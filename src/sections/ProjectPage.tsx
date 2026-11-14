import { useEffect } from "react";
import { projects } from "../data/site";
import { TechChip } from "../components/Logo";
import { flows } from "../data/flows";
import { details } from "../data/projectDetails";
import FlowDiagram, { ServiceMap } from "./Flow";
import { UiIcon } from "../components/UiIcon";
import { Badge } from "./Projects";

/** Case-study page at #/project/:id. */
export default function ProjectPage({ id }: { id: string }) {
  const p = projects.find((x) => x.id === id);
  useEffect(() => { window.scrollTo(0, 0); document.getElementById("project-h")?.focus(); }, [id]);
  if (!p) {
    return (
      <section className="section !pt-32"><div className="wrap"><h1 id="project-h" tabIndex={-1} className="text-5xl outline-none">Page not found</h1><a className="btn pink mt-6" href="#projects">View all projects</a></div></section>
    );
  }
  const related = projects.filter((x) => x.id !== p.id).slice(0, 3);
  const d = details[p.id];
  const flow = flows[p.id];
  const row = (k: string, v: React.ReactNode) => (
    <div className="grid sm:grid-cols-[10rem_1fr] gap-1 sm:gap-8 py-5 border-t border-[var(--rule)]"><dt className="mono text-[var(--accent)]">{k}</dt><dd className="m-0 text-lg">{v}</dd></div>
  );
  const H = ({ kicker, title, icon }: { kicker: string; title: string; icon: "folder" | "layers" | "code" | "award" | "check" | "star" | "cpu" }) => (
    <div className="mb-6">
      <p className="mono text-[var(--accent)] flex items-center gap-2"><span aria-hidden="true" className="grid place-items-center w-7 h-7 rounded-lg bg-[var(--glow)] border border-[var(--accent)]"><UiIcon name={icon} size={14} /></span>// {kicker}</p>
      <h2 className="display text-3xl md:text-4xl mt-2">{title}</h2>
    </div>
  );
  return (
    <>
      <section className="section !pt-28 md:!pt-32" aria-labelledby="project-h">
        <div className="wrap">
          <a href="#projects" className="btn !min-h-10 mb-10">← all projects</a>
          <p className="mono"><Badge k={p.kind} /></p>
          <h1 id="project-h" tabIndex={-1} className="mt-3 text-[clamp(2.4rem,6.5vw,5rem)] outline-none">{p.title}</h1>
          <p className="mt-4 text-xl text-[var(--ink-soft)]">{p.tagline}</p>

          {d && (
            <dl className="mt-10 grid sm:grid-cols-2 lg:grid-cols-4 gap-px bg-[var(--rule)] border border-[var(--rule)] rounded-xl overflow-hidden">
              {([["role", d.role], ["status", d.status], ["stack", p.stack.join(", ") || "n/a"], ["impact", d.headline ?? "see below"]] as [string, string][]).map(([k, v]) => (
                <div key={k} className="bg-[var(--bg)] p-4"><dt className="mono text-[var(--accent)]">{k}</dt><dd className="m-0 mt-1 text-[0.95rem]">{v}</dd></div>
              ))}
            </dl>
          )}

          <dl className="mt-12 border-b border-[var(--rule)]">
            {row("what it is", p.what)}
            {d && row("the problem", d.problem)}
            {d && row("who uses it", d.users)}
            {!d && row("my contribution", p.contribution ?? <span className="note">to be added</span>)}
            {p.stack.length > 0 && row("stack", <ul className="flex flex-wrap gap-2 list-none p-0 m-0">{p.stack.map((s) => <li key={s}><TechChip label={s} className="!text-sm" /></li>)}</ul>)}
            {p.link && row("link", <a className="btn pink" href={p.link.href} target="_blank" rel="noopener noreferrer">{p.link.label} ↗</a>)}
          </dl>

          {d && (
            <div className="mt-16">
              <H kicker="what it does" title="Key capabilities" icon="star" />
              <ul className="list-none p-0 m-0 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {d.capabilities.map((c) => (
                  <li key={c.title} className="spot card p-5"><span className="spot-line" aria-hidden="true" /><h3 className="display text-lg">{c.title}</h3><p className="mt-1.5 text-[0.95rem] text-[var(--ink-soft)]">{c.text}</p></li>
                ))}
              </ul>
            </div>
          )}

          {flow && (
            <div className="mt-16">
              <H kicker="how it works" title="The workflow, step by step" icon="layers" />
              <p className="text-[var(--ink-soft)] max-w-2xl mb-6">An illustrative diagram drawn for this portfolio, using generic labels only: no internal screenshots, data or system names.</p>
              <FlowDiagram flow={flow} title={p.title} />
            </div>
          )}

          {d?.services && (
            <div className="mt-16">
              <H kicker="how it's built" title="Services and who built what" icon="cpu" />
              <ServiceMap services={d.services} />
            </div>
          )}

          {d && (
            <div className="mt-16 grid lg:grid-cols-12 gap-10">
              <div className="lg:col-span-7">
                <H kicker="my work" title="What I did" icon="code" />
                <ul className="list-none p-0 m-0 space-y-3">
                  {d.contributions.map((c) => (
                    <li key={c} className="flex gap-3"><span aria-hidden="true" className="mt-1.5 shrink-0 w-1.5 h-1.5 rounded-full bg-[var(--accent)]" /><span className="text-[0.98rem]">{c}</span></li>
                  ))}
                </ul>
              </div>
              <div className="lg:col-span-5">
                <H kicker="results" title="Impact" icon="award" />
                {d.impact.numbers && (
                  <ul className="list-none p-0 m-0 grid gap-3 mb-5">
                    {d.impact.numbers.map((n) => (
                      <li key={n.label} className="spot card p-5 flex items-center gap-4"><span className="spot-line" aria-hidden="true" /><span className="display text-5xl text-[var(--accent)] leading-none">{n.value}</span><span className="text-[0.95rem]">{n.label}{n.projected && <span className="mono block text-[var(--amber)]">projected</span>}</span></li>
                    ))}
                  </ul>
                )}
                <ul className="list-none p-0 m-0 space-y-2.5">
                  {d.impact.points.map((pt) => (<li key={pt} className="flex gap-3 text-[0.95rem]"><UiIcon name="check" size={16} className="mt-1 shrink-0 text-[var(--accent)]" /><span>{pt}</span></li>))}
                </ul>
              </div>
            </div>
          )}

          {d?.practices && (
            <div className="mt-16">
              <H kicker="quality" title="Engineering practices" icon="check" />
              <ul className="list-none p-0 m-0 grid md:grid-cols-3 gap-4">
                {d.practices.map((pr) => (<li key={pr} className="card p-5 text-[0.95rem] text-[var(--ink-soft)]">{pr}</li>))}
              </ul>
            </div>
          )}

          {!flow && !d && (
            <div className="term mt-12"><div className="term-bar" aria-hidden="true"><i /><i /><i /><span className="mono ml-3 text-[var(--ink-soft)]">screenshots</span></div><div className="grid place-items-center aspect-[16/7] mono text-[var(--ink-soft)]">[ screenshots or video to be added ]</div></div>
          )}
        </div>
      </section>
      <section className="section alt" aria-labelledby="related-h">
        <div className="wrap">
          <h2 id="related-h" className="text-3xl md:text-4xl mb-8">Related projects</h2>
          <ul className="list-none p-0 m-0 border-b border-[var(--rule)]">
            {related.map((x, i) => (
              <li key={x.id}><a href={`#/project/${x.id}`} className="work-row spot no-underline"><span className="mono text-[var(--ink-soft)]">{String(i + 1).padStart(2, "0")}</span><span><span className="display block text-[clamp(1.2rem,2.2vw,1.6rem)]">{x.title}</span><span className="block text-[var(--ink-soft)] text-[0.95rem]">{x.tagline}</span></span><span className="hidden md:block"><Badge k={x.kind} /></span><span className="hidden md:block mono text-[var(--accent)]">view →</span></a></li>
            ))}
          </ul>
          <a className="btn pink mt-8" href="#projects">View all projects</a>
        </div>
      </section>
    </>
  );
}
