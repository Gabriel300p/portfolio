---
created: 2026-07-01
updated: 2026-07-01
task: portfolio-awwwards-uplift
status: active
description: "Portfolio Awwwards uplift — log de decisões (agent-loop, ADR-lite)"
tags:
  - agent-loop
  - decisions
---

# Decisions — Portfolio Awwwards/Pafolios uplift

> Log append-only (ADR-lite). Só o "por quê".

## 2026-07-01 — Contrato semeado pelo prompt da missão; gate de contrato resolvido

- **Contexto:** Gabriel abriu sessão autônoma de longa duração com escopo, régua de
  qualidade e gates explícitos no próprio prompt.
- **Decisão:** tratar o prompt como aprovação do contrato (GATE_CONTRACT → approve) e
  seguir direto para GENERATE; gates 🟡 pontuais (copy do hero, mudança de direção)
  continuam pausando.
- **Motivo:** pausar para aprovar um contrato que ele mesmo ditou seria checkpoint-asking
  — anti-padrão explícito no CLAUDE.md global.
- **Alternativas descartadas:** pausar em GATE_CONTRACT (burocracia sem informação nova).

## 2026-07-01 — Branch de trabalho: manter `portfolio/fable-polish-loop`

- **Contexto:** a missão cita `redesign/portfolio-uplift`, mas essa branch foi mergeada
  em `main` (até `b5bf4f5`) e não existe mais; a branch atual continua dela.
- **Decisão:** trabalhar em `portfolio/fable-polish-loop` (main + `436a28b`).
- **Motivo:** é a continuação natural do trabalho; criar outra branch duplicaria história.
- **Alternativas descartadas:** recriar `redesign/portfolio-uplift` (confusão com o
  histórico já mergeado).

## 2026-07-01 — Scroll-linked motion sem GSAP (CSS scroll-driven + WAAPI)

- **Contexto:** a régua da missão pede scroll-linked motion (Lenis + GSAP ScrollTrigger
  citados), mas a spec do repo — que tem precedência — veta framework pesado de animação
  neste escopo ("No GSAP"), e o DESIGN.md já fixa Lenis + IO reveals + WAAPI.
- **Decisão:** implementar scroll-linked com CSS scroll-driven animations
  (`animation-timeline: view()/scroll()`) com fallback IntersectionObserver, mantendo
  Lenis para smooth scroll e WAAPI para sequências. GSAP só se o nativo provar
  insuficiente (nova decisão registrada aqui se acontecer).
- **Motivo:** cumpre o critério funcional (progresso do scroll pilota a timeline) com
  0 KB de dependência nova, alinhado com spec + WPO (F9). O critério da régua é o
  efeito, não a lib.
- **Alternativas descartadas:** adicionar GSAP+ScrollTrigger (~60KB, contraria spec);
  ignorar scroll-linking (mantém o sinal nº1 de AI-slop).

## 2026-07-02 — F1: intenções de cada animação de reveal (critério do contrato)

- **Hero rise (load, staggered 80-340ms):** estabelece hierarquia de leitura top-down
  (monograma → título → prova → meta) no único viewport que todo visitante vê; blur(3px)
  clareando comunica "foco chegando", não decoração.
- **Title wipe (clip-path 0.9s):** o traço editorial da casa — títulos "impressos" na
  página como numa prensa; agora dispara também via ancestral `[data-reveal].in`
  (corrige blocker: 7 h2 invisíveis no case study).
- **Panel scrub (view() timeline, entry 5-70%):** o progresso do scroll pilota a chegada
  dos palcos de mídia — comunica que o trabalho "sobe ao palco" sob controle do leitor;
  com fallback IO (reveal do .proj pai) onde view() não existe.
- **Glow scrub (view(), entry 10% → cover 45%):** a luz de marca acende conforme o
  produto entra em cena — subordinada ao screenshot (regra do DESIGN.md).
- **Quote rule-draw (view(), scaleX left→right):** a linha tipográfica se desenha como
  sublinhado de citação — remete a marcar frases num texto impresso.
- **Stagger 60ms (stack-groups, quotes):** grupos chegam como cascata editorial, não
  como slab único (anti-slop); 60ms dentro da janela 30-80ms (Emil).
- **Accordion ::details-content glide (0.32s):** consistência de vocabulário com os
  painéis xp/edu que já deslizam; progressivo (interpolate-size).
- **Video gate threshold 0.5 + currentTime 1.5s:** padrão extraído do eftakher.me —
  o loop abre num frame significativo e só roda com metade visível.

## 2026-07-02 — Sessão bateu limite (reset 3:20am); grounding parcial

- **Contexto:** workflow de grounding perdeu 5/8 agentes por session limit
  (saddine/pixels/colibrivision + audit perf-seo + synthesize).
- **Decisão:** seguir solo com o material já obtido (eftakher + 2 audits internos
  completos, 21 findings) e re-rodar o resto do grounding quando a cota voltar.
- **Motivo:** os blockers acionáveis já estão identificados; esperar seria desperdiçar
  a janela de main-loop restante.

## 2026-07-02 — Clip-reveal em elemento observado: trap do IntersectionObserver

- **Contexto:** tentativa de variante `[data-reveal="clip"]` (bloco "imprime" top-down).
- **Decisão:** abandonada; wipes só em descendentes não-observados (padrão .head h2).
- **Motivo:** Chromium fatora o clip-path do próprio alvo no cálculo de interseção —
  elemento 100% clipado reporta ratio 0 para sempre e nunca revela (verificado ao vivo:
  elemento centrado na viewport, intersectionRatio 0). Chicken-and-egg estrutural.
- **Alternativas descartadas:** clipar um wrapper filho (complexidade de markup);
  threshold 0 (não dispara com área 0 de qualquer forma).

## 2026-07-02 — Gate de reveal separado do gate de JS (anti-blank-page)

- **Contexto:** Evaluator reprovou F1: html.js armava o hide no <head>, mas se o módulo
  ui.ts falhasse (rede/CSP/extensão), nada revelava — página em branco abaixo do hero.
- **Decisão:** hides keyed em `html.reveal`; head script arma `js + reveal` e agenda
  failsafe de 2.5s que remove `reveal` se `window.__uiReady` não foi setado pelo módulo.
- **Motivo:** conteúdo nunca pode depender de um módulo externo executar para existir.
