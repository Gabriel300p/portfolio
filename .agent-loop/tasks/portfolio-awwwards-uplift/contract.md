---
date: 2026-07-02
created: 2026-07-01
updated: 2026-07-02
task: portfolio-awwwards-uplift
status: active
description: "Portfolio Awwwards/Pafolios uplift — contrato de execução (agent-loop)"
tags:
  - agent-loop
  - contract
---

> **Atualizado 2026-07-02 (F12):** a regra de precedência abaixo ("spec do repo > prompt
> da missão") e a exclusão de re-theme foram a causa raiz de F1-F10 saírem
> visualmente conservadoras — a spec do repo (mais antiga, mais cautelosa) sempre
> venceu silenciosamente contra a ambição da missão. **Revogado por Gabriel:** ver
> `## Escopo` e `## Fora de escopo` atualizados abaixo, e a entrada de 2026-07-02 em
> `decisions.md`. F1-F10 continuam válidas e não devem regredir.

# Contract — Portfolio Awwwards/Pafolios uplift

> Output do Planner. Insumo de tudo. Específico o bastante para evitar avaliação vaga.
> Ver [[long-running-agents]] e [[agent-harness-state-schemas]].

## Objetivo

Elevar o portfolio (`~/projetos/portfolio`, Astro 5 estático) de "site pessoal bem feito"
para candidato real a Site of the Day (awwwards.com) e curadoria (pafolios.com), auditado
contra as 6 dimensões do Awwwards Developer Award: Animations/Transitions, Accessibility,
Responsive, Performance/WPO, Semantics/SEO, Creativity técnica. A régua é concreta
(critérios testáveis por feature), não adjetivo.

Precedência de fontes (revisada 2026-07-02): **prompt da missão vigente > DESIGN.md
(SSOT vivo) > spec do repo**. A spec original
(`docs/superpowers/specs/2026-07-01-portfolio-showcases-redesign-design.md`) foi escrita
antes da régua Awwwards/Pafolios existir e é conservadora por padrão ("not re-theme") —
ela deixou de ter precedência sobre a missão porque essa precedência é o que causou F1-F10
saírem visualmente mínimas (ver `decisions.md`, 2026-07-02). Trate a spec como referência
histórica de intenção, não como teto de escopo.

## Escopo

- Homepage (`src/pages/index.astro` + componentes) e case study B-Boss
  (`src/pages/work/bboss.astro`).
- Sistema de motion site-wide: scroll-linked reveals, cursor custom, transições de página.
- Assets de projeto tratados como peça de design (nunca print cru).
- DESIGN.md como SSOT vivo: padrões extraídos das referências gravados nele.
- Evidência real via Playwright (2+ breakpoints × claro/escuro × reduced-motion) + build.

## Fora de escopo

- Página/seção nova não pedida (blog, newsletter) → `scope_creep`.
- Troca de framework/stack (Astro estático continua).
- `git push`/merge em `main`, deploy → 🔴 sempre bloqueado.
- Refatorar áreas fora da feature atual "só porque".
- ~~Re-theme (paleta, tipografia, layout-mestre são fixos)~~ — **revogado 2026-07-02.**
  Paleta, tipografia, layout-mestre, copy e assets estão todos abertos a evoluir na F12
  se servirem a régua Awwwards/Pafolios. O único invariante de marca é: ainda parece
  Gabriel (voz editorial, não vira SaaS genérico), nunca usa "remote"/"founder", nunca
  cai em clichê de AI-slop. Ver F12 em `featurelist.json` e o prompt em
  `resources/portfolio/` no vault.

## Features

- **F1 — Sistema de motion scroll-linked (anti-slop)**
  - Critérios de aceitação (testáveis):
    - Nenhum reveal é "fade-in ao entrar na viewport" puro: cada um combina clip-path,
      stagger, wipe ou scroll-progress (CSS scroll-driven animations `view()`/`scroll()`
      com fallback IO; sem GSAP — spec veta framework pesado neste escopo).
    - `grep -rn "transition: all" src/` retorna 0 ocorrências.
    - Toda animação de reveal tem intenção documentada (1 linha em `decisions.md`).
    - `prefers-reduced-motion: reduce` → tudo estático e legível (screenshot Playwright).
    - Página 100% legível com JS desligado (reveal só arma com `html.js`).
- **F2 — Cursor customizado com spring physics**
  - Critérios de aceitação:
    - Cursor com lerp/spring (trail ~100–150ms) ativo em pointer fino (desktop);
      nunca aparece em touch (`pointer: coarse` → desativado).
    - Estados: default, hover em link/botão (escala/rótulo), hover em mídia de projeto.
    - `prefers-reduced-motion` → cursor nativo do browser, sem trail.
    - Não quebra a11y: cursor nativo permanece visível junto (ou `cursor: none` só onde
      o custom está garantidamente renderizando), foco por teclado intacto.
- **F3 — Transições de página coreografadas**
  - Critérios de aceitação:
    - Navegar home ↔ case study B-Boss usa View Transitions (Astro ClientRouter) com
      coreografia própria (elemento compartilhado ou wipe editorial), não corte seco.
    - Fallback: browsers sem suporte navegam normal (sem erro no console).
    - `prefers-reduced-motion` → crossfade mínimo ou corte.
- **F4 — Showcases: auditoria + polish vs spec (B-Boss, Movie Match, Pandora)**
  - Critérios de aceitação (da spec, gate de saída):
    - B-Boss: vídeo real WebM+MP4 gated por IntersectionObserver (nunca eager), poster,
      pausado fora da viewport; phone sobreposto; glow dourado.
    - Movie Match: walkthrough iPhone com telas Figma reais deslizando como protótipo;
      glow vermelho-cinema; reduced-motion → tela final estática.
    - Pandora: terminal WAAPI char-a-char, cursor não-selecionável, 3 demos reais;
      reduced-motion → transcript final estático.
    - Zero layout shift (CLS ~0 na seção); legível em claro+escuro × desktop+mobile.
- **F5 — Case study B-Boss scannable (padrão Pafolios)**
  - Critérios de aceitação:
    - Estrutura problema → abordagem → solução em blocos claros; outcome antes do
      polish decorativo; escaneável em ~30s (headers + uma métrica concreta por bloco).
    - Assets do app real (vídeo/stills já capturados), nunca print cru de Figma.
    - Mesma régua de motion/tema/responsivo das outras features.
- **F6 — Hero: prova social sem stat-card (verificação + polish)**
  - Critérios de aceitação:
    - Nenhuma faixa de métricas tipo stat-card genérico na página (a atual foi removida
      no merge do Hero+About; verificar que não sobrou resíduo em outra seção).
    - Prova tecida em prosa (estado atual) mantém números reais (5 anos, 1.000+ telas,
      200+ fluxos, design system) legíveis em EN e PT.
    - Copy final do hero é gate 🟡: qualquer reescrita de posicionamento pausa e
      apresenta opções a Gabriel (verificação/polish visual não pausa).
- **F7 — Educação/certificados padronizados + stack em destaque**
  - Critérios de aceitação:
    - Badges/certificados visualmente padronizados, logos reais das instituições
      (Alura, Google, FIAP…), links de verificação funcionam.
    - Linguagens/stack com destaque visual claro (público: empresas internacionais).
    - Responsivo + ambos temas + reduced-motion, com screenshot de evidência.
- **F8 — Extração de padrões das referências → DESIGN.md**
  - Critérios de aceitação:
    - DESIGN.md ganha seção de padrões extraídos (timings, easing, mecânica exata)
      de eftakher.me, saddine.com, pixels.studio, colibrivision.it (mínimo) — via
      Firecrawl `rawHtml` + grep de `gsap|framer-motion|transition|cubic-bezier`.
    - Cada padrão anotado com onde se aplica (ou não) neste portfolio.
- **F9 — Performance/WPO + Semantics/SEO**
  - Critérios de aceitação:
    - `pnpm build` limpo; Lighthouse (ou equivalente) Performance ≥ 90 mobile,
      A11y ≥ 95, SEO ≥ 95 na home e no case study.
    - Fontes com `font-display` correto e preload; vídeo nunca no payload inicial;
      imagens via `astro:assets` com dimensões explícitas (sem CLS).
    - Semântica: landmarks corretos, heading order, meta/OG/twitter card, sitemap.
- **F10 — Sweep responsivo + acessibilidade**
  - Critérios de aceitação:
    - Playwright: 375px e 1440px (mínimo) × claro/escuro sem quebra visual em
      nenhuma seção (evidência: screenshots por seção).
    - Navegação por teclado completa (foco visível, ordem lógica, skip link).
    - Contraste AA nos dois temas (checagem automatizada + spot-check).

## Critérios de evidência

> Sem runner `agent-loop.config` — comandos equivalentes executados pelo harness interno.

- `build` — `pnpm build` — obrigatório (exit 0)
- `visual` — Playwright screenshots 375px+1440px × light/dark (+reduced-motion nas
  features de motion) — obrigatório para features visuais
- `grep-gates` — `grep -rn "transition: all" src/` vazio (F1) — obrigatório
- `perf` — Lighthouse home + case study (F9) — obrigatório para F9
- `test`/`lint` — não existem no repo (sem suíte); build + visual são o gate

## Restrições

- Performance: payload inicial lean; vídeo/imagens sempre gated/lazy; sem GSAP/GIF
  (spec); dependência nova só com justificativa em decisions.md.
- Segurança: nunca tocar o Neon DB compartilhado do bboss-monorepo; só
  `DATABASE_URL` local. Nenhum segredo em código/notas.
- Arquivos proibidos: nada fora do repo portfolio exceto leitura (vault, bboss-monorepo
  read-only + boot local).
- Progressive enhancement obrigatório (DESIGN.md): legível sem JS.
- Trabalho sempre em branch (`portfolio/fable-polish-loop` atual); PR = checkpoint de
  comunicação; merge/push em main jamais.

## Riscos / Decisões em aberto

- Cursor custom (F2) e View Transitions (F3) são elementos site-wide novos — dentro do
  mandato da missão (régua Awwwards explícita), mas execução deve respeitar DESIGN.md;
  qualquer conflito com direção fixada → gate 🟡.
- Billing nano-banana possivelmente bloqueado → tentar mesmo assim, registrar output real.
- Boot do bboss-monorepo frágil → fallback: stills existentes + living-screenshot (spec).
- 2 iterações sem progresso real (mesmo diff/mesmas falhas) → forçar handoff.

## Classificação

- **Cor:** 🟡
- **Risk:** Medium
- **Size:** Large
- **Needs human:** sim (gates 🟡 de copy/posicionamento e mudança de direção; PR como
  checkpoint de comunicação)
- **Justificativa:** trabalho grande multi-feature em site pessoal público; sem risco de
  produção (estático, sem deploy pelo agente), mas com decisões de marca/copy que são
  do Gabriel. Contrato semeado pelo prompt da missão dele em 2026-07-01 — o gate de
  contrato conta como resolvido por esse prompt; gates 🟡 remanescentes são pontuais.
