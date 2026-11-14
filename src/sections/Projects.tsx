import { projects, type Project } from "../data/site";
import { Reveal, SectionTitle } from "../lib/ui";
import { TechChip } from "../components/Logo";

export const kind: Record<Project["kind"], { label: string; color: string }> = {
  work: { label: "work", color: "var(--accent)" },
  intern: { label: "internship", color: "var(--blue)" },
  game: { label: "game", color: "var(--violet)" },
  hackathon: { label: "hackathon", color: "var(--rose)" },
  college: { label: "college", color: "var(--amber)" },
};
export const Badge = ({ k }: { k: Project["kind"] }) => (
  <span className="mono inline-flex items-center gap-1.5 text-[var(--ink-soft)]"><span aria-hidden="true" className="w-2 h-2 rounded-full" style={{ background: kind[k].color }} />{kind[k].label}</span>
);

export function ProjectsBoard() {
  return (
    <section id="projects" className="section alt" aria-labelledby="proj-h">
      <div className="wrap">
        <SectionTitle n="02" kicker="projects" title="Selected work" id="proj-h" note="Open a project for the case study." icon="folder" />
        <ul className="list-none p-0 m-0 border-b border-[var(--rule)]">
          {projects.map((p, i) => (
            <li key={p.id}>
              <Reveal delay={(i % 4) * 0.04}>
                <a href={`#/project/${p.id}`} className="work-row spot no-underline">
                  <span className="mono text-[var(--ink-soft)]">{String(i + 1).padStart(2, "0")}</span>
                  <span>
                    <span className="display block text-[clamp(1.3rem,2.4vw,1.75rem)]">{p.title}</span>
                    <span className="block mt-1 text-[var(--ink-soft)] text-[0.95rem]">{p.tagline}</span>
                    {p.headline && <span className="block mt-1 mono text-[var(--accent)]">{p.headline}</span>}
                  </span>
                  <span className="hidden md:flex flex-wrap gap-1.5 items-center">
                    <Badge k={p.kind} />
                    {p.stack.slice(0, 3).map((s) => <TechChip key={s} label={s} className="!text-[0.72rem]" />)}
                  </span>
                  <span className="hidden md:block mono text-[var(--accent)]">view →</span>
                </a>
              </Reveal>
            </li>
          ))}
        </ul>
        <p className="mt-6 note">work projects show illustrative workflow diagrams, not internal screenshots; impact numbers appear once confirmed public-safe</p>
      </div>
    </section>
  );
}

