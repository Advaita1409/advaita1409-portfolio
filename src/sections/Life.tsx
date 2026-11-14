import { useEffect, useRef, useState, type FormEvent } from "react";
import { activities, peopleSay, photos, wall, type Activity } from "../data/site";
import { Reveal, SectionTitle } from "../lib/ui";
import { OrgLogo } from "../components/Logo";
import { UiIcon, type IconName } from "../components/UiIcon";
import Lightbox from "../components/Lightbox";

const groups: { id: Activity["group"]; title: string; icon: IconName; blurb: string }[] = [
  { id: "run", title: "Running", icon: "run", blurb: "Race bibs and medals." },
  { id: "dance", title: "Dance", icon: "music", blurb: "Taking part in Bengaluru's Samanvay Arts Festival." },
  { id: "surf", title: "Surfing", icon: "wave", blurb: "A three-day course on the waves." },
];

type Note = { name: string; role?: string; photo?: string; verified?: boolean; text: string };

const H3 = ({ icon, children }: { icon: IconName; children: React.ReactNode }) => (
  <h3 className="display text-2xl md:text-3xl flex items-center gap-3">
    <span aria-hidden="true" className="grid place-items-center w-10 h-10 rounded-xl bg-[var(--glow)] border border-[var(--accent)] text-[var(--accent)]"><UiIcon name={icon} size={20} /></span>
    {children}
  </h3>
);

const GOOGLE_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID as string | undefined;
type Google = { name: string; photo?: string };
declare global { interface Window { google?: any } } // eslint-disable-line @typescript-eslint/no-explicit-any

/** Reads the display name and photo from a Google ID token (the server re-verifies it with Google). */
function readGoogle(credential: string): Google | null {
  try {
    const payload = credential.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
    const j = JSON.parse(new TextDecoder().decode(Uint8Array.from(atob(payload), (c) => c.charCodeAt(0))));
    return { name: String(j.name ?? ""), photo: typeof j.picture === "string" ? j.picture : undefined };
  } catch { return null; }
}

const Avatar = ({ n, size = 40 }: { n: Note; size?: number }) =>
  n.photo ? (
    <img src={n.photo} alt="" width={size} height={size} referrerPolicy="no-referrer" loading="lazy" className="rounded-full object-cover border border-[var(--line)]" style={{ width: size, height: size }} />
  ) : (
    <span aria-hidden="true" className="grid place-items-center rounded-full bg-[var(--surface-2)] border border-[var(--line)] mono text-[var(--accent)]" style={{ width: size, height: size }}>{n.name.trim().charAt(0).toUpperCase()}</span>
  );

