# 04: Hero and pinned story (one section)

Status: resolved
Lane: design
Model: opus
Blocked by: 02

**Section:** home, the first section: the hero and the pinned story (record, transcribe, notes) as one section. Owner-approved on 2026-10-15 as hero option 1, "the room folds into the window" ("I agree with number one. Um, fix what's still rough.", then, after the fixed prototype, "I approve and build."). Opus won the B5 bake-off (owner picked A, "the smoothness of A"), so this ticket runs on Opus with no Effort line. It absorbs the old ticket 06 (pinned story composition); ticket 07 wires its scroll.

**What the section does:** the hero looks as approved at Gate B. As you scroll, the people shrink into portrait tiles on the window's left edge, the window shrinks and pins in the right column, the story photograph comes out from behind it, and the three story chapters scroll beside it, each setting which step the window plays on the clock. Under the story, one quiet line. Then the page goes on to the trust band (ticket 05), which now sits after this section.

**Source of truth:** `docs/redesign/prototypes/d4-hero-combo.html?v=1` (serve with `python3 -m http.server -d docs/redesign/prototypes 4173`), stills `docs/redesign/prototypes/d4-hero-combo/approved-1-desktop-1440.png`, `approved-1-phone-390.png`, `approved-1-reduced-motion-1440.png` (frames `a1-*`, `a2-*`, `a3-*`). The hero state's look is `prototypes/b2-hero-v10.html`; motion feel is bake-off A. The prototype's preview tag and its "Section order" list are not site content.

**Split with ticket 07.** This ticket builds everything that is seen: both layouts, the fold as a function of a progress value, the chapter states, the clock demo, the phone stage and the reduced-motion states. Ticket 07 (logic) turns scroll into that progress value and the active chapter, and builds the sticky track. The interface between them:

- `progress`: a Motion `MotionValue<number>` from 0 (hero) to 1 (pinned), so scroll can drive it without a React render per frame. The fold is a pure mapping from it.
- `scrollY`: a `MotionValue<number>`, for the parts that leave with the page (the field band, the bubbles, the figures until they fold).
- `chapter`: plain state, -1 (hero) or 0, 1, 2.
- Reduced motion: a `layout` state, hero or pinned, swapped by the cross-fade below.

Until 07 lands, the home page renders the section at progress 0 with the chapter blocks in normal flow, and a dev-only check on `app/scratch` (404 in production, as now) has a progress slider and a chapter picker, so every state can be reviewed.

**Hero state (progress 0):**

