# Portfolio — Gabriel Andrade

Personal portfolio of Gabriel Andrade, a design engineer from São Paulo.
Built with [Astro](https://astro.build/) as a static, single-page site. See `DESIGN.md` for the design rules.

## Design

- **Direction:** simple and clean. One dark theme, neutral black background, off-white text, no accent hue.
  The work is the only thing with color.
- **Type:** **Geist** for everything, **Geist Mono** for labels and numbers. Both self-hosted.
- **Language:** English only.
- **Motion:** one signature moment (the Pandora flow diagram draws in once when it scrolls into view),
  plus subtle hover states. Everything respects `prefers-reduced-motion` and stays visible without JavaScript.

## Structure

```
src/
  assets/img/work/   project screenshots (WebP, optimized via astro:assets)
  components/        Nav, Hero, Work, Stack, Background, Testimonials, Contact, Footer
  data/content.ts    skills, experience, education, languages, quotes
  layouts/           Base.astro (head, meta, reveal failsafe)
  pages/             index.astro
  scripts/           ui.ts (copy email, flow draw-in)
  styles/            global.css (tokens + all styles)
public/
  fonts/             Geist, Geist Mono (woff2)
```

## Commands

| Command        | Action                                   |
| -------------- | ---------------------------------------- |
| `pnpm install` | Install dependencies                     |
| `pnpm dev`     | Start the dev server at `localhost:4321` |
| `pnpm build`   | Build the static site to `./dist/`       |
| `pnpm preview` | Preview the production build locally     |

## Notes

- Project screenshots are captures of the running apps with fictitious data. Replace the files in
  `src/assets/img/work/` to update them, and check each one for real names, emails or customer data first.
- Pandora is a private system: the site shows architecture and numbers only, never vault content or a link.
