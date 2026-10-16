# 10: Footer

Status: done
Lane: design
Blocked by: 02

**Section:** footer, on every page.

**What to build:** a full-bleed pale blue field with dotted ink rules; the twelve use-case pages in plain columns; links to Pricing, How it works, Students, FAQ and GitHub; legal links (`TODO: confirm` the privacy and terms pages exist before launch); the trademark line. No motion.

- Mobbin: 3 footer references to `docs/redesign/refs/footer/`.

**Approved copy:** `docs/redesign/02-copy-deck.md` section 12 (footer) and section 3 (trademark line).
**Behavior spec:** none.

**Images needed from the owner:** none.

- [x] All links present; legal links marked TODO: confirm
- [x] Layout at 1440 and 390
- [x] Typecheck and build pass

## Answer

Design lane, Sonnet 5.5, loop mode, 2026-10-15.

- `web/components/site-footer.tsx` (Server Component, no client code, no motion), mounted in `web/app/layout.tsx` after `{children}`, so it closes every page. A `<footer>` in the `field` tone with the dotted ink rule on top (`bandVariants({ tone: "field", rules: "top" })`; no rule below, the page ends). Inside, `max-w-6xl`: the Fraunces wordmark (`TODO: logo`); a "Use cases" nav with all twelve pages in two columns of six, read down the page in the copy deck's order and with no group headings (the owner dropped categories); a "Product" nav with Pricing, How it works, Students, FAQ and GitHub (new tab, Hugeicons `ArrowUpRight01Icon`, a screen-reader note); under a dotted divider, the trademark line on the left and Privacy and Terms on the right. One link style: ink, a mustard underline that appears on hover and focus, 36px tall targets, the focus ring.
- **Legal links.** `/privacy` and `/terms` point at pages that do not exist, so they 404. `TODO: confirm` those pages exist before launch (commented in the component). No copyright or company line: the legal owner is not in the brief, so none is invented.
- **The trademark line moved.** It was the trust band's footnote (ticket 05). On home both would have shown the same sentence, which breaks "a sentence appears once on the page", so I moved it: `web/components/trust-band.tsx` lost its footnote, the footer carries it on every page. Verified: home text holds it once. The wording is the copy deck's, unchanged.
- **Layout.** 1440: wordmark, use cases (two columns), Product, in `1fr / 34rem / 12rem`; the bottom row is one line. Below 1024 the wordmark takes its own row; below 640 (`sm`) the use cases are one column of twelve, the footer is 1033px tall at 390 and nothing overflows. No horizontal overflow at 1440 or 390.
- **Contrast.** Links are ink on the pale blue (about 14:1); the trademark line is ink at 75%, above 4.5:1 (the plain muted grey measured 4.65:1, too close).
- **Mobbin.** Two queries, 24 sections read; three kept in `docs/redesign/refs/footer/` with what each informed (Loom, Wispr Flow, Mural).
- **Checked.** Chrome (dev server) at 1440 on `/faq` and home, and 390 by 844 at 2x; captures `docs/redesign/prototypes/d10-footer-1440.png`, `d10-footer-home-1440.png`, `d10-footer-390.png`. Production build and typecheck pass. The dev-tools badge in the captures is Next's, not the site's. Keyboard order and focus ring were read from the code, not tabbed through.
- **Defaults taken.** Column heading "Product" for the site pages (the deck gives no heading); no tagline or newsletter; no giant wordmark; the footer carries no GitHub button, since the header and the closing band already do; the use-case order is the header's.
- **Open.** The privacy and terms pages; the logo (the wordmark is a placeholder); each app-name claim under the trademark line is still `TODO: confirm` from ticket 05.
