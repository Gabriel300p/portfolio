---
date: 2026-07-02
created: 2026-07-01
updated: 2026-07-02
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

## 2026-07-02 — Gate amarelo resolvido: redesign do layout-mestre autorizado (F11)

- **Contexto:** Gabriel avaliou a entrega das F1-F10 como "mudanças mínimas" — esperava
  redesign completo. A tensão spec ("not re-theme") vs missão ("candidato a SOTD") tinha
  sido resolvida pro lado conservador; o dono do gate escolheu o outro lado.
- **Decisão:** redesign do LAYOUT-MESTRE mantendo identidade (warm paper, Playfair+Geist,
  esmeralda única) + hero repensado do zero. Re-theme total foi oferecido e rejeitado.
- **Motivo:** a dimensão mais fraca da régua Awwwards é Creativity — composição, não
  craft. O craft (motion/perf/a11y) aprovado nas F1-F10 é fundação, não concorrente.

## 2026-07-02 — F11 interrompida por limite de sessão; mandato ampliado (F12 substitui F11)

- **Contexto:** a sessão bateu limite de tempo/contexto (~3:20am) no meio da geração de
  F11 — deltas em Hero/Stack/Experience/Education/TechStrip/Testimonials/Work +
  global.css ficaram não-commitados e não-avaliados. Commitados como checkpoint WIP
  (`935cfe8`) numa sessão vault de arrumação de documentação, sem claim de conclusão.
  Gabriel revisou o resultado geral (F1-F10 + o pedaço de F11) na manhã seguinte e achou
  que ainda "quase nada mudou" — o veredito repetiu o mesmo padrão que motivou o gate de
  F11 no dia anterior.
- **Causa raiz identificada:** o `contract.md` original fixava
  "Precedência de fontes: spec do repo > prompt da missão > DESIGN.md" — e a spec do
  repo (`docs/superpowers/specs/2026-07-01-portfolio-showcases-redesign-design.md`)
  trazia "re-theme (paleta, tipografia, layout-mestre são fixos)" como fora de escopo.
  Essa regra de precedência fez o Generator resolver a tensão
  "ambição Awwwards vs. conservadorismo da spec" **sempre a favor do lado seguro**,
  silenciosamente, feature após feature — só surgiu como gate visível no fim (F11), e
  mesmo aí só parcialmente (paleta/tipografia continuaram travadas).
- **Decisão:** revogar "paleta, tipografia, layout-mestre são fixos" — Gabriel autoriza
  evoluir **design (incl. paleta/tipografia/layout-mestre), textos/copy e assets**, não
  só composição. F11 marcada `blocked` (superseded); **F12** a abre com escopo amplo.
  Novo prompt autônomo gerado (vault, `resources/portfolio/`) supersede o anterior
  (`prompt-loop-awwwards-uplift.md`) especificamente nessa restrição.
- **O que NÃO muda:** F1-F10 continuam aprovadas e não devem regredir (motion
  scroll-linked, cursor, view transitions, showcases reais, case study, hero sem
  stat-card, educação padronizada, DESIGN.md, Lighthouse ≥90/95/95, sweep
  responsivo/a11y) — é fundação técnica, não a parte que faltou.
- **Lição pra próxima vez (registrada também em [[Gotchas]] do vault):** quando um doc
  do próprio repo (spec) e a missão de uma sessão autônoma entram em tensão real, a
  sessão deve **surfacear isso como gate 🟡 logo na Onda/feature onde a tensão aparece
  pela primeira vez** — não resolver silenciosamente pro lado conservador e deixar o
  humano descobrir só ao revisar o resultado final.

## 2026-07-02 — F11: intenções da recomposição (layout-mestre)

- **Hero masthead:** metadata mono em régua no topo (registro editorial), display serif
  gigante assimétrico à esquerda (clamp 3.1→9.4rem, leading 0.98) — o nome do ofício em
  escala de manchete; prosa de prova em base de 2 colunas offset; chuva binária mantida
  como assinatura interativa atrás dos glifos. Copy 100% verbatim (gate F6 intacto).
- **Folio numerais (01–05):** numeral serifado outlined por seção — marca de fólio de
  revista; dá índice visual e quebra o "head centrado" genérico.
