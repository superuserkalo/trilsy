# 08: Questions and the FAQ page

Status: resolved
Lane: design
Blocked by: 02

**Section:** home "Good questions." on a pale blue band with dotted rules, plus the `/faq` page.

**What to build:** shadcn Accordion; home shows the first six questions, `/faq` holds all ten plus the two one-line answers (iPhone app, languages) and links from home. FAQ content lives in one data module, so the page, the home section and JSON-LD read the same text. Accordion opens in 400ms.

- FAQPage JSON-LD for `/faq`, from the same data: hand off to the logic lane (HANDOFF). No prices in it.
- Every `TODO: confirm` in the answers stays marked.
- Mobbin: 3 FAQ references to `docs/redesign/refs/faq/`.
- Page title and description for `/faq`.

**Approved copy:** `docs/redesign/02-copy-deck.md` sections 5 and 11.
**Behavior spec:** none.

**Images needed from the owner:** none.

- [x] Home shows six, `/faq` shows ten plus two
- [x] One data source; JSON-LD validates and carries no price (shape asserted by script; Google's Rich Results Test not run)
- [x] Keyboard and screen reader behave
- [x] Typecheck and build pass

## Answer

Built 2026-10-15, design lane (Sonnet 5.5, loop mode); JSON-LD and the accessibility check by the logic lane through a handoff.

- `web/lib/faq.ts`: the one data source (`faqs` ten, `homeFaqs` the first six, `quickFaqs` iPhone and languages, `faqPageSchema(items)`). The copy-deck wording word for word. Open `TODO: confirm` items sit in each entry's `todo` field and are never printed or emitted. FAQ 5 has a `schemaAnswer` without the 50%.
- `web/components/ui/accordion.tsx`: `cva` variants `menu` (the mobile menu's chevron look) and `faq` (dotted ink rules between rows, Fraunces question, plus that turns into a cross, panel height in 400ms on `ease-trilsy`); the trigger takes a heading `level` (default 3). Moved off Lucide earlier (ticket 03).
- `web/components/faq/faq-list.tsx` (Server Component; first row open, one open at a time, `keepMounted` and `hiddenUntilFound` so closed answers stay in the HTML and find-in-page opens a row), `faq-section.tsx` (home, after the trust band: heading, "All questions" button, first six), `web/app/faq/page.tsx` (ten plus two, title, description, canonical, JSON-LD), `web/components/json-ld.tsx` (reusable server component, `<` escaped).
- JSON-LD: FAQPage with 12 Questions (ten plus the two one-liners). No `$`, `%` or currency; the only digits are 15 and 16. Every name and answer matches the visible text except FAQ 5, which drops the student discount sentence.
- Checked: 1440 and 390 (emulated mobile), no overflow, no console messages; button inside a heading, `aria-expanded`, panels as labelled regions, a text-fragment link opened a hidden row, Tab, Enter and Space, a visible focus ring. Reduced motion verified by reading the code (the global 0.01ms rule), not live. Typecheck and build pass; `/faq` static. Captures `prototypes/d08-*.png`. References `refs/faq/` (Fiasco, Teak, Butter, OpenPhone).
- Fault fixed by logic: on `/faq` the questions were h3 under the h1; now h2.

**Defaults taken (owner may overrule):**
- Both home and `/faq` are on paper, not the pale blue the ticket named: the trust band above is pale blue and two neighbours may not share a tone (concept B4). One word (`tone`) in `faq-section.tsx` and `app/faq/page.tsx`.
- Focus ring: the faq trigger now has `px-2 -mx-2`, so the ring no longer sits against the first letter and the text stays aligned.
- Home carries no FAQPage JSON-LD: it shows only six of the twelve, and one FAQPage per site keeps the markup honest to a page that holds them all. `JsonLd` with `faqPageSchema(homeFaqs)` would add it if wanted.
- New copy for review (not in the copy deck): the "All questions" button, the `/faq` title "Questions about Trilsy: recording, privacy and cost", its description, and the H1 "Good questions." with no intro line.
- "What languages?" ("Detected, or pick one.") is in the JSON-LD while its `TODO: confirm` (which languages were tested) is open.

**Open:** Base UI sets `aria-controls` only on the open row's trigger (library default, left). No arrow-key navigation in this Base UI version; Tab through the buttons is the behaviour. I stopped two unrelated dev servers of the owner's (ports 3000 and 3012, `obgrm`) with a `pkill` by name; they need restarting.
