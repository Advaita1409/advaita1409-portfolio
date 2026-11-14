import { randomUUID } from "node:crypto";
import { clientIp, json, origin, rateLimit } from "./_lib/guard.js";
import { deliverRishta, validateRishta } from "./_lib/rishta.js";
import { addMessage, reviewToken, storeConfigured } from "./_lib/store.js";

/**
 * Contact form. The message is (1) archived in the private inbox when storage is configured and
 * (2) emailed to the owner with Reply-To set to the visitor, so replying is just hitting Reply.
 */
export async function POST(request: Request): Promise<Response> {
  if (!rateLimit(`rishta:${clientIp(request)}`, 3, 10 * 60_000)) return json({ error: "Too many messages. Please try again in a few minutes." }, 429);
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return json({ error: "Invalid request." }, 400);
  }
  // Honeypot: bots fill the hidden "website" field. Pretend success, send nothing.
  if (typeof body.website === "string" && body.website.trim() !== "") return json({ ok: true });
  const v = validateRishta(body);
  if (!v.ok) return json({ error: v.error }, 400);

  let archived = false;
  if (storeConfigured()) {
    try { await addMessage({ id: randomUUID(), ...v.value, ts: Date.now() }); archived = true; }
    catch (e) { console.error("message archive failed:", e instanceof Error ? e.message : "unknown"); }
  }
  try {
    await deliverRishta(v.value, "form", archived ? `${origin(request)}/api/guestbook?review=${reviewToken()}` : undefined);
    return json({ ok: true });
  } catch (e) {
    console.error("contact delivery failed:", e instanceof Error ? e.message : "unknown");
    // Saved in the inbox? Then it is not lost, so don't scare the visitor.
    return archived ? json({ ok: true }) : json({ error: "Could not send your message right now. Please email advaitasharma2003@gmail.com directly." }, 502);
  }
}
