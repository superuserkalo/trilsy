# Phase C: shader choice (design lane, 2026-10-15)

Status: **Gate C closed, 2026-10-15: no shader anywhere on the site, the hero included.** Owner: "Real estate doesn't make any sense, really, to use any shaders in this type of art direction. So, get rid of it, I guess." Nothing under `web/` changed in this phase.

## What was read and opened

- The installed docs of vgpu 0.5.0 (`web/node_modules/.bin/vgpu docs ...`): getting started, Next.js, adaptive quality, shipping to production, the guide list, plus the skill's `scene.md` and Blender index. The native macOS, ML and package-publishing guides were listed and skimmed by title only; none bears on a marketing page.
- vgpu.sh opened fine. The gallery is 39 examples, listed by the examples API (`https://vgpu.sh/api/examples/v1/latest.json`, revision `af8ab210...`) and the local CLI (`vgpu examples show <id>`). Each is also a live page at `https://vgpu.sh/preview/<id>`. I rendered 14 of them in Chrome on this Mac (Apple GPU, WebGPU available) at 1440 by 900 and saved the frames in `docs/redesign/refs/shaders/`; `contact-sheet.jpeg` puts them side by side (`docs/redesign/tools/shader-sheet.mjs` rebuilds it).
- The owner's "lost link": the description (fluid simulations, ocean particles, gradients, depth estimation) matches the gallery, but I cannot tell which one it was. If it was one of these, say which and I will look at that one first.

## Candidates

All from the vgpu gallery, all MIT (the vgpu package and the vercel-labs/vgpu repository carry an MIT licence; the example files have no licence header of their own, so "MIT as part of that repository" is my reading, `TODO: confirm` before shipping one). Cost is read from each example's source and description, not measured on a phone. I did not time any of them.

