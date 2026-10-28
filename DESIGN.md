# Design

Source of truth for the portfolio's look and voice. Read this before changing UI.

## Intent

A simple, clean, dark developer/designer portfolio that lets the real work be the loudest thing on the page.
Primary audience: hiring teams evaluating design + frontend depth, internationally. Do not use the words
"remote" or "founder" anywhere on the site.

## Voice

Plain, specific, confident. Sentence case. No AI clichés ("elevate", "seamless", "unleash"). No exclamation marks.
English only.

## Type

- **Sans:** Geist (`--sans`), 16px base, line-height 1.6, tight display tracking on headings (-0.03em to -0.045em).
- **Mono:** Geist Mono (`--mono`) for labels, tags, stats and metadata. Uppercase + wide tracking only on small kickers.
- Headings are weight 600. No serif, no italics for emphasis.

## Color

Single dark theme, neutral (no hue). Tokens live at the top of `src/styles/global.css`:

| Token          | Value   | Use                 |
| -------------- | ------- | ------------------- |
| `--bg`         | #0a0a0a | page                |
| `--surface`    | #111111 | cards               |
| `--surface-2`  | #171717 | inner blocks        |
| `--line`       | #242424 | borders             |
| `--text`       | #ededed | primary text        |
| `--text-muted` | #9a9a9a | secondary text      |
| `--text-faint` | #8a8a8a | labels (AA on all surfaces) |

There is no accent color. Emphasis comes from weight, size and white-on-black contrast. Project screenshots
carry the only color on the page.

## Layout

- Single page: Nav, Hero, Work, Stack, Experience + Education, Testimonials, Contact, Footer.
- Content width 1080px, gutter `clamp(20px, 5vw, 40px)`.
- Work: Pandora is the featured full-width case (screenshot, numbers, delivery-loop diagram, design decisions);
  B-Boss and Allumove sit side by side below it and stack on narrow screens.

## Images

- Real captures of running apps with **fictitious data only**, no device frames, no effects. 16:10, top-aligned crop.
- WebP, max 1600px wide, served through `astro:assets`.
- Never show real customers, emails, vault content or private repositories.

## Motion

One signature moment: the Pandora flow diagram (`.flow`) draws in once when it scrolls into view. Everything else
is static apart from short hover transitions.

Rules that must hold:

- Content is visible by default. The diagram hides only under `html.reveal`, which an inline script in `Base.astro`
  sets while JS runs and removes after 1.2s if `window.__uiReady` is not set (failsafe).
- `prefers-reduced-motion` and JS-disabled both show everything, with no animation.
- Do not put `clip-path` on an element observed by an IntersectionObserver (Chromium counts it as clipped and the
  observer never fires). Animate descendants instead.

## Verification

`pnpm build` must pass. Then check 1440, 768 and 390px for horizontal overflow, console errors, and the three
motion cases (normal, JS disabled, reduced motion, plus the failsafe with the module script removed).
