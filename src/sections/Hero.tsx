import { useEffect, useState } from "react";
import { identity, photos } from "../data/site";
import { useReducedMotion } from "../lib/ui";
import { UiIcon, type IconName } from "../components/UiIcon";
import { OrgLogo } from "../components/Logo";

const ext = { target: "_blank", rel: "noopener noreferrer" } as const;

const stats: [string, string, IconName][] = [
  ["award", "STAR Award, Maersk · 25 Jun 2026", "award"],
  ["role", "Associate Software Engineer · Maersk", "briefcase"],
  ["edu", "B.Tech CSE (IoT) · VIT · CGPA 8.03", "cap"],
  ["cert", "Meta Database Engineer Certificate", "check"],
  ["english", "TOEFL iBT 91 / 120", "globe"],
];

const script: { cmd: string; out: string }[] = [
  { cmd: "whoami", out: "advaita sharma" },
  { cmd: "cat role.txt", out: "Associate Software Engineer @ Maersk" },
  { cmd: "cat focus.txt", out: "IoT · game development · full-stack" },
  { cmd: "ls projects/", out: "p2r/  afr/  cost-to-serve/  zephyr/  drone-swarm/  ihims/" },
  { cmd: "echo $LOCATION", out: "Bangalore, India" },
];

/** Types the script one character at a time; shows everything at once under reduced motion. */
function useTyped() {
  const reduce = useReducedMotion();
  const [state, setState] = useState({ line: reduce ? script.length : 0, chars: 0 });
  useEffect(() => {
    if (reduce) { setState({ line: script.length, chars: 0 }); return; }
    if (state.line >= script.length) return;
    const cmd = script[state.line].cmd;
    const t = setTimeout(() => {
      if (state.chars < cmd.length) setState({ ...state, chars: state.chars + 1 });
      else setState({ line: state.line + 1, chars: 0 });
    }, state.chars < cmd.length ? 55 : 520);
    return () => clearTimeout(t);
  }, [state, reduce]);
  return state;
}

export default function Hero() {
  const me = photos.avatar;
  const { line, chars } = useTyped();
  return (
    <header id="top" className="relative overflow-hidden pt-14">
      <div className="grid-bg absolute inset-0 pointer-events-none" aria-hidden="true" />
      <div aria-hidden="true" className="absolute -top-24 right-0 w-[40rem] h-[40rem] rounded-full pointer-events-none" style={{ background: "radial-gradient(closest-side, var(--glow), transparent)" }} />
      <div className="relative px-5 md:px-12 pt-14 md:pt-24 pb-14 md:pb-20">
        <div className="wrap grid xl:grid-cols-12 gap-12 items-center">
          <div className="xl:col-span-7">
            <p className="mono inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[var(--line)] text-[var(--ink-soft)]">
              <OrgLogo id="maersk" size={20} />{identity.role} · {identity.location}
            </p>
            <h1 className="mt-6 text-[clamp(3.25rem,9vw,7rem)]">
              Advaita<br /><span className="text-[var(--accent)]">Sharma</span><span className="caret ml-2" aria-hidden="true" />
            </h1>
            <p className="mt-7 max-w-xl text-lg md:text-xl text-[var(--ink-soft)]">{identity.hero}</p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <a href="#projects" className="btn pink">View projects <span aria-hidden="true">→</span></a>
              <a href={identity.cvUrl} {...ext} className="btn" aria-label="Download CV (opens in new tab)">Download CV</a>
              <a href="#contact" className="btn">Contact</a>
            </div>
          </div>

          <div className="xl:col-span-5">
            <div className="term" role="img" aria-label="Terminal summary: Advaita Sharma, Associate Software Engineer at Maersk, focused on IoT, game development and full-stack, based in Bangalore.">
              <div className="term-bar" aria-hidden="true"><i /><i /><i /><span className="mono ml-3 text-[var(--ink-soft)]">~/advaita — zsh</span></div>
              <div className="flex items-center gap-4 p-5 border-b border-[var(--rule)]">
                <img src={me.src} alt="" width={64} height={64} {...({ fetchpriority: "high" } as Record<string, string>)} decoding="async" className="w-16 h-16 rounded-xl object-cover bg-[var(--surface-2)]" style={{ objectPosition: me.pos }} />
                <div><p className="display text-xl">{identity.name}</p><p className="mono text-[var(--ink-soft)]">{identity.role}</p></div>
              </div>
              <div className="p-5 font-mono text-[0.84rem] leading-relaxed min-h-[15rem]" aria-hidden="true">
                {script.map((s, n) => {
                  if (n > line) return null;
                  const typing = n === line;
                  return (
                    <div key={s.cmd} className="mb-2">
                      <p><span className="tok-s">$</span> <span className="tok-k">{typing ? s.cmd.slice(0, chars) : s.cmd}</span>{typing && <span className="caret ml-0.5" />}</p>
                      {!typing && <p className="text-[var(--ink-soft)] break-words">{s.out}</p>}
                    </div>
                  );
                })}
                {line >= script.length && <p><span className="tok-s">$</span> <span className="caret" /></p>}
              </div>
            </div>
          </div>
        </div>

        <dl className="wrap mt-14 grid sm:grid-cols-2 lg:grid-cols-5 gap-px bg-[var(--rule)] border border-[var(--rule)] rounded-xl overflow-hidden" aria-label="Highlights">
          {stats.map(([k, v, ic]) => (
            <div key={k} className="spot bg-[var(--bg)] px-4 py-3">
              <dt className="mono text-[var(--accent)] flex items-center gap-1.5"><UiIcon name={ic} size={14} />{k}</dt>
              <dd className="m-0 text-sm mt-0.5">{v}</dd>
            </div>
          ))}
        </dl>
      </div>
    </header>
  );
}
