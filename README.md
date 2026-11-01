# Gabriel Andrade — portfolio

Astro static portfolio: homepage, B-Boss and Pandora case studies, 404, English PDF résumé. Node 22, pnpm 10.

- `pnpm install --frozen-lockfile`
- `pnpm dev`
- `pnpm build`
- `pnpm preview`

Content: `src/data/content.ts` and `src/data/projects.ts`. Case narratives: `src/pages/work/`. Résumé source: `scripts/resume.html`; print with Chromium, A4, CSS page sizing and tagged PDF to `public/resume.pdf`. Force a light color scheme and inspect the result before publishing.

Vercel configuration is in `vercel.json`; deployment targets the existing `portfolio-gabriel-1` project. The root domain is canonical; www redirects to it. Local QA evidence is ignored under `output/playwright/`.

See DESIGN.md for editorial and verification rules. Previous local state was preserved in `/tmp/portfolio-before-20261028/` before this implementation.
