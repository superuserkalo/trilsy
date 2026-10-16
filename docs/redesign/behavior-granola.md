# Behavior study: Granola (extra study, 2026-10-15)

Page: `www.granola.ai`, the home page and its whole scroll journey. Granola became the north star on 2026-10-15 (owner: "I think granola should be a our new northstar honestly and also we should inspect the scorllign journey"); Superwhisper and Wispr Flow stay as secondary references. Measured 2026-10-15 in Chrome through Playwright at 1440x900 and 390x844 (the 390 pass with an iPhone user agent). Values are for 1440x900 unless a line says otherwise; lengths in `vh` scale with the viewport.

Where numbers come from: **log** (the numeric scroll log, 70px steps at 1440 and 60px at 390, early and settled samples, plus a pass back up), **source** (Granola's own CSS and its page script, read in the browser's copy), **clock** (DOM values sampled every 40ms on the clock), **frames** (screenshots), **probe** (the original and our prototype sampled at the same offsets). Source was read for understanding only; nothing was copied into the prototype or the site.

## Tooling

| What | Evidence |
| --- | --- |
| Next.js App Router on Vercel | `_next/static/chunks/app/(main)/page-*.js`, `/_vercel/insights` |
| **CSS scroll-driven animations** for every scroll-linked change | `animation-timeline: scroll(root)` and `view()`, named view timelines with `timeline-scope`; 12 scroll-timeline animations at 1440 and 9 at 390 (`document.getAnimations()`) |
| GSAP (core only, no ScrollTrigger) | clock timelines in the hero demo and the ticker behind the footer pull; `window.ScrollTrigger` absent |
| Motion (Framer Motion) | `useSpring` for the footer pull, `useInView` to pause the hero demo |
| IntersectionObserver | active step in "how it works", pausing the marquee |
| Rive runtime | in the bundle; what it draws on this page was not traced (**unverified**). The two `<canvas>` elements in the call thumbnails were not traced either. |
| No smooth-scroll library | no Lenis or Locomotive globals or classes; scripted `scrollTo` and wheel input land on the same positions |

REA was not needed: the CSS is readable as shipped and the page script, though minified, is short enough to follow.

## The scroll journey, top to bottom

The page is 14,310px tall at 1440 (12,192px at 390). Only four stretches move with scroll. Everything else is ordinary page scroll, with small demos playing on the clock.

| scrollY at 1440 | Section | How it moves |
| --- | --- | --- |
| 0 | Header | Transparent bar; becomes a white pill with a hairline border and soft shadow as soon as scrollY > 0 (300ms, ease-out). Back to transparent at 0. (source, log) |
| 0 to 900 | Hero into "Effortless notes" | **Pattern 1.** The note window collapses from hero size into its pinned place, scroll-linked. Its demo (pattern 2) plays on the clock throughout. |
| 0 to 852 | same | The window's stage is pinned (sticky, top 48px). The hero text and then the second heading scroll past it on the left. |
| about 1,455 to 1,925 | "For the doers" over the logo band | **Pattern 3.** Scroll-linked: the big headline sinks behind the dark logo band. |
| 1,800 to 2,509 | Logo band | Static grid of twelve customer logos on a dark band. |
| 2,940 to 5,110 | How it works | **Pattern 4.** Left rail pinned (sticky, top 96px); three progress bars fill with scroll; step demos start at the viewport's centre line. |
| 5,425 | Chat band (green) | A typing demo on the clock. Not studied. |
| 6,007 | Testimonials | A horizontal carousel with CSS scroll snap (`snap-x snap-mandatory`). Not studied. |
| 6,855 to 11,518 | Features | No scroll-linked change in the log. |
| 11,518 | MCP connectors | **Pattern 5.** A marquee that drifts on the clock, magnifies the tile in the middle and can be dragged. |
| 12,669 | Pricing teaser | Static. |
| 13,410 (bottom) | Footer | **Pattern 6.** Scrolling past the end lifts the page on a spring and shows a photo flipbook behind it. |

