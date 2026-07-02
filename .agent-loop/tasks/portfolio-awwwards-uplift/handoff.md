---
date: 2026-07-02
created: 2026-07-02
updated: 2026-07-02
task: portfolio-awwwards-uplift
status: active
description: "Portfolio Awwwards uplift — handoff (checkpoint da sessão de 2026-07-02)"
tags:
  - agent-loop
  - handoff
---

# Handoff — Portfolio Awwwards/Pafolios uplift

> Checkpoint de comunicação (PR aberto), não parada. Outro agente/humano consegue
> continuar daqui sem ler o chat.

> **Atualizado 2026-07-02 (documentação arrumada):** este handoff descreve o checkpoint de
> PR de F1-F10 (10/10 aprovadas — segue válido). Depois dele, a sessão entrou em F11
> (redesign do layout-mestre) e bateu limite de sessão/contexto no meio, deixando deltas
> não-commitados — commitados à parte como WIP (`935cfe8`), não avaliados. Gabriel reviu o
> conjunto e considerou o resultado ainda conservador; o mandato foi ampliado (design,
> copy e assets agora abertos — ver `decisions.md` e `contract.md`, ambos atualizados
> 2026-07-02) e F11 foi substituída por **F12** num prompt novo em
> `resources/portfolio/` (vault). `progress.json` está `state: BLOCKED`,
> `pendingGate: direction` — a retomada é o novo prompt, não a continuação direta deste.

## Resumo

**10 de 10 features aprovadas por Evaluator adversarial** (subagente read-only julgando
sobre evidência real — Playwright, Lighthouse, grep, build). 8 commits na branch `portfolio/fable-polish-loop`. Cor: 🟡.

| F | Estado | Nota |
|---|--------|------|
| F1 motion scroll-linked | ✅ approved (iter 2) | view() timelines, staggers, wipe; needs_repair na iter 1 corrigiu 2 buracos reais de robustez |
| F2 cursor spring | ✅ approved | dot+ring lerp ~117ms, estados, PRM/touch nativos |
| F3 view transitions | ✅ approved | cross-document MPA + morph bboss-stage (sem ClientRouter) |
| F4 showcases | ✅ approved | capturas REAIS do app (boot local + Docker PG); aspecto verificado |
| F5 case study | ✅ approved (iter 2) | h1, i18n 37 nós, ordem Pafolios, vídeo real, métrica/bloco |
| F6 hero | ✅ approved | copy byte-idêntica ao main — gate amarelo nunca acionado |
| F7 educação | ✅ approved | logos, dims, links verificados (curl) |
| F8 referências | ✅ approved | 4 sites extraídos com timings reais → DESIGN.md |
| F9 perf/SEO | ✅ approved | Lighthouse 94/100/100/100 e 98/100/100/100 (prod, mobile) |
| F10 responsivo/a11y | ✅ approved | skip link, inert, AA, menu mobile, nav cross-page |

## Por que parou

- Não parou — checkpoint de PR (gate 🟡 de comunicação). Loop continua com o veredito
  do F4 e os pendentes abaixo.

## Estado da evidência

- `evidence/1..6.json` + `evaluation.md` por iteração. Lighthouse rodado em produção
  (`astro preview`) com Chromium do Playwright. Todos os gates obrigatórios verdes.

## Diff / arquivos tocados

- `src/styles/global.css` (motion system, cursor, VT, menu mobile, tokens AA, skip/sr-only)
- `src/scripts/ui.ts` (stagger indexing, cursor, menu, inert, aria, anchor hash/focus, __uiReady)
- `src/layouts/Base.astro` (SEO head completo, JSON-LD, failsafe reveal, skip link)
- `src/pages/work/bboss.astro` (reescrito: h1, i18n, ordem, vídeo, métricas)
- `src/components/*` (Nav menu mobile, staggers, alts, dead link removido)
- `src/assets/img/projects/bboss-mobile-*.jpg` (capturas reais 780×1688)
- `public/og.png`, `public/apple-touch-icon.png`, `public/media/*.webp` (gerados)
- `DESIGN.md` (padrões das 4 referências + recipe de motion)

## Decisão necessária (Gabriel)

1. **Revisar e mergear o PR** (nunca mergeado pelo agente — 🔴).
2. Opcional: recapturar as telas mobile em horário comercial (badges "Aberto" verdes em
   vez de "Fechado"); container `bboss-capture-pg` ficou parado mas com dados —
   `docker start bboss-capture-pg` e o RUNBOOK do pipeline está em decisions.md.
3. Bug real pra corrigir no bboss-monorepo: sufixo "unit" duplicado na busca
   ("Unidade Centro unit") e seeds SQL desatualizados vs schema.

## Como retomar

- Ler `progress.json` (state=EVALUATE, F4) + este arquivo. Veredito F4 chega do
  Evaluator `a544432e1e3f6523b`. Depois: pendentes abaixo.

## Riscos / pendentes (fora do aprovado)

- **Sem menu para no-JS <720px** (gap conhecido não-bloqueante; não é regressão).
- **i18n para crawlers**: PT existe só em runtime (data-pt); rotas /pt/ + hreflang é
  decisão de arquitetura (🟡 se quiser SEO bilíngue de verdade).
- **Página 404** custom não existe (deixada de fora por risco de scope; trivial de adicionar).
- **PRM dinâmico**: toggle do OS no meio da sessão não desarma rAFs JS (minor documentado).
- Firefox: scroll-driven animations atrás de flag → fallback IO cobre; verificar visual lá.
