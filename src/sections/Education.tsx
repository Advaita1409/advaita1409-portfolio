import { education } from "../data/site";
import { Reveal, SectionTitle } from "../lib/ui";
import { OrgLogo } from "../components/Logo";

export default function Education() {
  return (
    <section id="education" className="section alt" aria-labelledby="edu-h">
      <div className="wrap">
        <SectionTitle n="04" kicker="education" title="School & college" id="edu-h" icon="cap" />
        <ul className="list-none p-0 m-0 grid md:grid-cols-2 gap-6">
          {education.map((e, i) => (
            <li key={e.id}>
              <Reveal delay={i * 0.08}>
                <article className="spot card p-6 h-full hover:border-[var(--accent)] transition-colors"><span className="spot-line" aria-hidden="true" />
                  <div className="flex items-center justify-between gap-3"><p className="mono text-[var(--accent)]">{e.when}</p><OrgLogo id={e.logo} size={52} /></div>
                  <h3 className="display text-[clamp(1.5rem,2.6vw,2rem)] mt-3">{e.school}</h3>
                  <p className="font-medium mt-3">{e.degree}</p>
                  <p className="mt-1 text-[var(--ink-soft)]">{e.note}</p>
                </article>
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
