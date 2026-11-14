/** Small stroke icon set (24px grid), hand-drawn for this site. Decorative: always aria-hidden. */
const P: Record<string, string> = {
  user: "M12 12a4 4 0 100-8 4 4 0 000 8zM4 21c0-4 3.6-7 8-7s8 3 8 7",
  folder: "M3 7a2 2 0 012-2h4l2 2h8a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V7z",
  briefcase: "M4 8h16v11H4zM9 8V6a1 1 0 011-1h4a1 1 0 011 1v2M4 13h16",
  cap: "M2 9l10-5 10 5-10 5zM6 11.5V16c0 1.5 2.7 3 6 3s6-1.500 6-3v-4.500",
  spark: "M12 3l1.800 5.200L19 10l-5.200 1.800L12 17l-1.800-5.200L5 10l5.200-1.800zM19 16l.8 2.200L22 19l-2.200.8L19 22l-.8-2.200L16 19l2.200-.8z",
  send: "M21 3L3 11l7 3 3 7zM10 14l11-11",
  award: "M12 14a6 6 0 100-12 6 6 0 000 12zM8.500 13.500L7 22l5-3 5 3-1.500-8.500",
  pin: "M12 21s7-6.200 7-11a7 7 0 10-14 0c0 4.800 7 11 7 11zM12 12a2.500 2.500 0 100-5 2.500 2.500 0 000 5z",
  code: "M8 8l-5 4 5 4M16 8l5 4-5 4M14 5l-4 14",
  database: "M4 6c0-1.700 3.600-3 8-3s8 1.300 8 3-3.600 3-8 3-8-1.300-8-3zM4 6v12c0 1.700 3.600 3 8 3s8-1.300 8-3V6M4 12c0 1.700 3.600 3 8 3s8-1.300 8-3",
  cloud: "M7 18a4 4 0 010-8 5.500 5.500 0 0110.500 1.500A3.500 3.500 0 0117 18z",
  layers: "M12 3l9 5-9 5-9-5zM3 13l9 5 9-5M3 17.500l9 5 9-5",
  medal: "M8 3h3l1 5M16 3h-3l-1 5M12 21a6 6 0 100-12 6 6 0 000 12zM12 12v3",
  calendar: "M4 6h16v14H4zM4 10h16M8 3v4M16 3v4",
  globe: "M12 21a9 9 0 100-18 9 9 0 000 18zM3 12h18M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18",
  flag: "M5 21V4M5 4h11l-2 4 2 4H5",
  music: "M9 18V5l11-2v13M9 18a3 3 0 11-6 0 3 3 0 016 0zM20 16a3 3 0 11-6 0 3 3 0 016 0z",
  wave: "M2 9c2.500 0 2.500-2 5-2s2.500 2 5 2 2.500-2 5-2 2.500 2 5 2M2 14c2.500 0 2.500-2 5-2s2.500 2 5 2 2.500-2 5-2 2.500 2 5 2M2 19c2.500 0 2.500-2 5-2s2.500 2 5 2 2.500-2 5-2 2.500 2 5 2",
  run: "M13 4.500a1.500 1.500 0 100-3 1.500 1.500 0 000 3zM6 21l3-6 3 2v5M9 15l1-5 4 1 3 3M10 10L7 12",
  mail: "M3 5h18v14H3zM3 7l9 6 9-6",
  check: "M5 12.500l4.500 4.500L19 7",
  branch: "M6 3v12M6 15a3 3 0 100 6 3 3 0 000-6zM18 9a3 3 0 100-6 3 3 0 000 6zM18 9c0 5-12 3-12 6",
  arrow: "M5 12h14M13 6l6 6-6 6",
  link: "M10 14a4 4 0 005.700 0l3-3a4 4 0 00-5.700-5.700l-1 1M14 10a4 4 0 00-5.700 0l-3 3A4 4 0 0011 18.700l1-1",
  star: "M12 3l2.800 5.700 6.200.9-4.500 4.400 1 6.200L12 17.200 6.500 20.200l1-6.200L3 9.600l6.200-.9z",
  trophy: "M8 21h8M12 17v4M7 4h10v5a5 5 0 01-10 0zM7 6H4v1a3 3 0 003 3M17 6h3v1a3 3 0 01-3 3",
  clock: "M12 21a9 9 0 100-18 9 9 0 000 18zM12 7v5l3 2",
  heart: "M12 20s-8-5-8-11a4.500 4.500 0 018-2.800A4.500 4.500 0 0120 9c0 6-8 11-8 11z",
  cpu: "M7 7h10v10H7zM10 10h4v4h-4zM9 3v3M15 3v3M9 18v3M15 18v3M3 9h3M3 15h3M18 9h3M18 15h3",
};
export type IconName = keyof typeof P;
export function UiIcon({ name, size = 18, className = "" }: { name: IconName; size?: number; className?: string }) {
  return (
    <svg aria-hidden="true" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d={P[name]} />
    </svg>
  );
}
