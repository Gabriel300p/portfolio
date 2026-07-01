// Real career content, sourced from Gabriel's résumé.
// Single source of truth for the Stack and Experience sections.

export interface Bilingual {
  en: string;
  pt: string;
}

export interface SkillGroup {
  label: Bilingual;
  items: string[];
}

export const skillGroups: SkillGroup[] = [
  {
    label: { en: "Product Design", pt: "Product Design" },
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
    label: { en: "Frontend", pt: "Frontend" },
    items: [
      "React",
      "Next.js",
      "TypeScript",
      "React Native",
      "Expo",
      "Tailwind",
      "shadcn/ui",
      "TanStack Query",
    ],
  },
  {
    label: { en: "AI-assisted workflows", pt: "Workflows com IA" },
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
    label: { en: "Tools", pt: "Ferramentas" },
    items: ["Figma", "FigJam", "Miro", "ClickUp", "Git", "GitHub", "Postman"],
  },
];

// Slugs resolved against the simple-icons package at build time.
export const stackLogos: string[] = [
  "figma",
  "react",
  "typescript",
  "javascript",
  "nextdotjs",
  "expo",
  "tailwindcss",
  "shadcnui",
  "reactquery",
  "nodedotjs",
  "html5",
  "css",
  "git",
  "github",
  "postman",
];

export interface Job {
  company: string;
  role: Bilingual;
  period: Bilingual;
  current?: boolean;
  bullets: Bilingual[];
}

export const experience: Job[] = [
  {
    company: "Acesso Energia",
    role: { en: "Frontend Developer & UI Designer", pt: "Frontend Developer & UI Designer" },
    period: { en: "Oct 2021 — Present", pt: "Out 2021 — Presente" },
    current: true,
    bullets: [
      {
        en: "Designed and maintained interfaces across internal platforms, client portals, mobile flows, and landing pages, covering 1,000+ screens and 200+ complete product flows.",
        pt: "Projetei e mantive interfaces em plataformas internas, portais de cliente, fluxos mobile e landing pages, cobrindo 1.000+ telas e 200+ fluxos de produto completos.",
      },
      {
        en: "Created and maintained the main product design system from scratch: reusable patterns, responsive behavior, accessibility, and scalable evolution.",
        pt: "Criei e mantive o principal design system do produto do zero: padrões reutilizáveis, responsividade, acessibilidade e evolução escalável.",
      },
      {
        en: "Designed in Figma and implemented responsive interfaces in React, TypeScript, and Tailwind, with clear handoff between design, frontend, QA, and business.",
        pt: "Desenhei no Figma e implementei interfaces responsivas em React, TypeScript e Tailwind, com handoff claro entre design, frontend, QA e negócio.",
      },
      {
        en: "Improved design-to-dev collaboration with clearer specs, reusable UI patterns, visual review, and production-focused design QA.",
        pt: "Melhorei a colaboração design-dev com specs mais claras, padrões de UI reutilizáveis, revisão visual e design QA focado em produção.",
      },
      {
        en: "Used AI-assisted workflows for product research, codebase analysis, technical planning, UX writing, and quality checks.",
        pt: "Usei workflows com IA para pesquisa de produto, análise de codebase, planejamento técnico, UX writing e verificações de qualidade.",
      },
    ],
  },
  {
    company: "Ômega Digital Center",
    role: { en: "Network & Infrastructure Analyst", pt: "Analista de Redes e Infraestrutura" },
    period: { en: "Mar 2019 — Oct 2021", pt: "Mar 2019 — Out 2021" },
    bullets: [
      {
        en: "Real-time technical support, network maintenance, and infrastructure monitoring for continuous system availability.",
        pt: "Suporte técnico em tempo real, manutenção de rede e monitoramento de infraestrutura para disponibilidade contínua.",
      },
      {
        en: "Diagnosed problems and resolved support requests with users and stakeholders clearly and efficiently.",
        pt: "Diagnostiquei problemas e resolvi chamados com usuários e stakeholders de forma clara e eficiente.",
      },
    ],
  },
];

export interface Study {
  school: string;
  title: Bilingual;
  period: string;
}

export const education: Study[] = [
  {
    school: "FIAP",
    title: { en: "Postgraduate, Full Stack Development", pt: "Pós-graduação, Full Stack Development" },
    period: "2025",
  },
  {
    school: "FIAP",
    title: {
      en: "Associate, Systems Analysis and Development",
      pt: "Tecnólogo, Análise e Desenvolvimento de Sistemas",
    },
    period: "2021 — 2022",
  },
  {
    school: "Times Idiomas",
    title: { en: "English Conversation Course", pt: "Curso de Conversação em Inglês" },
    period: "2025 —",
  },
];

export const languages: Bilingual[] = [
  { en: "Portuguese — Native", pt: "Português — Nativo" },
  { en: "English — Advanced", pt: "Inglês — Avançado" },
];
