# Portfolio — Gabriel Andrade

Personal portfolio of Gabriel Andrade, a design engineer from São Paulo.
Built with [Astro](https://astro.build/) as a static site.

## Design

- **Direction:** warm editorial (light paper base), inspired by the reference set the
  work was grounded in. High-contrast serif display (**Playfair**), **Geist** for body,
  **Geist Mono** for metadata. A single, restrained **green** accent.
- **Dark mode:** a warm editorial dark theme (not a cold tech dark). Same green accent,
  brightened for legibility. Toggle in the nav; the choice persists in `localStorage` and
  defaults to the OS `prefers-color-scheme`. An inline script in `<head>` sets the theme
  before first paint to avoid a flash.
- **Language:** English first, with a PT toggle in the nav (persisted). Copy lives inline
  on each element via `data-en` / `data-pt` attributes; a small client script swaps them.
- **Motion:** restrained — scroll-reveal, hover-lift, a live São Paulo clock. Everything
  respects `prefers-reduced-motion`.

## Structure

```
src/
  assets/img/     project screenshots (optimized via astro:assets)
  components/     Nav, Hero, TechStrip, Work, Systems, About, Contact, Footer
  layouts/        Base.astro (head, theme no-flash script, global styles)
  pages/          index.astro
  scripts/        ui.ts (nav, reveal, lang, clock, copy, theme toggle)
  styles/         global.css (semantic design tokens, light + dark)
public/
  fonts/          Geist, Geist Mono, Playfair (woff2, self-hosted)
  favicon.svg
```

## Commands

| Command           | Action                                       |
| ----------------- | -------------------------------------------- |
| `pnpm install`    | Install dependencies                         |
| `pnpm dev`        | Start the dev server at `localhost:4321`     |
| `pnpm build`      | Build the static site to `./dist/`           |
| `pnpm preview`    | Preview the production build locally         |

## Notes

- Project screenshots are exports from Figma / live sites; replace `src/assets/img/*`
  to update them.
- The theme and language toggles are progressive enhancement — the page is fully
  readable and navigable without JavaScript.
