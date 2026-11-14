/**
 * All page content. `null` values render as visible "to be added" placeholders
 * and are listed in README → "Still to fill".
 * Sources: DESIGN.md brief, Advaita's LinkedIn profile and posts.
 */

export const identity = {
  name: "Advaita Sharma",
  firstName: "Advaita",
  role: "Associate Software Engineer",
  location: "Bangalore, India",
  hero:
    "I'm Advaita Sharma, a software developer specializing in IoT and game development, driven to create impactful and user-centered digital solutions.",
  cvUrl: "https://drive.google.com/file/d/1E6CUEdxTId8Uwo9lT_qWLk7NED06JW43/view?usp=sharing",
  timeZone: "Asia/Kolkata",
};

export const links = {
  email: "advaitasharma2003@gmail.com",
  linkedin: "https://www.linkedin.com/in/advaita-sharma",
  github: "https://github.com/Advaita1409",
  instagram: "https://www.instagram.com/sharmajikibadibetiiiii/",
  instagramHandle: "@sharmajikibadibetiiiii",
};

/** Photos supplied by Advaita. `pos` is the CSS object-position focal point. */
export type Photo = { id: string; src: string; alt: string; w: number; h: number; pos: string };
export const photos: Record<string, Photo> = {
  avatar: { id: "avatar", src: "/assets/images/avatar.jpg", alt: "Advaita smiling", w: 160, h: 160, pos: "50% 50%" },
  garden: { id: "garden", src: "/assets/images/garden.jpg", alt: "Advaita in a printed dress in front of a green hedge, hand in hair, laughing", w: 750, h: 1000, pos: "50% 55%" },
  heritage: { id: "heritage", src: "/assets/images/heritage-walk.jpg", alt: "Advaita in a blue block-print scarf walking through a stone-pillared corridor", w: 900, h: 1200, pos: "50% 40%" },
  festive: { id: "festive", src: "/assets/images/festive.jpg", alt: "Advaita in a bright blue and yellow outfit in front of colourful festive umbrellas", w: 900, h: 1200, pos: "50% 50%" },
  hill: { id: "hill", src: "/assets/images/hill-station.jpg", alt: "Advaita in a pink beanie and hoodie holding a white flower, a hill town and clouds behind", w: 1105, h: 1400, pos: "50% 60%" },
  mirror: { id: "mirror", src: "/assets/images/mirror-selfie.jpg", alt: "Advaita taking a mirror selfie in a black polo shirt", w: 719, h: 900, pos: "50% 30%" },
  convocation: { id: "convocation", src: "/assets/images/convocation.jpg", alt: "Advaita in graduation robes holding her degree folder under the VIT 40th Annual Convocation arch", w: 750, h: 1000, pos: "50% 55%" },
  star: { id: "star", src: "/assets/images/star-award.jpg", alt: "STAR Award certificate awarded to Advaita Sharma by Maersk, dated 25 June 2026", w: 524, h: 745, pos: "50% 30%" },
  campus: { id: "campus", src: "/assets/images/campus.jpg", alt: "Advaita giving two thumbs up between glass office towers on a sunny day", w: 1200, h: 1173, pos: "50% 40%" },
  mountain: { id: "mountain", src: "/assets/images/mountain-view.jpg", alt: "Advaita glancing back over her shoulder on a mountain ridge at dusk", w: 750, h: 1000, pos: "50% 86%" },
};
/** Order for the photo wall. */
export const wall = ["hill", "festive", "mountain", "heritage", "mirror", "campus"] as const;

export const about = {
  p1: "Welcome! I'm Advaita, a software developer driven by the powerful intersection of technology and design. My passion lies in creating intuitive, visually engaging interfaces and developing innovative applications that elevate the digital experience.",
  p2: "I graduated in Computer Science and Engineering (IoT) from Vellore Institute of Technology in 2025 and joined Maersk as an intern, then grew into a full-stack developer role. I pair a strong technical foundation with a love of people and storytelling.",
  /** ✏️ short personal story */
  story: null as string | null,
};

export const skills: { group: string; items: string[] }[] = [
  { group: "Languages", items: ["Python", "Java", "TypeScript", "HTML / CSS / JavaScript"] },
  { group: "Frameworks", items: ["Spring Boot", "FastAPI", "React", "Vue"] },
  { group: "Data & cloud", items: ["PostgreSQL", "MySQL", "Azure", "Docker", "Kubernetes"] },
  { group: "Games & fundamentals", items: ["Unity", "Data structures & algorithms", "Particle swarm optimization"] },
];

