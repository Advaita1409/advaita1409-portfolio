import { useRef, type ReactNode } from "react";
import { Reveal } from "../lib/ui";
import { TechChip } from "../components/Logo";
import type { Actor, Flow, Step } from "../data/flows";
import { UiIcon, type IconName } from "../components/UiIcon";
import type { Detail, Mine } from "../data/projectDetails";

const actors: Record<Actor, { label: string; icon: IconName }> = {
  customer: { label: "customer", icon: "user" },
  system: { label: "system", icon: "cpu" },
  ops: { label: "operations", icon: "briefcase" },
  analyst: { label: "analyst", icon: "check" },
  user: { label: "user", icon: "user" },
  team: { label: "team's work", icon: "layers" },
};

const Arrow = () => (
  <div aria-hidden="true" className="shrink-0 w-10 grid place-items-center">
    <svg width="40" height="14" viewBox="0 0 40 14" fill="none" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" opacity="0.7"><path d="M2 7h34M30 2l6 5-6 5" /></svg>
  </div>
);

const MineBadge = ({ mine }: { mine?: boolean }) =>
  mine ? <span className="mono !text-[0.65rem] px-1.5 py-0.5 rounded bg-[var(--accent)] text-[var(--accent-ink)] font-medium">I built this</span> : null;

function Node({ n, step }: { n: number; step: Step }) {
  const a = actors[step.actor];
  return (
    <div className={`spot card w-[15.5rem] h-full p-4 flex flex-col gap-2 ${step.mine ? "!border-[var(--accent)]" : "opacity-90"}`}>
      <span className="spot-line" aria-hidden="true" />
      <div className="flex items-center justify-between gap-2">
        <span className="mono text-[var(--ink-soft)] flex items-center gap-1.5"><UiIcon name={a.icon} size={13} />{a.label}</span>
        <MineBadge mine={step.mine} />
      </div>
      <div className="flex items-start gap-2.5">
        <span aria-hidden="true" className="shrink-0 grid place-items-center w-7 h-7 rounded-lg mono !text-[0.75rem] border border-[var(--accent)] text-[var(--accent)]">{n}</span>
        <h4 className="display text-[1.05rem] leading-snug">{step.label}</h4>
      </div>
      <p className="text-[0.88rem] leading-snug text-[var(--ink-soft)]">{step.detail}</p>
      {step.tags && <ul className="list-none p-0 m-0 mt-auto pt-1 flex flex-wrap gap-1.5">{step.tags.map((t) => <li key={t}><TechChip label={t} className="!text-[0.68rem] !py-0" /></li>)}</ul>}
    </div>
  );
}

/** Horizontal workflow: scroll sideways to follow the flow. */
export default function FlowDiagram({ flow, title }: { flow: Flow; title: string }) {
  const { steps, branch } = flow;
  const scroller = useRef<HTMLDivElement>(null);
  const nudge = (dir: 1 | -1) => scroller.current?.scrollBy({ left: dir * 340, behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });

  const items: ReactNode[] = [];
  steps.forEach((s, i) => {
    items.push(<li key={`s${i}`} className="shrink-0 snap-start"><Reveal className="h-full"><Node n={i + 1} step={s} /></Reveal></li>);
    if (branch && branch.after === i) {
      items.push(<li key="arrow-b" aria-hidden="true" className="shrink-0 flex items-center"><Arrow /></li>);
      items.push(
        <li key="branch" className="shrink-0 snap-start">
          <Reveal className="h-full">
            <div className="h-full w-[17rem] rounded-xl border border-dashed border-[var(--line)] p-3 flex flex-col gap-2">
              <p className="mono text-[var(--amber)] text-center flex items-center justify-center gap-1.5"><UiIcon name="branch" size={14} />decision · {branch.question}</p>
              <div className="card flex-1 p-3 !border-[var(--accent)]"><div className="flex justify-between items-center"><p className="mono text-[var(--accent)]">yes</p><MineBadge mine={branch.yes.mine} /></div><p className="display text-base mt-0.5 leading-snug">{branch.yes.label}</p><p className="mt-1 text-[0.84rem] leading-snug text-[var(--ink-soft)]">{branch.yes.detail}</p></div>
              <div className="card flex-1 p-3 !border-[var(--amber)]"><div className="flex justify-between items-center"><p className="mono text-[var(--amber)]">no</p><MineBadge mine={branch.no.mine} /></div><p className="display text-base mt-0.5 leading-snug">{branch.no.label}</p><p className="mt-1 text-[0.84rem] leading-snug text-[var(--ink-soft)]">{branch.no.detail}</p></div>
            </div>
          </Reveal>
        </li>,
      );
    }
    if (i < steps.length - 1) items.push(<li key={`a${i}`} aria-hidden="true" className="shrink-0 flex items-center"><Arrow /></li>);
  });

  return (
    <figure className="m-0" aria-label={`Workflow diagram for ${title}`}>
      <div className="flex items-center justify-between gap-3 mb-3">
        <p className="mono text-[var(--ink-soft)] flex items-center gap-2"><span aria-hidden="true" className="inline-block w-3 h-3 rounded-sm border-2 border-[var(--accent)]" />outlined = I built or contributed</p>
        <div className="flex gap-2">
          <button type="button" className="btn !min-h-9 !px-3" onClick={() => nudge(-1)} aria-label="Scroll the diagram left">←</button>
          <button type="button" className="btn !min-h-9 !px-3" onClick={() => nudge(1)} aria-label="Scroll the diagram right">→</button>
        </div>
      </div>
      <div ref={scroller} tabIndex={0} role="group" aria-label={`${title} workflow, scrolls sideways`} className="overflow-x-auto pb-4 snap-x scroll-px-2 rounded-lg outline-offset-4">
        <ol className="list-none p-0 m-0 flex items-stretch w-max pr-4">{items}</ol>
      </div>
      {flow.caption && <figcaption className="note mt-3">{flow.caption}</figcaption>}
    </figure>
  );
}

const mineLabel: Record<Mine, { text: string; cls: string }> = {
  built: { text: "I built", cls: "bg-[var(--accent)] text-[var(--accent-ink)]" },
  contributed: { text: "I contributed", cls: "border border-[var(--accent)] text-[var(--accent)]" },
  team: { text: "team's work", cls: "border border-[var(--line)] text-[var(--ink-soft)]" },
  external: { text: "external", cls: "border border-dashed border-[var(--line)] text-[var(--ink-soft)]" },
};

/** "How it's built": services and who built what. */
export function ServiceMap({ services }: { services: NonNullable<Detail["services"]> }) {
  return (
    <ul className="list-none p-0 m-0 grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
      {services.map((s) => (
        <li key={s.name} className="spot card p-4 flex flex-col gap-2">
          <span className="spot-line" aria-hidden="true" />
          <span className={`mono !text-[0.68rem] self-start px-2 py-0.5 rounded ${mineLabel[s.mine].cls}`}>{mineLabel[s.mine].text}</span>
          <p className="display text-lg leading-snug">{s.name}</p>
          <p className="text-[0.9rem] text-[var(--ink-soft)]">{s.role}</p>
        </li>
      ))}
    </ul>
  );
}