- H1 "Be in the conversation. Trilsy writes the notes." with the chisel-band marker behind the whole second sentence: fixed SVG on a `::before` at final geometry, revealed left to right with `clip-path`, 600ms per line on `--ease-trilsy`, line after line when it wraps, starting 300ms after first paint, static under reduced motion, ink text on mustard. Source SVG and fix notes in `01-concept.md` ("B4 marker, fix to version A").
- Subhead option 1 and one button, View on GitHub, with the helper line. Nothing above the H1.
- The window: title per setting, Lecture / Meeting / Interview tabs inside the window (Lecture first), Microphone and System chips, no checkbox glyphs, notes as plain Markdown sections. Before Stop the panes carry the two in-window lines "The transcript appears when you stop." and "Notes follow the transcript." (owner-confirmed).
- Characters waist-up, one scale, cropped along the floor line, beside the window on the pale blue field band, bubbles above speakers with role chips, no arrows. Slow idle loops on each figure (off under reduced motion). The Lecture scene has no board sketch (the Mitosis sketch is dropped, owner-confirmed). Meeting: Marcus on the left in mustard (Microphone), Priya on the right (System), as in round 9 (owner-confirmed).
- The storyboard (`01-concept.md`, B5, as amended by B8, timings in the prototype's `render(t)`): Recording, then Stop, then Transcribing, then the transcript lines uncovered at machine pace, 180ms apart (owner-confirmed), then a travelling "Writing notes" row uncovers the notes with a mustard pass. Waveform driven by the speech (a level per typed character, dipping at spaces and full stops) but continuous and eased, like real audio. Timer in compressed time 00:00 to 00:21 to match the stamp. No empty bubble left during the hold. Bubble chip and transcript chip share one colour. Each setting plays about 15s, then the next, with a 600ms cross-fade at the seam; a tab click stops the cycle on that choice; pauses off-screen (100px margin) and resumes in place.

**The fold (progress 0 to 1), desktop.** Everything is drawn on a 1440 by 900 stage scaled by `min(1, viewport width / 1440)`; the numbers are stage coordinates from the prototype.

- Window: from left 430, top 414, width 580 to left 690, top 392, width 560, linear in progress.
- People: each figure eases (`--ease-trilsy`) from its hero place into a 72px portrait tile, radius 16, 2px ink border, field fill, the figure at 0.36 scale inside it, stacked on the window's left edge (x = window left − 88, y = window top + 30 + 84 per tile), each starting a little after the one before (offset 0.05 of progress per figure, over 0.85 of progress). Once folded, the speaking person's tile carries a 3px mustard ring.
- Bubbles fade out over the first third of progress. The field band and the bubbles leave with the page (offset by `scrollY`); a figure follows the page until it folds.
- Photograph: a 4:5 frame (452 by 565 at left 880, top 112, 1.5px ink border, radius 18) behind the window's top right, coming out from behind it over progress 0.35 to 1, linear (from 180px left, 160px down, scale 0.8, transparent, to its place).

**Pinned state and chapters (progress 1):**

- Three chapter blocks in the left column (120px in, 440px wide, each 80vh tall), heading and body from copy deck section 4. The active block is at full opacity, the others at 25%, changing over 400ms on `--ease-trilsy`.
- Chapter sets the clock: Record loops the recording beat (Recording to just before Stop); Transcribe plays Stop, Transcribing and the lines, then holds; Notes plays Writing notes and holds the finished notes. Each restarts when its chapter becomes active. The hero cycle does not advance while a chapter is active.
- Changing chapter swaps the photograph by a Motion cross-fade, 600ms on `--ease-trilsy`, inside the fixed 4:5 frame. No shader (Gate C).
- Under the story, one quiet line: "Your recordings stay on your Mac." Then the section ends.

**Phone (prototype breakpoint 700px; pick the matching Tailwind breakpoint and say which):** the hero copy scrolls normally above a pinned stage (sticky under the header, 58px from the top in the prototype): the people as 44px tiles in a row at the top left, the 4:5 photo (180 by 225) behind the window's top right, the window full width with a single pane (notes replace the transcript when Writing notes starts), and a chapter caption under the window that cross-fades per chapter in 400ms. The speech bubble shows only in the hero state, beside the tiles. The scrolling chapter blocks are invisible markers, so no text passes under the window.

**Reduced motion:** no travel or scale anywhere. The window scrolls with the page until the threshold; then the hero layout and the pinned layout swap by an opacity cross-fade, 200ms out and 200ms in, on `--ease-trilsy` (owner-confirmed). Each chapter shows its final frame (Record at 00:20, Transcribe with all three lines, Notes complete). The idle loops, the marker draw, the photo cross-fade (instant swap) and the marquee are off; tabs switch instantly.

**Also:**

- Photo boxes at exact final dimensions marked `TODO: image`, so nothing shifts when files arrive. Photo alt text from copy deck section 4.
- Check the marker's SVG filter in Safari and Firefox; if no person is available, record it as open.
- Mobbin: done for this ticket. The four references (Granola hero and pinned window, Grain, Charma) are in `docs/redesign/refs/hero/` and STATE.md; add three pinned-story references to `docs/redesign/refs/story/` only if the build needs them.

**Characters:** the owner's character pack is the final art (`docs/redesign/refs/characters-owner/`: `svg-pack/optimised/` and `cast-sheet-v2-approved.png`); there are no other characters coming. Role mapping in `01-concept.md` (round 9). The professor (grey-haired woman) is not in the SVG pack (slot 5 is a different person): build her from the pack, using the approved sheet's figure (the cut-out used in v10 and the prototype) or the pack's parts, and do not wait on the owner. Alt text per character from copy deck section 12.

**Approved copy:** `docs/redesign/02-copy-deck.md` section 2 (subhead option 1), section 4 (the three chapters, photo alt text, the quiet line) and section 12 (app states, alt text); the two in-window lines above.
**Behavior spec:** the approved prototype above; hero storyboard in `01-concept.md` B5; bake-off A (`prototypes/bakeoff/a/index.html`) for motion feel; B's waveform idea (`prototypes/bakeoff/b/index.html`) made smooth; `behavior-granola.md` pattern 1 and `animation-granola-hero.md` for craft, not choreography. The owner said not to copy any reference 1:1.

**Images needed from the owner:** `story-record.jpg`, `story-transcribe.jpg`, `story-notes.jpg`, each 4:5, 2400 by 3000 px (1600 by 2000 at least). Requests in `docs/redesign/STATE.md`, "Open image requests". Build against the `TODO: image` boxes.

- [x] Hero state matches the approved stills (and v10) at 1440px and 390px
- [x] Storyboard order Recording, Stop, Transcribing, lines (180ms apart), notes; timer agrees with stamp
- [x] Marker reveals left to right per line, static under reduced motion, no layout shift
- [x] The fold renders correctly at every progress value on the scratch check; tiles, window and photo end where the prototype puts them
- [x] All three chapter states render from one component with a chapter prop; photo cross-fade on chapter change
- [x] Phone pinned stage with tiles, photo, single-pane window and caption at 390px
- [x] Reduced motion: layout swap by cross-fade, final frames per chapter, no travel
- [x] Pauses off-screen
- [x] Headline and button visible without scrolling at 1440 and 390
- [x] Photo boxes at final size, marked TODO: image
- [x] Safari and Firefox checked, or recorded as open
- [x] Typecheck and build pass

## Comments

- 2026-10-15, logic lane: rewritten for the owner-approved merge of the hero and the pinned story (hero option 1). The old ticket built `b2-hero-v10.html` alone; its hero spec is kept above. Ticket 06 is folded in here; ticket 07 is now this section's scroll half.

## Answer

Built 2026-10-15, design lane, Opus 5.5, loop mode, from the approved prototype `docs/redesign/prototypes/d4-hero-combo.html?v=1`.

- `web/components/hero/story.ts`: the content (three settings with the round 9 cast, alt text per figure, the three lines, the notes; the three chapters with photo names, alt text and placeholder tints), the storyboard seconds, the chapter clocks and reduced-motion frames, the speech-driven waveform level, the `--ease-trilsy` curve as a function, and the fold geometry in stage coordinates.
- `story-clock.tsx` (client): `<StoryClock chapter rootRef freezeAt?>` runs one `requestAnimationFrame` clock for the whole section, pauses when the section is more than 100px off screen and resumes in place, cycles Lecture, Meeting, Interview every 15s with a 600ms cross-fade at the seam, stops the cycle on a tab click, runs each chapter's beat from its start, and holds each chapter's final frame under reduced motion. Painters register with `useStoryClock().register` and are called once a frame; React only renders when the setting changes.
- `demo-window.tsx` (client): the window as an illustration, one component for both widths. shadcn `Tabs` (new `window` list variant) for Lecture, Meeting, Interview with the progress underline; `Badge` (new `microphone`, `system`, `off` variants) for the source and transcript chips; `Window` (new `lift` variant, hard ink offset). Recording with the timer (00:00 to 00:21) and 40 waveform bars driven by the line being spoken, Stop pressed, Transcribing with a progress bar, the three lines uncovered 180ms apart, then the notes uncovered behind the travelling "Writing notes" row with a mustard pass per block. The two in-window lines before Stop. On the phone, one pane: the notes replace the transcript when Writing notes starts.
- `fold-stage.tsx` (client): the desktop stage (lg and up). `<FoldStage progress scrollY chapter layout?>`: the 1440 by 900 stage, scaled by CSS (`--stage-s: min(1, tan(atan2(100vw, 1440px)))`), with the hero's vertical offset `--dy` derived from it, so the server render is right at every desktop width before any script runs. `progress` (a `MotionValue`) folds it with transforms only: the window from (430, 414, 580) to (690, 392, 560), the people into 72px tiles at window left minus 88 (0.05 progress apart, eased), bubbles fading over the first third, the field band, bubbles and unfolded figures leaving with `scrollY`, the 4:5 photo coming out from behind the window over 0.35 to 1. The speaking tile carries the mustard ring. Under reduced motion nothing travels: the window scrolls with the page, then the stage fades out (200ms), switches layout and fades in (200ms), at `layout` or at progress 0.5 when `layout` is not passed. The photo's three placeholders cross-fade in 600ms on chapter change (instant under reduced motion).
- `phone-stage.tsx` (client): below lg, 44px tiles with the speaking ring, the bubble beside them in the hero state only (`Badge` chip), the 180 by 225 photo behind the window's top right once a chapter is active, the single-pane window, and a 136px caption under it whose three chapter blocks cross-fade in 400ms.
- `story-chapters.tsx`: `<StoryChapters chapter mode>`; `pinned` gives 80vh blocks in the left column at 25% or full opacity and, on the phone, invisible 70vh scroll markers; `flow` gives plain blocks for the page before ticket 07.
- `marker.tsx` (client): the chisel band (`public/marker-chisel.svg`, extracted from `prototypes/b4-marker-chisel.html`, turbulence filter included) on each line's `::before`, revealed by `clip-path` 600ms per line from 300ms, line after line. Lines are grouped from the words' own positions once the headline's real face has loaded, and regrouped without drawing again after a resize or a late font. Each line span is `whitespace-nowrap`, so `text-balance` cannot break a band in two.
- `hero-copy.tsx` (Server Component): H1, subhead option 1, the View on GitHub button and the helper line; a fixed 308px block on desktop so the scene always starts 404px from the top of the page.
- `hero-section.tsx` (client): the home composition until ticket 07: the copy, the stage at progress 0, the phone stage, the chapters in flow, and "Your recordings stay on your Mac." `app/page.tsx` renders it.
- `hero-check.tsx` and `app/scratch/hero/page.tsx`: the development check (404 in production, noindex): a progress slider, a chapter picker, a storyboard freeze and a reduced-motion layout switch, linkable as `/scratch/hero?p=0.45&c=1&t=10.2&layout=pinned`.
- `app/globals.css`: tokens only: `--font-hand` (bubbles), `--mac-close`, `--mac-minimize`, `--mac-zoom`, `--recording`, and the `idle`, `blink` and `marker` animations in `@theme`. All three stop under reduced motion through the existing base rule.
- `public/characters/`: the eight pack SVGs used and `professor.png` (the approved cast sheet's cut-out, 165 by 505).

**Breakpoint:** `lg` (1024px), not the prototype's 700px. Below 1024 the 1440 stage would be scaled under 0.71 and the window's 13px text would drop to about 9px; the header already switches at `lg`. Between 700 and 1023 the phone stage is used, inside a `max-w-xl` column.

**For ticket 07:** wrap `FoldStage`, `PhoneStage` and `StoryChapters mode="pinned"` in one `StoryClock` inside the sticky track, and feed `progress` (scrollY over 0.95 of the viewport height), `scrollY`, `chapter` and, under reduced motion, `layout`. `FoldStage`'s container must put its top edge at the top of the viewport (header included) and be 100vh tall; `PhoneStage` is the element to make sticky (`top-24` under the 96px header). `--stage-s` is set on the section in `hero-section.tsx` and the check page; set it the same way on the track. `HeroCopy` stays a server child.

Checked in Chrome (dev for the states, `next start` for the final frames): 1440, 1200, 1024, 390 and 360; the hero at several storyboard times; the fold at progress 0, 0.45 and 1 with each chapter; the phone stage with each chapter; a tab click (Interview); reduced motion on home and pinned at 1440 and 390; the reduced-motion swap measured (stage opacity 0.04 at 60ms, the window jumps from the hero to the pinned spot while invisible, opacity 1 by 450ms, no frame where the window moves); off-screen pause measured (timer and waveform held 2s while away, resumed in place); no horizontal overflow at 360, 390, 1024, 1440; no console errors from the section. Firefox 157 (Playwright) at 1440 and 390: renders, no page errors, the marker's turbulence edge drawn. Captures: `docs/redesign/prototypes/d04-home-1440.png`, `d04-home-390.png`, `d04-home-1440-reduced.png`, `d04-home-390-reduced.png`. Typecheck and build pass.

Defaults taken: (1) the breakpoint above. (2) Desktop transcript and notes panes are 264px tall (prototype 252): Figtree through `next/font` wraps the first lecture line, which pushed the third line out of the pinned window. (3) The marker is the chisel band the ticket names; the option-1 prototype stills used the older two-pass marker. (4) The stage's people are plain `<img>` at fixed sizes (SVG art; `next/image` would add nothing).

Open: Safari not checked (Playwright's WebKit does not launch on this macOS); the marker's SVG filter in Safari is the open check, for a person or ticket 18. The professor is the 165 by 505 cut-out, soft on a 2x screen; a vector or larger cut-out from the cast sheet would fix it. Between 1024 and 1439 the stage is scaled by `--stage-s`, so the window text is 9.2 to 13px; the ticket fixed that scale, and ticket 18 should judge it. The header's links prefetch `/pricing`, `/how-it-works` and `/students`, which 404 until their tickets (ticket 03's, not this one). `layout.tsx` metadata still carries the old copy (metadata ticket). Disk on this Mac was near full (345MB free at one point); the build itself is about 145MB in `.next`.

