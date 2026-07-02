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
  /** icon key resolved in Experience.astro: "code" | "server" */
  icon: "code" | "server";
  employment: Bilingual;
  period: string;
  current?: boolean;
  bullets: Bilingual[];
  stack: string[];
}

export const experience: Job[] = [
  {
    company: "Acesso Energia",
    role: { en: "Frontend Developer & UI Designer", pt: "Frontend Developer & UI Designer" },
    icon: "code",
    employment: { en: "Full-time", pt: "Tempo integral" },
    period: "10.2021 — Present",
    current: true,
    stack: ["React", "TypeScript", "Tailwind", "Figma", "Design Systems", "Accessibility", "Design QA", "AI-assisted"],
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
        en: "Led the migration from vanilla CSS to Tailwind, cutting the time to build and iterate on screens.",
        pt: "Liderei a migração de CSS puro para Tailwind, reduzindo o tempo de construir e iterar telas.",
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
    icon: "server",
    employment: { en: "Full-time", pt: "Tempo integral" },
    period: "03.2019 — 10.2021",
    stack: ["Networking", "Infrastructure", "Tech Support", "Monitoring", "Troubleshooting"],
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

export interface Credential {
  /** degree = graduation with a diploma; certificate = course credential */
  kind: "degree" | "certificate";
  institution: string;
  /** avatar letter(s) — matches the monogram treatment used in Experience */
  monogram: string;
  title: Bilingual;
  period: string;
  /** highlighted in the main list; the rest live under "see more" */
  featured?: boolean;
  /** short credential proof line, e.g. "Diploma", "GPA 8.86", the field */
  proof?: Bilingual;
  /** subject tags — only for degrees with substantial coursework */
  topics?: string[];
  /** public verification link (credential URL); row becomes a link when set */
  url?: string;
}

// Real credentials, sourced from Gabriel's CV / LinkedIn.
// The two FIAP degrees and the Google certificate are featured; the rest
// collapse under a "see more" toggle.
export const credentials: Credential[] = [
  // --- Featured: the two FIAP degrees + the Google certificate ---
  {
    kind: "degree",
    institution: "FIAP",
    monogram: "F",
    title: {
      en: "Postgraduate, Full Stack Development",
      pt: "Pós-graduação Lato Sensu, Full Stack Development",
    },
    period: "2025 — 2026",
    featured: true,
    proof: { en: "Diploma · GPA 8.86", pt: "Diploma · média 8.86" },
    topics: [
      "Clean Architecture",
      "DDD",
      "Microservices",
      "Design Patterns",
      "Docker",
      "Microfrontends",
      "React Native",
    ],
  },
  {
    kind: "degree",
    institution: "FIAP",
    monogram: "F",
    title: {
      en: "Associate, Systems Analysis and Development",
      pt: "Tecnólogo, Análise e Desenvolvimento de Sistemas",
    },
    period: "2020 — 2022",
    featured: true,
    proof: { en: "Diploma", pt: "Diploma" },
    topics: ["Systems Analysis", "Front-end", "React", "Databases", "Python", "UX/UI"],
  },
  {
    kind: "certificate",
    institution: "Google",
    monogram: "G",
    title: {
      en: "Foundations of User Experience (UX) Design",
      pt: "Fundamentos do design da experiência do usuário (UX)",
    },
    period: "2023",
    featured: true,
    proof: { en: "Certificate", pt: "Certificado" },
    url: "https://coursera.org/share/9e38ed5d34cc59c6833eb2e098852279",
    topics: ["UX Design", "User Research", "Design Thinking", "Wireframing", "Prototyping", "Accessibility"],
  },

  // --- The rest (see more), newest first ---
  {
    kind: "certificate",
    institution: "Alura",
    monogram: "A",
    title: {
      en: "Design System: designing and building components",
      pt: "Design System: projetando e construindo componentes",
    },
    period: "02.2025",
    url: "https://cursos.alura.com.br/certificate/3c0a461a-f1f3-4286-91b3-3ce55eed04f5",
  },
  {
    kind: "certificate",
    institution: "Alura",
    monogram: "A",
    title: {
      en: "Design System: defining styles and tokens",
      pt: "Design System: definindo estilos e tokens",
    },
    period: "01.2025",
    url: "https://cursos.alura.com.br/certificate/6cd23d2b-826d-45cd-8135-bd54195eeeed",
  },
  {
    kind: "certificate",
    institution: "Alura",
    monogram: "A",
    title: {
      en: "TypeScript: object-oriented programming on the front-end",
      pt: "TypeScript: aplicando orientação a objetos no Front-end",
    },
    period: "01.2025",
    url: "https://cursos.alura.com.br/certificate/85ee0f07-18bd-4ac3-bba2-3eaf5ee57a5e",
  },
  {
    kind: "certificate",
    institution: "Alura",
    monogram: "A",
    title: {
      en: "JavaScript: manipulating DOM elements",
      pt: "JavaScript: manipulando elementos no DOM",
    },
    period: "01.2025",
    url: "https://cursos.alura.com.br/certificate/c10c0343-f44b-4a79-a0a1-ad82303e6b3f",
  },
  {
    kind: "certificate",
    institution: "Alura",
    monogram: "A",
    title: {
      en: "Habits: from productivity to personal goals",
      pt: "Hábitos: da produtividade às metas pessoais",
    },
    period: "12.2024",
    url: "https://cursos.alura.com.br/certificate/0c9b4213-f3f9-4da6-ac84-e6c74ff7f259",
  },
  {
    kind: "certificate",
    institution: "FIAP",
    monogram: "F",
    title: {
      en: "Professional Qualification: Tech Strategy & Innovation with AI and IoT",
      pt: "Qualificação Profissional: Estratégia e Inovação Tecnológica com IA e IoT",
    },
    period: "12.2022",
  },
  {
    kind: "certificate",
    institution: "FIAP",
    monogram: "F",
    title: {
      en: "Professional Qualification: Mobile Application Development",
      pt: "Qualificação Profissional: Desenvolvimento de Aplicações Móveis",
    },
    period: "12.2022",
    url: "https://www2.fiap.com.br/updown/DocumentosAssinados/c5d328fd-01d9-4b90-81d3-1ce5500fe277.pdf",
  },
  {
    kind: "certificate",
    institution: "FIAP",
    monogram: "F",
    title: {
      en: "Multimedia and Creativity",
      pt: "Multimídia e Criatividade",
    },
    period: "10.2022",
    url: "https://on.fiap.com.br/pluginfile.php/1/local_nanocourses/certificado_nanocourse/68340/6fd61cdc37fcf84a25dfb374dc33a58a/certificado.png",
  },
  {
    kind: "certificate",
    institution: "FIAP",
    monogram: "F",
    title: {
      en: "User Experience",
      pt: "User Experience",
    },
    period: "09.2022",
    url: "https://on.fiap.com.br/pluginfile.php/1/local_nanocourses/certificado_nanocourse/65795/1650cfc02b0a740cded6a105bdf9e424/certificado.png",
  },
  {
    kind: "certificate",
    institution: "Rocketseat",
    monogram: "R",
    title: {
      en: "Discover's Path: Conectar",
      pt: "Discover's path Conectar",
    },
    period: "08.2022",
  },
  {
    kind: "certificate",
    institution: "FIA Business School",
    monogram: "F",
    title: {
      en: "Entrepreneurship and Leadership",
      pt: "Empreender e Liderar",
    },
    period: "08.2022",
    url: "https://www.credential.net/ab0f91aa-5b4f-41e7-beac-c4b2c9387fa7",
  },
  {
    kind: "certificate",
    institution: "Udemy",
    monogram: "U",
    title: {
      en: "SQL Databases from zero to advanced",
      pt: "Banco de Dados SQL do ZERO ao Avançado",
    },
    period: "01.2022",
    url: "https://www.udemy.com/certificate/UC-046e86fe-6a66-4579-be45-cb4a75e744c5/",
  },
  {
    kind: "certificate",
    institution: "FIAP",
    monogram: "F",
    title: {
      en: "Professional Qualification: Web Development and Design 2.0",
      pt: "Qualificação Profissional: Desenvolvimento e Designer Web 2.0",
    },
    period: "12.2021",
    url: "https://www2.fiap.com.br/updown/DocumentosAssinados/d35df461-2885-415a-958e-b10078dd4af3.pdf",
  },
  {
    kind: "certificate",
    institution: "FIAP",
    monogram: "F",
    title: {
      en: "Professional Qualification: Systems Analysis and Web Prototyping",
      pt: "Qualificação Profissional: Análise de Sistemas e Prototipação Web",
    },
    period: "12.2021",
    url: "https://www2.fiap.com.br/updown/DocumentosAssinados/e541b2c9-6b28-4f63-9131-3a3d43c5069c.pdf",
  },
  {
    kind: "certificate",
    institution: "Curso em Vídeo",
    monogram: "C",
    title: {
      en: "Python 3 - World 1",
      pt: "Python 3 - Mundo 1",
    },
    period: "09.2021",
  },
  {
    kind: "certificate",
    institution: "Udemy",
    monogram: "U",
    title: {
      en: "Zabbix: building a monitoring environment",
      pt: "Zabbix: construindo um ambiente de monitoramento",
    },
    period: "09.2020",
    url: "https://www.udemy.com/certificate/UC-dcdb1171-9acc-4c52-a32c-d88b97e864e5/",
  },
  {
    kind: "certificate",
    institution: "Udemy",
    monogram: "U",
    title: {
      en: "Cloud Computing: AWS, Google Cloud and Azure",
      pt: "Cloud Computing: AWS, Google Cloud e Azure",
    },
    period: "08.2020",
    url: "https://www.udemy.com/certificate/UC-02427716-217f-42e8-b090-629304c1016a/",
  },
];

export interface Language {
  /** circular flag file in public/flags (without extension) */
  flag: string;
  name: Bilingual;
  level: Bilingual;
  /** CEFR band, when it applies */
  cefr?: string;
  note: Bilingual;
  /** 1–5, drives the proficiency meter */
  proficiency: number;
  /** highlight — English leads, since the goal is international work */
  accent?: boolean;
}

export const languages: Language[] = [
  {
    flag: "gb",
    name: { en: "English", pt: "Inglês" },
    level: { en: "Advanced", pt: "Avançado" },
    cefr: "C1",
    note: { en: "Professional working proficiency", pt: "Proficiência profissional" },
    proficiency: 4,
    accent: true,
  },
  {
    flag: "br",
    name: { en: "Portuguese", pt: "Português" },
    level: { en: "Native", pt: "Nativo" },
    note: { en: "Mother tongue", pt: "Língua materna" },
    proficiency: 5,
  },
];