- **Rails sticky (Stack/Experience/Education/Words):** cabeçalho gruda na coluna esquerda
  enquanto o conteúdo rola — assimetria persistente + orientação constante, zero JS.
- **Work zig-zag:** linhas pares espelham (mídia lidera) — ritmo de leitura alternado.
- **Ticker full-bleed:** stack como marquee lento hairline-bound (constante, pausa em
  hover, estático em PRM) no lugar da linha estática centrada.
- **Contact gigante:** fechamento em escala de manchete (clamp até 7rem) alinhado à
  esquerda — a última impressão tem o mesmo peso da primeira.

---

## Sessão 3 (2026-07-02, tarde) — direção "Second Voice" travada

### D-2026-07-02-SV1 — Conceito Second Voice (Claude Design) vira a linguagem-alvo, enxertado na base da main
Gabriel avaliou 3 fontes: main (gosta do Stack), branch `portfolio/fable-polish-loop` (rejeitou TODO o visual F11), e o conceito "Second Voice" gerado pelo Claude Design a partir do brief do vault (gostou do hero, do work e de experience+education). Decisão dele (AskUserQuestion): **base = tokens da main + enxertos SV adaptados**. Análise técnica confirmou atrito baixo: o SV usa literalmente os tokens dark da main (`#16150F`, texto cream, esmeralda `#3DDC84`, Geist body, Geist Mono labels). Referência arquivada em `docs/design/second-voice.html` (auto-contido, com copy EN+PT embutida).

### D-2026-07-02-SV2 — 🟡 anunciado: display serif Playfair → Newsreader
A voz tipográfica do hero que o Gabriel aprovou É o Newsreader 400 com tracking apertado (clamp 56→104px, lh 1.02) — mais leve e editorial que o Playfair. Trocar a display é mudança de temperatura de marca (gate 🟡 do v2): decidido ADOTAR Newsreader site-wide, mantendo a assinatura do itálico de ênfase (agora em esmeralda no h1). Playfair sai; Geist/Geist Mono ficam. Self-host via woff2 (Google Fonts, licença OFL). Anunciado na conversa, não bloqueante — Gabriel pode vetar no checkpoint da F13.

### D-2026-07-02-SV3 — 🟡 anunciado: SV é dark-only; mantemos dual-theme
O SV foi desenhado só no dark. Mantemos o sistema de temas da main: dark adota o SV verbatim (mesmos tokens), light é DERIVADO na F20 seguindo a media-bright rule do DESIGN.md (papel quente `#f5f4ef`, esmeralda `#0b7d45`). Toggle, persistência e anti-flash preservados.

### D-2026-07-02-SV4 — Estratégia de branch: `portfolio/second-voice` a partir da main
Em vez de reverter F11 na branch antiga: branch nova da main + cherry-pick do range contíguo `436a28b^..aa79c66` (todo o salvage F1-F10: reveal system+failsafe, cursor, VT, mp4+poster, case study F5, a11y/SEO F9-F10, capturas hi-res, cross-page nav). Replay limpo, build verde. F11 (masthead/rails/folios/zig-zag) fica para trás por construção. Estado `.agent-loop` trazido do tip da branch antiga. `portfolio/fable-polish-loop` preservada como histórico.

### D-2026-07-02-SV5 — Assets de projeto nascem do zero (pipeline híbrido)
Os painéis de mídia do SV são placeholders explícitos ("DROP REAL SCREENSHOT"). Pipeline: capturas reais re-staged do monorepo B-Boss (seed curado via Docker + Playwright, DPR≥2 — processo já documentado na F4) + composições premium com IA quando agregar acabamento (upscale/limpeza; nunca inventar UI que não existe). Formato final webp + fallbacks.

### D-2026-07-02-SV6 — Checkpoints por seção, assíncronos
Gabriel: "Não precisa pausar a sessão... O loop é exatamente para trabalhar sozinho." Cada feature F13+ posta screenshots (desktop+mobile, temas) na conversa como checkpoint e o loop SEGUE; veto dele reabre a feature como repair. Isso substitui o gate bloqueante, mantendo a lição do v1 (tensão anunciada cedo, nunca silêncio).