Two things hold across the page. Scroll decides position and framing; anything that looks like the product working runs on the clock (the hero demo, the step demos, the chat typing). And there is no snap and no scroll hijacking in the vertical journey; the only snap is inside the horizontal testimonial carousel.

Frames: `behavior/granola-1-collapse-1440.jpeg`, `granola-1-collapse-390.jpeg`, `granola-2-note-demo-1440.jpeg`, `granola-3-doers-1440.jpeg`, `granola-3-doers-390.jpeg`, `granola-4-steps-1440.jpeg`, `granola-5-connectors-1440.jpeg`, `granola-6-footer-pull-1440.jpeg`.

## 1. The hero collapses into a pinned window (the core of the journey)

In one sentence: the note window starts large and pushed up and to the right, with three tilted photo cards fanned out behind it; over the first screen of scrolling the window shrinks into its place in the right column, the cards slide into it and shrink, then fade; the window stays pinned while the second heading scrolls up beside it, and then the whole stage leaves with the page.

**Trigger and pinning.** Root scroll timeline (`animation-timeline: scroll(root)`), so progress is page scrollY over a fixed range, starting at the top of the page. The stage is a `position: sticky` section (top 48px, one viewport tall) laid in the same grid cell as the hero and second section, inside a wrapper two viewports tall (1,800px). It pins from 0 to 852px (wrapper height 1,800 minus stage 900 minus top 48) and is released at 852 (log: pinned 0 to 840 at 48, top -10 at 910). (source, log)

**What changes, at 1440** (scrollY; source for the ranges and keyframes, log and probe for the values):

| Element | Range | From | To | Easing |
| --- | --- | --- | --- | --- |
| Window | 0 to 900 (100vh) | translate(25% of its width, -6vh) scale(1.2): 461x691 at left 886, top 118 | none: 384x576 at left 828, top 230 | linear |
| Card 1 (wide) | 0 to 450 (0 to 50vh) | translate(24%, -6%) scale(1) | translate(0) scale(0.75) | cubic-bezier(.7, 0, .84, 0) |
| Card 2 (tall) | 54 to 504 (6 to 56vh) | translate(23%, 21%) scale(1) | translate(0) scale(0.75) | same |
| Card 3 (tall) | 108 to 558 (12 to 62vh) | translate(-35%, 10%) scale(1) | translate(0) scale(0.75) | same |
| All three cards | 540 to 720 (60 to 80vh) | opacity 1 | opacity 0 | linear |
| Call thumbnails | 0 to 1,080 (120vh) | translateY(12%) | translateY(-45%) | linear |
| Stage | 0 to 852 | pinned at top 48 | released | |

Translate percentages are of each element's own size. The cards sit inside the window's box, so they also ride its scale. The window's 25% horizontal offset applies only at 1440px and wider; from 1024 to 1439 it is `translateY(-6vh) scale(1.2)` only.

The card easing is a steep ease-in: almost nothing happens for the first third of each range (card 1 has moved 5 of its 106px by scrollY 250) and most of the travel lands in the last quarter. The cards seem to hang, then get pulled into the window. The window itself is linear and finishes at 100vh, just after the pin length (852) is reached, so the shrink ends as the stage starts to leave.

**Narrow screens, under 1024px** (390 log and source): the same idea at a smaller scale. The window sits under the hero text, full column width (358x537). It scales from 1 to 0.8 over 0 to 844 (100vh) with no offset. The cards start from translate(45%, 8%), (40%, 10%) and (-45%, 8%) and shrink to scale 0.2, same ranges and easing, then fade 60 to 80vh. The stage is sticky at top 96px and pins from 551 to 1,023 (472px) in the mobile user agent. The second heading comes after the pinned window instead of beside it.

**Reduced motion and fallback.** The scroll-driven CSS has no `prefers-reduced-motion` rule, so the collapse plays for everyone (source). Where `animation-timeline` is unsupported, an `@supports not` block puts the cards at their start offsets and fades them out (500ms opacity transition) once the page is scrolled (`main.scrolled`); the window does not animate.

