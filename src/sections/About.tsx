import { useState } from "react";
import { about, photos, skills } from "../data/site";
import { Reveal, SectionTitle } from "../lib/ui";
import { TechChip, OrgLogo } from "../components/Logo";
import { UiIcon, type IconName } from "../components/UiIcon";
import Lightbox from "../components/Lightbox";

const Tile = ({ k, icon, children, className = "" }: { k: string; icon: IconName; children: React.ReactNode; className?: string }) => (
  <div className={`spot card p-4 flex flex-col justify-between overflow-hidden ${className}`}>
    <span className="spot-line" aria-hidden="true" />
    <p className="mono text-[var(--accent)] flex items-center gap-1.5"><UiIcon name={icon} size={14} />{k}</p>
    <div>{children}</div>
  </div>
);

export default function About() {
  const [box, setBox] = useState<{ src: string; alt: string } | null>(null);
  const me = photos.garden, grad = photos.convocation, star = photos.star;
  return (
    <section id="about" className="section" aria-labelledby="about-h">
      <div className="wrap">
        <SectionTitle n="01" kicker="about" title="About me" id="about-h" icon="user" />
        <Reveal>
          <p className="display !font-medium text-[clamp(1.45rem,2.8vw,2.2rem)] leading-[1.25] !tracking-[-0.02em] max-w-4xl">{about.p1}</p>
        </Reveal>

        {/* Compact bento: photos on the left, facts on the right */}
        <Reveal delay={0.05}>
          <div className="mt-10 grid grid-cols-2 lg:grid-cols-4 gap-3 auto-rows-[7rem] lg:auto-rows-[9.5rem]">
            <figure className="photo m-0 col-start-1 row-start-1 row-span-2">
              <img src={me.src} alt={me.alt} width={me.w} height={me.h} loading="lazy" decoding="async" className="w-full h-full object-cover" style={{ objectPosition: me.pos }} />
            </figure>

            {/* studied: portrait convocation photo, caption at the bottom so the face stays clear */}
            <div className="spot photo relative col-start-2 row-start-1 row-span-2 flex flex-col justify-between p-3 text-white">
              <img src={grad.src} alt={grad.alt} width={grad.w} height={grad.h} loading="lazy" decoding="async" className="absolute inset-0 w-full h-full object-cover -z-10" style={{ objectPosition: "50% 20%" }} />
              <span aria-hidden="true" className="absolute inset-x-0 bottom-0 h-[55%] -z-10 bg-gradient-to-t from-black/85 via-black/55 to-transparent" />
              <p className="mono self-start flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-black/55 text-[#5eead4]"><UiIcon name="cap" size={14} />studied</p>
              <div className="flex items-end gap-2.5"><OrgLogo id="vit" size={36} /><div className="min-w-0"><p className="display text-lg leading-tight">VIT, B.Tech CSE (IoT)</p><p className="text-white/85 text-xs">CGPA 8.03 · graduated Aug 2025</p></div></div>
            </div>

            <Tile k="now" icon="briefcase" className="col-start-1 row-start-3 col-span-2 lg:col-start-3 lg:row-start-1">
              <div className="flex items-center gap-3"><OrgLogo id="maersk" size={36} /><div><p className="display text-xl leading-tight">Associate Software Engineer</p><p className="text-[var(--ink-soft)] text-sm">Maersk · full-stack, finance &amp; logistics platforms</p></div></div>
            </Tile>

            <Tile k="based in" icon="pin" className="col-start-1 row-start-4 lg:col-start-3 lg:row-start-2">
              <p className="display text-xl">Bangalore</p><p className="text-[var(--ink-soft)] text-sm">Karnataka, India</p>
            </Tile>

            {/* award: certificate thumbnail opens full size */}
            <div className="spot card col-start-2 row-start-4 lg:col-start-4 lg:row-start-2 flex gap-2 p-3 overflow-hidden">
              <span className="spot-line" aria-hidden="true" />
              <div className="flex flex-col justify-between min-w-0 flex-1">
                <p className="mono text-[var(--accent)] flex items-center gap-1.5"><UiIcon name="award" size={14} />award</p>
                <div><p className="display text-lg leading-tight">STAR Award</p><p className="text-[var(--ink-soft)] text-xs">Maersk · 25 Jun 2026</p></div>
              </div>
              <button type="button" onClick={() => setBox({ src: star.src, alt: star.alt })} className="photo shrink-0 w-12 sm:w-[4.6rem] cursor-zoom-in" aria-label="View the STAR Award certificate">
                <img src={star.src} alt="" width={star.w} height={star.h} loading="lazy" decoding="async" className="w-full h-full object-cover object-top" />
              </button>
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.05}>
          <div className="mt-10 grid lg:grid-cols-12 gap-8">
            <p className="lg:col-span-7 text-lg text-[var(--ink-soft)]">{about.p2}</p>
            <div className="lg:col-span-5 text-[var(--ink-soft)]">{about.story ? <p>{about.story}</p> : <p className="note">my story, in my own words, coming soon</p>}</div>
          </div>
        </Reveal>

        <Reveal delay={0.08}>
          <div className="term mt-12">
            <div className="term-bar" aria-hidden="true"><i /><i /><i /><span className="mono ml-3 text-[var(--ink-soft)]">skills.config</span></div>
            <dl className="m-0 p-2 md:p-4">
              {skills.map((g) => (
                <div key={g.group} className="grid md:grid-cols-[13rem_1fr] gap-2 md:gap-6 p-3 rounded-lg hover:bg-[var(--surface-2)] transition-colors">
                  <dt className="mono text-[var(--blue)] pt-1">{g.group.toLowerCase().replace(/[^a-z]+/g, "_")}:</dt>
                  <dd className="m-0"><ul className="flex flex-wrap gap-2 list-none p-0 m-0">{g.items.map((s) => <li key={s}><TechChip label={s} /></li>)}</ul></dd>
                </div>
              ))}
            </dl>
          </div>
        </Reveal>
      </div>
      <Lightbox src={box?.src ?? null} alt={box?.alt ?? ""} onClose={() => setBox(null)} />
    </section>
  );
}
