# Gabriel Andrade — portfolio

Astro static portfolio: homepage, B-Boss and Pandora case studies, 404, English PDF résumé. Node 22, pnpm 10.

- `corepack pnpm install --frozen-lockfile`
- `corepack pnpm dev`
- `corepack pnpm test` — native Node tests, no network requests
- `corepack pnpm build` — generates the static site in `dist/`
- `corepack pnpm preview`

Content: `src/data/content.ts` and `src/data/projects.ts`. Case narratives: `src/pages/work/`. Résumé source: `scripts/resume.html`; print with Chromium, A4, CSS page sizing and tagged PDF to `public/resume.pdf`. Force a light color scheme and inspect the result before publishing.

Vercel configuration is in `vercel.json`; deployment targets the existing `portfolio-gabriel-1` project. The maintained Astro source is on `portfolio/simple-dark`; `main` contains the legacy site. Verify the active Vercel deployment's actual source before promotion: the published copy may be newer than this branch, and a small feature release must not revert it. The root domain is canonical; www redirects to it. Local QA evidence is ignored under `output/playwright/`.

## GitHub activity

The homepage renders a static contributions calendar after Work and before Background. It needs no browser JavaScript. The source is the public [GitHub Contributions API](https://github.com/grubersjoe/github-contributions-api), using exactly `https://github-contributions-api.jogruber.de/v4/Gabriel300p?y=last`. Counts represent GitHub contributions, not commits. The displayed dates identify the actual rolling 12-month period. Calendar layout and date formatting use UTC.

Each build requests the endpoint once, with an eight-second timeout covering the response body, no retries, and no token or paid fallback. The adapter checks dates, a complete consecutive year (including leap days), nonnegative integer counts, levels, and the total against the daily sum. Upstream responses may be cached by the public API; collection time records when this site received the response, not when GitHub was scraped. The displayed total uses `total.lastYear` after checking it against the daily sum.

On request or validation failure, the build uses `src/data/github-activity.snapshot.json` only if its source, collection timestamp, period and data are valid. The page labels that collection date **Cached**. If neither source is valid, it shows an unavailable message and the GitHub profile link, with no invented total or empty graph. External failure does not stop the site build.

The checked-in snapshot contains the real public response collected on 8 November 2026, with `source`, `collectedAt` (ISO UTC) and `data` metadata. Normal builds never write or refresh it. To refresh it deliberately, fetch the same endpoint once with an eight-second timeout, retain the full JSON as `data`, record the successful collection time as `collectedAt`, and keep the endpoint as `source`. Validate the response with `validateCalendar(data, collectedAt)` from `src/lib/github-activity.mjs` before replacing the file; retain the previous snapshot if any step fails. Review the resulting snapshot diff and run `corepack pnpm test` and `corepack pnpm build`. There is no scheduled refresh.

See DESIGN.md for editorial and verification rules. Previous local state was preserved in `/tmp/portfolio-before-20261028/` before this implementation.
