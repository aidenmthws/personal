/**
 * The single source of truth for site copy. The Ride (/) and Dry Land
 * (/dry-land) both render from this file, so copy never lives in components.
 *
 * Facts and metrics come from PLAN.md section 3, verbatim.
 */

export type LandingId =
  | "shore"
  | "boatman"
  | "source"
  | "canal"
  | "water"
  | "lake"
  | "channels"
  | "market"
  | "harbor";

export type Metric = { value: string; label: string };

export type Project = {
  name: string;
  dates: string;
  description: string;
  stack: string[];
  /** Set while a project is unfinished. A project with a status shows no results. */
  status?: string;
  metrics: Metric[];
};

export type SkillGroup = { name: string; skills: string[] };

/** One result in the Broad water net. Every fact comes from the resume bullets. */
export type Catch = Metric & { story: string };

export type Landing = {
  id: LandingId;
  /** The landing name on the Ride. */
  title: string;
  /** The plain heading on Dry Land. */
  dryTitle: string;
  org?: string;
  role?: string;
  location?: string;
  dates?: string;
  /** At most 45 words and one number, for the Ride card. */
  summary: string;
  /** Full resume bullets, for Dry Land. */
  bullets: string[];
  metrics: Metric[];
  /** Feeds Spice market lighting (add-on). Names match the market's skill lists. */
  skills: string[];
  links?: { label: string; href: string }[];
  scene: string;
  coursework?: string[];
  projects?: Project[];
  skillGroups?: SkillGroup[];
  catch?: Catch[];
};

const heroLine =
  "I build backend systems and AI tooling that make messy data easier to use.";

const shareDescription =
  "Software engineer building APIs, observability, and LLM tooling.";

export const site = {
  name: "Aiden Mathews",
  url: "https://aidenmathews.vercel.app",
  heroLine,
  shareDescription,
  pageTitle: `Aiden Mathews | ${shareDescription}`,
  dryLandPageTitle: "Dry Land | Aiden Mathews",
  location: "Northern Virginia",
  email: "2023amathews@gmail.com",
  emailLabel: "Email 2023amathews@gmail.com",
  linkedin: {
    label: "LinkedIn: linkedin.com/in/aiden-mathews",
    href: "https://www.linkedin.com/in/aiden-mathews",
  },
  resume: {
    file: "Aiden_Mathews_resume.pdf",
    href: "/Aiden_Mathews_resume.pdf",
    label: "Download resume (PDF)",
    missingNote: "My resume PDF is not posted yet.",
    missingAction: "Email me for a copy.",
  },
  nav: {
    label: "Site version",
    ride: "Ride",
    dryLand: "Dry Land",
  },
  actions: {
    castOff: "Cast off",
    dryLand: "Dry Land",
  },
  skipLinks: {
    content: "Skip to content",
    dryLand: "Skip to Dry Land",
    contact: "Skip to contact",
  },
  labels: {
    coursework: "Coursework",
    stack: "Stack",
  },
  ride: {
    hint: "Scroll or use the arrow keys to move.",
    routeLabel: "Route map",
    pause: "Pause water",
    play: "Play water",
  },
  net: {
    lower: "Lower the net",
    hint: "See the other two results.",
    raise: "Empty the basket",
    label: "The catch",
  },
  spices: {
    hint: "Point at a skill, or tap it, to light its landings on the route map.",
    usedAt: "used at",
    offRoute: "on my resume, but not tied to one landing.",
  },
  copyEmail: {
    action: "Copy email",
    done: "Email copied.",
    failed: "Copying failed. Select the address:",
  },
  notFound: {
    pageTitle: "Page not found | Aiden Mathews",
    title: "This stretch of river is not on the route.",
    body: "Pick a landing below, or read everything on Dry Land.",
    routeLabel: "Route map",
  },
  log: {
    title: "Log of the voyage",
    body: "Built with Next.js, TypeScript, and Tailwind, with scenes drawn as code-built SVG. Set in Fraunces, Instrument Sans, and IBM Plex Mono. Deployed on Vercel.",
  },
};

