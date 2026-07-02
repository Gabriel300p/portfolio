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

## 2026-07-02 — F3 via View Transitions cross-document (MPA), não ClientRouter

- **Contexto:** transições de página coreografadas; Astro oferece ClientRouter (SPA-like).
- **Decisão:** `@view-transition { navigation: auto }` (cross-document, CSS puro) +
  old lifts / new rises + morph do palco B-Boss (`view-transition-name: bboss-stage`,
  escopado para exatamente 1 elemento por página).
- **Motivo:** ClientRouter muda o ciclo de vida de todos os scripts (re-init manual em
  astro:page-load, tema/lang resetando no swap — minefield inteiro para um site MPA de
  2 páginas). Cross-document VT dá a mesma coreografia com zero mudança de lifecycle
  e fallback natural (browsers sem suporte navegam normal).
- **Alternativas descartadas:** ClientRouter (custo de integração desproporcional);
  cortar seco (critério da régua exige coreografia).

## 2026-07-02 — F2: intenção do cursor

- **Cursor dot+ring:** eco do motivo register-mark (crosshair editorial) — dot esmeralda
  rápido (~40ms) + anel que persegue (~110ms); anel aperta em interativos ("mirou"),
  abre em mídia de projeto ("olhe mais de perto"). Nativo escondido só depois de
  html.cursor-on provar que o custom renderiza; touch/reduced-motion ficam nativos.

## 2026-07-02 — F4: capturas reais do app B-Boss (mandato de assets cumprido)

- **Contexto:** os 4 mobile shots eram exports de 204×769 (aspecto errado, cortados ~40%
  pelo frame). Mandato: tentar gerar de verdade primeiro.
- **Tentativa real (funcionou):** Postgres 16 descartável em Docker (`bboss-capture-pg`,
  porta 5433) → prisma migrate deploy + seed TS (12 barbearias/26 unidades) →
  `DATABASE_URL`/`DIRECT_URL` locais exportados em todo comando (dotenv não sobrescreve
  env — Neon compartilhado intocado; `run-seeds.sh` NÃO usado pois carrega o .env) →
  API :3002 + client :3001 → Playwright mobile 390×844 DPR 3.
- **Fricções resolvidas no DB local:** hash do seed não batia com "senha123" (comentário
  mentiroso — hash novo gerado com bcrypt do próprio repo); MFA exigia
  `mfa_last_verified`; app exige endereço cadastrado (não geolocation) →
  `client_addresses` inserido; galeria da unidade reapontada (FKs órfãos,
  relationMode=prisma) e 2 fotos não-barbearia (banda!) trocadas.
- **Resultado:** 4 telas reais (home com banner do plano, busca com distâncias, detail
  com galeria/CTAs, perfil) em 780×1688 substituindo os exports antigos.
- **Limitações documentadas:** seeds SQL do repo estão desatualizados vs schema
  (services/appointments/reviews não populam) → telas de booking/histórico ficam para
  quando o seed for consertado; tudo mostra "Fechado" (captura fora do horário);
  sufixo "unit" duplicado na busca é bug real do app.
- **Alternativas descartadas:** nano-banana (desnecessário — app real disponível);
  placeholder (proibido quando a geração real é possível).

## 2026-07-02 — Contraste: token --text-faint escurecido para AA

- **Decisão:** #9a948a→#756f63 (4.53:1) light; #6f6a5e→#8b8577 (4.98:1) dark.
- **Motivo:** 2.7:1/3.4:1 falhavam AA em ~28 usos incluindo texto corrido (.hero-sub);
  ajuste de VALOR na mesma família de matiz, não mudança de paleta (regra DESIGN.md
  intacta: temas trocam valores, não regras).
