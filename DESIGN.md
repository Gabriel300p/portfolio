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

## Reference patterns (extracted 2026-07-02, Firecrawl rawHtml study)

### eftakher.me — Framer site, framer-motion springs, zero scroll-reveals
Confirmed stack: framer-motion runtime, no GSAP/Lenis, native scroll, **no entrance
animations at all** — the whole motion budget lives in hover. Fonts Inter/JetBrains Mono.

- **Work Card "dock-to-fill" hover (signature).** Project shot docked to the card's bottom
  edge (`bottom:-1px; width:85%`), mat of card color around it; on hover it grows to fill
  (`bottom:0; width:100%; height:100%`) while a layered shadow deepens (4 stacked shadows,
  strongest `0 20px 84px rgba(0,0,0,.14)`). Spring `stiffness:368 damping:35 mass:1.1`
  ≈ **550ms, cubic-bezier(0.3, 1.06, 0.35, 1)** approximation. A separate 1px hairline
  overlay (`z-index:1, pointer-events:none`) keeps the border crisp above the growing
  media. *Here:* GPU-safe variant for `.panel` media — `transform: scale(.85→1)` origin
  bottom-center instead of animating width/height. Hairline = `--line` overlay.
- **Editorial list rows.** 1080px measure, rows split info `flex:1` / media `flex:2`,
  separated only by `border-top: 1px rgba(0,9,50,.12)` — no hover backgrounds. Status
  label in the single accent color. *Here:* already matches `.work-list`; keep.
- **Video play-when-visible.** IO threshold **0.5** gates play/pause; `currentTime = 1.5`
  on loadedmetadata so the loop opens on a meaningful frame. *Here:* adopt both in
  `initVideoGate` (we use 0.2 today; bump and add startTime offset).
- **Mouse-tilt card.** `rotateX/Y = (offset/size) * -10` → max ±5°, spring
  `stiffness:300 damping:50` (overdamped ≈ rAF lerp factor 0.12–0.15). *Here:* matches
  our magnetic/tilt vocabulary; keep ±≤5°.
- **Pill morph hover.** `border-radius 230px → 56px` + wash bg + `backdrop-filter blur(4px)`,
  ~400ms spring bounce 0.2 ≈ `cubic-bezier(0.3, 1.15, 0.4, 1)`. *Here:* optional for
  `.btn` hover — shape morph instead of color-only.
- **Posture.** Static page + rich hover is inherently reduced-motion-friendly. *Here:* we
  keep scroll reveals (editorial identity) but they must stay cheap and interruptible.

*(saddine.com, pixels.studio, colibrivision.it — study pending, session-limit interrupted;
re-run the grounding workflow to fill these in.)*

## Motion recipe (house rules, F1)

- **House curve:** `--ease-expo: cubic-bezier(0.16, 1, 0.3, 1)` — the de-facto curve the
  site already used 10× hardcoded; now tokenized. `--ease-out` kept for tilt/settle.
  Never `ease-in`. Never `transition: all`.
- **Reveals:** base = opacity + translateY(22px) 0.7s `--ease-expo`, but **never alone**:
  section headings pair it with the clip-path title wipe; grouped children get stagger
  via `data-stagger` (60ms steps, set as `--i` by `initReveal`); media panels get
  scroll-scrubbed entrance via `animation-timeline: view()` where supported.
- **Scroll-linked:** CSS scroll-driven animations (`@supports (animation-timeline: view())`),
  progressive — IO reveal remains the fallback. Scrub ranges `entry 0% / entry 60%`.
- **Hover:** 200–450ms, `--ease-expo` or `ease`; tilt settle ≤ 450ms.
- **Reduced motion:** blanket kill (`* { animation/transition: none }`) + static final
  frames; JS inits early-return (`reduceMotion`).