| # | Example (link) | What it looks like | Cost | Could serve |
| --- | --- | --- | --- | --- |
| 1 | [fluid](https://vgpu.sh/examples/fluid) | Cyan and magenta ink drifting on black, stirred by the pointer. Dye colours are constants in `advect-dye.wgsl`, so recolouring is a parameter change; the field is always dark (additive on near-black). | Lowest of the set: a 128 by 72 grid, a 512 by 288 dye buffer, nine small compute dispatches and one draw per step. | A dark section (none exists on the approved home) |
| 2 | [fft-ocean](https://vgpu.sh/examples/fft-ocean) | White dots riding dark waves, almost black. | High: an FFT plus about half a million particles. | Nothing; too dark and sparse to carry anything |
| 3 | [fft-ocean-surface](https://vgpu.sh/examples/fft-ocean-surface) | A photoreal sea at sunset, amber sky over teal water. Closest in colour to the owner's dusk reference. | High: FFT compute passes and a raymarched sky. | The closing band, but that is a photograph by decision |
| 4 | [gradient](https://vgpu.sh/examples/gradient) | A saturated rainbow wash. | Trivial: one fragment shader. | Nothing; it is the generic gradient the anti-slop rule names |
| 5 | [holographic-card](https://vgpu.sh/examples/holographic-card) | A graphite card with a triangle outline and pearlescent foil on approach. | Moderate fragment work. | Nothing; it is vgpu's own brand card |
| 6 | [spiral-galaxy](https://vgpu.sh/examples/spiral-galaxy) | 4,600 stars flowing into a spiral on a night sky, bloom and lens flare. The target shape is the strokes of a "6"; changing it means new code. | High: compute, instanced quads and a bloom chain. | Nothing; space is unrelated to audio or meetings |
| 7 | [glass-sculpture](https://vgpu.sh/examples/glass-sculpture) | A raymarched glass object on pale grey. | High: raymarching with refraction and bloom. | Nothing; reads as a product render, not as sound |
| 8 | [radiance-cascades](https://vgpu.sh/examples/radiance-cascades) | A warm cream grid lit by a glowing triangle; you draw light with the pointer. The warmest of the set. | Moderate to high: a jump-flood field and six cascades. | Nothing; the interaction is "draw light", which the product does not do |
| 9 | [atmosphere](https://vgpu.sh/examples/atmosphere) | A physically based dusk sky, clouds lit amber. | Highest: lookup tables plus volumetric clouds. | Nothing; it would fight the photographs |
| 10 | [liquid-layout](https://vgpu.sh/examples/liquid-layout) | DOM cards drawn as refracting glass that merges where they touch, driven by Motion. | Moderate: an SDF over eight cards. | Nothing; it is blanket glassmorphism, which the rules reject |

Looked at and set aside without a full capture: depth-estimation (it downloads an ONNX model and only shows the depth map beside the photo, no parallax), triangle-led-front (a dark triangle with a glow, a "glow blob" in a different shape), nextjs-flare (a logo shader for another brand), spring-choreography (a purple knot of particles), and the three-dimensional scene examples (modular-city, marble-machine and the rest), which are product demos of the scene API.

**Community search.** Web search turned up three things, none vetted and none a better fit: a small showcase repo, `yuanyang749/vgpu-demo` (not opened); a developer's write-up of a fluid solver built on vgpu, itself inspired by the gallery's fluid (not opened); and non-vgpu audio-reactive WebGPU and WebGL toys (a Hugging Face space with a microphone input, LiveKit's aura visualiser, Siri-wave components). The audio-reactive ones are the only ones about voice, but they react to the visitor's microphone, which this page must never ask for, and the LiveKit one is WebGL. I did not capture or recommend any of them.

## What the page can hold

The approved home leaves no place for a dark, saturated field.

- **Hero:** paper (`#FBF7EE`) above a pale blue band (`#DCE6F2`), headline, subhead, button, then the product window flanked by the characters, then the trust band (see `prototypes/b2-hero-v10-lecture-1440.png`). The first 900px are full, and the brief says the shader must support the hand-drawn hero and must not push the headline or button down. Every candidate with a visible look is dark or saturated, so each would be the loudest thing on a light page and compete with the characters.
- **Pinned story and closing band:** photographs the owner is making, in a dusk teal and amber look. A shader in either place replaces a photograph (not allowed) or sits on top of one.
- **Questions and footer:** pale blue, with no motion by decision.

## Recommendation: no shader

**No hero effect and no secondary use.** This is the choice the brief names as acceptable and often better.

**Why this one, not the others.** I looked for something that is about sound, voice, light or signal becoming text, and that works on a pale paper page beside hand-drawn people. Ten of the gallery's 39 examples were worth a close look and none passes both tests. The ones that are about light or sound at all (radiance-cascades, the ocean pair, atmosphere) are either dark, or need a camera-sized area of the page, or are decoration whose link to a notetaker is only "waves" or "sunset". Fluid is the best of the lot technically (the cheapest, recolourable by changing a few colour constants, no new code), and "ink in water" is the only one with a plausible story, but it works only on a black field and the home page has no black field; adding a section for it breaks "one job per section" and the structure the owner chose. The remaining examples fail the anti-slop list outright: a rainbow gradient, a glow, glass cards, a brand's own logo shader, or a background unrelated to meetings. A shader that is only there to be a shader would cost a WebGPU check, a static fallback image to make, reduced-motion handling, off-screen pausing and a mobile variant, for something the owner has not asked for and the page does not need.

**What this means for the other phases.**
- The pinned story swaps photographs with a Motion clip-and-cross-fade, 600ms on `--ease-trilsy`, and an instant swap under reduced motion. It needs no WebGPU test and no fallback image.
- The old shader (`web/app/ripple.wgsl`, the `check:shader` script, the wgsl loader in `next.config.ts` and the `vgpu` dependency) is disposable with the rest of the old design. Removing them is a Phase D logic task; I changed nothing in `web/`.
- This reverses nothing in the earlier notes, but it changes one line: the B5 and `01b` notes say the photo melt "belongs to Phase C and vgpu, with an instant swap as the fallback". The gallery has no image-to-image transition, so as published it cannot be built, and the brief forbids writing a new shader. The instant swap becomes a Motion cross-fade.

## Options for the owner at Gate C

- **A, no shader (recommended).** As above. Nothing to build, nothing to fall back from.
- **B, no gallery shader now, but allow one small custom effect later.** A photograph melt for the pinned story's chapter swaps only, written with vgpu's `effect`, one small fragment shader. This is new shader code, which Phase C forbids and `CLAUDE.md` says I must ask about first. The owner can only judge it against the real photographs, which do not exist yet, so the practical form of B is: build A, and revisit B when the photographs arrive. Any B must ship with the full rule set below.
- **C, fluid, recoloured, in a new dark section.** Recoloured to mustard, terracotta and dusty blue instead of cyan and magenta, no other change. It needs a section that is not on the approved home (for example a dark band before the questions) and so changes the structure the owner chose. Preview: `docs/redesign/refs/shaders/fluid.jpeg` (as published) and the contact sheet. I would not pick it.

## If a shader is ever chosen, the rules it ships under

Use the example as published, changing only parameters and colours. Client component only, SSR-safe, behind a WebGPU check; the fallback is an intentional static image (an owner-supplied frame, so it would be an image request); `prefers-reduced-motion` shows that image; pause off-screen with IntersectionObserver; `surface(gpu, canvas, { dpr: [1, 2] })` caps the pixel ratio at 2; no effect under 800px; never behind the headline or button text.

## Mobbin

The Mobbin connector failed to connect this session (DNS error on `api.mobbin.com`), so no Mobbin references were inspected. This phase picks no section layout, so nothing was designed from references; I record the gap instead.

## Gate C, owner's answer (2026-10-15): an original shader, audio related, like a waveform

The owner does not want a premade gallery shader; they want one written for Trilsy with vgpu, and it must be a waveform. They had said earlier that they wanted the waveform "smoother, like a real waveform", so every direction below is smooth analytic curves, with no bars. The gallery sections above stay as the record of what was ruled out.

**Prototype.** `docs/redesign/prototypes/c-hero-shader.html` is hero v10 with the shader in the blue band behind the figures. Serve `docs/redesign` and open `http://localhost:4174/prototypes/c-hero-shader.html?t=3&h=A&s=strands` (`s=strands`, `track` or `lines`; `at=2.2` freezes a moment, `rm=1` shows the quiet reduced-motion pose). vgpu 0.5.0 loads from esm.sh in the prototype only. The three shaders are `prototypes/shader/hero-strands.wgsl`, `hero-track.wgsl` and `hero-lines.wgsl`. Each validates on a real device (`vgpu check --require-validation`), is one fragment pass, and shares one voice model: a speech level per speaker (the hero's own scripted beats supply it; the page never touches a microphone) swells where that person stands, thins with distance, and travels outward as words. Stills: `prototypes/c-wave-compare-1440.png` (the three side by side), and one full page each, `c-wave-strands-1440.png`, `c-wave-track-1440.png`, `c-wave-lines-1440.png`, all frozen at the moment the professor is speaking.

1. **Strands (recommended).** Five hair-thin ink strands that together draw one voice across the whole band. Almost a flat line when quiet; swells and ripples around a speaker. Its line weight is the same thin pen line as the characters, so it sits beside them rather than over them.
2. **Track.** One mirrored, filled audio track, the shape a voice memo draws, with an ink outline. The most obviously a waveform, and the heaviest on the page; it can read as a hill range when it is tall.
3. **Ruled voice.** The notebook rules across the band, straight at rest and carrying the voice as a smooth wave when someone speaks. It ties to the notes, but it is the weakest as a waveform: at a glance it reads as ruled paper or water.

**Checked.** One live run of Strands at the full 1440px hero (a 2880 by 1162 canvas on a 2x display): 60 frames a second, worst frame 18ms, no console errors, on this Apple-silicon Mac only. Not checked: a phone (the plan switches it off under 800px anyway), Safari and Firefox, a machine without WebGPU.

**Honest limits.** In all three the hero is crowded: the window and the figures cover most of the band, so what a visitor sees is the waveform around and between them, mostly at the left and right edges and beside the figures. That is the layering the brief asked for (support the illustration, never compete), but it is quiet. The speaker positions are fixed at the lecture setting's two speakers; Meeting and Interview need their own positions. The photograph swap in the pinned story is not part of this: a waveform-edged wipe between photographs is possible with the same method, to be decided after the hero effect and once the photographs exist; until then it is a Motion cross-fade. The earlier ripple, contour and photograph-smear experiments were deleted.

**If one is chosen, the build rules** are the ones above (client component, WebGPU check, a static fallback image of the quiet pose that the owner or I render from the shader, reduced motion shows that image, pause off-screen, DPR capped at 2, off under 800px). The fallback and reduced-motion still would be a render of the same shader at rest, not a new asset.

## Gate C, closed (2026-10-15): no shader

The owner saw the three waveform directions and decided against any shader. Their reason, verbatim: "Real estate doesn't make any sense, really, to use any shaders in this type of art direction. So, get rid of it, I guess." It is the same finding the first draft reached (the page has no room for one in this hand-drawn, paper-and-photograph art direction), now the owner's own call.

**Decided.**
- No shader on the site: not in the hero, not in the pinned story, not anywhere else. No hero effect and no secondary use.
- The pinned story's photograph swap is a Motion clip-and-cross-fade, 600ms on `--ease-trilsy`, an instant swap under reduced motion. It needs no WebGPU check and no fallback image.
- The `CLAUDE.md` rule on shaders and 3D (vgpu only, with a fallback and reduced motion) now only applies if the owner ever reopens this.

**Rejected, kept as history.** The three waveform prototypes (`prototypes/c-hero-shader.html`, `prototypes/shader/hero-strands.wgsl`, `hero-track.wgsl`, `hero-lines.wgsl`, and the stills `c-wave-*.png`) and the gallery captures in `refs/shaders/` are rejected and are not to be built. They stay in the repo as a record, and the owner can delete them.

**For Phase D (logic lane), not done here.** Remove the old shader and its plumbing: `web/app/ripple.wgsl`, the `check:shader` script, the `.wgsl` loader in `web/next.config.ts`, `web/wgsl-env.d.ts`, `web/scripts/render-shader.mjs` and the `vgpu` dependency, and the sentences about shaders in `CLAUDE.md` (the Commands line for `check:shader`, the stack line, the design rule). Also, `docs/redesign-brief/04-phase-d-build.md` and the hero ticket should say the swap is a Motion cross-fade and that there is no shader.
