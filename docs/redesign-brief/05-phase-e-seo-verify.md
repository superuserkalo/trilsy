# Phase E: SEO / AEO / agent readiness, then verification

Read `00-master.md` and `/docs/redesign/STATE.md`.

## E1. SEO, AEO and agent readiness
- `metadata` API: title, description, canonical, OG and Twitter images (generated with `opengraph-image`), `viewport`.
- `sitemap.ts`, permissive `robots.ts` (explicitly allow major search and AI crawlers), `llms.txt` and `llms-full.txt` describing the product accurately, and a clean semantic heading hierarchy.
- JSON-LD: `SoftwareApplication`, `Organization`, `FAQPage`, `BreadcrumbList` where relevant. **Do not put placeholder prices in any of these.**
- Make content quotable by answer engines: short definitional paragraphs, FAQ answers of 40 to 60 words, use-case and comparison pages with unambiguous claims.
- Run any agent-readiness checks (is-agentic style) and fix what is flagged.
- Run Lighthouse and report scores.

## E2. Verification (required before you say done)
1. Screenshot the finished site at 1440px and 390px **side by side with the Phase A reference screenshots**. Write an honest critique of where it is weaker than Superwhisper or Wispr Flow, and fix those things.
2. Run the Vercel web-interface-guidelines review (`web-design-guidelines`) **as a lint pass**: accessibility, focus states, contrast, semantics. These guidelines do not decide the visual design. Phase B did.
3. Five-second test: cover everything except the first viewport. Can a stranger say what Trilsy does? If not, iterate.
4. Re-run the numeric scroll log on our own site and compare it with the behavior specs. Fix mismatches.
5. Show the final skills ledger. Fix any required skill that was not read in full or changed no decision.
6. Report what you built, every placeholder (`TODO: confirm` list: prices, integrations status, stats), and what you would change next.
