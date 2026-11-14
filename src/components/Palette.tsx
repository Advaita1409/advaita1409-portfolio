import { useEffect, useMemo, useRef, useState } from "react";
import { identity, links, projects } from "../data/site";
import { sections } from "./Nav";
import { toggleTheme } from "../lib/theme";

type Item = { id: string; label: string; hint: string; run: () => void };

/** ⌘K / Ctrl+K command palette: jump to sections, open projects, contact links, toggle theme. */
export default function Palette({ open, onClose }: { open: boolean; onClose: () => void }) {
  const ref = useRef<HTMLDialogElement>(null);
  const [q, setQ] = useState("");
  const [i, setI] = useState(0);

  const items = useMemo<Item[]>(() => {
    const go = (id: string) => () => { location.hash = `#${id}`; setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" }), 60); };
    const out = (href: string) => () => { window.open(href, "_blank", "noopener"); };
    return [
      ...sections.map((s) => ({ id: `s-${s.id}`, label: `Go to ${s.label}`, hint: "section", run: go(s.id) })),
      ...projects.map((p) => ({ id: `p-${p.id}`, label: p.title, hint: "project", run: () => { location.hash = `#/project/${p.id}`; } })),
      { id: "a-cv", label: "Download CV", hint: "action", run: out(identity.cvUrl) },
      { id: "a-mail", label: "Email Advaita", hint: "action", run: () => { location.href = `mailto:${links.email}`; } },
      { id: "a-in", label: "Open LinkedIn", hint: "link", run: out(links.linkedin) },
      { id: "a-gh", label: "Open GitHub", hint: "link", run: out(links.github) },
      { id: "a-theme", label: "Toggle theme (dark / light)", hint: "action", run: toggleTheme },
    ];
  }, []);

  const shown = items.filter((x) => (x.label + " " + x.hint).toLowerCase().includes(q.toLowerCase()));

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (open && !d.open) { d.showModal(); setQ(""); setI(0); }
    if (!open && d.open) d.close();
  }, [open]);
  useEffect(() => setI(0), [q]);

  const pick = (x?: Item) => { if (!x) return; onClose(); setTimeout(x.run, 30); };
  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") { e.preventDefault(); setI((n) => Math.min(n + 1, shown.length - 1)); }
    else if (e.key === "ArrowUp") { e.preventDefault(); setI((n) => Math.max(n - 1, 0)); }
    else if (e.key === "Enter") { e.preventDefault(); pick(shown[i]); }
  };

  return (
    <dialog ref={ref} className="palette" aria-label="Command palette" onClose={onClose} onClick={(e) => { if (e.target === ref.current) onClose(); }}>
      <div className="flex items-center gap-3 px-4 border-b border-[var(--rule)]">
        <span aria-hidden="true" className="mono text-[var(--accent)]">&gt;</span>
        <label htmlFor="pal-q" className="sr-only">Type a command or search</label>
        <input id="pal-q" role="combobox" aria-expanded="true" aria-controls="pal-list" aria-activedescendant={shown[i] ? `pal-${shown[i].id}` : undefined}
          value={q} onChange={(e) => setQ(e.target.value)} onKeyDown={onKey} placeholder="Type a command or search…" autoComplete="off"
          className="w-full bg-transparent py-4 outline-none placeholder:text-[var(--ink-soft)]" />
        <span className="kbd-hint">esc</span>
      </div>
      <ul id="pal-list" role="listbox" aria-label="Commands" className="list-none m-0 p-2 max-h-[50vh] overflow-auto">
        {shown.length === 0 && <li className="px-3 py-6 text-center mono text-[var(--ink-soft)]">no matches</li>}
        {shown.map((x, n) => (
          <li key={x.id} id={`pal-${x.id}`} role="option" aria-selected={n === i}
            onMouseEnter={() => setI(n)} onClick={() => pick(x)}
            className={`flex items-center justify-between gap-4 px-3 py-2.5 rounded-lg cursor-pointer ${n === i ? "bg-[var(--glow)] text-[var(--accent)]" : ""}`}>
            <span>{x.label}</span><span className="mono text-[var(--ink-soft)]">{x.hint}</span>
          </li>
        ))}
      </ul>
    </dialog>
  );
}
