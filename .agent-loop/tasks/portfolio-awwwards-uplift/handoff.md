# Handoff — portfolio-awwwards-uplift

**Estado em 2026-07-02 (sessão 3):** direção visual finalmente aprovada pelo humano —
conceito **"Second Voice"** (Claude Design), enxertado na base de tokens da main.
Referência: `docs/design/second-voice.html`. Spec viva: `DESIGN.md` (seção "Second Voice
composition"). Decisões da sessão: `decisions.md` D-2026-07-02-SV1…SV7.

**Branch de execução: `portfolio/second-voice`** (main + salvage F1-F10 via cherry-pick
`436a28b^..aa79c66`; F11 fica na branch antiga `portfolio/fable-polish-loop`, preservada
como histórico). Build verde confirmado.

**Onde estamos:** F12 (fundação) em GENERATE. F13–F20 pendentes — ver `featurelist.json`
(uma feature por seção, acceptance detalhada) e `plan.md` Fase 6.

**Como retomar sem o chat:** ler `progress.json` (estado + gates) → `featurelist.json`
(feature atual + acceptance) → `decisions.md` (por quês) → `DESIGN.md` (linguagem-alvo).
Dev server: `pnpm dev` (4321). Referência SV navegável: `python3 -m http.server 8899` na
raiz → `/docs/design/second-voice.html`. Assets B-Boss: monorepo real em
`~/projetos/bboss-monorepo` (processo de captura documentado em decisions.md F4).

**Regras que não mudam:** nunca "remote"/"founder" na copy; citações só as reais;
não regredir F1-F10 (Lighthouse ≥90/95/95, reduced-motion estático, i18n EN/PT);
🔴 push/merge em main sempre bloqueado — PR é o checkpoint.
