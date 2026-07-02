---
created: 2026-07-01
updated: 2026-07-01
task: portfolio-awwwards-uplift
status: active
description: "Portfolio Awwwards uplift — decomposição em fases (agent-loop)"
tags:
  - agent-loop
  - plan
---

# Plan — Portfolio Awwwards/Pafolios uplift

> Decomposição em fases. Papéis Planner → Generator → Evaluator via subagentes
> (Workflow/Task), Evaluator sempre read-only sobre evidência real.

## Estado herdado (sessões anteriores, já em `main`)

- Hero+About fundidos, prova em prosa (commit `ac8fe07`) — sem faixa stat-card.
- Showcases com device frames codados, vídeo B-Boss real (WebM+MP4+poster em
  `public/media/`), terminal Pandora WAAPI, walkthrough Movie Match (commits
  `973420b`…`436a28b`).
- Education com logos reais + accordion de certificados; Testimonials reais.
- Branch de trabalho atual: `portfolio/fable-polish-loop` (main + 1 commit).

## Fases

### Fase 0 — Bootstrap (esta) ✅
Contract, plan, featurelist, progress, decisions seed. Estado no formato oficial.

### Fase 1 — Grounding paralelo
- F8: workflow de pesquisa (Firecrawl) nos 4 sites de referência → padrões concretos
  (timings/easing/mecânica) escritos no DESIGN.md.
- Auditoria interna paralela: mapear cada reveal/transição existente em
  `src/` contra os critérios F1 (o que é fade-in puro, onde há `transition: all`,
  o que falta de intenção documentada).

### Fase 2 — Motion core (F1 → F2 → F3)
Ordem: F1 primeiro (fundação: tokens de easing, scroll-driven, choreografia), depois
F2 (cursor, consome os mesmos tokens), depois F3 (View Transitions entre páginas).
Cada uma via /design-pipeline (classificar → skill de direção → build → loop
Playwright → polish), Evaluator subagente separado por iteração.

### Fase 3 — Conteúdo (F4 → F5 → F6 → F7)
Auditoria + polish dos showcases (F4), reestrutura scannable do case study (F5),
verificação do hero (F6 — copy nova é gate 🟡), padronização educação/stack (F7).

### Fase 4 — Qualidade transversal (F9 → F10)
Perf/SEO/semântica (F9), sweep responsivo+a11y (F10). Rodam por último porque
consomem o estado final das fases 2–3; regressões voltam como REPAIR na feature dona.

### Fase 5 — Fechamento
handoff.md, /ingest no vault, PR (checkpoint de comunicação — reportar a Gabriel),
gates 🟡 pendentes batched.

## Motor por feature

GENERATE (design-pipeline ou dev-pipeline) → EVIDENCE (build + Playwright real) →
EVALUATE (subagente read-only, veredito sobre EvidenceReport) → REPAIR (máx ~3
iterações) → próxima feature. Nunca autoavaliação como aprovado.
