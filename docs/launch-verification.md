# Portfolio launch — 2026-10-28

## Implementation

Home, B-Boss case, Pandora case, custom 404, one-page English résumé (selectable, tagged PDF), social preview, canonical URLs and www redirect. Astro static output, Node 22, existing Vercel project `portfolio-gabriel-1`.

## Evidence

- Build passed; internal links/assets resolved; `git diff --check` passed.
- Home and both cases checked at 390, 768 and 1440px: no horizontal overflow or page errors.
- Axe: zero violations on all three pages.
- JavaScript-disabled/reduced-motion page renders complete content.
- Keyboard skip link transfers focus to main.
- Lighthouse mobile against local production build: performance 100, accessibility 100, best practices 100, SEO 100. Laboratory measurement, not field Core Web Vitals.
- Résumé: one page, text extraction checked and rasterized PDF visually reviewed.
- Screenshots and raw reports: ignored `output/playwright/` directory.

## Content provenance

- Career: Pandora `resources/carreira/perfil-profissional.md` and user-provided career analysis; role periods aggregated to avoid conflicting promotion dates. No C1 certification claimed.
- B-Boss: Pandora `projects/bboss.md`, existing sanitized application capture and supplied contribution history. No usage or revenue claims.
- Pandora operational example: `reference/agentos/solo-operator-resilience.md`, July 7, 2026, health probes and explicitly unresolved empty-queue/feed detection. Historical behavior, not current reliability certification.

## Deployment

Production: https://portfolio-gabriel-1.vercel.app
Deployment: https://portfolio-gabriel-1-acrgjztdq-gabriel300ps-projects.vercel.app
Previous working new-design deployment for rollback: https://portfolio-gabriel-1-8rdpd7oh1-gabriel300ps-projects.vercel.app
Rollback: use Vercel project deployment history to promote the previous production version.

Domain redirects have been reconciled in Vercel: apex serves the deployment, www redirects to apex (308).
Custom-domain completion remains pending Cloudflare DNS. Vercel reports misconfigured DNS for apex and www; both currently return a Cloudflare 404. Recommended records from authenticated Vercel configuration: A @ 216.198.79.1; CNAME www e4b50d7ed9a2a3a1.vercel-dns-017.com; DNS only. Preserve MX/TXT and other subdomains. Verify public HTTPS and routes after cutover before marking the goal complete.


## October 29 — compact home and individual case presentations

Home project covers removed; projects are now text rows with descriptive case links. Cases have a responsive section index. B-Boss adds a role/journey map, contextual interface capture, numbered design decisions and outcome/validation split. Pandora adds a monitoring evidence table and moves the console capture into the lessons section. Existing factual scope is preserved.

Build and diff checks pass. All three pages checked at 390/768/1440px without overflow or page errors. Case pages have no axe violations. The initial home link accessible-name mismatch was corrected by retaining the visible text in its accessible name; the rerun returned zero violations. Click-through, case section navigation, full-size image HTTP 200 and three evidence-table rows were verified.

## October 29 — final editorial release

Production deployment: https://portfolio-gabriel-1-28cuveb0a-gabriel300ps-projects.vercel.app
Stable alias: https://portfolio-gabriel-1.vercel.app
Previous production for rollback: https://portfolio-gabriel-1-9zs9cch0s-gabriel300ps-projects.vercel.app

Added Allumove's documented qualification redesign and a fresh browser capture of its fictional prototype. Three cases now cycle through next-project navigation. Home copy is more specific and the generic approach section is removed. Resume updated and visually checked: one page, selectable text.

Final local mobile Lighthouse: performance 99, accessibility 100, best practices 100, SEO 100. Four pages × three widths passed overflow checks; zero page errors and zero desktop axe violations. Reports and screenshots are under output/playwright. These are lab checks, not real-user performance measurements.

Domain recheck: https://gabrielandrade.com still returns Cloudflare HTTP 404. No Cloudflare credentials or DNS-management connector available in this session. Existing Vercel DNS instructions above remain the handoff; do not mark the original custom-domain goal complete.

## Home thumbnails

Added three small, linked interface previews to the project index. Astro generates responsive optimized images; CSS crops previews without changing source captures. Desktop uses a 160px image column, tablet 120px, mobile 96px beside the title. Subtle hover zoom is disabled for reduced motion; keyboard focus is visible.

