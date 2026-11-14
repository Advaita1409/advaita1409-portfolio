import { useEffect, useState } from "react";
import { identity, links } from "../data/site";

function useClock() {
  const fmt = () => new Intl.DateTimeFormat("en-IN", { hour: "2-digit", minute: "2-digit", hour12: true, timeZone: identity.timeZone }).format(new Date());
  const [t, setT] = useState(fmt);
  useEffect(() => { const id = setInterval(() => setT(fmt()), 15000); return () => clearInterval(id); }, []);
  return t;
}

export default function Footer() {
  const time = useClock();
  return (
    <footer className="px-5 md:px-12 pt-16 pb-32 md:pb-16 border-t border-[var(--rule)]">
      <div className="wrap">
        <p className="display text-[clamp(2rem,5vw,3.5rem)]">Thanks for stopping by<span className="text-[var(--accent)]">.</span></p>
        <div className="mt-8 pt-4 border-t border-[var(--rule)] grid sm:grid-cols-3 gap-3 mono text-[var(--ink-soft)]">
          <p>{identity.name} · {identity.role}</p>
          <p>{identity.location} · <a href={`mailto:${links.email}`} className="underline underline-offset-2 hover:text-[var(--accent)]">{links.email}</a></p>
          <p className="sm:text-right">Bangalore <time dateTime={new Date().toISOString()}>{time}</time></p>
        </div>
      </div>
    </footer>
  );
}