/** "Things people say about me": visitors leave a note (optionally signed in with Google), and it shows up here. */
function PeopleSay() {
  const [live, setLive] = useState<Note[]>([]);
  const [state, setState] = useState<"idle" | "sending" | "live" | "held">("idle");
  const [err, setErr] = useState("");
  const [cred, setCred] = useState<{ token: string; who: Google } | null>(null);
  const btn = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch("/api/guestbook").then((r) => (r.ok ? r.json() : { notes: [] })).then((d) => setLive(Array.isArray(d.notes) ? d.notes : [])).catch(() => {});
  }, []);

  // "Sign in with Google": only when a Google client id is configured.
  useEffect(() => {
    if (!GOOGLE_ID || cred || state === "live" || state === "held") return;
    const init = () => {
      if (!window.google || !btn.current) return;
      window.google.accounts.id.initialize({ client_id: GOOGLE_ID, callback: (r: { credential: string }) => { const who = readGoogle(r.credential); if (who) setCred({ token: r.credential, who }); } });
      window.google.accounts.id.renderButton(btn.current, { theme: "outline", size: "large", shape: "pill", text: "signin_with" });
    };
    if (window.google) { init(); return; }
    let sc = document.getElementById("gsi-client") as HTMLScriptElement | null;
    if (!sc) { sc = document.createElement("script"); sc.id = "gsi-client"; sc.src = "https://accounts.google.com/gsi/client"; sc.async = true; document.head.appendChild(sc); }
    sc.addEventListener("load", init);
    return () => sc?.removeEventListener("load", init);
  }, [cred, state]);

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const d = new FormData(form);
    setState("sending"); setErr("");
    try {
      const res = await fetch("/api/guestbook", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ name: cred?.who.name || d.get("name"), role: d.get("role"), text: d.get("text"), website: d.get("website"), credential: cred?.token }) });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error ?? "Something went wrong.");
      if (data.status === "approved") { setLive((l) => [{ name: cred?.who.name || String(d.get("name")), role: String(d.get("role") ?? "").trim() || undefined, photo: cred?.who.photo, verified: !!cred, text: String(d.get("text")) }, ...l]); setState("live"); }
      else setState("held");
      form.reset(); setCred(null);
    } catch (x) { setErr(x instanceof Error ? x.message : "Something went wrong."); setState("idle"); }
  }

  const all: Note[] = [...live, ...peopleSay];
  return (
    <div id="people-say" className="mt-20 grid lg:grid-cols-12 gap-10">
      <div className="lg:col-span-5">
        <H3 icon="heart">Things people say about me</H3>
        <p className="mt-2 text-[var(--ink-soft)]">Worked with me, studied with me, or just met me? Leave a line. Adding your position helps readers trust it.</p>
        {state === "live" || state === "held" ? (
          <p role="status" className="card p-5 mt-5">{state === "live" ? "Thank you! Your note is up there now." : "Thank you! Your note will appear once it has been approved."}</p>
        ) : (
          <form onSubmit={submit} className="relative mt-5 space-y-3">
            {GOOGLE_ID && (
              <div className="card p-4">
                {cred ? (
                  <div className="flex items-center gap-3">
                    <Avatar n={{ name: cred.who.name, photo: cred.who.photo, text: "" }} size={44} />
                    <div className="min-w-0 flex-1"><p className="font-medium truncate">{cred.who.name}</p><p className="mono text-[var(--accent)]">✔ signed in with Google</p></div>
                    <button type="button" className="btn !min-h-9 !px-3" onClick={() => setCred(null)}>Change</button>
                  </div>
                ) : (
                  <>
                    <p className="mono text-[var(--ink-soft)] mb-2">optional: show your real name and photo</p>
                    <div ref={btn} className="min-h-[44px]" />
                    <p className="text-xs text-[var(--ink-soft)] mt-2">Only your name and profile photo appear publicly. Your email is never shown.</p>
                  </>
                )}
              </div>
            )}
            {!cred && <div><label htmlFor="g-name" className="mono block mb-1.5 text-[var(--ink-soft)]">Name</label><input id="g-name" name="name" required maxLength={40} autoComplete="name" className="field" /></div>}
            <div><label htmlFor="g-role" className="mono block mb-1.5 text-[var(--ink-soft)]">Current position (optional, adds credibility)</label><input id="g-role" name="role" maxLength={80} autoComplete="organization-title" placeholder="e.g. Engineering Manager, Company" className="field" /></div>
            <div><label htmlFor="g-text" className="mono block mb-1.5 text-[var(--ink-soft)]">Your note (max 200 characters)</label><textarea id="g-text" name="text" required minLength={3} maxLength={200} rows={3} className="field" /></div>
            <div aria-hidden="true" className="absolute -left-[9999px] h-0 overflow-hidden"><label>Website<input name="website" tabIndex={-1} autoComplete="off" /></label></div>
            {err && <p role="alert" className="font-medium text-[var(--accent)]">{err}</p>}
            <button className="btn pink" type="submit" disabled={state === "sending"}>{state === "sending" ? "Posting..." : "Post my note"}</button>
          </form>
        )}
      </div>
      <div className="lg:col-span-7">
        {all.length === 0 ? (
          <div className="card p-6"><p className="note">no notes yet, be the first</p></div>
        ) : (
          <ul className="list-none p-0 m-0 grid sm:grid-cols-2 gap-4">
            {all.map((n, i) => (
              <li key={`${n.name}-${i}`} className="spot card p-5 flex flex-col justify-between gap-4 hover:border-[var(--accent)] transition-colors">
                <span className="spot-line" aria-hidden="true" />
                <p className="text-lg leading-snug">“{n.text}”</p>
                <div className="flex items-center gap-3">
                  <Avatar n={n} />
                  <div className="min-w-0">
                    <p className="font-medium leading-tight truncate">{n.name}{n.verified && <span className="ml-1.5 mono text-[var(--accent)]" title="Signed in with Google" aria-label="signed in with Google">✔</span>}</p>
                    {n.role && <p className="text-sm text-[var(--ink-soft)] leading-tight">{n.role}</p>}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default function Life() {
  const [box, setBox] = useState<{ src: string; alt: string } | null>(null);
  return (
    <section id="life" className="section" aria-labelledby="life-h">
      <div className="wrap">
        <SectionTitle n="05" kicker="life" title="Beyond the code" id="life-h" note="Out and about, running, dancing and surfing." icon="spark" />

        {/* Out and about first */}
        <div className="mb-16">
          <H3 icon="globe">Out and about</H3>
          <ul className="list-none p-0 m-0 mt-6 columns-2 md:columns-3 gap-4">
            {wall.map((id, i) => {
              const p = photos[id];
              return (
                <li key={id} className="break-inside-avoid mb-4">
                  <Reveal delay={(i % 3) * 0.06}>
                    <figure className="photo spot m-0 relative">
                      <img src={p.src} alt={p.alt} width={p.w} height={p.h} loading="lazy" decoding="async" className="w-full h-auto block" />
                    </figure>
                  </Reveal>
                </li>
              );
            })}
          </ul>
        </div>

        {groups.map((g) => (
          <div key={g.id} className="mb-14">
            <H3 icon={g.icon}>{g.title}</H3>
            <p className="mt-1 mb-6 text-[var(--ink-soft)]">{g.blurb}</p>
            <ul className="list-none p-0 m-0 grid md:grid-cols-2 xl:grid-cols-3 gap-5">
              {activities.filter((a) => a.group === g.id).map((a, i) => (
                <li key={a.id}>
                  <Reveal delay={(i % 3) * 0.06} className="h-full">
                    <article className="spot card p-5 h-full flex flex-col hover:border-[var(--accent)] transition-colors">
                      <span className="spot-line" aria-hidden="true" />
                      <div className="flex items-start gap-3">
                        <OrgLogo id={a.org} size={44} />
                        <div className="min-w-0"><h4 className="display text-lg leading-snug">{a.title}</h4><p className="mono text-[var(--accent)] mt-0.5">{a.when}</p></div>
                      </div>
                      <p className="mt-3 text-[0.95rem] text-[var(--ink-soft)]">{a.detail}</p>
                      <ul className="list-none p-0 m-0 mt-4 flex gap-3 flex-wrap">
                        {a.images.map((im) => (
                          <li key={im.src} className="flex-1 min-w-[7rem]">
                            <button type="button" onClick={() => setBox({ src: im.src, alt: im.alt })} className="photo group w-full block cursor-zoom-in" aria-label={`Enlarge: ${im.alt}`}>
                              <img src={im.src} alt="" width={im.w} height={im.h} loading="lazy" decoding="async" className="w-full h-32 object-cover" />
                            </button>
                            <p className="mono text-[var(--ink-soft)] mt-1">{im.label}</p>
                          </li>
                        ))}
                      </ul>
                    </article>
                  </Reveal>
                </li>
              ))}
            </ul>
          </div>
        ))}

        <PeopleSay />
      </div>
      <Lightbox src={box?.src ?? null} alt={box?.alt ?? ""} onClose={() => setBox(null)} />
    </section>
  );
}
