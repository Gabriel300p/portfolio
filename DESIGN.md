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

**Master composition (2026-07-02 redesign — F11):**
- **Hero = editorial masthead.** Hairline metadata row (role / edition / place+clock, mono
  uppercase), then oversized asymmetric Playfair display (`clamp(3.1rem, 10.5vw, 9.4rem)`,
  lh 0.98, max-width 13ch, left), then an offset two-column base (proof prose 1.15fr /
  context + cue 0.85fr, `align-items: end`). Fold-filling via flex + `margin-top: auto`.
- **Section heads are folios, never centered.** Full-width top rule + mono kicker +
  display-scale h2 left (`clamp(2.3rem, 5.4vw, 4.4rem)`) + outlined serif numeral
  (`-webkit-text-stroke: 1px var(--line-strong)`, transparent fill) as the section's
  folio mark. Numbering 01–05 via `data-num`.
- **Rail sections** (`.rail`: stack, experience, education, words): head lives in a sticky
  left column (0.36fr, `top: 92px`), content scrolls in the right column; one shared top
  rule on the wrap. Collapses to single column ≤900px.
- **Work rows zig-zag:** even rows mirror (media leads). One full-bleed slow ticker under
  the hero (stack marquee, hover-pause, PRM static).
- **The page closes at headline scale** — contact h2 up to 7rem, left-aligned; hierarchy
  bookends (first and last impressions carry the same typographic weight).

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

### saddine.com — Next+Tailwind; CSS transitions only, no scroll-reveals
- **Experience accordion:** timeline via `::before` (absolute `left-3 w-px bg-border`),
  icon chips ON the line, metadata `pl-9`, `last:before:bg-background` masks the tail.
  Hover halo = offset `::before` layer so chip/line stay outside the tint —
  background-color-only, **150ms ease-out**. Their panels snap; ours glide (better).
- **Chevron path-morph:** real point flip `M6 9L12 15L18 9` ↔ `M6 15L12 9L18 15`, 0.3s
  (CSS `d: path()`; Safari fallback rotate 180°).
- **Page-level ease worth stealing:** `cubic-bezier(.76, 0, .24, 1)` at 0.7–0.8s.
- **Restraint:** colors-only 150–200ms hovers, `active:scale(0.98)`, zero scroll-reveals.

### pixels.studio — SvelteKit; zero libs, canvas + rAF + lerp
- **Blur-rise reveal:** `opacity:0 + translate3d(0,40px,0) + blur(12px)` pre-state in
  stylesheet (no FOUC), ease **`cubic-bezier(0.22, 1, 0.36, 1)`**, load 1100ms
  (stagger 0/120/260ms), scroll 1300ms, IO `-10%` rootMargin, once, and **reveal
  immediately if already above the fold at mount** (correctness detail). Blur caps at
  ~6px on large serif (shimmers otherwise) — never on H1.
- **Cursor-reactive hero canvas:** seeded glyph grid (14×18px, PRNG), elliptical
  spotlight (110px/48px, aspect 1.6), position AND angle lerped **0.15/frame**, trail
  points ≥16ms apart cap 80 decay ×0.96, idle sweep every 5–7s. They forgot the PRM
  guard — we don't.
- **Self-stopping rAF** (animate only while `|target−value| > 0.01`) = zero idle cost;
  adopted in our cursor.

### colibrivision.it — WP + GSAP 3.12 (curves extracted, reimplemented vanilla)
- **Blade reveal:** lines in `overflow:hidden` wrappers, `translateY(100%)→0`, **600ms
  `cubic-bezier(0.215, 0.61, 0.355, 1)`** (power3.out), stagger **50ms/line**, once at
  viewport bottom. Flagship treatment for Playfair headings.
- **Card-stack shrink:** sticky cards, per-frame `translateY(20px*i) scale((h−off*.05)/h)`
  — already vanilla + PRM-gated in their source; liftable for stacked case cards.
- **Theme-switch crossfade:** add `html.theme-transition` BEFORE flipping theme, force
  reflow, remove after duration+200ms; transitions color/bg/border **~600ms
  `cubic-bezier(0.16,1,0.3,1)`** (our --ease-expo). PRM: none.
- **Swap-hover text roll:** duplicate label in `::after`, roll `translateY(-100%)`,
  0.6s --ease-expo, `overflow:hidden` wrapper — build-time duplication, zero JS.

**Shared philosophy across all four references: scroll stays mostly static; hover
carries the personality.** Don't stack more scroll motion than the panel scrubs.

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
