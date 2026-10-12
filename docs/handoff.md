# Trilsy handoff

## Product

A private, botless Mac notetaker for conversations of any kind: record or import audio, transcribe locally, and produce detailed notes with a short overview. The current focus is the Mac app, not dictation or meeting bots. An iPhone app and optional paid processing are future scope.

## What exists

- `Sources/`: first-pass SwiftUI implementation, capture, import, playback, local WhisperKit transcription, MLX notes, persistence and exports.
- `Tests/`: five native tests covering prompt bounds, ordering, recovery and corrupt files. They have not been run on macOS.
- `web/`: deployed Next.js marketing website with Tailwind, shadcn/Base UI, Motion and an original vgpu shader.
- `.github/workflows/check.yml`: Mac build/test and website build/WGSL checks, ready to run when hosted on GitHub. No successful Mac CI run has been observed yet.
- `.agents/skills/`: installed shadcn and vgpu instructions; provenance is in `skills-lock.json`.

The website has passed a production build. The native app has never been compiled or exercised on an Apple silicon Mac. Do not present the website's illustrative product windows as native app screenshots, or claim a customer-ready installer exists.

## Design handoff

The owner has rejected the current website design. Its colors, typography and composition are a starting point, not approved requirements. The references are Superwhisper and the note-taking part of Wispr Flow. The owner wants a distinctive design, substantial shader motion, good microinteractions and an honest trust section. No pill-shaped label above the hero title.

Inspect Mobbin visual references before each new design phase. Use Tailwind for layout and shadcn for suitable controls. Keep the repo small. Reference history is in `website-design.md`.

Main entry points:

- `web/components/site.tsx`: page sections, sample notes, privacy and release dialogs.
- `web/components/hero.tsx`: hero composition, animated cards, recorder and section entrances.
- `web/components/ambient.tsx`: WebGPU lifecycle, video fallback and reduced-motion handling.
- `web/app/ripple.wgsl`: original glass-loop shader.
- `web/app/globals.css`: theme tokens and base animation rules.
- `web/components/mark.tsx` and `web/app/icon.svg`: mark and favicon.
- `web/components/ui/`: shadcn components.

Run `cd web && npm ci && npm run dev`. Validate with `npm run build` and `npm run check:shader`. Regenerate the shader poster with `node scripts/render-shader.mjs`; add `--video` to regenerate the loop using ffmpeg. The live hardware-WebGPU path still needs a real-device check; the shader was rendered with vgpu/node's software adapter, and the browser video fallback was checked.

## Website deployment

- Public website: https://trilsy.com
- Vercel project: `trilsy`
- Root directory: `web`
- Framework: Next.js; Node.js 24
- No application environment variables or AI API keys are required for the marketing site.
- The existing Vercel deployment was uploaded directly; automatic GitHub deployment has not been connected.

Vercel account permissions are separate from source-code access. Configure the Git connection in the existing project if automatic deployment is wanted; do not create a competing project for the domain.

## Native next steps

Follow `README.md` to install XcodeGen and run `scripts/build-mac.sh` on an Apple silicon Mac. Resolve compiler or SDK API issues first, then verify one complete recording-to-notes flow. `acceptance.md` lists the remaining device, quality and release checks. No code-signing credentials, model weights or recordings are included.

## Original development history

The public repository was populated through the GitHub connector because direct Git push was not authenticated. Its initial publication is a snapshot; the original six local commits and all four development branches are preserved in `archives/pre-github-history.bundle`.

From a clone of this repository, recover that history as a separate checkout:

```sh
git clone archives/pre-github-history.bundle ../trilsy-original-history
```

Continue new development on the public repository's `main` branch. The bundle is a historical backup, not a runtime dependency.
