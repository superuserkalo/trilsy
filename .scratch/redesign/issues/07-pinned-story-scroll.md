# 07: Hero and pinned story, scroll

Status: resolved
Lane: logic
Blocked by: 04

**Section:** home, the merged hero and pinned story section built in ticket 04 (owner-approved hero option 1, 2026-10-15). This is its scroll-linked half.

**What to build:** the sticky track and the values that drive 04's component: `progress` and `scrollY` (Motion values), `chapter`, and under reduced motion the `layout` swap. 04 owns how each state looks; this ticket owns when each state is on screen. Measure against the approved prototype, `docs/redesign/prototypes/d4-hero-combo.html?v=1`.

- **Track, desktop:** one stage, `position: sticky` at the top, 100vh tall, in a wrapper holding the hero copy in its first 100vh, then the three chapter blocks (80vh each), then a 30vh tail, then the quiet line. No scroll library, no snap, no scroll hijacking. `useScroll` / `useTransform` (or CSS scroll-driven animation where it is simpler and supported); no React state written per scroll frame.
- **The fold starts at scroll 0.** `progress` = scroll into the track / (0.95 × viewport height), clamped to 0 to 1, linear (04 applies its own easing per element). `scrollY` is passed through for the parts that leave with the page.
- **Chapter:** the active chapter is the last block whose top has passed 45% of the viewport height (70% on the phone), and only once `progress` ≥ 0.98; otherwise -1 (hero). A clear threshold, no snap. Scrolling back up returns to the hero state and the hero cycle resumes where it was.
- **Phone:** the same track with 04's pinned stage sticky under the header (58px in the prototype); chapter blocks 70vh each, invisible markers that only set `chapter`. Check the stage and caption fit at 390 by 664 (a short phone viewport) and that nothing overflows horizontally.
- **Reduced motion:** no scroll-linked travel or scale. `layout` is hero until `progress` passes 0.5, then pinned; 04 swaps them with its 200ms out, 200ms in cross-fade. Before the swap the window scrolls with the page. Chapters still change at their thresholds and show 04's final frames.
- **Off-screen:** 04's clock pauses at a 100px margin; check it pauses once the section has scrolled past and resumes in place.
- **Header:** the island must not shrink during the fold (ticket 17 owns the shrink); make the end of the fold available to it (for example, `progress` reaching 1).
- **Probe, as the 01b specs did:** sample the same named values on the prototype and the built section at fixed scroll offsets (window left, top and scale; each tile's rectangle; photo opacity and position; active chapter) at 1440 and 390; record the table in the Answer. Target: within 1px and the same chapter at every offset. Test on a trackpad and a wheel.

**Approved copy:** none of its own; 04 renders the copy.
**Behavior spec:** the approved prototype (its `layout()` and `pickChapter()` hold the mappings above); `behavior-granola.md` pattern 1 (window collapse, measured and prototyped in `prototypes/sticky-collapse.html`) for craft; the scroll-plus-clock split from `behavior-wisprflow.md` pattern 1 and `behavior-aerivoice.md` pattern 2. Our own code, not the references' timings.

**Images needed from the owner:** none of its own; the three story photos are 04's, and this ticket works against the `TODO: image` boxes.

- [x] Fold scroll-linked from scroll 0 over 95vh at 1440px; pinned stage holds through the chapters
- [x] Chapter thresholds at 45% (desktop) and 70% (phone), only after the fold completes; no snap
- [x] Phone pinned stage with marker chapters at 390px; no horizontal overflow
- [x] Reduced motion: layout swap at the threshold, no travel
- [x] Clock pauses off-screen and resumes in place
- [ ] Trackpad and wheel tested (owner-pending: real hardware); probe table recorded against the prototype at 1440 and 390 (done)
- [x] Typecheck and build pass

## Comments

- 2026-10-15, logic lane: rewritten for the owner-approved merge of the hero and the pinned story (hero option 1). It no longer wires a separate story from ticket 06 (resolved, folded into 04): the frame no longer reshapes from wide to 4:5, the phone no longer has stacked cards that play in view, and the scroll work starts at scroll 0, the fold of the hero, instead of at the story's top.

## Answer

Built 2026-10-15, logic lane, Opus 5.5, loop mode. One file changed under `web/`: `web/components/hero/hero-section.tsx`. Ticket 04's parts are unchanged.

- **Track.** The section holds one track. Desktop (`lg`, 1024px, 04's breakpoint): the track is pulled up 96px (`lg:-mt-24`) so it starts at the top of the page under the sticky header; `FoldStage` is the `sticky top-0 h-screen` stage (z 1); the copy sits over it (z 5, pointer events only on its children, so the window's tabs stay clickable); then the three 80vh chapter blocks (`StoryChapters mode="pinned"`) and a 30vh tail; the quiet line follows the track. Phone: the copy, then `PhoneStage` sticky at `top-24` (under the 96px header, the prototype's 58px), the three 70vh invisible markers and the same tail. No scroll library, no snap, no hijacking.
- **Copy block 100vh plus 124px, not 100vh.** In the prototype the hero copy has `height: 0` but `padding-top: 124px`, so the chapters start 124px below 100vh, and that is what puts the first chapter's heading level with the pinned window. The built copy block is `calc(100vh + 124px)` (96px header plus the copy's 28px), so every chapter threshold and the stage's release match the prototype to the pixel. The ticket's "first 100vh" wording is off by that 124px.
- **Values.** `scrollY` = `useScroll().scrollY` minus the track's page offset (a MotionValue, re-measured on resize and by a ResizeObserver on the track), passed through. `progress` = `clamp(scrollY / (0.95 × innerHeight))`, linear, both from `useTransform`. `chapter` and, under reduced motion, `layout` are React state written only when they change (guarded by a ref), from one `scrollY` change handler that uses cached block offsets, so no layout read happens per scroll frame. The handler computes progress itself rather than reading the derived `progress`, which can still hold the previous frame's value inside that handler (this was a real off-by-one-frame bug in the first build: the chapter came on one scroll event late at the 0.98 gate).
- **Chapter.** The last block whose top is above 45% of `innerHeight` (70% below `lg`), and only once progress ≥ 0.98; otherwise -1. Under reduced motion the gate is the layout swap (pinned), as in the prototype's `pickChapter()`, where `p` is the swapped state. The phone has no fold and no gate (the prototype sets `p = 1` there). Scrolling back up returns to -1 and the hero clock resumes from its stored time (04's `StoryClock` keeps it while a chapter runs).
- **Reduced motion.** `layout` = pinned once progress passes 0.5, hero before; `FoldStage` does its 200ms out, 200ms in cross-fade. Before the swap the window scrolls with the page (04's mapping). Turning the setting on mid-page settles the layout from the current scroll.
- **Header (for 17).** `<html data-hero-fold>` is `open` while progress < 1 and `done` at 1; removed when the section unmounts. On the phone it follows the same progress, though there is no fold there. The header itself is unchanged, so nothing shrinks during the fold.

**Probe** (scratch script, the same named values on the prototype `d4-hero-combo.html?v=1` and on `/`, both in Chrome at device scale 1; offsets in viewport heights from the page top on desktop and from the point where the phone stage sticks on the phone). Values: window left, top, width (its height is excluded: 04 made the panes 264px, prototype 252); each tile's rectangle; photo rectangle and opacity; active chapter; horizontal overflow.

| Run | Offsets | Result |
| --- | --- | --- |
| 1440 × 900, dev | 0, 0.1, 0.25, 0.475, 0.5, 0.75, 0.9, 0.93, 0.94, 1, 1.2, 1.35, 1.45, 1.48, 1.49, 1.6, 1.9, 2.1, 2.2, 2.28, 2.29, 2.5, 2.7, 2.8, 2.84, 2.9 | every value within 1px, same chapter at every offset (gate between 0.93 and 0.94; chapter 1 between 1.48 and 1.49; chapter 2 between 2.28 and 2.29; release at 2.84) |
| 1440 × 900, reduced motion | same | every value within 1px, same chapter (chapter 0 already at 0.75: the gate is the swap) |
| 1440 × 900, `next start` | same, normal and reduced | every value within 1px, same chapter |
| 1200 × 900 | same | pinned state within 1px and same chapter everywhere; during the fold, vertical positions differ by up to 68px (04's copy block is unscaled, the prototype scales everything; 04's decision) and the prototype overflows 240px horizontally, the build 0 |
| 390 × 844 and 390 × 664 | same, from the stick point | window, photo and stage sit 38px lower (header 96 vs 58) and the stage is 9px taller (04's panes); horizontal overflow 0 in both. Chapters fire by the same rule, marker top above 70% of the viewport, so relative to the stick point they come 47px later (38 + 9); same chapter elsewhere |

**Scroll input** (Playwright mouse wheel in Chrome, not hardware): 100px steps (wheel) and 4px steps (trackpad-like) at 1440 and 390. Chapters advance in order (1440: -1, 0 at 840 to 900, 1 at 1360 to 1400, 2 at 2080 to 2100), the page ends where the deltas put it (no snap), and scrolling back up returns to -1 at 0. A real trackpad and a real wheel on a Mac were not available to me: open for a person.

**Off-screen.** Style writes inside the section, counted with a MutationObserver: 462 in 2s with the hero on screen; still running with the section's bottom 50px above the viewport (inside the 100px margin); 0 in 2s once it is 400px past; writing again when scrolled back, chapter unchanged. Same at 390.

**Short phone.** At 390 × 664 the stuck phone stage runs from 96 to 695px, 31px past the bottom of the viewport; the caption text of chapters 1 and 2 ends at 667px, so its last line loses 3px. At 360 × 640 it ends at 685 to 689px (45 to 49px cut). 390 × 844 fits (text ends at 667). Fixing it changes the look (the stage's 150px top space, the caption's size, or where it sticks), so it is handed to the design lane.

**Short phone, fixed (design lane, 2026-10-15).** Two causes, not one. (1) The stage was 599px, so it needed a 695px viewport. Below a 700px viewport height (`@media (max-height: 699px)`, in `web/components/hero/phone-stage.tsx`) the top space is 116px (was 150), the gap under the window 8px (was 12) and the caption block 112px (was 136) with a 24px heading and 14px body (were 26 and 15); the window and its panes are unchanged. Stage 537px; at 390 x 664 it ends at 633px, caption text at 601px; at 360 x 640 it ends at 633px (637px for a moment while the title bar's state label wraps), caption text at 626px. (2) The Interview setting's title "Ana Ribeiro, product designer" wrapped to two lines at 390 and below and made the window, and so the stage, 17.5px taller than the other two settings (616px at 390 x 844 on that tab). The title in `demo-window.tsx` now truncates to one line. At 390 x 844 the only visible change is that title ending in an ellipsis. Open: at 360 the title bar's "Transcribing" and "Writing notes" labels wrap to two lines for a moment (4px); a viewport shorter than about 640px still cuts the caption.

Captures: `docs/redesign/prototypes/d07-1440-y0.png`, `d07-1440-y450.png`, `d07-1440-y1500.png`, `d07-390x664-y0.png`, `d07-390x664-y1100.png` (the cut caption).

Typecheck and build pass. No console errors from the section; the three 404s are the header prefetching pages that do not exist yet (ticket 03's).

**Re-probe after the design fix (logic lane, 2026-10-15).** Stuck at top 96, measured over the three chapters: 390 x 664 stage bottom 633px, caption text 601px; 360 x 640 stage bottom 633 to 637px, caption text 601 to 626px; 390 x 844 unchanged (695px, 667px); horizontal overflow 0 everywhere. The 390 x 664 probe against the prototype now gives the same chapter at every offset (the shorter stage moves the markers up), with the window 4px lower than the prototype's (header 96 vs 58, less the 34px cut from the top space). 1440 re-run: every value within 1px, same chapter. No site code changed in this step.

**Closed, with one item owner-pending:** the test on a real Mac trackpad and a real mouse wheel (Playwright's simulated wheel passed; the coordinator has asked the owner). Also open, from the design fix: the title-bar label wrapping briefly at 360 wide (`tabs.tsx`), and viewports shorter than about 640px (for example a 568px SE-class screen), which still cut the caption.
