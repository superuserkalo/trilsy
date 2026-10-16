# 17: Site motion pass

Status: resolved
Lane: logic
Blocked by: 03, 04, 05, 07, 08, 09, 10, 11, 12, 13, 14, 15, 16

**Section:** motion across the whole site.

**What to build:**

- Header: the island shrinks from 80px to 56px over 400ms on `--ease-trilsy`, triggered once, not scroll-linked. It must not compete with the hero's fold (tickets 04 and 07): never during the fold; default, it shrinks when the fold completes (07 exposes that point) and grows back when the page returns above it. The pinned stage's geometry must not depend on the header's height, so the shrink moves nothing inside the stage; check the phone stage's sticky offset (58px in the prototype) still clears the smaller island.
- One subtle scroll-reveal pattern on the easing token, 400 to 600ms, applied only where it guides attention; no staggered fade-up on everything. **No extra reveals in the merged hero and story section:** its window, people, photo and chapter text already move with scroll; reveals start at the trust band.
- Audit: every motion uses `m` under `LazyMotion`, the one easing token and a 400 or 600ms duration (exceptions: the hero demo's clock, including its 180ms transcript-line stagger and the idle loops; the scroll-linked fold, which has no duration; the reduced-motion layout swap, 200ms out and 200ms in, owner-confirmed; and the 70s marquee); micro-interactions only on interactive elements; no parallax for its own sake, cursor effects, blobs or bouncy springs.
- Reduced motion verified on every page.

**Approved copy:** none changes. **Behavior spec:** `01-concept.md` B5 "Other motion"; craft from the 01b specs, not their choreography.

**Images needed from the owner:** none.

- [x] Header shrink works and is static under reduced motion
- [x] Audit list recorded with each finding fixed
- [x] Typecheck and build pass

## Comments

- 2026-10-15, logic lane: updated for the owner-approved merge of the hero and the pinned story (hero option 1). Blocked by 07 instead of 06 (resolved, folded into 04), because the header shrink has to wait on the fold's scroll work. The shrink trigger at the end of the fold is a default taken by the logic lane, not an owner decision.

## Answer

2026-10-15, logic lane, Opus 5.5, loop mode.

**Header shrink.** `web/components/header-island.tsx` (client) is the island now; `site-header.tsx` stays a Server Component and passes its contents through. Height 80px, 56px once compact, as a CSS `height` transition at 400ms on `ease-trilsy`: a state change, not scroll-linked. On home it reads `<html data-hero-fold>` from ticket 07 through a MutationObserver: compact once "done", full again once "open", so it never moves during the fold. Pages without the hero (no attribute) go compact once scrolled past 96px, the header strip's height. The 96px strip around the island keeps its height, so nothing on the page moves, and the pinned stage's geometry does not read the header at all. The phone stage sticks at 96px (`top-24`), below the compact island's 72px bottom. Under reduced motion the island stays at 80px. The Use cases panel stays anchored to the compact island (`data-island` kept).

**Reveal.** `web/components/reveal.tsx`, the one pattern: rise 16px and fade in, 600ms on `ease-trilsy`, once, when 20% is in view. Server-rendered visible (nothing hidden without JavaScript); hidden on mount only if it starts below the viewport, so nothing on screen blinks out on a reload mid-page or an anchor jump; never hidden under reduced motion. Applied on home only, from the trust band down: the trust band's line and row, the questions grid, the closing band's text block (the Reveal takes the class of the element it replaced, so no wrapper changes layout). Not on the hero section, and not on the inner pages, where each window already plays once in view.

**Audit.** Method: every page (home, how it works, pricing, students, faq, use cases and all twelve use-case pages) scrolled top to bottom in a production build at 1440, with links and buttons hovered on home, faq and pricing, listing every running animation and transition from `document.getAnimations()` (duration, easing, target); then the same under reduced motion at 1440 and 390.

| # | Finding | Fix |
| --- | --- | --- |
| 1 | The `m.*` windows (how it works notes; Lectures, Customer, Client, Recruiting, Research, Incident) set their finished state at once under reduced motion, but Motion still played it as a 400 or 600ms fade with a 6 to 12px move. Motion runs on the Web Animations API, which the reduced-motion rule in `globals.css` does not reach. | `useMotionTransition()` in `web/lib/motion.ts` returns the transition, or `{ duration: 0 }` under reduced motion; all seven windows use it. |
| 2 | `TabsTrigger` (the hero window's tabs) and its underline: `transition-all` / `transition-opacity` at the 150ms default and default easing. | On `--duration-base` and `ease-trilsy`. |
| 3 | `Badge` (the hero's Microphone and System chips): same 150ms default. | Same. |
| 4 | `AccordionTrigger` base (the phone menu's Use cases trigger): same. | Same. |
| 5 | `BreadcrumbLink` hover: same. | Same. |
| 6 | Talks, courses and webinars window, transcript lines: `transition-opacity` at the default. | Same. |

Recorded as fine: every other transition is 400 or 600ms on `ease-trilsy`; all JavaScript motion is `m.*` under `LazyMotion strict` (no `motion.*`, which would throw); no springs, parallax, cursor effects or blobs; hover effects only on links, buttons and the slider. Exceptions as the ticket lists them: the hero clock (180ms transcript stagger, the 6.2, 7.9 and 5.3s idle sways, the 1s blink), the scroll-linked fold, the 200ms reduced-motion layout swap and the 70s marquee. Two loops of the same kind kept and named here: the blinking caret in the Team meetings window (`animate-blink`, the hero's token) and the spinner in the Voice notes window (1s linear, `motion-reduce:animate-none`); both are product state indicators like the hero's blink. Under reduced motion the only animation left on any page is the owner-confirmed 200ms swap on home. Unused, not touched: `dialog.tsx` (100ms overlay), `toggle.tsx`, `toggle-group.tsx`, the navigation menu's `Indicator`; ticket 18 can delete them.

**Probe** (production build, Chrome, Playwright): 1440 by 900, island 80 at the top, 80 mid-fold and at 94% of the fold, 57.75 200ms after the fold completes, 56 at 700ms, 80 again back at the top; the reveals start at opacity 0 and are 1 after scrolling; reduced motion: 80 throughout and reveals at 1 from the start. 390 by 844: the same, the fold completing later because the phone's track starts under the copy (ticket 07's definition, kept). `/pricing`: 80 at 0, 56 at 200, 80 at 50. No console errors besides the known 404 prefetches. Captures `docs/redesign/prototypes/d17-header-compact-{1440,390}.png`, `d17-home-folded-{1440,390}.png`, `d17-nav-compact-1440.png`.

**Defaults taken:** the reveal's shape (16px rise plus fade, 600ms, 20% in view) and where it goes (home only, three blocks); the 96px threshold on pages without the hero; under reduced motion "static" read as the island not changing size at all; on the phone the shrink follows ticket 07's fold attribute, so it comes once the stage has been scrolled 95vh into its track.

**Open:** a real trackpad and wheel pass (with ticket 07's); Safari and Firefox; a 56px island holds the 44px GitHub button with 3px to spare inside the border.
