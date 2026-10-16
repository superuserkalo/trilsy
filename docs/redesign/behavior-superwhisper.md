# Behavior study: Superwhisper (Phase A, session 01b)

Page: `superwhisper.com`. Measured 2026-10-13 in Chrome through Playwright at 1440x900 and 390x844. Pixel values are for 1440x900 unless a line says otherwise.

Each pattern says where its numbers come from: **log** (the numeric scroll log), **source** (the page's bundled script, minified but with the scroll mappings readable as plain number arrays), **frames** (screenshots), or **probe** (the original and our prototype sampled side by side).

## Tooling

| What | Evidence |
| --- | --- |
| Next.js App Router | `/_next/static/chunks/app/(home)/page-*.js`, `__next_f` |
| Motion (Framer Motion) | `useScroll`, `useTransform`, `useSpring` and `motion.div` calls in the page chunk |
| Tailwind | utility classes in the DOM |
| No GSAP, no Lottie or Rive, no smooth-scroll library | none in globals or script URLs; a wheel-driven video pass stayed within one wheel tick (12px) of scripted scrolling |
| One small canvas | 40x30px in the top-right corner, part of the day and night switch |

REA was not needed.

## 1. The hero becomes a framed stage

Frames: `behavior/superwhisper-1-hero-stage-1440.jpeg` (ten key moments), `behavior/superwhisper-1-hero-390.jpeg`.

The first viewport is a full-bleed sky gradient with a face at the left edge, a laptop at the right edge and the headline in the middle. As you scroll, the headline fades and swells, the face and laptop slide out sideways, and the gradient is clipped down to a rounded window in the middle of a black page. That window is the stage for the demo.

- **Trigger and pinning.** A wrapper 350vh tall (3,150px). Its inner layer is `position: fixed` until the wrapper's bottom meets the bottom of the viewport, then `absolute`. That gives 2,250px of pinned scroll. Progress `p` runs 0 to 1 across those 2,250px. (source, log)
- **Steps.** Each value is a linear map of `p`, then passed through a spring:

| Element | Change | Over p | Over scrollY |
| --- | --- | --- | --- |
| Headline block | opacity 1 to 0 | 0 to 0.15 | 0 to 338 |
| Headline block | scale 1 to 1.2, moves up 15% of the viewport | 0 to 0.2 | 0 to 450 |
| Face (left) and laptop (right) | slide out by their own width, scale 1 to 1.15 | 0 to 0.3 | 0 to 675 |
| Gradient frame | `clip-path` from the full viewport to a 1,024x627 window with an 18px radius | 0 to 0.4 | 0 to 900 |
| Floating nav | appears once `p` passes 0.2 | | 450 |
| "Ready to see how it works?" and the Play button | opacity 0 to 1 | 0.25 to 0.55 | 563 to 1,238 |
| Nothing | the stage holds | 0.55 to 1 | 1,238 to 2,250 |

- **Easing.** Every value follows its target through a spring (stiffness 200, damping 30, mass 0.2), which is overdamped: no overshoot, and it settles in about half a second. The mapping itself is linear; the spring is what makes it feel soft.
- **The clip.** `inset(calc(50% - 313.5px) calc(50% - min(512px, 50vw - 40px)) round 18px)`, with every term multiplied by the 0 to 1 clip value. The window is clipped out of the same gradient the hero was painted on, so nothing is swapped.
- **The long hold.** About 1,000px of scroll does nothing but keep the stage on screen. That is the room the demo needs (pattern 2).
- **Mobile, under 800px.** None of this exists. The wrapper is one viewport tall and static, the floating nav and the day and night switch are not rendered, the side images do not show, and the buttons become store links. The scroll log at 390px shows no scroll-driven change in the first 4,000px.

**Prototype and validation.** `prototypes/hero-to-stage.html`, our own code with flat placeholder panels and a hand-written spring. The same probe was run on both at 32 offsets, 90px apart:

| Probe | Largest difference |
| --- | --- |
| Pinned layer position | 0px |
| Headline opacity, scale and offset | 0 |
| Side panel offset and scale | 0 |
| Clip inset | 1px |
| Instruction opacity | 0 |
| Floating nav shown | same at all 32 |

Frames of the prototype: `behavior/proto-hero-to-stage-1440.jpeg`.

## 2. The demo on the stage

Frames: `behavior/superwhisper-2-demo-1440.jpeg` (twelve frames over 32 seconds after pressing Play).

- **Trigger.** A click on "Play Demo". It did not start by itself in the capture. The page also invites the visitor to pick an app and hold Option and Space to dictate for real. Scroll does nothing once the stage is framed.
- **Steps.** Time-based script. A Notes window opens (0.8s), a recording pill appears at the top (0.5s later), the pill "listens" for as long as the sentence would take to say (38ms per character, at least 750ms), and the text lands in the note. A Slack window opens at about 6s and receives a message; a code editor opens at about 14s. At about 18s the stage blurs and a "Replay Demo" button sits on top. (frames, source)
- **Content.** The windows are HTML mocks of real apps with believable content, and a dock with three app icons sits at the bottom of the stage.
- **Pinning.** Inside pattern 1's pin.
- **Not verified:** the live dictation path (it needs a microphone), and whether the windows can be dragged.

## 3. Floating nav

Frames: the fourth frame onward in `behavior/superwhisper-1-hero-stage-1440.jpeg`.

- **Trigger.** Once `p` in pattern 1 passes 0.2 (scrollY 450). Reverses when you scroll back above it.
- **Steps.** A pill-shaped nav fades in at the top centre and drops 10px into place. It stays for the rest of the page.
- **Timing.** 0.3s, `easeOut`. (source; log shows opacity 0 to 1 and y -10 to 0 between scrollY 420 and 480)
- **Active state.** An IntersectionObserver with a 45% margin top and bottom marks "Pricing" active while the pricing section crosses the middle of the viewport.
- **Mobile.** Not rendered under 800px.

## 4. Keyboard that tilts through the viewport ("Works anywhere you can type")

Frames: `behavior/superwhisper-4-keyboard-1440.jpeg`.

- **Trigger.** Scroll-linked across the section's whole pass through the viewport, from its top entering at the bottom to its bottom leaving at the top. The section is 766px tall, so `p` covers 1,666px. Not pinned.
- **Steps.** A keyboard whose keycaps are app icons rises from below, settles, then leaves upward while tipping the other way:

| p | Vertical offset | Tilt |
| --- | --- | --- |
| 0 | 400px below | -20 degrees |
| 0.5 | in place | -2.4 degrees |
| 0.6 | in place | -2.4 degrees |
| 0.85 | 600px above | 15 degrees |

- **Easing.** Linear between those stops, then a spring (stiffness 300, damping 30, mass 0.5). A dark gradient over the section fades out over the first quarter. (source; the log shows the offset reaching 0 between scrollY 5,280 and 5,640, holding to 5,760, and the tilt moving from -9.2 through -2.4 to 7.3 degrees over the visible part)

## 5. Tutorial carousel that drives its own heading

Frames: `behavior/superwhisper-5-carousel-1440.jpeg` (four frames over 6.5 seconds).

- **Trigger.** Time-based autoplay. Scroll does nothing to it.
- **Steps.** A row of video thumbnails slides one place at a time. The centred card is at full opacity, its neighbours at 0.7 and the rest at 0.5. The section heading is rewritten for each card ("Whip through Slack messages", "Take notes from YouTube", "Write medical notes offline"), and a row of pills under the cards shows the position.
- **Timing.** Slides move in 0.5s. The gap between slides is about 4 seconds, read from the frames; the interval constant was not read, so treat it as **approximate**.

## Smaller things seen and not studied

- Day, dusk and night: the hero's two side images exist in four time-of-day versions stacked on top of each other. The visitor's clock picks one on load and a switch in the top-right corner changes it, with a 1.2s `ease-in-out` opacity cross-fade. Read from the DOM and the source only; no frames were captured, so this is **unverified** as rendered behavior.
- Logo marquee under the stage: a plain CSS loop.
- One block after the keyboard fades up 20px when it enters the viewport and fades back out when it leaves (log, scrollY 5,760 and 6,840).

## What a build needs from this

Facts for whoever builds a Trilsy section on these ideas, not design decisions.

- The hero and the stage are one element with a changing `clip-path`, which is why the transition has no seam.
- Linear maps plus one spring are enough for this whole page. There is no per-element easing curve to tune.
- The stage holds for more than a viewport of scroll so that a time-based demo has somewhere to live.
- The reference gives up the effect entirely on phones. Its first phone viewport shows a gradient and text, with no product in it, which the teardown already lists as something to avoid.
