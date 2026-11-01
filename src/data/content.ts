// Real career content, sourced from Gabriel's résumé. English only.
// Single source of truth for the Stack and Experience sections.

export interface SkillGroup {
  label: string;
  items: string[];
}

export const skillGroups: SkillGroup[] = [
  {
    label: "Product Design",
    items: [
      "UX/UI Design",
      "Product Discovery",
      "User Flows",
      "Prototyping",
      "Design Systems",
      "Design QA",
      "Accessibility",
      "UX Writing",
    ],
  },
  {
    label: "Frontend",
    items: ["React", "Next.js", "TypeScript", "React Native", "Expo", "Tailwind", "shadcn/ui", "TanStack Query"],
  },
  {
    label: "AI-assisted workflows",
    items: [
      "LLM research",
      "Repository analysis",
      "Technical planning",
      "Documentation",
      "Interface exploration",
      "Quality checks",
    ],
  },
  {
    label: "Tools",
    items: ["Figma", "FigJam", "Miro", "ClickUp", "Git", "GitHub", "Postman"],
  },
];

export interface Job {
  company: string;
  role: string;
  employment: string;
  period: string;
  current?: boolean;
  bullets: string[];
}

// Condensed for the simple layout: the strongest bullets from the résumé.
export const experience: Job[] = [
  {
    company: "Acesso Energia",
    role: "Frontend Development & UI Design",
    employment: "Full-time",
    period: "10.2021 — Present",
    current: true,
    bullets: [
      "Built React interfaces and reusable frontend components with API integrations; led the migration from vanilla CSS to Tailwind.",
      "Created and maintained the main product design system, establishing shared patterns, responsive behavior and accessibility across interfaces.",
      "Designed and maintained 1,000+ screens and 200+ product flows across internal platforms, client portals, mobile flows and landing pages.",
    ],
  },
  {
    company: "Ômega Digital Center",
    role: "Technical Support & Infrastructure (across roles)",
    employment: "Full-time",
    period: "03.2019 — 10.2021",
    bullets: [
      "Real-time technical support, network maintenance, and infrastructure monitoring for continuous system availability.",
    ],
  },
];

export interface Credential {
  institution: string;
  title: string;
  period: string;
  proof: string;
}

// The two FIAP degrees and the Google certificate (the featured set of the résumé).
export const credentials: Credential[] = [
  {
    institution: "FIAP",
    title: "Postgraduate, Full Stack Development",
    period: "2025 — 2026",
    proof: "Diploma · GPA 8.86",
  },
  {
    institution: "FIAP",
    title: "Associate, Systems Analysis and Development",
    period: "2021 — 2022",
    proof: "Diploma",
  },
  {
    institution: "Google",
    title: "Foundations of User Experience (UX) Design",
    period: "2023",
    proof: "Certificate",
  },
];

export const languages = [
  { name: "English", level: "Advanced" },
  { name: "Portuguese", level: "Native" },
];

export const quotes = [
  {
    text: "What really stands out about Gabriel is how well he collaborates and communicates. His exemplary work ethic, creativity, and meticulous attention to detail make him someone you can fully trust to deliver exceptional results.",
    name: "Alexandre Dutra",
    role: "Data Scientist, Fraud & Risk Analytics · Bradesco",
  },
  {
    text: "I've worked with Gabriel for over two years and watched him grow as a person and a professional. Problem-solving is his defining trait, and he's always after new knowledge and better ways to work.",
    name: "Matheus Moraes",
    role: "Fullstack Developer · Node.js · React · Go",
  },
];
