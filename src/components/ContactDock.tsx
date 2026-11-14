import { links } from "../data/site";
import { Icon, iconPaths as paths } from "./icons";

const ext = { target: "_blank", rel: "noopener noreferrer" } as const;
/** Persistent contact dock: bottom-centre on phones, bottom-right on desktop. */
export default function ContactDock() {
  const item = "grid place-items-center w-10 h-10 rounded-lg text-[var(--ink-soft)] hover:text-[var(--accent)] hover:bg-[var(--glow)] transition-colors";
  return (
    <nav aria-label="Contact" className="fixed z-40 bottom-4 left-1/2 -translate-x-1/2 lg:left-auto lg:translate-x-0 lg:right-6 flex items-center gap-1 p-1.5 rounded-xl bg-[var(--surface)] border border-[var(--line)] shadow-[0_12px_40px_rgb(0_0_0/0.4)]">
      <a className={item} href={`mailto:${links.email}`} aria-label="Email Advaita"><Icon d={paths.mail} /></a>
      <a className={item} href={links.linkedin} {...ext} aria-label="LinkedIn (opens in new tab)"><Icon d={paths.in} /></a>
      <a className={item} href={links.github} {...ext} aria-label="GitHub (opens in new tab)"><Icon d={paths.gh} /></a>
      {links.instagram && <a className={item} href={links.instagram} {...ext} aria-label="Instagram (opens in new tab)"><Icon d={paths.ig} /></a>}
      <a href="#contact" className="h-10 px-3.5 ml-1 rounded-lg bg-[var(--accent)] text-[var(--accent-ink)] font-semibold text-sm whitespace-nowrap hover:brightness-105 inline-flex items-center no-underline">Say hello</a>
    </nav>
  );
}
