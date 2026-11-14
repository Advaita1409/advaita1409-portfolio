import { useEffect, useState, type ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { UiIcon, type IconName } from "../components/UiIcon";

export { useReducedMotion };

/** Scroll-triggered reveal. Plain content under reduced motion. */
export function Reveal({ children, delay = 0, className = "" }: { children: ReactNode; delay?: number; className?: string }) {
  const reduce = useReducedMotion();
  if (reduce) return <div className={className}>{children}</div>;
  return (
    <motion.div className={className} initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-60px" }} transition={{ duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] }}>
      {children}
    </motion.div>
  );
}

/** Section header styled like a code comment + heading. */
export function SectionTitle({ n, kicker, title, id, note, icon }: { n: string; kicker: string; title: string; id: string; note?: string; icon?: IconName }) {
  return (
    <header className="mb-10 md:mb-14">
      <p className="mono text-[var(--accent)] flex items-center gap-2.5">{icon && <span aria-hidden="true" className="grid place-items-center w-8 h-8 rounded-lg bg-[var(--glow)] border border-[var(--accent)]"><UiIcon name={icon} size={16} /></span>}// {n} — {kicker}</p>
      <h2 id={id} className="mt-3 text-[clamp(2.1rem,5vw,3.6rem)]">{title}</h2>
      {note && <p className="mt-3 max-w-xl text-[var(--ink-soft)]">{note}</p>}
    </header>
  );
}

/** Tiny hash router: "#/project/p2r" → { name: "project", id: "p2r" }. */
export function useRoute() {
  const parse = () => {
    const m = location.hash.match(/^#\/project\/([\w-]+)$/);
    return m ? { name: "project" as const, id: m[1] } : { name: "home" as const, id: "" };
  };
  const [route, setRoute] = useState(parse);
  useEffect(() => {
    const on = () => setRoute(parse());
    window.addEventListener("hashchange", on);
    return () => window.removeEventListener("hashchange", on);
  }, []);
  return route;
}
