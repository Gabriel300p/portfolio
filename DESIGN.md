# DESIGN.md — Gabriel Andrade portfolio

> Design language SSOT, co-versioned with the code (vault ADR-0001). The vault card
> `projects/portfolio.md` points here. Declare identity from this file — do not re-roll
> palette/type/voice per screen ("AI face").

## Intent

An editorial, warm-paper developer/designer portfolio. It must read as *crafted by a person
with taste*, and — above all — **let the real work be the loudest thing on the page**.
Primary audience: hiring teams evaluating design + frontend depth. Do not use the words
"remote" or "founder" anywhere on the site (user decision).

## Voice

Plain, specific, confident. Sentence case. No AI clichés ("elevate", "seamless", "unleash").
No exclamation marks in UI copy. Bilingual EN-first with a PT-BR toggle (`data-en`/`data-pt`).

## Type

- **Display / serif:** Playfair (`--serif`) — headlines, project names, big statements. Italic
  emphasis word is the signature (`<em>` inside h1/h2).
- **Body / sans:** Geist (`--sans`) — 17px base, line-height ~1.62, tracking −0.006em.
- **Metadata / mono:** Geist Mono (`--mono`) — labels, tags, stats, timestamps. `tabular-nums`
  for any numbers. Uppercase + wide tracking only for small kicker labels.

## Color

Warm-paper light (default) and warm editorial dark — never cold tech dark, never `#000`.
One accent only: emerald. Semantic tokens in `src/styles/global.css` (`:root` /
`[data-theme="dark"]`); themes swap values, not rules.

- Light: bg `#f5f4ef`, text `#1c1a17`, accent `#0b7d45`.
- Dark: bg `#16150f`, text `#f0ece1`, accent `#3ddc84`.
- **Rule:** project media must stay bright and legible in BOTH themes. In light mode, media
  surfaces belong to the paper family (tinted), not a hard `#101010` slab (that reads as a
  copy-paste accident). The screenshot is the hero; frame/light effects are subordinate.

## Layout

Max-width 1160px, fluid pad `clamp(20px,5vw,56px)`. Editorial asymmetry: narrow text column /
large media. Fill the fold; avoid oceans of empty vertical space — vertical rhythm should feel
intentional, not padded-out. Register-mark crosshairs are a quiet editorial motif.

## Motion (all gated on `prefers-reduced-motion`)

Lenis smooth scroll; staggered `data-reveal` entrances (GPU transform+opacity); title wipe
reveal; magnetic buttons; cursor-revealed green binary rain in the hero; project carousels.
**Progressive enhancement is mandatory:** the page must be fully readable with JS disabled —
reveal starts visible and is only armed once `html.js` is set.

## Proof

Surface real numbers as first-class UI, not buried in an accordion: 5 years · 1,000+ screens ·
200+ flows · design system from scratch (Acesso Energia). Every featured project carries one
concrete metric line (mono, tabular-nums). Testimonials come from real LinkedIn recommendations
with named people and roles.

## References

eftakher.me (Work media panel + editorial base), saddine.com (project accordion + experience),
pixels.studio (cursor-reactive hero), colibrivision.it (motion).
