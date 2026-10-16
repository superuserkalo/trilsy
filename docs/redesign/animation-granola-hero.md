# Animation study: Granola's hero, the call and the notes (2026-10-15)

Page: `www.granola.ai`, the hero window ("Q3 GTM sync") and the call panel beside it. Measured on 2026-10-15 in headless Chrome through Playwright, at 1440x900 and 390x844 (iPhone user agent), using the `animation-behavior-study` skill (`timeline.mjs`, `storyboard.mjs`, `compare.mjs`). The owner asked for the main flow: the meeting with two people talking, and what the AI does with it. The scroll collapse around the same window is in `behavior-granola.md` pattern 1 and is not repeated here. This study replaces that file's pattern 2 (the 8.2s note demo) with full detail and one correction (see "Corrections to pattern 2").

Where numbers come from: **source** (Granola's shipped page script and CSS, pretty-printed in a scratch folder and read to understand them; nothing copied), **clock** (DOM probes every 50ms on the live page), **clips** (the call video files, probed with ffprobe and viewed frame by frame in scratch; not kept), **frames** (screenshots). Selectors are dated 2026-10-15: root `.sticky-demo-preview`, call panel `.video-thumbs`. Reference sites change.

## The short answer

**The two people do not talk to each other.** Each tile is a separate, silent webcam clip of a Granola employee, 5 or 10 seconds long, looping on its own. They listen, nod, smile, sip a coffee, give a small wave. There are no turns, no active-speaker ring, no waveform on a tile, no captions and no link between what they do and what the notes say. The meeting is ambient: it shows that a call is happening and leaves the rest to the notes. Checked in four of the fifteen clips (two women, two men, all idle). The conversation is implied by the people being present while the notes fill in.

**What the AI does:** nothing until someone presses a button. While the call runs, the person types a rough line into their notes (26 characters a second) under a "Transcribing" pill. Then "Generate notes" pops in, is pressed and drops away, and an "Enhancing notes" row travels down the window. Above the row the finished notes are revealed by an edge that follows it, each line sweeping from colour into ink as the edge passes. The AI never types and never streams words: the whole note is already laid out and is uncovered in 3.1 seconds. The row then turns into a "My notes / Enhanced" toggle, which slides back to "My notes", bringing back the rough lines, which is also the loop's first frame. The loop is 8.18 seconds.

## Stage and loop

| | |
| --- | --- |
| Root | `.sticky-demo-preview` (the window plus the call panel), in the pinned hero stage |
| Plays | at page load, at scrollY 0; on the clock, never scrubbed by scroll |
| Notes loop | **8.18s** (source: the GSAP timeline sums to 8.18s; clock: "Transcribing" pill pops in at 5,900, 14,100 and 22,250ms in one run, 8.17 to 8.2s apart) |
| Call loop | each clip loops on its own: 10.0s for 14 of the 15 clips, 5.0s for one. Not synced to the notes; with a 10s clip the two cycles line up again only every 409s |

## Cast

| Actor | Looks like | Where |
| --- | --- | --- |
| Person A, person B | two real webcam clips, square-cropped, one above the other in a black rounded panel; a row of three small pills below (microphone, camera, red hang-up), static and not clickable | the panel overlaps the window's right edge: `top: 50%; right: -14%; width: 28%` of the window at 1024px and up (108x229 at 1440), `top: 30%; right: -4%; width: 24%`, 80 to 96px wide below that (86x186 at 390) |
| The note-taker (the visitor, by implication) | never shown; present only as the typed line and its caret | the notes area |
| Rough notes | three short lowercase lines ("confirm ICP alignment", "Deal stalls - sales input", an empty line) and a fourth that types; 10px, one font, no structure | top of the notes area |
| Caret | a 1px accent-coloured bar after the last character, pulsing (opacity 1 to 0.5, 2s, Tailwind `animate-pulse`), not blinking | end of line 4 |
| "Transcribing" pill | white pill, three dancing bars and the word; the bars are decorative CSS loops, not driven by any audio | bottom centre of the window |
| "Generate notes" button | dark filled pill with a sparkle icon | same bottom-centre slot |
| "Enhancing notes" row | full-width white pill with a spinner (1s linear) and the label, soft shadow | travels from the top of the notes area to their bottom |
| Enhanced notes | 16 lines: four bold section headings, each followed by bullets; in each of the first three sections one bullet is ink (the person's rough line, expanded) and the rest are grey (what the AI added); a "Next Steps" section of grey owner-action bullets | same area as the rough notes, on top of them (opaque background) |
| Toggle | two-way pill "My notes / Enhanced" with a sliding highlight | bottom-centre slot |

The two people are picked at random on each page load from a list of 15 named clips, never the same name twice; posters are preloaded. Clips are 512px wide at 768px and up and 256px below, 12 fps, H.264, no audio track, 24 to 170 KB each. They are drawn onto a `<canvas>` frame by frame with `requestVideoFrameCallback` from a `<video>` element that is never put in the page; browsers without that API get a plain muted looping `<video>` (source). Double-clicking a tile replaces that clip with the visitor's own camera, mirrored, after the browser's permission prompt, and logs an analytics event (source: "webcam easter egg"); double-click again to turn it off.

## Beat table: one loop

t is seconds from the start of a loop. Motion values are from source, checked on the clock (every transition below landed within one 50ms sample of the source time).

| t start | t end | Actor | What happens | Motion |
| --- | --- | --- | --- | --- |
| 0 | 0 | Window | Reset. Rough notes show three lines and an empty fourth with the caret. Enhanced notes hidden (clipped to nothing). The toggle left on screen by the last loop vanishes in one frame. | instant |
| 0.04 | 0.49 | "Transcribing" pill | Pops in where the toggle just was, so the cut is covered. | opacity 0 to 1, scale 0.6 to 1, 0.45s `back.out(2.6)` |
| 0 | loop | Bars in the pill | Three bars, each in two halves moving apart and together. | 4px, 5px, 2.5px travel; 0.6s, 0.5s, 0.92s; delays 0, 0.18, 0.33s; `ease-in-out`, alternate, infinite |
| 0.30 | 1.80 | Note-taker | Line 4 types: "Q3 messaging rollout, are teams ready??", 39 characters. | 26 characters a second, linear (1.5s); caret pulses throughout |
| 1.80 | 2.05 | | Hold. | |
| 2.17 | 2.42 | Pill | Leaves. | opacity to 0, scale to 0.8, 0.25s `power2.in` |
| 2.25 | 2.63 | "Generate notes" | Pops in, overlapping the pill's exit by 0.17s. | opacity 0 to 1, scale 0.8 to 1, 0.38s `back.out(2.2)` |
| 2.81 | 3.03 | "Generate notes" | Pressed: dips and returns, a click without a cursor. | scale to 0.96 in 0.1s `power2.in`, back to 1 in 0.12s `power2.out` |
| 3.08 | 3.43 | "Generate notes" | Drops away. | y +28px, scale 0.85, opacity 0, 0.35s `power2.in` |
| 3.43 | 3.71 | "Enhancing notes" row | Appears at the top of the notes. | opacity 0 to 1, scale 0.95 to 1, 0.28s `power2.out` |
| 3.43 | 6.53 | AI notes | The row travels down by the notes' height (from y -8 to 277px at 1440, to 292px at 390). The notes above it are uncovered by a bottom clip that follows the row. Each line, as the edge reaches its top, plays a colour sweep into its final ink or grey. If the notes were taller than the area, the second half of the travel would scroll them so the edge stays in view (no overflow at 1440 or 390). | progress 3.1s `power1.in` (slow start, fastest at the end); line sweep 0.4s `ease-in-out` each |
| 6.53 | 7.03 | Row | Moves to the toggle's slot at the bottom (y 384px at 1440). | 0.5s `power2.out` |
| 6.93 | 7.33 | Toggle | Pops in with "Enhanced" selected. | opacity 0 to 1, scale 0.88 to 1, 0.4s `back.out(1.8)` |
| 6.95 | 7.17 | Row | Fades and narrows into the toggle. | opacity to 0, width to the toggle's (scaleX at least 0.7), 0.22s `power2.in` |
| 7.33 | 7.78 | | Hold on the finished notes. | |
| 7.78 | 8.06 | Toggle | Highlight slides to "My notes". | 0.28s `power3.inOut` |
| 8.06 | 8.18 | Window | The enhanced notes hide and the rough notes return with line 4 empty, which is the first frame of the next loop. Short hold, then repeat. | instant |

Line sweeps measured on the clock: line 1 at 3.43s, line 6 at about 5.1s, line 11 at about 5.85s; the gaps shrink down the page because the reveal speeds up.

The sweep: each line's text is clipped to a background three times its width, a gradient of solid ink (or grey), then a narrow band of yellow, pink, lavender, pale blue and lime, then transparent. The background slides from its right end (text invisible) to its left end (text solid), so a short rainbow passes across each line from left to right and leaves it in ink. Grey lines use a grey base.

## Timing at a glance

- Before the AI: 3.43s (typing 1.5s, button 1.2s).
- The AI: 3.1s for 16 lines, about 5 lines a second at the end.
- The payoff: 1.65s (toggle in, hold, switch back).
- Every pop overshoots (`back.out` 1.8 to 2.6), lasting 0.38 to 0.45s; every exit is a quick `power2.in` of 0.22 to 0.35s.

## Behaviour around the loop

| Check | Result | Evidence |
| --- | --- | --- |
| Off screen | The notes timeline **pauses** when the window is more than 100px outside the viewport and **resumes where it stopped** (the row held at y 62.97px for 4s away, then went on from there). The call clips **keep playing** off screen (canvas content changed every second while away). | clock; source: Motion `useInView(ref, { margin: "100px" })` plays or pauses the GSAP timeline; the clips have no visibility check |
| Reduced motion | **No change**: the full loop plays and the clips run. | clock with `prefers-reduced-motion: reduce` emulated; source has no reduced-motion branch in the hero (the connectors marquee further down has one) |
| Loop seam | The loop ends on its own first frame: the switch to "My notes" restores the rough lines. One cut is hidden: the toggle disappears in one frame at the loop start, under the pill popping into the same slot. | clock, source |
| 390px | Same timeline to the sample. The window is 358x537 under the hero copy; the call panel stays, smaller (78px tiles) and overlapping the window's right edge; the clips are the 256px versions; the row travels 300px because one line wraps. | clock, frames |

## Libraries

- **GSAP core**, one timeline with `repeat: -1` and an `onRepeat` reset, built in a `useGSAP`-style hook scoped to the window (not on `window.gsap`, so `timeline.mjs` reports it as absent).
- **Motion** `useInView` for pausing.
- **CSS** keyframes for the bars, spinner, caret pulse and line sweep (`bg-slide`, 0.4s inside the demo).
- **Canvas plus a detached `<video>`** per tile, `requestVideoFrameCallback`; `getUserMedia` for the easter egg.
- No Lottie, no Rive in this demo, no WebGL.

## Contact sheets

- `behavior/granola-hero-flow-1440.jpeg`: one loop of the original, every 0.4s, window and call panel.
- `behavior/granola-hero-flow-390.jpeg`: the same at 390.
- `behavior/proto-granola-hero-flow-1440.jpeg`, `proto-granola-hero-flow-390.jpeg`: the prototype, same framing.
- The earlier `behavior/granola-2-note-demo-1440.jpeg` covers the same demo at 0.5s steps.

## What makes it work

- **A real call, not a drawing of one.** Two real faces in a call panel with a red hang-up button read as "a meeting is happening" in under a second, without any choreography. Idle clips are more believable than acted talking: nobody's lips have to match anything.
- **The person does the human part, the AI does the rest.** The only typing is the note-taker's rough, lowercase line, typed at a human pace. The AI's output arrives at a machine pace and fully formed. The contrast between the two speeds is the pitch.
- **A visible cause.** The notes do not just appear; a button is pressed first. The press (a 4% dip) is small, and it is enough to read as a click.
- **The notes are the rough notes, grown.** Each rough line becomes a section heading, the ink bullet keeps the person's point and grey bullets add what was said. "My notes / Enhanced" names the product's whole idea, and the switch back shows the before and after in one move.
- **Nothing shifts.** The finished notes are laid out from the start and only uncovered, so there is no reflow, and the travelling row shows where the work is happening.
- **It loops without a seam,** and pauses when nobody is looking.

## Prototype and validation

`prototypes/granola-hero-flow.html`, our own code: placeholder people (two simple drawn figures on coloured tiles, each idling on its own CSS loop of 10s and 5s, standing in for the clips), placeholder copy ("Spring term planning", "Listening", "Write notes", "Writing notes", "Mine / Notes", a 39-character typed line, 16 note lines in the same heading, ink and grey pattern), Trilsy palette as placeholder colours. No GSAP: one pure function `render(t)` sets every element from the loop time, with the GSAP curves written out (`back.out`, `power1` to `power3`); a `requestAnimationFrame` clock advances only while an IntersectionObserver with a 100px margin sees the window, and resumes where it stopped. One deliberate difference: under `prefers-reduced-motion` it shows a still final frame (notes shown, toggle on "Notes", figures still), because Trilsy's rule requires it; Granola has none. Serve with `python3 -m http.server -d docs/redesign/prototypes 4173` and open `/granola-hero-flow.html`.

Validated with `timeline.mjs` on the original and the prototype, the same 13 probes (typed length, pill, button opacity, y and scale, row opacity and y, sweep on lines 1, 6 and 11, toggle opacity and highlight x, notes opacity), 22s each, 50ms interval, both runs synced on the button's first change (`SYNC=gen`). Timing tolerance: 100ms (interval plus 50ms).

| Check | 1440 | 390 |
| --- | --- | --- |
| Transition times, every probe, every edge over two and a half loops | within 50ms | within 50ms |
| Row y while visible (`enhY`) | max 4px, mean 0.7px | max 7px, mean 2.1px |
| Button y and scale while visible | max 1px, 0.01 | max 3px, 0.04 |
| Toggle highlight x while visible | max 7px, mean 0.5px | max 26px, mean 1.8px |
| Typed length | max 2 characters | max 2 characters |
| Off screen | pauses and resumes in place; figures keep idling | |
| Reduced motion | one still state for 9s | |

Every value gap is a phase offset under one sample on a fast-moving value: at 26 characters a second, 2 characters is 77ms; the toggle moves 93px in 0.28s, so 26px is about 50ms at its fastest; the row moves fastest at the end of its travel, where 7px is about 40ms. `compare.mjs` on the raw files also shows large gaps on `enhY`, `genY` and `togX` at the loop seam only: while hidden, Granola leaves the row and button where the previous tween ended (y 277px, +28px) and resets them on the next beat, while the prototype resets them at once. Those are invisible (opacity 0) and were left out of the visible-only rows above. The 1440 row travel matched only after one placeholder line was shortened so that it fits one line at 1440 and wraps at 390, as Granola's second line does; travel equals the notes' height.

Raw runs and scripts stayed in the scratch workspace (`timeline.mjs`, `compare.mjs`, plus a transition-time pairer and a visible-only comparer written for this study).

## Corrections to pattern 2 in `behavior-granola.md`

- The notes do not scroll inside the window at 1440 or 390: the 16 lines fit, so the second-half scroll in the code never runs at these sizes.
- The colour sweep runs 0.4s per line inside the demo (the global rule says 0.9s; the demo overrides it).
- The loop is 8.18s by source (8.2s was rounded).
- The call panel, not mentioned there, is two independent video loops; the "canvases in the call thumbnails" listed as unverified there are these clips.

## Notes on Trilsy's approved hero

Notes for the hero ticket (04), not decisions. Every design choice stays with the owner, who has said not to copy a reference 1:1. Trilsy's approved hero: a window with Lecture, Meeting and Interview tabs; waist-up drawn characters beside it with speech bubbles and role chips; the storyboard Recording, Stop, Transcribing, transcript lines, then Writing notes and the notes assembling.

- **Granola never scripts a conversation.** What the owner liked, "a meeting with people in it", is ambient presence plus the notes. Trilsy's approved hero goes further: the bubbles script who speaks and what they say. There is no Granola timing to borrow for turns, gaps or a speaking cue; those are Trilsy's own design. One idea that does carry: characters that idle (a nod, a small gesture) on their own short loops, apart from the speech clock, would read as alive the way Granola's clips do. The bubble and the transcript chip must share one clock, since the ticket pairs them by colour.
- **Two clocks.** Granola keeps the people and the notes on separate clocks and never syncs them. For Trilsy that split would fit idle motion only; speech, bubbles, waveform, timer and transcript belong on one timeline.
- **Granola's "Transcribing" runs during the meeting.** Trilsy transcribes only after recording ends, so the approved order (Recording, Stop, Transcribing, lines) must stay; Granola's live pill under typing is the one beat that would be untrue for Trilsy.
- **A visible cause for the AI.** Granola's notes follow a pressed button: pop in, a 4% dip, drop away. Trilsy's storyboard already has the equivalent in the Stop press; the same three-part beat could carry it. Granola's pops overshoot (`back.out`) and last 0.22 to 0.45s; Trilsy's rule is one easing token at 400 to 600ms, so the beat would keep its shape and take Trilsy's timing.
- **Notes uncovered, not typed.** Granola lays the whole note out and uncovers it behind a travelling row in 3.1s: no reflow, a clear "work happening here" marker, and the AI looks faster than a person. That fits "the notes assemble" without typing them. Granola's per-line rainbow sweep is gradient text in motion, which CLAUDE.md's anti-slop list rejects; an uncovering edge with no colour, or a mustard pass in the marker's colour, would be the Trilsy-side alternatives to put to the owner.
- **Only the person types.** In Granola the single typed line is the human's, at 26 characters a second, and the machine's output never types. In Trilsy's storyboard the transcript lines are the app's output; how they appear (typed, line by line, uncovered) is open, and Granola's split suggests keeping a human pace for anything a person does and a machine pace for anything Trilsy does.
- **"My notes / Enhanced" has no Trilsy counterpart.** Trilsy writes the notes from the recording and they can then be edited; it does not merge the user's own rough notes. A before-and-after toggle like Granola's would show a feature Trilsy does not have. The ink-versus-grey split has the same problem. The tabs (Lecture, Meeting, Interview) are Trilsy's natural loop seam instead: the end of one setting's notes can lead into the next tab, the way Granola's toggle leads back to its first frame.
- **Loop length.** Granola's whole flow is 8.18s: 3.4s of human work, 3.1s of AI, 1.65s of payoff. Trilsy's storyboard has more beats (a recording with a compressed 00:00 to 00:21 timer, Stop, Transcribing, lines, notes) and will run longer; Granola's proportions are one reference for how short each beat can be and still read.
- **Off screen and reduced motion.** Granola pauses at a 100px margin and resumes in place, which ticket 04 already asks for. It ignores reduced motion; Trilsy shows the final frame, as the ticket says and the prototype does.
- **Phone.** Granola keeps both people at 390, as 78px tiles over the window's edge. Trilsy's v10 hides the characters at 390 and gives the phone its own beat; Granola shows that a small cast in a corner can survive on a phone, if the owner wants that option.
- **Not for Trilsy:** real people's video (Trilsy's cast is the owner's drawn pack), the webcam easter egg (it asks for the camera on a marketing page).

## Unverified

- Eleven of the fifteen clips were probed for length and size but not watched; the four watched are all idle, none talks.
- The `<video>` fallback for browsers without `requestVideoFrameCallback` (older Firefox) was read in source, not run.
- Safari and Firefox were not run.
