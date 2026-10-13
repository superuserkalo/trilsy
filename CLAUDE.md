# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

Trilsy is a botless Mac notetaker. The repo holds two independent halves: the native SwiftUI app (`Sources/`, `Tests/`, `project.yml`) and the marketing site (`web/`). Keep the repo lean; these two are the whole scope.

## Commands

Website, from `web/` (there is no linter and no web test suite):

```sh
npm ci
npm run dev
npm run build          # production compile, the main gate
npm run typecheck
npm run check:shader   # validates app/ripple.wgsl
```

Mac app, from the repo root (Apple silicon, macOS 15+, `brew install xcodegen`):

```sh
./scripts/build-mac.sh   # xcodegen generate, then build and run all tests
xcodebuild -project Trilsy.xcodeproj -scheme Trilsy -destination 'platform=macOS,arch=arm64' \
  -derivedDataPath build CODE_SIGN_IDENTITY=- \
  -only-testing:TrilsyTests/RecordingTests/testCorruptManifestIsNotOverwritten test
```

`Trilsy.xcodeproj` and `Config/` are generated from `project.yml` and gitignored; edit `project.yml`, never the project.

Deploy: Vercel project `trilsy`, deployed by CLI from `web/` (Git auto-deploy is not connected). Production is trilsy.com; deploy there only when the owner says so. The site needs no environment variables, and the domain stays on this one Vercel project.

## Native app

`AppModel` coordinates one recording or processing job at a time. Capture callbacks copy PCM into serial file writers; each source (microphone, system, import) keeps its own roughly 60-second CAF chunks and timeline. WhisperKit transcribes each completed chunk and persisted chunk IDs are the checkpoints, so a retry skips finished chunks. The speech model is released before the MLX notes model loads, to bound peak memory. Notes are written per bounded transcript section, then reduced to an overview. Storage is plain JSON and files under `~/Library/Application Support/Trilsy/Recordings/<UUID>/`, with no backend.

Status: the native code is a first pass with no observed successful Mac build, test run or CI run, so expect compiler and SDK API errors before behavior bugs. Known limits are in `docs/architecture.md`; release gates are in `docs/acceptance.md`. Read both before changing capture, persistence or processing.

## Website

Next.js App Router, Tailwind 4, shadcn/ui (`base-nova` style on Base UI), Motion, vgpu. `.wgsl` files import as modules through the loader in `next.config.ts`.

**The current design is rejected and is being replaced.** Treat its palette, type, layout, logo and shader as disposable. `docs/website-design.md` records that old design; it is history, not direction.

The redesign runs in gated phases, one per session, each started with `./scripts/redesign`, which puts the session on the model its lane calls for (Sonnet 5.5 for design, Opus 5.5 at medium effort for logic). For any redesign work, read `docs/redesign-brief/00-master.md` first, then only the phase file the owner names, and stop at its gate. The owner makes the site's photographs: ask for one with an image request as the master describes, never source one. Product facts for copy live in the master; read them before writing or changing any site copy.

The shadcn and vgpu skills are files in `.agents/skills/`, not registered skills: read `.agents/skills/shadcn/SKILL.md` and `.agents/skills/vgpu/SKILL.md` (and the files they link) before component or shader work. Read vgpu docs from the installed package version.

### Design rules (owner's hard constraints)

- **First screen:** a stranger knows what Trilsy is within seconds. The headline stands alone, with nothing above it: no eyebrow, kicker, pill or badge.
- **Styling:** Tailwind utilities and shadcn/ui only. Customize through theme tokens and `cva` variants; `globals.css` holds tokens and base rules, nothing else.
- **Icons:** one family at one stroke weight. Hugeicons first, Lucide only for a gap. No emoji.
- **Shaders and 3D:** vgpu only, with a WebGPU fallback to an intentional static image and `prefers-reduced-motion` honored.
- **One job per section.** An idea, visual or sentence appears once on the page.
- **Motion** explains the product, guides attention or confirms an action. One easing token, 400 to 600ms.
- **Mockups show real-looking content** and carry no "preview", "demo" or "example" labels.
- **Anti-slop:** reject a headline that could belong to any app, a background unrelated to audio or meetings, repeated card grids, gradient text, glow blobs, blanket glassmorphism, default AI fonts.
- **References:** inspect Mobbin images (the actual visuals, not search metadata) before designing each section, and record the links and what they informed. Superwhisper and Wispr Flow's notetaker page are the north stars; keep Trilsy's identity original.
- **Honesty:** no invented logos, testimonials, counts, certifications or downloads. There is no signed installer or public release yet. The trust strip states true product facts. Site mockups are illustrations, never presented as native app screenshots. Placeholders are marked `TODO: confirm`.
- **Reach:** SEO, AEO and agent readiness (llms.txt, permissive robots, Open Graph, use-case pages) are part of the work.

### Working with the owner on design

Co-design, not handoff. Show rough visible drafts early. Ask one topic at a time with 2 to 4 concrete options, recommendation first, as rendered previews. Pick sensible defaults for anything minor and say so. Design decisions always come back to the owner.

Stop and ask, saying exactly what is needed, when: a reference site, Mobbin or a skill cannot be opened; a section has fewer than 4 usable references; a product fact, price or claim is missing; or the next step would invent a shader, logo direction, number, testimonial, integration or asset the owner has not approved.

Verify the rendered page and its interactions at desktop and narrow widths before any deployment.

## Agent skills

### Issue tracker

Issues are local markdown files under `.scratch/<feature>/`. See `docs/agents/issue-tracker.md`.

### Triage labels

The five default triage roles, each label equal to its name. See `docs/agents/triage-labels.md`.

### Domain docs

Single-context: `CONTEXT.md` and `docs/adr/` at the repo root, created when first needed. See `docs/agents/domain.md`.