### D-2026-07-02-SV7 — Testimonials do SV são drafts; usar as citações reais
O SV traz quotes marcadas "draft quotes — replace with each author's real words". As citações reais (Alexandre Dutra, Matheus Moraes — LinkedIn) já existem na main e são as únicas permitidas. Copy do SV para hero/contact é aproveitável (foi escrita sobre fatos reais do brief); qualquer copy nova segue a voz do DESIGN.md.

### D-2026-07-02-SV8 — Pipeline de capturas F14: stack local isolada + staging SQL próprio
Reproduzido e endurecido o padrão F4: Postgres descartável `bboss-sv-pg` em `127.0.0.1:5433`, TODAS as invocações com `DATABASE_URL`/`DIRECT_URL` inline (o `.env` da API aponta para Neon de PRODUÇÃO — nunca tocado; env inline vence dotenv). Seeds SQL legados estão dritados do schema (colunas renomeadas, IDs hardcoded de um run antigo, `10-rollback.sql` que entra no glob) — em vez de remendá-los, um staging próprio schema-atual e 100% dinâmico: `output/portfolio-screens/sv-staging.sql` (no scratchpad da sessão; conteúdo descrito aqui) criou 76 barbeiros (2/unidade, nomes reais), 5 categorias + 9 serviços por barbearia mapeados a todas as 38 unidades, 20 clientes com endereço SP, 420 appointments com snapshot financeiro (pesados nos últimos 30 dias), 194 reviews, 912 passes (70% validados, horários de pico 17-20h, pesados nos últimos 7 dias — as MÉTRICAS do dashboard são movidas por PASSES, não appointments), schedules default por barbearia + 456 staff-schedules (a pill "Horário não disponível" vem de `barbershop_staff_schedules` vazio). Auth sem hack de app: hash bcrypt regenerado com o bcrypt do repo (o hash do seed TS não confere com "senha123" — bug conhecido do F4) + `mfa_last_verified=NOW()` + assinatura UNLIMITED pro cliente de captura. CORS/origem: dashboard servido em :3006 (3000 ocupada por outro projeto) exigiu `FRONTEND_URLS` + `AUTH_BARBERSHOP_ORIGINS` na API. Captura: `~/projetos/bboss-monorepo/output/portfolio-screens/capture-sv.mjs` (playwright headless, DPR 2 desktop / DPR 3 mobile 390×844, locale pt-BR, devtools TanStack escondidos via CSS) — 13 telas em 3 apps, money shots: dashboard executivo (313 passes validados +165,3%, gráficos vivos), admin "Operação da plataforma", client home (banner de passe 3D) e detail (★4.9, 14 avaliações, Aberto). Assets escolhidos copiados para `src/assets/img/projects/sv/`.

### D-2026-07-02-SV9 — F20 sweep: tema claro deriva por tokens; qualidade não regride
Tema claro não precisou de trabalho dedicado: todas as seções SV (hero band, showcase rail, bg-cols, contact, footer) usam tokens semânticos (`--bg`/`--text`/`--accent`/`--line`/`--bg-elevated`) que a main já define para os dois temas — o claro deriva sozinho (papel quente, tinta escura, esmeralda `#0b7d45`, produto dark "no palco" contra painel claro = media-bright rule). Evidência real (evidence/14.json): Lighthouse mobile home 94/100/100/100, case study 98/100/100/100 (todos ≥ gate 90/95/95); `transition: all` = 0; i18n balanceado 108 data-en / 108 data-pt; reduced-motion deixa 0 de 39 elementos de reveal escondidos; sem overflow horizontal a 375px; zero "remote"/"founder" na copy. OG image regenerada do hero SV (1200×630, 35k). mp4 do dashboard removido (webm-only + poster); vídeo re-gravado limpo. Todas F12–F20 aprovadas com verificação (change-verifier adversarial nas de maior risco: F12/F13/F15/F17/F18; visual+grep+lighthouse nas de asset/qualidade: F14/F16/F19/F20). Loop em GATE_MERGE 🟡 — aguarda decisão do Gabriel para PR (🔴 push/merge em main nunca automático).
