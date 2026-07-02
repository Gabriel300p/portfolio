---
created: 2026-07-01
updated: 2026-07-01
task: portfolio-awwwards-uplift
status: active
description: "Portfolio Awwwards uplift — avaliação adversarial por iteração (agent-loop)"
tags:
  - agent-loop
  - evaluation
---

# Evaluation — Portfolio Awwwards/Pafolios uplift

> Append por iteração. O Evaluator (subagente separado, read-only) julga **só** sobre a
> evidência coletada (build/Playwright/grep), nunca sobre o que o Generator alega.

<!-- iterações appendadas abaixo -->

## Iteração 1 — F1 (2026-07-02)

### Evidência

| Comando | Passou | Resumo |
| --- | --- | --- |
| build | ✅ | pnpm build 0 erros |
| grep transition:all | ✅ | 0 ocorrências |
| scroll-linked live | ✅ | view() scrubbing real (matrix mid-flight) |
| reduced-motion (JS on) | ✅ | 0 escondidos |
| módulo JS bloqueado | ❌ | não testado na iteração 1 — Evaluator achou o buraco |

### Veredito

- **F1:** needs_repair (Evaluator subagente a544432e1e3f6523b, adversarial)

### Justificativa

- Finding A: failsafe reduced-motion era código morto (especificidade html.js > net sem !important).
- Finding B: html.js armado no head + ui.ts nunca executando = página inteira invisível; [data-stagger] sem net nenhum.
- Finding C: ~10 blocos ainda eram fade+rise puro (critério 1 do contrato).

### Próximos passos (aplicados na iteração 2)

- Net com !important cobrindo data-stagger; gate html.reveal + failsafe __uiReady 2.5s; blocos convertidos para stagger.

## Iteração 2 — F1 (2026-07-02)

### Evidência

| Comando | Passou | Resumo |
| --- | --- | --- |
| build | ✅ | 0 erros |
| grep transition:all | ✅ | 0 |
| módulo bloqueado (route abort) | ✅ | reveal removido em 2.5s; 0 escondidos, 0 clipados |
| reduced-motion + módulo bloqueado | ✅ | 0/0 em 400ms (CSS puro) |
| sweep scroll contínuo home + case | ✅ | hidden=[] clipped=0 |

### Veredito

- **F1:** approved (Evaluator re-verificou os 3 findings no diff real; 5/5 critérios do contrato)

### Nota técnica

- Trap descoberto ao vivo: Chromium considera clip-path do próprio alvo no
  IntersectionObserver → variante [data-reveal="clip"] abandonada e documentada.

## Iteração 3 — F2 + F3 (2026-07-02)

### Evidência

| Comando | Passou | Resumo |
| --- | --- | --- |
| build | ✅ | 0 erros |
| cursor trail live | ✅ | dot (830,471) vs ring (699,409) mid-flight; RING_K 0.28 ≈ 117ms |
| estados link/media/press | ✅ | 20px accent / 56px / 16px |
| reduced-motion cursor | ✅ | 0 elementos, cursor nativo |
| VT wiring | ✅ | regra ativa; bboss-stage 1 elemento/página; navegação real ok |

### Veredito

- **F2:** approved — Evaluator conferiu guards duplos (matchMedia + pointerType), settle do rAF, ausência de leak de cursor:none, z-index.
- **F3:** approved — Evaluator conferiu o risco real (nome duplicado: #work .stage-gold vs .case-panel resolvem 1:1 por página), fallback puro-CSS, reduce completo.

## Iteração 4 — F5 (2026-07-02)

### Evidência

| Comando | Passou | Resumo |
| --- | --- | --- |
| build | ✅ | 0 erros |
| estrutura | ✅ | h1 único; problema→abordagem→decisões→solução→resultado→produto; 0 heading skips |
| i18n | ✅ | 37 nós; kickers PT; html.lang=pt-BR |
| vídeo real | ✅ | data-gate, preload=none, poster, webm+mp4, readyState 4 |
| métricas | ✅ | 1 linha mono por bloco, números reais (nada inventado — conferido pelo Evaluator) |

### Veredito

- **F5:** needs_repair@iter1 → **approved** após reparo único (nomes dos cards do
  ecosystem bilíngues, verificado ao vivo: "Gestão da Barbearia" etc.). Evaluator
  aprovou condicionado exatamente a este fix ("Fix the ecosystem card titles and F5
  is clean"); demais critérios todos verificados por ele no código.
- Bônus: link morto github.com/Gabriel300p/landing-pages (404 real) removido do
  accordion More projects.

## Iteração 5 — F6+F7+F9+F10 (2026-07-02)

### Evidência

| Comando | Passou | Resumo |
| --- | --- | --- |
| Lighthouse home (prod, mobile) | ✅ | Perf 94 · A11y 100 · BP 100 · SEO 100 · CLS 0 |
| Lighthouse case study | ✅ | Perf 98 · A11y 100 · BP 100 · SEO 100 |
| sub-audits a11y | ✅ | zero falhando após fix do lang button |
| teclado/skip/inert | ✅ | Playwright real |
| menu mobile 375px | ✅ | abre/fecha/navega, aria, stagger |
| contraste AA | ✅ | 4.53:1 / 4.98:1 (Evaluator recomputou independente) |

### Veredito

- **F6/F7/F9/F10: approved** (Evaluator verificou cada alavanca no código; hero
  byte-idêntico ao main — gate amarelo de copy nunca foi acionado).
- Gap conhecido não-bloqueante: sem JS em <720px não há menu (não é regressão;
  conteúdo alcançável por scroll).

## Iteração 6 — F4 (2026-07-02)

### Evidência

- Boot real do bboss-monorepo (Docker PG descartável) + 4 capturas retina do client
  PWA logado; assets 780×1688 substituem exports 204×769. evidence/6.json.

### Veredito

- **F4:** approved — aspecto 0.4621 vs frame 0.4600 (delta 0.45%, crop resolvido); sistemas de motion byte-idênticos ao estado aprovado