export type Kind = "work" | "intern" | "game" | "hackathon" | "college";
export type Project = {
  id: string;
  title: string;
  kind: Kind;
  tagline: string;
  what: string;
  contribution: string | null;
  stack: string[];
  /** Hidden until Advaita confirms (DESIGN.md: "confirm"). */
  impact: string | null;
  link?: { href: string; label: string };
  small?: boolean;
  /** One-line impact shown on the project row. */
  headline?: string;
};

export const projects: Project[] = [
  {
    id: "p2r", title: "PayToRelease (P2R)", kind: "work",
    headline: "Live in 13 countries · 10 FTE positions released",
    tagline: "From proof of payment to payment release.",
    what: "Automates the path from proof of payment to payment release, using OCR and LLM extraction, validation, and analyst review.",
    contribution: "Full-stack work across API, UI and database: bank-statement upload and processing with region-specific formats (staging, duplicate checks, traceability), rule-based payment-reference extraction, the analyst review and validation screens with metrics, access control, and clean-up of legacy case-state data.", stack: ["Python", "FastAPI", "Vue 3", "TypeScript", "PostgreSQL", "Azure"], impact: null,
  },
  {
    id: "afr", title: "Approved Freight Release (AFR)", kind: "work",
    headline: "Live in 7 countries · 15 FTE released",
    tagline: "A freight-release assistant that does the checking.",
    what: "A freight-release assistant that checks payment proof, closes the related tasks, and handles emails.",
    contribution: "Built the shipment-level task-closure automation with per-shipment results, audit logging, and the screens for choosing eligible shipments. Stabilised the customer email workflows (templates, attachments, recipients) and wrote the incident and support documentation.", stack: ["Python", "FastAPI", "React", "PostgreSQL", "Azure Service Bus"], impact: null,
  },
  {
    id: "cost", title: "Cost to Serve (CostraX)", kind: "work",
    headline: "Projected 300 FTE savings by end of 2027",
    tagline: "Logistics cost analytics for leaders.",
    what: "Logistics cost analytics that give leaders a clear, comparable view of what it costs to serve.",
    contribution: "Built analytics dashboards and drill-down filters across month, region, country, product, process and task; usage and compliance summaries; Excel and CSV exports; and the solution-design workflow for compliance gaps.", stack: ["React", "Java 17", "Spring Boot", "PostgreSQL"], impact: null,
  },
  {
    id: "credit", title: "Credit policy simulator", kind: "work",
    tagline: "See the effect of a credit policy before you change it.",
    what: "A platform for simulating credit policy and analysing customer credit across several customer groups: scoring, proposed credit days, and cash-flow impact.",
    contribution: "Built the policy-overview, customer-list and simulation screens, fixed the cash-flow calculation to use stored values validated against reference spreadsheets, added a complete data export, and designed the daily data-refresh API workflow.",
    stack: ["Vue", "TypeScript", "Spring Boot", "PostgreSQL"], impact: null,
  },
  {
    id: "inland", title: "Inland route cost estimator", kind: "work",
    tagline: "Estimate inland route costs, one route or thousands.",
    what: "A tool that estimates inland route costs from route details or bulk Excel uploads, using distance estimation, historical rates and buy-to-sell mappings.",
    contribution: "Contributed to the React UI (single estimate, bulk upload, analysis download, buy-to-sell editing) and the FastAPI endpoints behind it, and supported deployment and documentation.",
    stack: ["React", "FastAPI", "PostgreSQL", "Docker"], impact: null,
  },
  {
    id: "zephyr", title: "Zephyr: Shards of Destiny", kind: "game",
    tagline: "My first solo indie game.",
    what: "A 2D platformer where you play a daring scavenger exploring dangerous ruins to collect Aether Shards, the energy crystals that power a fractured world, while an ancient force called the Voidborn grows stronger. Platforming, combat mechanics, bosses and a story-driven experience. Playable on Windows.",
    contribution: "Designed and built the whole game solo as a personal project.", stack: ["Unity"], impact: null,
    link: { href: "https://lnkd.in/gyPTGvHq", label: "Play it" },
  },
  {
    id: "drone", title: "Drone Swarm Coordination", kind: "hackathon",
    tagline: "Decentralised AI drone swarm, simulated in 3D.",
    what: "Built for the Naval Hackathon 2024, problem statement “Drone Swarm Coordination”: a decentralised, AI-based coordination system that uses Particle Swarm Optimization to steer a fleet of drones in a 3D Unity simulation, aimed at naval operations.",
    contribution: "Built with a team of three, developing the simulation together.", stack: ["Unity", "Particle Swarm Optimization", "3D simulation"], impact: null,
  },
  {
    id: "ihims", title: "Integrated Health Intervention Management System", kind: "hackathon",
    tagline: "Healthcare tech for underserved communities.",
    what: "An idea for accessible healthcare that brings together AI, IoT and blockchain. Our team, NextGen2, advanced to Stage 2 of the Providence LEAP Ideathon with it.",
    contribution: "Worked with a team of three on the concept and the pitch.", stack: ["AI", "IoT", "Blockchain"], impact: null,
  },
  {
    id: "bhel", title: "Shop-floor data app (BHEL)", kind: "intern",
    tagline: "Digitised data collection for manufacturing.",
    what: "During an internship at BHEL, I looked at how insulators are produced: every stage has parameters that were noted down by hand and entered into a database later. I built a mobile application that digitises that data capture, using database management, operating-systems knowledge, Java and SQL.",
    contribution: "Identified the manual-capture problem and built the app end to end.", stack: ["Java", "SQL", "Mobile"], impact: null,
  },
  {
    id: "aquawatch", title: "AquaWatch IoT", kind: "college",
    tagline: "College project.",
    what: "An IoT-based environmental monitoring system that connects sensors with real-time data collection and analytics.",
    contribution: null, stack: ["IoT"], impact: null, small: true,
  },
];