**Prototype and validation.** `prototypes/sticky-collapse.html`: our own code with placeholder shapes and text, values computed from scrollY each frame (the way Motion's `useScroll` and `useTransform` would on our site) instead of CSS scroll timelines; a reduced-motion still state that Granola lacks. The same probe was run on the original and on the prototype across the first 1,100 to 1,300px:

| Probe | 1440, 29 offsets 50px apart | 390, 33 offsets 50px apart |
| --- | --- | --- |
| Window scale, x and y offset, left | 0px / 0 | 0 |
| Window top (pinning and release) | 0px | 0px from the pin on; 60px before it (see below) |
| Card translate, scale, opacity (all three) | 1px at most | 1px at most |
| Call thumbnails translateY | 1px | 1px |
| Stage top (pin start, release) | 0px | 0px from the pin on |

Before the pin at 390 the original's stage sits 60px higher. That is the height of Granola's hero copy, which changes with the user agent (the probe runs without a phone user agent, so Granola shows one fewer button row and the window starts at 587 instead of 647); pin top, release point, scale and every card value match. Frames of the prototype: `behavior/proto-sticky-collapse-1440.jpeg`, `proto-sticky-collapse-390.jpeg`.

## 2. The note demo inside the window (clock)

Frames: `behavior/granola-2-note-demo-1440.jpeg` (18 frames, 500ms apart).

**Trigger.** Time-based, one GSAP timeline on an endless repeat. It plays only while the window is within 100px of the viewport (Motion `useInView`, `margin: "100px"`) and pauses otherwise. Scroll never scrubs it. There is no reduced-motion branch in the component (source).

**Steps** (one loop, about 8.2s; source for the tweens, clock for the times):

| t (s) | What happens | Duration, easing |
| --- | --- | --- |
| 0 | Reset: three rough lines shown, enhanced notes hidden. A "Transcribing" pill with three bouncing bars pops in. | 0.45s, `back.out(2.6)`; bars are CSS loops, 0.5 to 0.92s, alternate |
| 0.3 to 1.8 | The fourth rough line types in, 26 characters a second, with a blinking caret. | linear |
| 2.2 | Transcribing pill out; "Generate notes" button pops in, is pressed (scale 0.96, then back) and drops away (down 28px, scale 0.85, fade). | out 0.25s `power2.in`; in 0.38s `back.out(2.2)`; press 0.1s + 0.12s; drop 0.35s `power2.in` |
| 3.43 to 6.53 | "Enhancing notes" row with a spinner appears and travels down the window. Above it the enhanced notes are revealed by a bottom clip that follows the row; each line plays a colour sweep as the edge passes it. In the second half the notes scroll inside the window so the edge stays in view. | 3.1s, `power1.in` (starts slow, speeds up) |
| 6.53 | The row moves to where the "My notes / Enhanced" toggle sits and fades as the toggle pops in with Enhanced selected. | move 0.5s `power2.out`; fade 0.22s; toggle 0.4s `back.out(1.8)` |
| 7.8 | The toggle's highlight slides to "My notes" and the rough lines return, which is the loop's first frame, so the seam does not show. | 0.28s, `power3.inOut` |

Clock check: the typed line took 1.46s for 39 characters; the clip reveal ran 6,888 to about 9,990ms in the sample (3.1s); the toggle slide took about 270ms.

## 3. "For the doers" sinks behind the logo band

Frames: `behavior/granola-3-doers-1440.jpeg`, `granola-3-doers-390.jpeg`.

**Trigger.** A named view timeline on a 1px line across the middle of the headline (`view-timeline-name: --doers-under` on `.doers-trigger`), range `cover 50%`, which runs from when that line crosses the viewport's centre to when it leaves the top. Scroll-linked, linear. (source)

**What changes.** The headline (160px Quadrant serif, one line, `min(12vw, 160px)`) moves from translateY(0) to translateY(130%), 208px, over 450px of scroll. Against the page it slows to about half speed (log: 70px per step before and after, about 38px per step inside the range, 1,455 to 1,925). The dark logo band below it has a higher z-index and moves at full speed, so the band slides up over the headline and covers it from the bottom. Nothing fades.

**The band itself.** "Trusted by teams we admire" over two rows of six logos on near-black, with small plus marks at the grid crossings and a 20px strip of photograph on the band's right edge at desktop. Static: no marquee, no hover motion in the log.

**390.** Same CSS; the headline is 47px tall, so it moves 61px over 422px of scroll (about 51px per 60px step inside the range). Barely noticeable on a phone.

## 4. How it works: a pinned step rail with scroll-filled bars

Frames: `behavior/granola-4-steps-1440.jpeg`.

**Trigger and pinning.** Two columns. The left rail (three step names, each with a 174px underline) is sticky at top 96px and pinned from 2,940 to 5,110. The right column scrolls normally: three blocks (heading, line, a demo window), 96px apart. (log, source)

**Two mechanisms, one for each job.**

- **Progress is scroll-linked.** Each block is a named view timeline. Its bar fills with `scaleX(0 to 1)`, linear, over the range `cover 50vh` to `cover calc(100% - 50vh)`: from when the block's top crosses the viewport centre to when its bottom does. Measured fills: 2,560 to 3,300, 3,400 to 4,140, 4,240 to 4,980 (about 740px each, 0.24px of bar per px of scroll).
- **The active step is triggered.** An IntersectionObserver with `rootMargin: -50% 0px -50% 0px` (a zero-height line at the viewport centre) sets the active index when a block crosses it. The active name turns dark (500ms colour transition). A passed step's bar swaps to a 500ms `scaleX(1 to 0)` wipe from the right, so only the current bar shows. Each block's demo plays when its step becomes active.
- **Click to jump.** Clicking a step name smooth-scrolls its block to the centre and ignores the observer for 900ms so the highlight does not flicker through the steps in between.

Without scroll-timeline support the bars are hidden; the rest works.

**390.** A separate layout: no rail and no pin. Steps stack, each with its demo, and each demo starts when its block crosses the same centre line.

## 5. The connectors marquee: clock drift, magnified centre, draggable

Frames: `behavior/granola-5-connectors-1440.jpeg`.

**Trigger.** Time-based. A horizontally scrollable row of square tiles (154px at desktop, 112px on phones), five copies of the list for an endless loop, wider than the viewport (130vw, offset -15vw). (source)

**Steps.** Every frame, while the row is on screen (IntersectionObserver), the script advances `scrollLeft` by 30px a second (measured: 49 to 139 in 3s). Each tile's scale is `0.59 + 0.41 * cos(d * pi / 2)`, where `d` is its distance from the viewport's centre divided by half the viewport width, capped at 1, so the middle tile is full size and the edges are at 0.59 (measured: 0.59 at the edges, 0.998 at the centre). Tiles are shifted so the gaps stay even as they scale. The row is a real scroll container: drag or trackpad scrolling takes over, and the drift resumes from wherever the user left it.

**Reduced motion.** No drift and no scaling; the row is a plain scrollable list. (source)

## 6. The footer pull: overscroll lifts the page over a photo flipbook

Frames: `behavior/granola-6-footer-pull-1440.jpeg` (pulled state).

**Trigger.** Only at the very bottom (an observer on a 1px line after the footer). Further wheel or touch scrolling down, which would normally do nothing, is collected instead. (source)

**Steps.**

- The whole page (one wrapper, `min-h-svh`) is moved up by `260 * (1 - e^(-pulled / 500))` px, where `pulled` is the scroll distance collected. It approaches 260px and never passes it (measured: 22, 55, 91, 123 px over the first four 100px wheel ticks, 257px after 24).
- Behind it, a fixed 260px panel at the bottom of the viewport shows six photographs, swapped every 150ms while the page is lifted: a flipbook, not a cross-fade.
- About 140ms after the last wheel event (or on touch end) the pull resets and the page drops back on a Motion spring (stiffness 260, damping 24, mass 0.9): measured from 258px to 0 in about 220ms, a 5px overshoot, settled by about 500ms. The flipbook stops on whatever frame it reached.

**Reduced motion.** No pull; the panel shows its first photograph. (source)

## Smaller things seen and not studied

- Chat band: a question types into a chat box on the clock.
- Testimonials: horizontal scroll-snap carousel.
- Footer wordmark: very large, full width, static.

## What a build needs from this

Facts for whoever builds a Trilsy section from this study. Not design decisions.

- `position: sticky` in a tall wrapper reproduces every pin on the page. No scroll library, no ScrollTrigger.
- Granola's scroll-linked motion is CSS scroll-driven animation. Motion's `useScroll` and `useTransform` reproduce the same curves to the pixel (the prototype does it with plain scrollY). Granola ships an `@supports not` fallback, so it treats scroll timelines as not universal; check browser support before choosing them over Motion.
- Granola's collapse ignores `prefers-reduced-motion`. Ours must not: Trilsy's rule is a still final state.
- Ranges are in `vh` from the top of the page, so the effect keeps its proportions on any screen height. The pin length (wrapper height minus one viewport) is what decides how long the reader sits with the pinned object.
- The cards' steep ease-in (`cubic-bezier(.7, 0, .84, 0)`) is what makes them look pulled in rather than slid. Trilsy has one easing token, so an ease-in like this would need the owner's approval.
- Thresholds that change state use the viewport's centre line (IntersectionObserver, `rootMargin: -50% 0px -50% 0px`), never snap.
- Phones get a different layout where the desktop one depends on width (the step rail); where the idea survives, it keeps the same ranges at a smaller scale (the collapse).

## Notes on the approved Trilsy home page

Notes for the sessions that build these sections, not decisions. Every design choice stays with the owner, and the owner has said not to copy any reference 1:1 (2026-10-13).

- **Hero (ticket 04).** Granola's hero window does not end with the hero: it carries into the next screen and is pinned beside the second heading. Trilsy's approved order puts the trust band right after the hero and the pinned story after it, so carrying the hero window down the page would change the approved structure; that is the owner's call. What carries over without changing anything: the demo plays on a clock and pauses off-screen (ticket 04 already asks for this; Granola uses a 100px margin), and the loop ends on its own first frame so the repeat has no visible seam. Granola uses short overshooting pops (`back.out`, 180 to 450ms); Trilsy's rule is one easing token at 400 to 600ms.
- **Trust band (ticket 05).** Granola's logo band is a static grid of customers. Trilsy's is a marquee of apps (not customers) under a line that is true of every one, so only the mechanics compare: Granola's connectors marquee (pattern 5) pauses off-screen, can be dragged, and stops under reduced motion, which matches ticket 05's static row. The magnified centre tile is an extra, not in the ticket. The "For the doers" slide-under (pattern 3) is a scroll-linked way into a band; Trilsy has no headline above its band, and the hero rule forbids anything above the H1, not below it.
- **Pinned story (tickets 06 and 07).** Granola confirms ticket 07's approach: sticky stage in a tall wrapper, no library, no snap, the product demo on a clock inside a scroll-decided stage. Two mechanisms may be useful there: a chapter progress bar filled by scroll (pattern 4) next to a chapter change triggered at the viewport's centre line, and on phones dropping the pin for stacked cards that each start at that line, which is already ticket 07's phone plan. Granola's pinned section has no photographs; Trilsy's photograph swap remains ticket 07's Motion cross-fade.
- **Closing band (ticket 09).** Granola ends without a closing photograph band; its photographs appear only in the footer pull (pattern 6), as a hidden reward behind the page. Trilsy's closing band is a static photograph and the approved spec stays as it is. A pull like Granola's would need several owner-made photographs and is invisible to anyone who never scrolls past the end, so it could only ever be an extra.

## Unverified

- What the Rive runtime draws on the home page, and what draws the two canvases in the call thumbnails.
- The chat band and testimonial carousel timings (not studied).
