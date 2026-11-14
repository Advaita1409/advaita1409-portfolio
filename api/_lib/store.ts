/**
 * Tiny Upstash Redis (REST) client for guestbook notes. Optional: when the env vars are missing
 * the guestbook falls back to "email only" and the static list in src/data/guestbook.json.
 * Uses plain fetch, no extra dependency.
 */
import { createHmac, timingSafeEqual } from "node:crypto";

export type Note = { id: string; name: string; role?: string; text: string; ts: number; status: "pending" | "approved" | "rejected" };

export const storeConfigured = () => !!(process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN && process.env.MODERATION_SECRET);

async function cmd<T = unknown>(args: (string | number)[]): Promise<T> {
  const res = await fetch(process.env.UPSTASH_REDIS_REST_URL!, {
    method: "POST",
    headers: { authorization: `Bearer ${process.env.UPSTASH_REDIS_REST_TOKEN}`, "content-type": "application/json" },
    body: JSON.stringify(args),
  });
  const data = (await res.json()) as { result?: T; error?: string };
  if (!res.ok || data.error) throw new Error(data.error ?? `store error ${res.status}`);
  return data.result as T;
}

const key = (id: string) => `gb:n:${id}`;

export async function addNote(n: Note): Promise<void> {
  await cmd(["SET", key(n.id), JSON.stringify(n)]);
  await cmd(["LPUSH", "gb:all", n.id]);
}

/** Newest first. */
export async function latestNotes(limit = 100): Promise<Note[]> {
  const ids = await cmd<string[]>(["LRANGE", "gb:all", 0, limit - 1]);
  if (!ids?.length) return [];
  const raw = await cmd<(string | null)[]>(["MGET", ...ids.map(key)]);
  return raw.filter((r): r is string => !!r).map((r) => JSON.parse(r) as Note);
}

export async function setStatus(id: string, status: Note["status"]): Promise<boolean> {
  const raw = await cmd<string | null>(["GET", key(id)]);
  if (!raw) return false;
  const n = JSON.parse(raw) as Note;
  n.status = status;
  await cmd(["SET", key(id), JSON.stringify(n)]);
  return true;
}

/** One private token protects the review page; rotate it by changing MODERATION_SECRET. */
export const reviewToken = () => createHmac("sha256", process.env.MODERATION_SECRET!).update("guestbook-review").digest("hex");
export function validToken(t: string | null | undefined): boolean {
  if (!t || !storeConfigured()) return false;
  const a = Buffer.from(t), b = Buffer.from(reviewToken());
  return a.length === b.length && timingSafeEqual(a, b);
}

export type Msg = { id: string; name: string; email: string; type: string; text: string; ts: number };
const mkey = (id: string) => `msg:n:${id}`;

/** Contact-form messages are archived here (when storage is configured) so they can be read in one private place. */
export async function addMessage(m: Msg): Promise<void> {
  await cmd(["SET", mkey(m.id), JSON.stringify(m)]);
  await cmd(["LPUSH", "msg:all", m.id]);
}
export async function latestMessages(limit = 100): Promise<Msg[]> {
  const ids = await cmd<string[]>(["LRANGE", "msg:all", 0, limit - 1]);
  if (!ids?.length) return [];
  const raw = await cmd<(string | null)[]>(["MGET", ...ids.map(mkey)]);
  return raw.filter((r): r is string => !!r).map((r) => JSON.parse(r) as Msg);
}