const market: SkillGroup[] = [
  {
    name: "Languages",
    skills: [
      "Java",
      "JavaScript",
      "Python",
      "Go",
      "C++",
      "C#",
      "SQL",
      "HTML/CSS",
    ],
  },
  {
    name: "Frameworks",
    skills: [
      "React",
      "Spring Boot",
      "Angular",
      "Node.js",
      "FastAPI",
      "Gin",
      "Tailwind",
    ],
  },
  {
    name: "Databases",
    skills: ["PostgreSQL", "MongoDB", "ClickHouse", "DuckDB", "Firebase"],
  },
  {
    name: "Cloud and tools",
    skills: [
      "Docker",
      "GCP",
      "AWS",
      "Terraform",
      "MCP",
      "Langfuse",
      "CI/CD",
      "Redis",
      "Git",
      "Vercel",
      "OpenAI API",
      "Agile/Scrum",
    ],
  },
];

/** In ride order, source to sea. */
export const landings: Landing[] = [
  {
    id: "shore",
    title: "Shore",
    dryTitle: site.name,
    location: site.location,
    summary: heroLine,
    bullets: [],
    metrics: [],
    skills: [],
    scene: "shore",
  },
  {
    id: "boatman",
    title: "The boatman",
    dryTitle: "About",
    summary:
      "I am a computer science student at Virginia Tech who loves software development, ethical cybersecurity, and AI. I look for challenging projects that push my limits, even when they mean late-night coding. If you want to build something great together, let's connect.",
    bullets: [],
    metrics: [],
    skills: [],
    scene: "boatman",
  },
  {
    id: "source",
    title: "The source",
    dryTitle: "Virginia Tech",
    org: "Virginia Tech",
    role: "B.S. in Computer Science",
    summary:
      "I study computer science at Virginia Tech, with a 3.72 GPA.",
    bullets: ["GPA 3.72"],
    metrics: [{ value: "3.72", label: "GPA" }],
    skills: [],
    scene: "source",
    coursework: [
      "Computer Systems",
      "Introduction to AI",
      "Machine Learning",
      "Data Structures and Algorithms",
      "Computer Organization",
      "Discrete Mathematics",
      "Cloud Software Development",
      "Probability and Statistics",
    ],
  },
  {
    id: "canal",
    title: "First canal",
    dryTitle: "Bunchful Enterprise",
    org: "Bunchful Enterprise",
    role: "Software Engineering Intern",
    location: "New York",
    dates: "Sep 2024 to Jan 2025",
    summary:
      "I led the Bunchful.news migration from WordPress to React with React Router and Firebase real-time updates, for a 40% faster load.",
    bullets: [
      "Led the Bunchful.news migration from WordPress to React with React Router and Firebase real-time updates (40% faster load).",
      "Built responsive React and CSS components (100% cross-browser and device compatibility, mobile page speed up 22 points).",
      "Tested with Jest and React Testing Library (85% coverage).",
    ],
    metrics: [
      { value: "40%", label: "faster load" },
      { value: "100%", label: "cross-browser and device compatibility" },
      { value: "22 points", label: "mobile page speed up" },
      { value: "85%", label: "coverage" },
    ],
    skills: ["React", "Firebase", "HTML/CSS"],
    scene: "canal",
  },
  {
    id: "water",
    title: "Broad water",
    dryTitle: "Juume AI",
    org: "Juume AI",
    role: "Junior Fullstack Engineering Intern",
    location: "Reston",
    dates: "Jun 2025 to Jun 2026",
    summary:
      "I built log analytics and PII detection with Temporal, DuckDB, Postgres, and GCS, with 93% of PII detected, plus a Go (Gin) analytics API and a Langfuse tracing stack on Google Cloud.",
    bullets: [
      "Go (Gin) analytics API for gateway usage, token consumption, and performance metrics.",
      "Temporal, DuckDB, Postgres, and GCS for log analytics and PII detection (35% lower API latency, 93% of PII detected).",
      "Langfuse tracing stack on Google Cloud provisioned with Terraform.",
      "AI Gateway control plane refactor and IAM token refresh race-condition fixes (90% fewer crashes, zero-downtime deploys on Cloud Run).",
    ],
    metrics: [
      { value: "93%", label: "of PII detected" },
      { value: "35%", label: "lower API latency" },
      { value: "90%", label: "fewer crashes" },
    ],
    catch: [
      {
        value: "93%",
        label: "of PII detected",
        story:
          "I built log analytics and PII detection with Temporal, DuckDB, Postgres, and GCS. It detected 93% of PII.",
      },
      {
        value: "35%",
        label: "lower API latency",
        story:
          "The same log analytics work ran on Temporal, DuckDB, Postgres, and GCS. It brought API latency down 35%.",
      },
      {
        value: "90%",
        label: "fewer crashes",
        story:
          "I refactored the AI Gateway control plane and fixed IAM token refresh race conditions. That meant 90% fewer crashes and zero-downtime deploys on Cloud Run.",
      },
    ],
    skills: [
      "Go",
      "Gin",
      "DuckDB",
      "PostgreSQL",
      "GCP",
      "Langfuse",
      "Terraform",
    ],
    scene: "water",
  },
  {
    id: "lake",
    title: "The lake",
    dryTitle: "Freddie Mac",
    org: "Freddie Mac",
    role: "Software Engineering Intern",
    location: "McLean",
    dates: "May 2026 to Aug 2026",
    summary:
      "I built a Node.js MCP server that groups customer enhancement requests with LLM categorization, for 40% less manual triage across hundreds of tickets.",
    bullets: [
      "AI-assisted workflows, agent skills, and a Node.js MCP server that groups customer enhancement requests with LLM categorization (40% less manual triage across hundreds of tickets).",
      "Java Spring Boot and MongoDB backend for a portal used by 50+ internal stakeholders.",
      "Angular chatbot UI (30% less review time per request).",
      "Bruno and Jenkins checks (25% fewer environment-related deployment failures).",
    ],
    metrics: [
      { value: "40%", label: "less manual triage" },
      { value: "50+", label: "internal stakeholders" },
      { value: "30%", label: "less review time per request" },
      { value: "25%", label: "fewer environment-related deployment failures" },
    ],
    skills: ["Node.js", "MCP", "Java", "Spring Boot", "MongoDB", "Angular"],
    scene: "lake",
  },
  {
    id: "channels",
    title: "Side channels",
    dryTitle: "Projects",
    summary:
      "Two side projects: an MCP-based harness comparing Jev against Claude, still in progress, and a legal document analyzer.",
    bullets: [],
    metrics: [],
    skills: ["React", "FastAPI", "OpenAI API", "Python", "MCP"],
    scene: "channels",
    projects: [
      {
        name: "Agentic Decision Evaluation Harness",
        dates: "Sep 2026",
        status: "In progress",
        description:
          "An MCP-based harness comparing Jev against Claude on infrastructure tool-routing and risk-gating decisions (Terraform, kubectl) with identical typed output schemas, measuring tool-selection accuracy, hallucination rate, Brier score, latency, and cost, plus a confidence-threshold hybrid that escalates to Claude.",
        stack: ["TypeSafe Jev", "Claude API", "Python", "MCP"],
        metrics: [],
      },
      {
        name: "Smart Legal Document Analyzer",
        dates: "Jul 2025",
        description:
          "LLM extraction and PDF parsing on Vercel serverless (30% better comprehension, 35% faster load).",
        stack: ["React", "FastAPI", "OpenAI API"],
        metrics: [
          { value: "30%", label: "better comprehension" },
          { value: "35%", label: "faster load" },
        ],
      },
    ],
  },
  {
    id: "market",
    title: "Spice market",
    dryTitle: "Skills",
    summary:
      "The languages, frameworks, databases, and tools from my resume.",
    bullets: [],
    metrics: [],
    skills: [],
    scene: "market",
    skillGroups: market,
  },
  {
    id: "harbor",
    title: "Harbor",
    dryTitle: "Contact",
    summary: "I am open to full-time roles and internships.",
    bullets: [],
    metrics: [],
    skills: [],
    links: [site.linkedin],
    scene: "harbor",
  },
];

/**
 * Dry Land reads like a resume, newest work first. The Ride keeps the river
 * order of `landings`.
 */
const dryLandOrder: LandingId[] = [
  "shore",
  "boatman",
  "lake",
  "water",
  "canal",
  "channels",
  "source",
  "market",
  "harbor",
];

export const dryLandLandings = dryLandOrder.flatMap((id) =>
  landings.filter((landing) => landing.id === id),
);
