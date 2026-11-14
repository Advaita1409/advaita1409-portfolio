import { certificates, experience } from "../data/site";
import { Reveal, SectionTitle } from "../lib/ui";
import { OrgLogo } from "../components/Logo";

export default function Experience() {
  return (
    <section id="experience" className="section" aria-labelledby="exp-h">
      <div className="wrap">
        <SectionTitle n="03" kicker="experience" title="Where I've worked" id="exp-h" icon="briefcase" />
        <ol className="list-none p-0 m-0 tl space-y-2">
          {experience.map((j, i) => (
            <li key={j.id} className="relative pl-9">
              <span className="tl-dot" style={i === 0 ? { background: "var(--accent)" } : undefined} aria-hidden="true" />
              <Reveal delay={i * 0.04}>
                <div className="grid md:grid-cols-[12rem_1fr_1.1fr] gap-2 md:gap-8 py-5 border-b border-[var(--rule)]">
                  <p className="mono text-[var(--accent)] pt-1.5">{j.when}</p>
                  <div className="flex gap-4 items-start"><OrgLogo id={j.logo} size={48} /><div><h3 className="display text-[clamp(1.35rem,2.4vw,1.8rem)]">{j.role}</h3><p className="mt-1 text-[var(--ink-soft)]">{j.org}</p></div></div>
                  <p className="text-[var(--ink-soft)] md:pt-1">{j.text}</p>
                </div>
              </Reveal>
            </li>
          ))}
        </ol>

        <h3 className="display text-2xl md:text-3xl mt-16 mb-5">Certificates &amp; awards</h3>
        <ul className="list-none p-0 m-0 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {certificates.map((c) => (
            <li key={c.id} className="spot card p-5 hover:border-[var(--accent)] transition-colors"><span className="spot-line" aria-hidden="true" />
              <div className="flex items-center gap-3"><OrgLogo id={c.logo} size={38} /><p className="mono text-[var(--ink-soft)]">{c.by}</p></div>
              <p className="display text-lg mt-3 leading-snug">{c.name}</p>
              {c.detail && <p className="mt-3 text-sm text-[var(--ink-soft)]">{c.detail}</p>}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
