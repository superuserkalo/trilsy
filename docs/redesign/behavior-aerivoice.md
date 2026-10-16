# Behavior study: Aerivoice (Phase A, session 01b)

Page: `aerivoice.app`. Measured 2026-10-13 in Chrome through Playwright at 1440x900 and 390x844. Pixel values are for 1440x900 unless a line says otherwise.

Each pattern says where its numbers come from: **log** (the numeric scroll log), **source** (the page's own scripts and CSS, which are small and mostly readable), **frames** (screenshots), or **probe** (the original and our prototype sampled side by side).

## Tooling

| What | Evidence |
| --- | --- |
| Astro with React islands, hydrated when visible | `/_astro/*.js`, `astro-island` elements |
| No animation library | no GSAP, Motion, Lenis, Lottie or Rive globals or script URLs |
| Canvas 2D image sequence | `canvas.lid-canvas`, `/sequences/lid/manifest.json` (100 WebP frames) |
| WebGL | hero background (`GradientBlinds` chunk, a fixed full-page canvas) and the hero crystal (`CrystalStage` chunk, 173KB). Which library the crystal uses is **unverified**; the hero was not one of the patterns studied. |
| CSS only | the staged reveals, the tab progress bar, the looping bobs and shines, and one scroll-driven animation (`animation-timeline: scroll(root)`) on the header |
| No smooth-scroll library | a wheel-driven video pass stayed within one wheel tick (12px) of scripted scrolling |

REA was not needed.

One fact from the sequence manifest: its `source` field reads "seedance-2-5 (first/last frame: gemini-3-pro-image keyframes)". The laptop frames are a generated video cut into stills, not a 3D render.

## 1. Pinned, scroll-scrubbed image sequence ("Open your Mac.")

Frames: `behavior/aerivoice-1-sequence-1440.jpeg` (twelve key moments), `behavior/aerivoice-1-sequence-390.jpeg`.

A closed laptop sits at the bottom of the hero. As you scroll it opens, the camera pushes into its screen until the screen fills the viewport, a demo plays there, the camera pulls back and the lid closes.

- **Trigger and pinning.** A track 410svh tall (3,690px) holds a `position: sticky` stage one viewport high. The stage is pinned from scrollY 900 to 3,690: 2,790px. (log, CSS)
- **Progress.** `p = (0.55 * vh - trackTop) / (trackHeight - vh + 0.55 * vh)`, clamped to 0..1. The 0.55 is a pre-roll: progress starts while the stage is still 55% of a viewport below the top (scrollY 405), so the lid is already opening as the section arrives. (source)
- **Steps.** Thresholds on `p`, with the scrollY each one lands on:

| p | scrollY | What happens |
| --- | --- | --- |
| 0 to 0.21 | 405 to 1,095 | Lid opens. Frame index is `round(lid * 99)`, linear. |
| 0.154 to 0.42 | 911 to 1,785 | Camera zooms into the screen (smoothstep). Scale goes from 0.249 to 2.5, interpolated geometrically, so it reads as a steady push. |
| 0.195 to 0.21 | 1,045 to 1,095 | The live HTML screen fades in over the lid (smoothstep). |
| 0.21 to 0.28 | 1,095 to 1,325 | The screen "turns on": its content fades up from black. |
| 0.42 to 0.70 | 1,785 to 2,704 | Demo window. See pattern 2. |
| 0.70 to 0.78 | 2,704 to 2,967 | Camera pulls back. |
| 0.78 to 0.815 | 2,967 to 3,082 | Screen turns off. |
| 0.815 to 1 | 3,082 to 3,690 | Lid closes (the same frames in reverse). |

- **Captions.** Four lines sit in a gradient scrim at the bottom of the stage. "Open your Mac." shows from the start until `p = 0.42`. Changing caption: the old one fades and drops 10px in 0.18s (`ease-in`); the new one fades up in 0.36s (`ease-out`) after a 0.16s delay. After the demo window no caption shows.
- **Easing.** Displayed progress eases toward the scroll position exponentially with a time constant of 0.14s. The draw loop runs only while the value is moving and the stage is near the viewport.
- **How the sequence is drawn.** 100 WebP frames, 1,284x716 on desktop and 960x536 on small screens, drawn to a 2D canvas at up to 2x pixel density. Loading order is first frame, last frame, then every 16th, 8th, 4th and so on, six at a time, so a rough version of the whole motion is available early. A poster image shows until the canvas is live. The HTML screen is placed on the lid with a `matrix3d` built from four corner points in the manifest.
- **Mobile, 600px and below.** Same sequence in a shorter track (353svh; pinned from scrollY 880 to 2,960 at 390x844), the smaller frame set, and a tighter camera that frames the notch and the top of the terminal.
- **Reduced motion.** The track collapses to one viewport, the stage is not sticky, only the last frame (lid open) is loaded, and the stage shows the open, zoomed-in screen as a still. (source)

**Prototype and validation.** `prototypes/sequence-scrub.html`, our own code, drawing 100 steps of a plain shape in place of the rendered frames. The same probe was run on both at 38 offsets, 90px apart:

| Probe | Result |
| --- | --- |
| Stage pinned or not | same at all 38 |
| Screen fade-in and fade-out | same at all 38 |
| Screen content on or off | same at all 38 |
| First caption active | same at all 38 |
| Scroll cue shown | same at all 38 |
| Camera scale | within 0.04 at the 27 offsets outside the demo window. Inside it the original's camera follows the clock, so it is left out. |

Frames of the prototype: `behavior/proto-sequence-scrub-1440.jpeg`.

## 2. A timed demo inside the pinned stage

Frames: the second and third rows of `behavior/aerivoice-1-sequence-1440.jpeg`.

- **Trigger.** Scroll opens and closes a window (`p` from 0.42 to 0.70, 919px of scroll); inside it the demo runs on the clock and loops. Leaving the window by scrolling stops it and hands control back to the scroll.
- **Steps.** A pill grows out of the laptop's notch and shows words arriving one at a time as they are "heard" ("okay so um add a retry with…"), then a cleaning-up state, then the cleaned sentence is pasted into the terminal on screen. Captions 2 to 4 follow the demo's phase, not the scroll. A scroll cue appears at the bottom for the whole window.
- **Camera.** Between phases the camera moves between two framings (the notch, then the terminal). Measured scale 2.5 and 0.86; each move takes 900ms on a cubic in-out curve. (log, source)
- **Pinning.** Inside pattern 1's pin.
- **Why it matters.** The scroll never has to carry the demo's timing. It only decides whether the demo is on stage.

## 3. Pinned orbit ("Pick your providers.")

Frames: `behavior/aerivoice-3-orbit-1440.jpeg`.

- **Trigger and pinning.** A 1,980px track with a sticky stage, pinned from scrollY 5,950 to 7,000: 1,050px. (800px at 390 wide.) (log)
- **Progress.** Two units added together: 0 to 1 while the stage rises into view, then 1 to 2 while it is pinned. (source)
- **Steps.** Nine provider icons sit on an ellipse around the app icon. During the first unit the ring opens from 25% to 100% of its radius (smoothstep) and turns 0.08 of a revolution; during the pin it turns a further 0.32. Icons at the back are smaller and dimmer (scale 0.8 to 1.0, opacity 0.9 to 1.0) and each is turned up to 18 degrees toward the centre. A halo fades in from 0.3 to 0.9 of the first unit and the heading from 0.55 to 0.95.
- **Easing.** The same 0.14s exponential ease as pattern 1. On top of the scroll, each icon bobs on its own CSS loop (3.1s to 3.4s) and a shine sweeps across it every 7s; the centre tile tilts toward the pointer (up to 18 and 12 degrees).
- **Reduced motion.** Progress is fixed at 1.4, so the ring is drawn open and does not follow the scroll. (source)

## 4. Auto-cycling tabs with a before and after ("Make it sound like you.")

Frames: `behavior/aerivoice-4-tabs-1440.jpeg` (eight frames over 10.5 seconds).

- **Trigger.** Starts once, when half of the stage is in view. Time-based after that.
- **Steps.** Four tabs (Faithful, Polished, Compose, Custom). The active tab carries a thin progress bar; when it fills, the next tab activates. Under the tabs, a speech bubble on the left holds the raw words with the filler struck through, a connector with a check sits in the middle, and a window on the right types the result. Changing tab swaps the window (Notes, a terminal, an email) and replays the typing.
- **Timing.** Panels cross-fade in 0.35s. The progress bar is linear. A full tab lasts about 4 seconds, read from the frames; the exact `--cycle` value was not read, so treat it as **approximate**.
- **Interaction.** Hovering pauses the cycle; clicking or using the arrow keys selects a tab and stops the cycling for good. It also pauses while off screen.
- **Pinning.** None.

## 5. Staged reveal on entry

Frames: `behavior/aerivoice-5-reveal-1440.jpeg` (six frames over 800ms).

- **Trigger.** Once per element, when it is 10% above the bottom of the viewport. Never replays.
- **Steps.** Opacity 0 to 1 and a rise of 18px.
- **Easing and timing.** Opacity 0.6s `ease-out`; rise 0.6s `cubic-bezier(0.2, 0.7, 0.2, 1)`. Siblings are staggered 70ms apart through a per-element index.
- **Safety.** The hidden starting state only applies under a `can-reveal` class that the script adds, and the script does not add it under reduced motion. Without JavaScript, or with reduced motion, everything is simply visible. (source)

## 6. Race timers ("Lightning fast.")

Frames: `behavior/aerivoice-6-race-1440.jpeg` (six frames over 1.5 seconds).

- **Trigger.** Once, when the first lane is fully in view.
- **Steps.** Two lanes, one per product. Each has a bar and a seconds counter. Both start at 0 and run to their real figure (0.52s and 0.70s); the bar that finishes first lights up.
- **Timing.** The animation lasts exactly as long as the number it shows, so the slower lane visibly finishes later. Each counter follows a cubic in-out curve. (source)
- **Reduced motion.** The script does not run. What the lanes show in that case was not checked: **unverified**.

## Smaller things seen and not studied

- Header: a dark backdrop fades in behind the header over the first 120px of scroll, done in CSS with `animation-timeline: scroll(root)` and no script.
- Hero background: the WebGL canvas fades out in 0.3s once the hero leaves the viewport, so it never runs behind other sections.

## What a build needs from this

Facts for whoever builds a Trilsy section on these ideas, not design decisions.

- A scrubbed sequence needs a pre-roll, or the first frames are wasted on a stage that is still arriving.
- The cheapest reliable pin is `position: sticky` inside a tall track. Nothing here needs a scroll library.
- Easing the displayed value toward the scroll (0.14s) hides coarse wheel steps without making the page feel detached.
- Splitting the work between scroll (is it on stage, how close is the camera) and the clock (what the product is doing) keeps the demo readable at any scroll speed.
- Every pattern has a still, complete state for reduced motion and for no JavaScript.
