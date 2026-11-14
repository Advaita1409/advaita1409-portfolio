import { useEffect, useState } from "react";
import { toggleTheme, useTheme } from "../lib/theme";
import { UiIcon, type IconName } from "./UiIcon";

export const sections: { id: string; label: string; path: string; icon: IconName }[] = [
  { id: "about", label: "about.md", path: "about", icon: "user" },
  { id: "projects", label: "projects/", path: "projects", icon: "folder" },
  { id: "experience", label: "experience.log", path: "experience", icon: "briefcase" },
  { id: "education", label: "education.md", path: "education", icon: "cap" },
  { id: "life", label: "life/", path: "life", icon: "spark" },
  { id: "contact", label: "contact.sh", path: "contact", icon: "send" },
];

export default function Nav({ onProject, onPalette }: { onProject?: string; onPalette: () => void }) {
  const [active, setActive] = useState("");
  const [open, setOpen] = useState(false);
  const dark = useTheme() === "dark";
  const toggle = toggleTheme;

  useEffect(() => {
    const io = new IntersectionObserver((entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id)), { rootMargin: "-45% 0px -50% 0px" });
    const watch = () => sections.forEach((s) => { const el = document.getElementById(s.id); if (el) io.observe(el); });
    watch();
    const on = () => setTimeout(watch, 120);
    window.addEventListener("hashchange", on);
    return () => { io.disconnect(); window.removeEventListener("hashchange", on); };
  }, []);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const crumb = onProject ? `projects/${onProject}` : (sections.find((s) => s.id === active)?.path ?? "home");

  const tree = (
    <ul className="list-none p-0 m-0 font-mono text-[0.85rem]">
      <li className="text-[var(--ink-soft)] py-1">~/advaita</li>
      {sections.map((s) => {
        const on = active === s.id && !onProject;
        return (
          <li key={s.id}>
            <a href={`#${s.id}`} onClick={() => setOpen(false)} aria-current={on ? "true" : undefined}
              className={`flex items-center gap-2 py-1.5 pl-2 -ml-px border-l no-underline transition-colors ${on ? "border-[var(--accent)] text-[var(--accent)] bg-[var(--glow)]" : "border-[var(--rule)] text-[var(--ink-soft)] hover:text-[var(--fg)] hover:border-[var(--line)]"}`}>
              <UiIcon name={s.icon} size={15} className="opacity-80 shrink-0" />{s.label}
            </a>
          </li>
        );
      })}
    </ul>
  );
  const themeBtn = (
    <button type="button" onClick={toggle} aria-pressed={!dark} className="mono inline-flex items-center gap-2 min-h-11 text-[var(--ink-soft)] hover:text-[var(--fg)] cursor-pointer">
      <span aria-hidden="true">{dark ? "☾" : "☀"}</span> theme: {dark ? "dark" : "light"}
    </button>
  );

  return (
    <>
      {/* Desktop file-tree sidebar */}
      <aside className="hidden lg:flex fixed left-0 top-0 bottom-0 w-60 flex-col justify-between p-6 border-r border-[var(--rule)] bg-[var(--bg)] z-40" aria-label="Site index">
        <div>
          <a href="#top" className="flex items-center gap-2 no-underline mb-8" aria-label="Advaita Sharma, home">
            <img src="/assets/images/avatar.jpg" alt="" width={32} height={32} className="w-8 h-8 rounded-full object-cover border border-[var(--accent)]" />
            <span className="display text-lg">Advaita Sharma</span>
          </a>
          <nav aria-label="Sections">{tree}</nav>
        </div>
        <div className="space-y-1">{themeBtn}<p className="mono text-[var(--ink-soft)] !text-[0.7rem]">Bangalore, IN</p></div>
      </aside>

      {/* Desktop top bar: breadcrumb + CTA */}
      <header className="hidden lg:flex fixed top-0 right-0 left-60 z-30 h-14 items-center justify-between px-8 bg-[var(--bg)]/85 backdrop-blur border-b border-[var(--rule)]">
        <p className="mono text-[var(--ink-soft)]" aria-hidden="true">~/advaita/<span className="text-[var(--fg)]">{crumb}</span></p>
        <div className="flex items-center gap-3"><button type="button" onClick={onPalette} className="btn !min-h-9 !py-1 mono !text-[0.8rem] text-[var(--ink-soft)]" aria-label="Open command palette"><span aria-hidden="true">Search</span><span className="kbd-hint" aria-hidden="true">⌘K</span></button><a href="#contact" className="btn pink !min-h-9 !py-1">Say hello</a></div>
      </header>

      {/* Mobile top bar */}
      <header className="lg:hidden fixed top-0 inset-x-0 z-50 flex items-center justify-between px-4 h-14 bg-[var(--bg)]/95 border-b border-[var(--rule)] backdrop-blur">
        <a href="#top" className="display text-lg no-underline flex items-center gap-2"><img src="/assets/images/avatar.jpg" alt="" width={28} height={28} className="w-7 h-7 rounded-full object-cover border border-[var(--accent)]" />Advaita Sharma</a>
        <div className="flex gap-2"><button type="button" className="btn !min-h-10 !px-3" onClick={onPalette} aria-label="Open command palette"><span aria-hidden="true" className="font-mono">&gt;_</span></button><button type="button" className="btn !min-h-10" aria-expanded={open} aria-controls="mobile-menu" onClick={() => setOpen((o) => !o)}>{open ? "Close" : "Menu"}</button></div>
      </header>
      {open && (
        <nav id="mobile-menu" aria-label="Sections" className="lg:hidden fixed inset-0 z-40 pt-20 px-6 pb-10 bg-[var(--bg)] overflow-auto">
          {tree}
          <div className="mt-8">{themeBtn}</div>
        </nav>
      )}
    </>
  );
}
