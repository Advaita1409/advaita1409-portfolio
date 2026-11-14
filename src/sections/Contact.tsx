import { useState, type FormEvent } from "react";
import { confetti } from "../components/Confetti";
import { links } from "../data/site";
import { Icon, iconPaths } from "../components/icons";
import { Reveal, SectionTitle } from "../lib/ui";

const TYPES = ["Job", "Collab", "Dance", "Just hi"];
const ext = { target: "_blank", rel: "noopener noreferrer" } as const;

function ContactForm() {
  const [state, setState] = useState<"idle" | "sending" | "sent">("idle");
  const [error, setError] = useState("");
  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const d = new FormData(e.currentTarget);
    setState("sending"); setError("");
    try {
      const res = await fetch("/api/rishta", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ name: d.get("name"), email: d.get("email"), type: d.get("type"), text: d.get("text"), website: d.get("website") }) });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error ?? "Something went wrong.");
      setState("sent"); confetti(60);
    } catch (err) { setError(err instanceof Error ? err.message : "Something went wrong."); setState("idle"); }
  }
  if (state === "sent") return <div role="status" className="card p-8"><p className="display text-3xl">Message sent.</p><p className="mt-2 text-[var(--ink-soft)]">Thanks. I'll get back to you soon.</p></div>;
  return (
    <form onSubmit={submit} className="card relative p-6 md:p-8 space-y-4" aria-labelledby="cf-h">
      <h3 id="cf-h" className="display text-2xl">Send a message</h3>
      <div className="grid sm:grid-cols-2 gap-4">
        <div><label htmlFor="c-name" className="mono block mb-1.5 text-[var(--ink-soft)]">Name</label><input id="c-name" name="name" required maxLength={80} autoComplete="name" className="field" /></div>
        <div><label htmlFor="c-email" className="mono block mb-1.5 text-[var(--ink-soft)]">Email</label><input id="c-email" name="email" type="email" required maxLength={120} autoComplete="email" className="field" /></div>
      </div>
      <div><label htmlFor="c-type" className="mono block mb-1.5 text-[var(--ink-soft)]">Reason</label><select id="c-type" name="type" required defaultValue="" className="field"><option value="" disabled>Choose one</option>{TYPES.map((t) => <option key={t}>{t}</option>)}</select></div>
      <div><label htmlFor="c-text" className="mono block mb-1.5 text-[var(--ink-soft)]">Message</label><textarea id="c-text" name="text" required minLength={3} maxLength={2000} rows={5} className="field" /></div>
      <div aria-hidden="true" className="absolute -left-[9999px] h-0 overflow-hidden"><label>Website<input name="website" tabIndex={-1} autoComplete="off" /></label></div>
      {error && <p role="alert" className="font-medium text-[var(--accent)]">{error} <a className="underline" href={`mailto:${links.email}`}>Email me</a></p>}
      <button type="submit" className="btn pink" disabled={state === "sending"}>{state === "sending" ? "Sending..." : "Send message"}</button>
    </form>
  );
}

export default function Contact() {
  return (
    <section id="contact" className="section" aria-labelledby="contact-h">
      <div className="wrap">
        <SectionTitle n="06" kicker="contact" title="Let's talk." id="contact-h" />
        <div className="grid lg:grid-cols-12 gap-12 items-start">
          <Reveal className="lg:col-span-5 space-y-8">
            <p className="text-xl">Looking to start a project? Feel free to contact me.</p>
            <a className="display text-[clamp(1.05rem,1.9vw,1.4rem)] [overflow-wrap:anywhere] text-[var(--accent)] underline decoration-[var(--rule)] underline-offset-4 hover:decoration-[var(--accent)]" href={`mailto:${links.email}`}>{links.email}</a>
            <p className="mono text-[var(--ink-soft)]">Bangalore, Karnataka, India</p>
            <ul className="list-none p-0 m-0 grid gap-3 max-w-md">
              {([
                ["LinkedIn", "in/advaita-sharma", links.linkedin, iconPaths.in, "var(--blue)"],
                ["GitHub", "Advaita1409", links.github, iconPaths.gh, "var(--fg)"],
                ["Instagram", links.instagramHandle, links.instagram, iconPaths.ig, "var(--rose)"],
              ] as [string, string, string | null, string, string][]).filter((c) => c[2]).map(([name, handle, href, d, color]) => (
                <li key={name}>
                  <a href={href!} {...ext} className="spot card flex items-center gap-4 p-4 no-underline hover:border-[var(--accent)] transition-colors" aria-label={`${name}, ${handle} (opens in new tab)`}>
                    <span className="spot-line" aria-hidden="true" />
                    <span className="grid place-items-center w-11 h-11 rounded-xl bg-[var(--surface-2)] border border-[var(--rule)]" style={{ color }}><Icon d={d} size={22} /></span>
                    <span className="flex-1 min-w-0"><span className="display text-lg block">{name}</span><span className="mono text-[var(--ink-soft)] block truncate">{handle}</span></span>
                    <span aria-hidden="true" className="mono text-[var(--accent)]">↗</span>
                  </a>
                </li>
              ))}
            </ul>
          </Reveal>
          <Reveal delay={0.08} className="lg:col-span-7"><ContactForm /></Reveal>
        </div>
      </div>
    </section>
  );
}