export type Job = { id: string; role: string; org: string; logo: string; when: string; text: string };

export const experience: Job[] = [
  { id: "maersk", role: "Associate Software Engineer", org: "Maersk, Bangalore", logo: "maersk", when: "Jan 2025 – present", text: "Joined as a software engineer intern and grew into a full-stack developer role. Builds finance and logistics platforms with React, Spring Boot, PostgreSQL and Figma. Received the STAR Award in June 2026. Also took part in campus hiring, representing the company at a university placement drive and speaking at its pre-placement talk. Beyond code: wrote architecture overviews, support runbooks and troubleshooting guides, and moved hard-coded configuration into environment-based settings across several services." },
  { id: "bhel", role: "App Developer Intern", org: "BHEL, SBD", logo: "bhel", when: "Aug – Sep 2023", text: "Solved an industry-specific problem by automating data capture in insulator production with a mobile application." },
  { id: "freelance", role: "Freelancer", org: "Remote", logo: "freelance", when: "Oct 2022 – Dec 2023", text: "Worked with several clients on website development and managing websites." },
  { id: "ncc", role: "Cadet", org: "National Cadet Corps", logo: "ncc", when: "Nov 2022 – present", text: "NCC cadet. Story to be added." },
  { id: "ngo", role: "Digital Marketing & PR Intern", org: "warriorswithoutcause (NGO)", logo: "ngo", when: "13 Jan – 3 Mar 2022", text: "Created posters and campaigns to promote awareness, and helped raise ₹23,580 for washrooms in slums under Project Swasthya Raksha. Also learned leadership, fundraising, podcasting, event management and social media management." },
];

export const certificates: { id: string; name: string; by: string; detail: string; logo: string }[] = [
  { id: "star", name: "STAR Award", by: "Maersk", detail: "25 Jun 2026 · for contributions as a Full Stack Developer and out-of-the-box thinking", logo: "maersk" },
  { id: "toefl", name: "TOEFL iBT", by: "ETS", detail: "91 / 120", logo: "ets" },
  { id: "meta", name: "Database Engineer Professional Certificate", by: "Meta · Coursera", detail: "", logo: "meta" },
  { id: "alpha", name: "Alpha: DSA with Java", by: "ApnaCollege", detail: "", logo: "apna" },
  { id: "ngo", name: "Certificate of Appreciation", by: "warriorswithoutcause", detail: "Winter Internship Program 2022", logo: "ngo" },
  { id: "leap", name: "Providence LEAP Ideathon", by: "Stage 2 qualifier", detail: "Team NextGen2 · IHIMS", logo: "providence" },
  { id: "naval", name: "Naval Hackathon 2024", by: "Participant", detail: "Drone Swarm Coordination", logo: "navy" },
  { id: "yantra", name: "Yantra-VIT 2023: Stockastic", by: "Dream Merchants VIT", detail: "Stock-market simulation hackathon · 6 Jun 2023", logo: "yantra" },
];

