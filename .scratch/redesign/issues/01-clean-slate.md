# 01: Clean slate

Status: resolved
Lane: logic
Blocked by: None (can start immediately)

**Section:** none (build plumbing). Every later ticket builds on an empty, building site.

**What to build:** remove the rejected design and the shader plumbing so the home page is an empty shell that type-checks and builds.

- Remove the old shader and everything that exists for it (Gate C closed with no shader anywhere; list in `docs/redesign/03-shader-choice.md`, "For Phase D"): the `.wgsl` file, the `check:shader` script, the wgsl loader in the Next config, the wgsl type declarations, the shader render script, the `vgpu` dependency.
- Remove the old design's components, its public video and image, and the Instrument Sans font package.
- Add the Hugeicons React package (the site's icon family) and a `LazyMotion` provider in the root layout so later client leaves use `m` components.
- Docs: remove the shader sentences from `CLAUDE.md` (the `check:shader` command line, vgpu in the stack line; the shader design rule becomes "no shader; reopened only by the owner"), and in `docs/redesign-brief/04-phase-d-build.md` state that the pinned story's photo swap is a Motion cross-fade and that the site has no shader.

**Approved copy:** none. **Behavior spec:** none.

**Images needed from the owner:** none.

- [x] No `.wgsl`, vgpu or shader script remains under `web/`; `npm ls vgpu` is empty
- [x] Home renders an empty shell; no old component, video or image is referenced
- [x] Hugeicons installed; `LazyMotion` wraps the app
- [x] `CLAUDE.md` and the 04 brief updated as above
- [x] `npm run typecheck` and `npm run build` pass from `web/`

## Answer

Built 2026-10-15 (logic lane, Opus 5.5, loop mode).

- Removed: `web/app/ripple.wgsl`, `web/wgsl-env.d.ts`, `web/scripts/render-shader.mjs`, the `check:shader` script, the `.wgsl` loader (`web/next.config.ts` is now an empty config), the `vgpu` and `@fontsource-variable/instrument-sans` dependencies, the old components (`ambient`, `hero`, `mark`, `site`), and `web/public/glass-loop.mp4` and `light-field.webp` (the `public/` folder is gone until a ticket adds a file to it). The Instrument Sans import and `--font-sans` line left `globals.css`; its other tokens stay for ticket 02 to replace.
- Added: `@hugeicons/react` and `@hugeicons/core-free-icons`; `web/components/motion-provider.tsx` (`LazyMotion` with `domAnimation`, `strict`, so a full `motion.*` component throws) wrapping the app in `web/app/layout.tsx`. `web/app/page.tsx` renders an empty `<main />`.
- Also: the CI web job no longer installs the vgpu renderer or runs `check:shader` (`.github/workflows/check.yml`); README's website paragraph no longer describes the shader or its render script; `CLAUDE.md` and `04-phase-d-build.md` updated as the ticket asks.
- `npm run typecheck` and `npm run build` pass from `web/` (a stale `.next/` from routes not in the repo had to be cleared first). `npm ls vgpu` is empty. The served home page body is `<main></main>`.
- Left for later tickets: the root metadata in `layout.tsx` still carries the old copy, including "botless" (Phase E or the ticket that writes metadata); the shadcn primitives in `components/ui/` stay, and `accordion` and `dialog` still import `lucide-react`, which stays installed for them.
