import { randomUUID } from "node:crypto";
import { clientIp, json, origin, rateLimit } from "./_lib/guard.js";
import { deliverGuestbook } from "./_lib/rishta.js";
import { addNote, latestMessages, latestNotes, reviewToken, setStatus, storeConfigured, validToken, type Note } from "./_lib/store.js";

/**
 * Default: every note waits for you to approve it (inbox page) before it appears on the site.
 * Set GUESTBOOK_AUTO_PUBLISH=true to let notes go live at once (suspicious ones are still held).
 */
const autoPublish = () => process.env.GUESTBOOK_AUTO_PUBLISH === "true";
const BAD_WORDS = /\b(fuck|shit|bitch|asshole|bastard|slut|dick|porn|casino|viagra|crypto|loan)\b/i;
function looksSuspicious(text: string, name: string): boolean {
  const t = `${name} ${text}`;
  return /https?:|www\.|\.(com|net|org|io|ru|cn|xyz|top)\b|@\w+\.\w+/i.test(t) || BAD_WORDS.test(t) || /(.)\1{9,}/.test(t) || (text.length > 25 && text === text.toUpperCase());
}

const esc = (s: string) => s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);
const html = (body: string, status = 200) =>
  new Response(`<!doctype html><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex"><title>Inbox and guestbook</title>
<style>body{font:16px/1.5 system-ui,sans-serif;max-width:44rem;margin:2rem auto;padding:0 1rem;background:#0b0f14;color:#e8ecf1}h1{font-size:1.5rem}h2{margin-top:2rem}section{border:1px solid #2a3442;border-radius:10px;padding:1rem;margin:.8rem 0;background:#121a24}small{color:#97a3b4}a{color:#5eead4}button{font:inherit;padding:.4rem .9rem;border-radius:8px;border:1px solid #5eead4;background:transparent;color:#5eead4;cursor:pointer;margin-right:.4rem}button.no{border-color:#fb7185;color:#fb7185}form{display:inline}</style>${body}`,
    { status, headers: { "content-type": "text/html; charset=utf-8", "cache-control": "no-store", "x-robots-tag": "noindex" } });

/** Public list (approved only) or the private review page (?review=TOKEN). */
export async function GET(request: Request): Promise<Response> {
  const url = new URL(request.url);
  const review = url.searchParams.get("review");
  if (review !== null) {
    if (!validToken(review)) return html("<h1>Not found</h1>", 404);
    const [notes, msgs] = await Promise.all([latestNotes(100), latestMessages(100)]);
    const card = (n: Note) => `<section><b>${esc(n.name)}</b>${n.role ? ` <small>(${esc(n.role)})</small>` : ""} <small>${new Date(n.ts).toUTCString()} · ${n.status}</small><p>${esc(n.text)}</p>
      <form method="post" action="/api/guestbook"><input type="hidden" name="token" value="${esc(review)}"><input type="hidden" name="id" value="${esc(n.id)}">
      ${n.status !== "approved" ? '<button name="action" value="approve">Approve</button>' : ""}${n.status !== "rejected" ? '<button class="no" name="action" value="reject">Remove from site</button>' : ""}</form></section>`;
    const pending = notes.filter((n) => n.status === "pending");
    const rest = notes.filter((n) => n.status !== "pending");
    const msg = (m: { name: string; email: string; type: string; text: string; ts: number }) => `<section><b>${esc(m.name)}</b> &lt;${esc(m.email)}&gt; <small>${esc(m.type)} · ${new Date(m.ts).toUTCString()}</small><p style="white-space:pre-wrap">${esc(m.text)}</p><a href="mailto:${encodeURIComponent(m.email)}?subject=${encodeURIComponent("Re: your message")}">Reply</a></section>`;
    return html(`<h1>Inbox and guestbook</h1>
      <h2>Contact messages (${msgs.length})</h2>${msgs.map(msg).join("") || "<p><small>No messages yet.</small></p>"}
      <h2>Guestbook: waiting for approval (${pending.length})</h2>${pending.map(card).join("") || "<p><small>Nothing waiting.</small></p>"}
      <h2>Guestbook: already decided</h2>${rest.map(card).join("") || "<p><small>None yet.</small></p>"}`);
  }
  if (!storeConfigured()) return json({ notes: [], configured: false });
  try {
    const notes = (await latestNotes(100)).filter((n) => n.status === "approved").map(({ name, role, text, ts }) => ({ name, role, text, ts }));
    return new Response(JSON.stringify({ notes, configured: true }), { headers: { "content-type": "application/json", "cache-control": "public, max-age=10, s-maxage=15, stale-while-revalidate=60" } });
  } catch (e) {
    console.error("guestbook list failed:", e instanceof Error ? e.message : "unknown");
    return json({ notes: [], configured: true });
  }
}

/** JSON = a visitor leaving a note. Form-encoded = the owner approving or removing from the review page. */
export async function POST(request: Request): Promise<Response> {
  if ((request.headers.get("content-type") ?? "").includes("application/x-www-form-urlencoded")) {
    const f = new URLSearchParams(await request.text());
    const token = f.get("token"), id = f.get("id") ?? "", action = f.get("action");
    if (!validToken(token) || !/^[\w-]{8,64}$/.test(id) || (action !== "approve" && action !== "reject")) return html("<h1>Not allowed</h1>", 403);
    await setStatus(id, action === "approve" ? "approved" : "rejected");
    return new Response(null, { status: 303, headers: { location: `/api/guestbook?review=${encodeURIComponent(token!)}` } });
  }

  if (!rateLimit(`gb:${clientIp(request)}`, 2, 10 * 60_000)) return json({ error: "Too many notes. Please try again later." }, 429);
  let body: Record<string, unknown>;
  try { body = await request.json(); } catch { return json({ error: "Invalid request." }, 400); }
  if (typeof body.website === "string" && body.website.trim() !== "") return json({ ok: true, status: "pending" }); // honeypot
  const name = String(body.name ?? "").trim();
  const text = String(body.text ?? "").trim();
  const role = String(body.role ?? "").trim();
  if (role.length > 80) return json({ error: "Position must be 80 characters or fewer." }, 400);
  if (name.length < 1 || name.length > 40) return json({ error: "Name is required (max 40 characters)." }, 400);
  if (text.length < 3 || text.length > 200) return json({ error: "Note must be 3 to 200 characters." }, 400);

  try {
    let status: Note["status"] = "pending";
    let reviewUrl: string | undefined;
    if (storeConfigured()) {
      status = autoPublish() && !looksSuspicious(text, `${name} ${role}`) ? "approved" : "pending";
      await addNote({ id: randomUUID(), name, ...(role ? { role } : {}), text, ts: Date.now(), status });
      reviewUrl = `${origin(request)}/api/guestbook?review=${reviewToken()}`;
    }
    try { await deliverGuestbook(name, text, reviewUrl, status, role); }
    catch (e) { if (!reviewUrl) throw e; console.error("guestbook email failed (note is saved):", e instanceof Error ? e.message : "unknown"); }
    return json({ ok: true, status });
  } catch (e) {
    console.error("guestbook failed:", e instanceof Error ? e.message : "unknown");
    return json({ error: "Could not send your note right now." }, 502);
  }
}
