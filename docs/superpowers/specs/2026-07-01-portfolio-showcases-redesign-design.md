# Portfolio project showcases — redesign (design spec)

Date: 2026-07-01 · Branch: `redesign/portfolio-uplift`

## Problem

The three featured project showcases (B-Boss, Movie Match, Pandora) and the B-Boss
case study page look flat and cheap. The raw material is good (real dark+gold B-Boss
product screens, cinematic Movie Match app, a real CLI vault). The **presentation**
is the failure:

1. **Context clash** — dark product UIs dropped onto a warm-paper light panel; the
   screenshot fights the page instead of living in an intentional environment.
2. **Weak presence** — shrunk screens (~210px phones), raw, no convincing device frame.
3. **Dead motion** — today it's a carousel crossfade + hover tilt. Pandora's "terminal"
   is 100% static text — the one thing that most wants animation is frozen.

## Goals

- Every project screenshot lives in an intentional, on-brand **stage** (no clash).
- Convincing, **coded** device frames (browser + phone) — no plastic "AI slop" bezels.
- Real, tasteful **motion** per project, viewport-gated, hover-pausable, fully
  `prefers-reduced-motion` safe, theme-aware (light + dark).
- Keep the existing warm-paper editorial visual language — this is a showcase upgrade,
  **not** a re-theme.

## Non-goals

- No re-theme of the site. No new color system, fonts, or layout language.
- No heavy animation framework (no GSAP) for this scope. No GIFs, ever.

## Scope (approved)

- Homepage `#work` section (`src/components/Work.astro`) — the 3 featured showcases.
- The B-Boss case study page (`src/pages/work/bboss.astro`) — same flat-screen problem.

## The showcase system (foundation — shared by all three)

### 1. Branded stage + glow
Behind each dark screenshot, a `radial-gradient` in the product's accent hue, fading to
transparent (blurred, low opacity), anchoring the dark UI on the warm-paper site.
- B-Boss → gold `#fac82b`
- Movie Match → cinema red (`#e50914`-ish, tuned)
- Pandora → terminal green (reuse site emerald)
Static (no JS); optional viewport-entry opacity/scale via `animation-timeline: view()`.

### 2. Coded device frames (no plastic)
Layered physical cues, not one strong shadow (anti-slop):
- **Browser (macOS/Safari)** — traffic lights from a single pseudo-element `box-shadow`
  stack; subtle bevel gradient; proportional corner radius; url/tab chrome.
- **iPhone** — real 19.5:9 aspect, layered bevel (diagonal gradient), body `#181818`,
  concentric inner radius, notch pill with an off-center radial "lens" highlight.

### 3. Motion primitives (vanilla CSS + Web Animations API + tiny JS)
- Reuse existing `IntersectionObserver` reveal infra in `src/scripts/ui.ts`.
- Trigger on viewport enter; pause on hover where there's text to read; pause on exit.
- `prefers-reduced-motion: reduce` → static final frame everywhere.

## Per-project design

### B-Boss (flagship) — real video + phone
- macOS browser frame containing a **real screen recording** of the running B-Boss
  dashboard (scroll + open a filter + navigate), muted loop.
  - `<video autoplay loop muted playsinline>`, WebM (primary) + MP4 (fallback),
    `poster` still, `IntersectionObserver`-gated load/play, paused off-screen.
  - Recorded via Playwright driving the real app (see Sourcing).
- Client app **phone** overlapping bottom-right, subtle screen-swap.
- Gold glow stage; 3D tilt settles on viewport entry; stat chips may count up.
- **Fallback** if recording proves too fragile: coded "living screenshot" (GPU
  `translateY` auto-scroll of a tall still, masked top/bottom). Be transparent if used.

### Movie Match — iPhone prototype walkthrough
- iPhone frame running a **flow**: onboarding (pick streamings) → home recs →
  filters expand → movie detail (cast). Screens slide like a real prototype
  (absolute-positioned screens, JS scheduler picks the active one, CSS transition).
- Poster-row parallax inside a screen; floating streaming-logo motes.
- Cinema-red glow stage. Reduced-motion → static "detail" screen.

### Pandora — real animated terminal
- Termynal-pattern component, driven by **Web Animations API** (not nested setTimeout):
  typed command char-by-char, output revealed line-by-line, blinking **non-selectable**
  cursor (pseudo-element → user can copy the command cleanly).
- Loops 3 real demos: `ingest` (route knowledge), `qmd query` (semantic search),
  `agents scout + verify`. Minimal, sober window chrome (no colored traffic lights).
- Terminal-green glow. Reduced-motion → static final transcript.

## Sourcing

- **B-Boss** (hybrid): reuse the already-populated good captures as baseline; boot the
  apps locally against a **disposable local Postgres** (Docker/system PG) + run the
  repo's Prisma seeds, then Playwright-record the flagship video and capture a few
  fresh retina stills of the strongest routes (dashboard, attendance table, admin
  analytics, client home/barbershop detail).
  - **Safety (hard rule):** never touch the shared Neon DB in the monorepo `.env.local`.
    Use a local `DATABASE_URL` override only. No writes to any shared/remote DB.
  - Monorepo: Nx + pnpm, Node ≥22. Apps: barbershop :3000, client :3001, api :3002,
    barber :3003, admin :3004. Brand: bg `#0a0a0a`, card `#171717`, gold `#fac82b`,
    text `#fafafa`. Seeds at `apps/api/prisma/seed.ts` + `prisma/seeds/`.
  - Timebox the boot+seed; if it doesn't come up cleanly, fall back to existing stills
    + the coded living-screenshot motion for B-Boss.
- **Movie Match**: export exact Figma nodes at high res (fileKey `9IxJ9VNMjLbyZAABr01nPp`):
  Home `45:483` / `126:201`, Filtros-expandido `41:17686`, Detalhe `21:1144`,
  Suas listas `61:820`, plus onboarding screens.
- **Pandora**: no screenshot — coded/animated from real command transcripts.

## Tech decisions

- Astro 5 + vanilla CSS in `src/styles/global.css` + progressive-enhancement JS in
  `src/scripts/ui.ts`. Web Animations API for terminal + sequencing.
- Video only for B-Boss (WebM+MP4, gated, muted, looped). No GSAP. No GIF.
- Assets: mobile stills stay `astro:assets` `<Image>`; video in `public/` (or `src` if
  processed). Keep payloads lean; lazy/gated everywhere.

## Verification (exit gate)

- Playwright vision-critique loop on real render: both themes, desktop + mobile.
- `prefers-reduced-motion` path renders static, complete, legible.
- No layout shift; video gated (not eager-downloaded); Lighthouse/perf sane.
- Screens read as intentional showcases, not raw screengrabs (the whole point).

## Risks & fallbacks

- **Boot/seed fragility** (auth to reach dashboards, incomplete seed) → fallback to
  existing populated stills + coded living-screenshot motion for B-Boss; be transparent.
- **Video payload** → keep clips short (≤~8s), small dimensions, WebM-first, gated.
- **Motion overload** → one clear motion idea per showcase; calm defaults.
