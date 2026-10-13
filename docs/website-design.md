# Trilsy website design (v1, rejected)

**Status: historical.** This records the first design, which the owner rejected, and how it was verified. It is not direction for new work. The redesign is specified in [redesign-brief](redesign-brief/00-master.md); standing rules are in the root `CLAUDE.md`.

## Direction

Ice blue (#dae9fd), cobalt (#3159e8), warm white (#f8f7f3), navy (#182e54), and a small coral recording accent. Oversized Instrument Sans with an asymmetric layout and an original fluted glass sculpture. No pill or eyebrow above the hero headline. The three-stroke mark suggests rising notes and stays legible at favicon size.

Superwhisper remains the primary reference for immersive artwork and focused product presentation. Layout, spacing, colors and responsive states use Tailwind. Real shadcn/Base UI components supply buttons, tabs, toggle groups, dialogs and accordion controls. Global CSS is restricted to theme tokens, base styles and animation definitions.

## Mobbin images inspected for this revision

- [Wispr Flow hero](https://mobbin.com/sites/sections/e0030809-614c-4bcb-9c53-746c90165df9): concise promise and recording-to-output storytelling.
- [Aqua closing section](https://mobbin.com/sites/sections/03f083e3-7838-429b-8800-3d25fad9310b): pale blue sculpture, airy composition and simple action. Informed the hero stage; no source artwork copied.
- [Patch hero](https://mobbin.com/sites/sections/40cfa79f-c1db-4e7c-aa91-b542618a8469): confident electric-blue color and large typography.
- [Serus trust section](https://mobbin.com/sites/sections/d674ddba-26f4-40ad-a39f-f710227c0085): credibility placement. Trilsy uses product facts, not copied certifications or customer claims.
- [Granola hero](https://mobbin.com/sites/sections/7dc415dd-32ab-4406-b79e-68eb47783c01): asymmetric product collage and strong left-aligned copy.
- [Granola product section](https://mobbin.com/sites/sections/d36babfc-e4be-468d-a5e5-0b14b2d99e68): readable white notes window and direct explanation of useful output.

## Shader and motion

`web/app/ripple.wgsl` is an original SDF raymarcher for a twisted elliptical band with ninety fine flutes and glass-like environment lighting. The shape and camera orientation vary in a seamless ten-second cycle. Pointer coordinates affect the live shader.

`Ambient` dynamically imports vgpu, compiles before drawing, caps rendering at 30 FPS / 1.25 DPR, and skips offscreen/hidden draws. It catches adapter, compilation and asynchronous GPU errors. Browsers without a usable WebGPU adapter play `public/glass-loop.mp4`, a 1.2 MB, 24 FPS render of the same shader. The video also pauses offscreen or in a hidden tab. Reduced-motion users see `public/light-field.webp` without mounting the video. The ambient-motion control pauses both render paths, floating cards, progressive sample text and recorder bars.

Motion supplies section entrances, spring pointer parallax, floating notes, progressive transcript emphasis, saved-state transitions, interactive file selection, and notes switching. Buttons have hover lift and press compression. Export provides temporary downloaded feedback. System reduced-motion preferences suppress spatial animation.

Regenerate the poster and validate motion with `cd web && node scripts/render-shader.mjs`. Add `--video` to regenerate the seamless video (ffmpeg required). `npm run check:shader` validates WGSL. The renderer compares time 0 with time 5 and checks the ten-second seam.

## Verification — 2026-10-12

- Production build and TypeScript passed; diff whitespace check passed.
- WGSL validator passed. vgpu/node rendered with a **CPU software adapter (llvmpipe)**; 234,594 visibly changed pixels between sampled frames and mean seam error 0.000371484375. No asynchronous GPU errors.
- Desktop browser inspection confirmed the moving video fallback, pause control, trust strip, example switching, transcript tab and interactive local-file selection. No application errors observed; unrelated browser-extension warnings were excluded.
- Reviewed 390px and 768px embedded layouts. Document content/scroll widths matched (375/375 and 753/753, allowing for scrollbars). Fixed the tablet hero overlap by moving the two-column breakpoint to 1024px.
- Live production: release dialog and export feedback passed; video playback paused after the hero scrolled out of view. A repeat tablet check after the breakpoint change could not be completed: automatic review declined another protected-preview share link, and the browser disallowed a local data-URL test harness. The changed breakpoint passed compilation; the earlier narrow-layout review is recorded above.
- Cloud browser reports `navigator.gpu.requestAdapter()` returning null. A hardware-WebGPU browser check and physical Mac/iPhone performance checks remain outstanding. Shader compilation/rendering is verified separately; do not represent it as hardware-GPU browser validation.

## Release presentation

The primary action opens an interactive example. Release-status dialogs explain that the Mac app is in development. No signed native installer, fake waitlist, testimonial, certification or public native-source archive is served. Native source remains in the private project deliverable.

The trust strip explains local processing, no meeting bot, no account, and file ownership. Privacy details disclose initial model downloads, ordinary Mac disk protection, and Vercel request logging. The demo uses explicitly illustrative content and makes no requests to process recordings.
