# Portfolio redesign — "Second Voice" (F12–F20)

Full visual redesign adopting the **Second Voice** direction (from Claude Design),
grafted onto main's token system. Branched from `main` + cherry-picked the F1–F10
technical foundation (motion, a11y, SEO, real captures); the disliked F11 editorial
direction was left behind by construction.

## What changed, by section
- **Nav** — serif logotype, mono lowercase links, EN/PT segmented pill
- **Hero** — "Designed and built, *end to end.*" in Newsreader 104px, emerald italic
  accent, bilingual eyebrow, employer-anchored metrics band (no stat-card)
- **Work** — B-Boss flagship showcase (sticky rail + 4 panels of **real product
  captures**) + Movie Match / Pandora index + accordion, all numbered; "Open live
  demo ↗" → stage app
- **Experience + Education** — one two-column CV band (education rail with the FIAP
  pós highlighted by an accent border); keeps main's logos, 17-cert accordion, languages
- **Stack** — main's content (kept per preference) re-dressed in the SV language
- **Testimonials** — real LinkedIn quotes (Alexandre Dutra, Matheus Moraes)
- **Contact** — "Let's talk." with an emerald period + mono links
- **Case study** — re-skinned, hi-res captures, dashboard video re-recorded clean

## Typography
Display **Playfair → Newsreader** (self-hosted, 4 weights) — the hero voice.
Geist / Geist Mono kept. Warm-paper light theme derives from semantic tokens.

## Assets (from scratch)
Real B-Boss product screens captured from the running stack (isolated Postgres,
never production), schema-current staging seed, 13 hi-DPR captures + a clean
re-recorded dashboard video. Reproducible pipeline in the B-Boss monorepo.

## Quality (real evidence)
- Lighthouse mobile — home **94 / 100 / 100 / 100**, case study **98 / 100 / 100 / 100**
- `transition: all` = 0 · i18n balanced (119/119 home, 54/54 case)
- reduced-motion static (0/39 reveal elements hidden) · no 375px overflow
- zero "remote"/"founder" in copy · one view-transition morph per page
- Verified per-feature (adversarial change-verifier) + a final 9-check holistic sweep

🤖 Generated with [Claude Code](https://claude.com/claude-code)
