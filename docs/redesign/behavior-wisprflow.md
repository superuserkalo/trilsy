# Behavior study: Wispr Flow (Phase A, session 01b)

Pages: `wisprflow.ai/notetaker` (the north star) and `wisprflow.ai` (the home page, where the photo scroll effect lives). Measured 2026-10-13 in Chrome through Playwright at 1440x900 and 390x844. All pixel values below are for 1440x900 unless a line says otherwise; lengths given in `vh` scale with the viewport.

How to read the numbers: "offset" is scroll distance from the start of a pin. Each pattern says where its numbers come from: **log** (the numeric scroll log), **source** (the site's own readable script), **frames** (screenshots), or **probe** (the original and our prototype sampled side by side).

## Tooling

| What | Evidence |
| --- | --- |
| Webflow | `data-wf-*` attributes, `w-mod-js` on `<html>`, Webflow chunks |
| GSAP 3.15.0 with ScrollTrigger, SplitText, DrawSVG, MotionPath, ScrollTo | `window.gsap.version`, script URLs on `cdn.prod.website-files.com/gsap/3.15.0/` |
| Hand-written scene scripts, unminified, loaded from jsDelivr | `flow-stack.js` (home photo section), `stack.js` (notetaker pinned section), `notetaker.js` (hero transcript), `languages.js`, `faq.js` |
| Raw WebGL for the photo transition | `canvas.flow-melt-canvas`, `canvas.stack-melt-canvas`; shader source is inline in the scene scripts |
| Lottie | hero toast on the home page, footer icon |
| No smooth-scroll library | no Lenis or Locomotive globals or classes; a wheel-driven video pass stayed within one wheel tick (16px) of scripted scrolling |

REA was not needed: every scene script is readable.

## 1. The photo scroll effect (required pattern), home page

This is the effect with the grainy, washed-out, film-style photographs. It sits on `wisprflow.ai`, 1,291px down, directly after the logo band. The notetaker page reuses the same engine with two photographs (pattern 2).

In one sentence: a photograph in a rounded card grows until it pushes its neighbour off the row, shrinks to a small portrait card, drops out of the dark band onto a cream stage, and then stays put while three chapters play on top of it and the photograph behind them melts into a different one for each chapter.

Frames: `behavior/wisprflow-1-photo-scroll-1440.jpeg` (sixteen key moments), `behavior/wisprflow-1-photo-melt-1440.jpeg` (one photo swap, twelve frames), `behavior/wisprflow-1-photo-scroll-390.jpeg`.

**Trigger and pinning.** The section pins when its top reaches the top of the viewport and stays pinned for 6,012px, which is 6.68 viewport heights (log, and GSAP's own `ScrollTrigger` record: `start 1291`, `end 7303`, `pin: true`). Card and band geometry follow the scroll position directly, with no smoothing. Two things inside the pin run on the clock instead: the photo swap and each chapter's little UI demo.

**What changes at each step** (offsets from the pin start; source for the phase lengths, log and probe for the positions):

| Phase | Offset | Scroll length | What happens |
| --- | --- | --- | --- |
| In | 0 to 225 | 0.25vh | Nothing moves. A beat of stillness after the pin catches. |
| Grow | 225 to 945 | 0.8vh | The photo card widens from 835px to 1,160px and its left edge moves from 465px to 140px, squeezing the "Keyboard 45 wpm" card beside it from 325px to nothing. |
| Hold | 945 to 1,170 | 0.25vh | The photo fills the row. |
| Shrink | 1,170 to 1,800 | 0.7vh | The card narrows to 400x468 and centres (left 520px). Height goes from 501px to 468px, top from 351px to 368px. The "220 wpm" label fades out in 250ms. The waveform pill on the photo starts shrinking from 1.8x and reaches 1x at the end of the travel. |
| Travel | 1,800 to 3,132 | 1.48vh | The dark band and everything in it scroll up and away at page speed. The card does not: it stays on screen, sinks by up to 70px at the midpoint, and over the last 152px rises to sit exactly in the middle of the viewport (top 216px). |
| Chapter 1 | 3,132 to 4,032 | 1.0vh | Card fixed. Tab list appears at the left, copy at the right. Photo 1 (daylight, a figure in a field). |
| Chapter 2 | 4,032 to 4,932 | 1.0vh | Photo melts to photo 2 (night, teal and amber). |
| Chapter 3 | 4,932 to 6,012 | 1.2vh | Photo melts to photo 3 (warm amber interior). The message box rotates out and two more app cards fan in at 45 degrees. |
| Release | 6,012 | | The pin lets go and the whole stage scrolls away with the page. |

The travel length is not a constant in the script. It is whatever scroll the stage needs for the card to arrive centred, so it changes with layout; 1.48vh is the value at 1440x900.

**How the photographs enter, change and leave.**

- **Enter.** There is no entrance animation on the photograph. The card is already in place in the band and arrives with ordinary page scroll. The motion on top of it is a line of dictated text that runs along a curved path across the photo, on a 30-second loop.
- **Change, part one: the frame.** For the first 3,132px the photograph itself never changes. Only its frame does: wide (835px), wider (1,160px), then a 400px portrait. The image is cropped by the card (`object-fit: cover`), so the same photograph is seen at roughly 2.3:1 and then at 0.85:1.
- **Change, part two: the melt.** When the chapter index changes, both `<img>` elements are hidden, a WebGL canvas the size of the card is shown, and a 700ms tween (`power1.inOut`) runs a mix value from 0 to 1. The shader pushes each image sideways by a soft noise field (four-octave value noise, scale 3.0, strength 0.35 of the image width): the outgoing photo is pushed by `noise * t`, the incoming one starts pushed by `noise` and settles as `t` reaches 1, and the two are blended by `t`. On screen the old photo smears horizontally into the new one, which suits photographs that already have motion blur. When the tween ends the canvas hides and the new `<img>` shows. If WebGL or the texture upload fails, the swap is an instant opacity change. The swap is reversible: scrolling back melts back.
- **Leave.** Nothing fades. At offset 6,012 the pin releases and the card scrolls off with the page.

**Easing and timing.**

- Grow is not linear. The side card's width is `28% of the row * (1 - f(t))`, where `f` covers its first and last 15% in the first and last 5% of the phase and is linear between. Once the side card is under 20% of the row it collapses faster (smoothstep), and at 80% of the phase a 340ms timed tween closes whatever is left. Scrolling back under 68% reopens it.
- Shrink is smoothstep.
- Travel: band at page speed; card sink is `70px * sin(pi * t)`.
- Photo melt: 700ms, `power1.inOut`. Tab and copy swap: 220ms fade. Tab indicator: 500ms.
- Each chapter's UI demo (text being typed, cleaned up and pasted) plays once on entry over 9.5s, 6.2s and 6.8s. It is not scrubbed.

**Snap.** Inside the chapter zone only, shortly after scrolling stops (GSAP's default delay, about 100ms), the page glides for 300ms (`power1.inOut`) to the middle of a chapter: the next one if you scrolled down, the previous one if you scrolled up. Resting offsets measured: 3,582, 4,482, 5,472, and 6,012 (the release). So one scroll gesture moves exactly one chapter. Before the chapter zone there is no snap. (log, probe)

**Mobile, under 992px.** A different implementation, not a scaled one. No pin, no snap, no growing card. The two speed cards stack. Each chapter becomes its own photo card in the normal flow, followed by its title and copy, and each plays its UI demo on a timer when it scrolls into view (an IntersectionObserver with a 15% bottom margin; 4.0s, 5.2s and 6.8s per chapter). Whether the melt canvas is ever used on mobile is **unverified**: with one photo per card there is nothing to melt between.

**The photographs as files.** Photo 1 is 2,470x1,150 (it has to cover the 1,160px card); photos 2 and 3 are 800x888 and 400x444, portrait only. They are WebP at 10 to 40KB each, which soft, blurred images allow. The closing call-to-action bands on both pages use one more photograph each as a static background (2,600x1,733, which is 3:2, and 2,880x1,696).

**Prototype and validation.** `prototypes/photo-scroll.html`, our own code with generated placeholder images. The same probe was run on the original and the prototype at 40 offsets, 180px apart, across the whole pin:

| Probe | Largest difference |
| --- | --- |
| Card top | 1px |
| Card left | 1px |
| Card width, card height | 0px |
| Band position | 0px |
| Which photo is showing | same at all 40 |
| Resting scroll position after snap | same at all 40 |

Frames of the prototype: `behavior/proto-photo-scroll-1440.jpeg`.

## 2. Pinned "stack" section, notetaker page

Frames: `behavior/wisprflow-2-stack-1440.jpeg`, `behavior/wisprflow-2-stack-390.jpeg`.

The notetaker's version of the same idea, with a different first act. Chat bubbles scattered around the heading gather into one transcript card; the card then drops onto the cream stage and five chapters play in it.

- **Trigger.** Two triggers. A pre-roll from when the section top is 60% down the viewport (scrollY 652) until it reaches the top, during which the first bubbles pop (source: `PRE_POP`, `POP_HEAD = 3`). Then the pin, from scrollY 1,192 to 7,505: 6,313px, 7.0vh. (log, GSAP record)
- **Steps.** Bubbles pop in row by row, 0.45vh of scroll per row. Each pop is time-based once its threshold is crossed: scale from (0.35, 0.85) to 1 in 0.5s, `back.out(2)`. In each bubble the hard word (a name, a product) gets a light sweep 0.22s later: 350ms in, 1,100ms hold, 600ms out, with a letter wave (each letter lifts 20% of its height and tilts 5 degrees, 45ms apart). Then the rows fly into the card: 0.7s, `power3.inOut`, 0.09s apart; the script holds the scroll until 40% of that has played (source; not measured). Then the band leaves upward and the card settles at top 217px by scrollY 3,600 (the same travel as pattern 1). Then five chapters: 1.0vh each for the first four and 0.35vh for the last.
- **Photographs.** Chapters 3 and 4 put a photograph behind the card content (a blue and amber night scene, then a warm blurred one, both 800x888), swapped with the same 700ms melt. The first appears at scrollY 5,360 to 5,440. (log)
- **Background line.** A long curved line behind the stage draws one segment per chapter: 900ms in, 400ms out, `power2.inOut`, timed, not scrubbed.
- **Snap.** None on this page (`SNAP = false`).
- **Mobile, under 992px.** No pin (GSAP registers none at 390px); chapters stack and play in view.

## 3. Hero transcript and task deck, notetaker page

Frames: `behavior/wisprflow-3-hero-transcript-1440.jpeg` (eight frames over 11 seconds).

- **Trigger.** Time-based, starts on load, loops. Scroll does nothing to it.
- **Steps.** Up to five transcript lines are visible, each with a coloured speaker chip. A new line types in letter by letter; older lines slide up and fade by age (opacity 1.0, 0.5, 0.32, 0.18, 0.08). When a line contains a commitment, a task card is thrown from the transcript to a deck on the right, where up to three cards stack.
- **Timing.** 28ms per letter; each letter rises 8px and fades in over 260ms, `cubic-bezier(0.22, 1, 0.36, 1)`. At least 1,100ms between lines and a 400ms pause after a line finishes. Lines glide up in 0.6s, `cubic-bezier(0.16, 1, 0.3, 1)`. The card travels 780ms from 140px to the left, growing from 0.72 to 1, with an overshoot pop (420ms, `cubic-bezier(0.34, 1.56, 0.64, 1)`); the name pill follows 90ms later. Deck cards sit 14px apart, each 4.5% smaller, at a random tilt of up to 3 degrees. (source)
- **Pinning.** None.
- **Narrow layout.** At 1,150px and below the deck sits under the transcript and cards arrive from above.

## 4. Testimonial cards on an arc, both pages

Frames: `behavior/wisprflow-4-testimonials-1440.jpeg`.

- **Trigger and pinning.** A wrapper 2,593px tall (notetaker; 3,476px on the home page) holds a `position: sticky` stage one viewport high. Pinned from scrollY 10,513 to 13,106 on the notetaker page.
- **Steps.** Scroll drives one number, which positions every card along an arc from lower left to upper right. One card is centred and upright at a time; its neighbours are rotated and partly off screen.
- **Easing and timing.** Scroll-linked through GSAP with `scrub: 1.5`, so the cards take about 1.5s to catch up with the scroll. On mobile the stage still pins (scrollY 7,910 to 9,240 at 390px) with `scrub: true`, so there is no lag. The wrapper's height is set by script to stage height plus 85% of the travel. (source, GSAP record)

## 5. Corners that round as a band meets the viewport edge, both pages

Frames: the first and ninth frames of `behavior/wisprflow-1-photo-scroll-1440.jpeg`.

- **Trigger.** Scroll-linked, continuous, on every full-width coloured band.
- **Steps.** Each frame, a band's top corner radius is set to its distance below the top of the viewport, and its bottom radius to its distance above the bottom, both clamped between 0 and 80px. A band that fills the screen has square corners; as its edge comes into view the corners round.
- **Easing.** Eased toward the target by 16% per frame. (source)
- **Pinning.** None.

## Smaller things seen and not studied

- Buttons: on hover each letter of the label lifts 20% and tilts 5 degrees in a wave, 0.06s apart (hover-capable devices only).
- Home page heading underline: an SVG stroke drawn with scroll from when it enters the viewport until it is 30% from the top.
- FAQ: a two-pane list (questions left, answer right), from `faq.js`. Not measured.

## What a build needs from this

Facts for whoever builds the Trilsy version, not design decisions.

- The effect needs one photograph that survives two crops (about 2.3:1 and 0.85:1) and one more portrait photograph per extra chapter. Subjects should sit where both crops keep them.
- `position: sticky` in a tall wrapper reproduces the pin; the prototype does it without GSAP.
- The melt is a small fragment shader. On our site that shader goes through vgpu (Phase C), with the instant swap as its fallback and under `prefers-reduced-motion`.
- Mobile is a separate, simpler layout, and the reference accepts that.
- The snap is what makes the chapter zone feel deliberate. It is also the part most likely to annoy, so it should be tested on a trackpad and a wheel before it is kept.