Build and diff checks passed. Home at 390/768/1440px: three loaded images, no horizontal overflow. Axe returned zero violations; Allumove thumbnail navigated to its case. Desktop and mobile screenshots inspected under output/playwright/thumbnails-*.png.

## Vector artwork correction

Replaced unreadable screenshot thumbnails with three original inline SVG editorial illustrations: booking calendar (B-Boss), property qualification (Allumove), agent coordination (Pandora). Illustrations are decorative, not represented as actual product interfaces; real evidence remains in case pages. No image-generation service or additional runtime dependency used.

Build passes. Home checked at 390/768/1440px with three SVGs and no overflow; axe returned zero violations. Desktop/mobile artwork captures visually inspected, and Pandora thumbnail navigation verified. Evidence: output/playwright/vector-previews-*.png.

## Text-only home restored; Allumove native exhibit

Restored numbered text rows on the homepage and removed ProjectArtwork plus thumbnail-specific styles. Replaced Allumove's narrow raster capture with a static Astro/CSS exhibit adapted from the actual MatchPainel structure: four assessment axes, highlighted financial criterion, explicit property rule and follow-up explanation. English text and internally consistent fictional figures; clearly labeled as an adapted presentation, not a screenshot or live assessment. No React/runtime dependency, pretend buttons, or edits to source products.

Build/diff checks pass. Home and Allumove inspected at 390, 768, 1440px: no overflow or page errors. Desktop/tablet axe passed; mobile caught a preexisting GA visible/accessibility-name mismatch in the shared nav. Removed the overriding aria-label and exposed the visible short label; the link now takes its accessible name from the visible text at each breakpoint. Rerun passed at 390 and 1440px with zero axe violations. Keyboard skip-to-main and home-to-Allumove navigation passed; four criteria and no pretend action buttons verified. Visual evidence: output/playwright/restored-*.png.

Final deployment: https://portfolio-gabriel-1-leopzyfql-gabriel300ps-projects.vercel.app
Custom domain is now working: https://gabrielandrade.com. Browser verified HTTP 200 and expected content on home and all three case routes. Home has no project images or SVGs; Allumove has four native criteria cards. This supersedes the earlier Cloudflare DNS blocker.

## Brex / Operational AI application material

Added a separate one-page tagged, selectable résumé at /resume-operational-ai.pdf; retained the general résumé and text-only home. Expanded Pandora around the August MCP launcher/discovery incident, activation checks, Tempo mitigation, and the distinction between implemented orchestration and production wiring. No unsupported external adoption, transaction-idempotency or sole-authorship claim.

Provenance: Pandora infrastructure audit dated 2026-08-10, its INFR-0014 execution diary and INFR-0006 Tempo record; AGOS-0013 dated orchestration implementation record; scripts/model-portfolio/evaluate.py; established career profile. No runtime systems were changed or audited in this task.

Private interview/application source: scripts/brex-interview.html (excluded from Vercel); generated PDF in output/playwright/brex-interview-preparation.pdf (also excluded). Includes an introduction, application note, case walkthrough, seven technical rehearsal questions, evidence boundaries and questions for Brex. No application or recruiter message was sent.

Validation: Pandora at 390/768/1440px without overflow and zero axe violations. Desktop case and résumé visually inspected. Résumé: one A4 page, tagged PDF, selectable text. Build and diff checks pass.

## Software engineering positioning — October 29

Hero, contact, footer, page title/description, structured job title and social card now present Software Engineer with AI agents and automation as the focus. Pandora leads the project order; next-case navigation follows the same array. Main résumé links target /resume-operational-ai.pdf, retaining /resume.pdf as an existing direct URL. Experience bullets lead with implementation and integrations without changing employment history.

Market rationale: official Brex Operational AI listing (https://www.brex.com/careers/8861245002?gh_jid=8861245002) and VTEX Senior Frontend listing (https://job-boards.greenhouse.io/vtex/jobs/5252367004) support applied AI and product-engineering positioning. This small sample is not evidence of which occupation has the largest vacancy volume. Invisible's formerly indexed Brazil agentic role redirected to an error/job list and was not treated as live. No unsupported seniority or years-of-AI claim added.

Validation: build; home 390/768/1440px without horizontal overflow, zero axe violations; project order and primary résumé destination checked. Desktop/mobile and social-card screenshots visually reviewed.
