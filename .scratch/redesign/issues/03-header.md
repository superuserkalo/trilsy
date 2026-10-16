# 03: Header

Status: resolved
Lane: design
Blocked by: 02

**Section:** header, on every page.

**What to build:** the square island header from B2: wordmark, Use cases (dropdown), Pricing, How it works, Students, and a View on GitHub button, with a phone menu.

- Wordmark: plain Fraunces "Trilsy", marked `TODO: logo` (owner supplies the logo later).
- Use cases dropdown: the twelve pages in two groups of six (Work: Sales calls, Customer calls, Team meetings, Client meetings, Recruiting, Incident calls; Learning and media: Lectures, Talks, courses and webinars, Research interviews, Journalism, Podcasts and video, Voice notes), each a name and its one-line lead. Opens in 400ms on `--ease-trilsy`. Keyboard and focus correct.
- 3px blue-tint border on the island, per B4 treatment 3.
- Shrink on scroll is ticket 17, not here.
- Mobbin: look at 5 strong sticky headers, save references to `docs/redesign/refs/header/`, implement one calm behavior.

**Approved copy:** `docs/redesign/02-copy-deck.md` section 1 and the leads in section 7.
**Behavior spec:** the island header of the Wispr Flow notetaker page (`docs/redesign/behavior-wisprflow.md`); `behavior-superwhisper.md` pattern 3 (floating nav) for craft only, not choreography.

**Images needed from the owner:** none (logo is an open owner asset; the header carries the TODO).

- [x] Header on every page, links to the planned routes
- [x] Dropdown lists all twelve pages with their leads; works by keyboard
- [x] Phone menu at 390px
- [x] References saved and recorded in the ledger (live captures: the Mobbin connector was down; see Answer)
- [x] Typecheck and build pass

## Answer

Built 2026-10-15, design lane, Sonnet 5.5, loop mode.

- `web/components/site-header.tsx` (Server Component): the island. A 96px sticky strip that lets clicks through, 16px of padding on top, and the island inside it: 80px tall, at most 912px wide, 3px `field` border, `card` fill, `rounded-lg`, no shadow. Plain Fraunces "Trilsy" at the left (comment `TODO: logo`), the nav and the mustard "View on GitHub" button grouped at the right. It stays 16px under the top edge as the page scrolls and changes nothing else (the shrink to 56px is ticket 17; its height is set on the island, so nothing else moves). Mounted once in `app/layout.tsx`.
- `web/components/header-nav.tsx` (client): desktop nav from `lg` (1024px) up. Use cases is a shadcn `NavigationMenu` trigger whose panel is anchored to the island (it hangs 8px under the island, at its width), two columns of six, each item a name and its lead, no icons and no visible group headings (each column is a `ul` labelled Work and Learning and media for screen readers). Opens on hover, click, Enter or Space; Tab walks the twelve links in order; Escape closes and returns focus to the trigger. Opens in 400ms on `ease-trilsy` (measured on the popup and the trigger). Pricing, How it works and Students are plain links.
- `web/components/mobile-menu.tsx` (client): below 1024px the island shows the wordmark, the GitHub button and a menu button that opens a right-hand sheet (400ms, `ease-trilsy`, no blur, no shadow): Use cases as an accordion that expands in place with the twelve names and leads, then Pricing, How it works and Students. A link closes the sheet.
- `web/lib/site.ts`: the GitHub URL, the twelve use cases (slug, name, lead from copy deck section 7) in two groups of six, and the three plain links. Routes: `/use-cases/<slug>`, `/pricing`, `/how-it-works`, `/students`. None exists yet; each arrives with its ticket.
- `web/components/ui/navigation-menu.tsx` and `sheet.tsx` added from the shadcn registry and restyled; `button.tsx` untouched. `accordion.tsx`: Lucide chevrons replaced by one Hugeicons chevron that rotates, and the panel height now animates (Base UI `--accordion-panel-height`, 400ms). `dialog.tsx`: Lucide close icon replaced by Hugeicons.

Checked, in a real browser (dev for the first checks, `next start` for the sticky check): 1440 closed and open, 390 closed and menu open, no console messages, no horizontal overflow at 390, sticky position held after a 1500px scroll, keyboard open and Tab through all twelve links, Escape. Captures: `docs/redesign/prototypes/d03-header-closed-1440.png`, `d03-header-open-1440.png`, `d03-header-closed-390.png`, `d03-menu-390.png`. Typecheck and build pass.

Defaults taken: (1) the dropdown has no visible "Work" or "Learning and media" headings, because the owner said groups are dumb and the approved preview showed none; the ticket text names the groups, so they exist as two labelled columns for screen readers only; adding headings is one line each. (2) The island is 80px at rest (ticket 17's starting height); the B2 stills show about 68px. (3) The desktop nav begins at 1024px; between 768 and 1023 the island shows the phone layout, since the four links and the button do not fit in 912px minus margins below that. (4) No "All use cases" link in the panel, because that copy is not in the deck; the index page is reached from the footer (ticket 10). (5) The phone menu has a menu button; the B2 phone still showed none.

Open: the Mobbin connector was down (DNS), so the five references are live-site captures (`docs/redesign/refs/header/`), not Mobbin; say if you want a Mobbin pass. `View on GitHub` points at `https://github.com/superuserkalo/trilsy` (the repo's `origin`). Logo is still `TODO: logo`. The mustard of the button is the ticket 02 token, a little duller than the B2 stills. The dropdown panel at 912px by about 480px is tall; trimming it is a copy or spacing decision for the owner.