export const education: { id: string; school: string; degree: string; when: string; note: string; logo: string }[] = [
  { id: "vit", school: "Vellore Institute of Technology", degree: "B.Tech, Computer Science Engineering (IoT)", when: "2021 – 2025", note: "Graduated August 2025 with a CGPA of 8.03 / 10. Specialised in the Internet of Things.", logo: "vit" },
  { id: "nps", school: "National Public School, Yeshwanthpur", degree: "Higher Secondary, Science", when: "2014 – 2021", note: "12th grade: Physics, Chemistry, Maths, Biology.", logo: "nps" },
];

/** ✏️ Optional hand-picked quotes shown before visitors' guestbook notes in "Things people say about me". */
export const peopleSay: { name: string; text: string }[] = [];

export type ActivityImage = { src: string; alt: string; w: number; h: number; label: string };
export type Activity = { id: string; group: "run" | "dance" | "surf"; title: string; org: string; when: string; detail: string; images: ActivityImage[] };

/** Runs, dance and surf: photos and certificates supplied by Advaita. ✏️ Add distances for the two runs marked "to be added". */
export const activities: Activity[] = [
  {
    id: "ksp5k", group: "run", title: "Karnataka State Police Run · 5K timed", org: "police", when: "1 Mar 2026",
    detail: "Bengaluru, with SBI. Finisher's medal in hand in front of Vidhana Soudha.",
    images: [
      { src: "/assets/images/5k-run.jpg", alt: "Advaita in a race shirt holding up her finisher's medal outside Vidhana Soudha in Bengaluru", w: 825, h: 1100, label: "Finish line" },
      { src: "/assets/images/run-5k-bib.jpg", alt: "Race bib for the Karnataka State Police Run, 5K timed, 1 March 2026", w: 800, h: 609, label: "Race bib" },
    ],
  },
  {
    id: "persistence", group: "run", title: "BeAthlit Persistence Run 2026", org: "beathlit", when: "2026",
    detail: "Race bib from the run. Distance to be added.",
    images: [{ src: "/assets/images/run-persistence-bib.jpg", alt: "Race bib for the BeAthlit Persistence Run 2026", w: 800, h: 586, label: "Race bib" }],
  },
  {
    id: "commitment", group: "run", title: "Apollo Commitment Run 2026", org: "apollo", when: "2026",
    detail: "Race bib from the run. Distance to be added.",
    images: [{ src: "/assets/images/run-commitment-bib.jpg", alt: "Race bib for the Apollo Commitment Run 2026", w: 800, h: 615, label: "Race bib" }],
  },
  {
    id: "samanvay", group: "dance", title: "Samanvay Arts Festival 2026 · Adavu Jam", org: "samanvay", when: "19 Sep 2026",
    detail: "Took part in Adavu Jam, conducted by Sri Rajarajeshwari Kalaniketan during its Golden Jubilee celebration of 50 years of art and culture, at Chowdiah Memorial Hall, Bengaluru. Certificate of appreciation and participation.",
    images: [{ src: "/assets/images/samanvay-certificate.jpg", alt: "Certificate of appreciation and participation, Samanvay Arts Festival 2026", w: 800, h: 614, label: "Certificate" }],
  },
  {
    id: "surf", group: "surf", title: "Kayakboy Surf Club · 3-day surfing course", org: "kayakboy", when: "Dec 2025",
    detail: "Completed a three-day surfing course. Certificate of completion.",
    images: [
      { src: "/assets/images/surf-board.jpg", alt: "Advaita leaning against a painted Kayakboy Surf Club surfboard beside a river", w: 562, h: 1000, label: "At the club" },
      { src: "/assets/images/surf-certificate.jpg", alt: "Kayakboy Surf Club certificate of completion for a three-day surfing course, December 2025", w: 800, h: 585, label: "Certificate" },
    ],
  },
];
