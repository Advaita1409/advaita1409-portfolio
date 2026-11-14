import { techIcons } from "../data/techIcons";

/** Map a free-text tech label to a Simple Icons slug (or null). */
const matchers: [RegExp, string][] = [
  [/spring/i, "springboot"], [/fastapi/i, "fastapi"], [/typescript/i, "typescript"], [/vue/i, "vuedotjs"], [/react/i, "react"],
  [/python/i, "python"], [/java\b|java 17/i, "openjdk"], [/postgres/i, "postgresql"], [/mysql/i, "mysql"], [/docker|container/i, "docker"],
  [/kubernetes/i, "kubernetes"], [/unity/i, "unity"], [/html|css|javascript/i, "html5"], [/figma/i, "figma"], [/\bgit\b/i, "git"],
];
const AZURE = /azure/i;
const dark = (hex: string) => {
  const n = parseInt(hex, 16); const r = (n >> 16) & 255, g = (n >> 8) & 255, b = n & 255;
  return 0.2126 * r + 0.7152 * g + 0.0722 * b < 70;
};

export function TechIcon({ label, size = 16 }: { label: string; size?: number }) {
  if (AZURE.test(label)) {
    return <span aria-hidden="true" className="inline-grid place-items-center rounded-[4px] font-bold leading-none" style={{ width: size, height: size, fontSize: size * 0.55, background: "#0078D4", color: "#fff" }}>Az</span>;
  }
  const slug = matchers.find(([re]) => re.test(label))?.[1];
  const ic = slug ? techIcons[slug] : undefined;
  if (!ic) return null;
  return (
    <svg aria-hidden="true" width={size} height={size} viewBox="0 0 24 24" className="shrink-0">
      <path d={ic.path} fill={dark(ic.hex) ? "var(--fg)" : `#${ic.hex}`} />
    </svg>
  );
}

/** A tech chip with its logo, when we know it. */
export function TechChip({ label, className = "" }: { label: string; className?: string }) {
  return (
    <span className={`chip inline-flex items-center gap-1.5 ${className}`}>
      <TechIcon label={label} size={14} />
      {label}
    </span>
  );
}

type Org = { name: string; src?: string; icon?: string; mono?: string };
/** Organisation logos. Missing logos get a clean monogram tile. */
export const orgs: Record<string, Org> = {
  maersk: { name: "Maersk", src: "/assets/logos/maersk.png" },
  vit: { name: "Vellore Institute of Technology", src: "/assets/logos/vit.png" },
  ets: { name: "ETS", src: "/assets/logos/ets.png" },
  meta: { name: "Meta", icon: "meta" },
  coursera: { name: "Coursera", icon: "coursera" },
  bhel: { name: "BHEL", src: "/assets/logos/bhel.png" },
  ncc: { name: "National Cadet Corps", src: "/assets/logos/ncc.png" },
  ngo: { name: "warriorswithoutcause", src: "/assets/logos/wwc.png" },
  freelance: { name: "Freelance", mono: "</>" },
  nps: { name: "National Public School", src: "/assets/logos/nps.png" },
  apna: { name: "ApnaCollege", mono: "AC" },
  providence: { name: "Providence", mono: "PR" },
  navy: { name: "Naval Hackathon", mono: "NH" },
  yantra: { name: "Yantra-VIT", mono: "Y" },
  police: { name: "Karnataka State Police", mono: "KSP" },
  beathlit: { name: "BeAthlit", mono: "BA" },
  apollo: { name: "Apollo", mono: "AP" },
  samanvay: { name: "Sri Rajarajeshwari Kalaniketan", mono: "SRK" },
  kayakboy: { name: "Kayakboy Surf Club", mono: "KB" },
};

export function OrgLogo({ id, size = 44 }: { id: string; size?: number }) {
  const o = orgs[id];
  if (!o) return null;
  const box = { width: size, height: size } as const;
  if (o.src) return <span aria-hidden="true" className="shrink-0 grid place-items-center rounded-xl bg-white border border-[var(--rule)] overflow-hidden" style={box}><img src={o.src} alt="" width={size} height={size} loading="lazy" decoding="async" className="w-[78%] h-[78%] object-contain" /></span>;
  if (o.icon && techIcons[o.icon]) return <span aria-hidden="true" className="shrink-0 grid place-items-center rounded-xl bg-white border border-[var(--rule)]" style={box}><svg width={size * 0.58} height={size * 0.58} viewBox="0 0 24 24"><path d={techIcons[o.icon].path} fill={`#${techIcons[o.icon].hex}`} /></svg></span>;
  return <span aria-hidden="true" className="shrink-0 grid place-items-center rounded-xl bg-[var(--surface-2)] border border-[var(--rule)] mono !tracking-tight text-[var(--accent)] font-medium" style={{ ...box, fontSize: Math.max(10, size * 0.27) }}>{o.mono}</span>;
}
