import { Resend } from "resend";
import { EMAIL_RE } from "./guard.js";

export const RISHTA_TYPES = ["Job", "Collab", "Dance", "Just hi"] as const;

export type Rishta = { name: string; email: string; type: string; text: string };

export function validateRishta(input: Partial<Record<keyof Rishta, unknown>>): { ok: true; value: Rishta } | { ok: false; error: string } {
  const name = String(input.name ?? "").trim();
  const email = String(input.email ?? "").trim();
  const type = String(input.type ?? "").trim();
  const text = String(input.text ?? "").trim();
  if (name.length < 1 || name.length > 80) return { ok: false, error: "Name is required (max 80 characters)." };
  if (!EMAIL_RE.test(email) || email.length > 120) return { ok: false, error: "A valid email is required." };
  if (!(RISHTA_TYPES as readonly string[]).includes(type)) return { ok: false, error: "Pick a reason from the list." };
  if (text.length < 3 || text.length > 2000) return { ok: false, error: "Message must be 3 to 2000 characters." };
  return { ok: true, value: { name, email, type, text } };
}

const esc = (s: string) => s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

/** Delivers a Rishta to the owner's inbox via Resend. Throws on misconfiguration or failure. */
export async function deliverRishta(r: Rishta, via: "form" | "auntie-ji", inboxUrl?: string): Promise<void> {
  const key = process.env.RESEND_API_KEY;
  const to = process.env.RISHTA_TO_EMAIL;
  if (!key || !to) throw new Error("Email delivery is not configured.");
  const resend = new Resend(key);
  const { error } = await resend.emails.send({
    from: process.env.RISHTA_FROM_EMAIL ?? "Rishta <onboarding@resend.dev>",
    to,
    replyTo: r.email,
    subject: `Portfolio message (${r.type}) from ${r.name}`.replace(/[\r\n]/g, " "),
    html: `<p><b>${esc(r.name)}</b> &lt;${esc(r.email)}&gt; · ${esc(r.type)} · via ${via}</p><p style="white-space:pre-wrap">${esc(r.text)}</p><p>Just hit <b>Reply</b> to answer ${esc(r.name)}.</p>${inboxUrl ? `<p><a href="${esc(inboxUrl)}">All messages and guestbook notes</a> (private link)</p>` : ""}`,
    text: `${r.name} <${r.email}> (${r.type}, via ${via})\n\n${r.text}`,
  });
  if (error) throw new Error("Email provider rejected the message.");
}

/** New guestbook note: tell the owner, with a private link to review it (when moderation storage is configured). */
export async function deliverGuestbook(name: string, text: string, reviewUrl?: string, status: "pending" | "approved" | "rejected" = "pending"): Promise<void> {
  const key = process.env.RESEND_API_KEY;
  const to = process.env.RISHTA_TO_EMAIL;
  if (!key || !to) throw new Error("Email delivery is not configured.");
  const how = reviewUrl
    ? `<p>${status === "approved" ? "It is already live on your site." : "It is being held for your review."} <a href="${esc(reviewUrl)}">Open your private inbox page</a> to remove or approve notes.</p>`
    : `<p>To publish it, add it to src/data/guestbook.json and redeploy.</p>`;
  const { error } = await new Resend(key).emails.send({
    from: process.env.RISHTA_FROM_EMAIL ?? "Guestbook <onboarding@resend.dev>",
    to,
    subject: status === "approved" ? "New guestbook note is live on your site" : "New guestbook note awaiting approval",
    html: `<p><b>${esc(name)}</b> wrote:</p><p style="white-space:pre-wrap">${esc(text)}</p>${how}`,
    text: `${name} wrote:\n\n${text}\n\n${reviewUrl ? "Review it: " + reviewUrl : "To publish it, add it to src/data/guestbook.json and redeploy."}`,
  });
  if (error) throw new Error("Email provider rejected the message.");
}
