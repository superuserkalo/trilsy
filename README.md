# Trilsy

Be here. We’ll take the notes. A private, botless notetaker for Apple silicon Macs.

**Developer preview.** Native source is implemented but has not yet been compiled or exercised on a Mac. Do not use it as the only recorder for an important conversation until the [acceptance checks](docs/acceptance.md) pass. No signed download is available yet.

For the current status, deployment setup, and where to start changing the design, see the [handoff](docs/handoff.md). The existing website design is not approved and is intended to be replaced.

## One app, one job

Record microphone and application audio, or import an audio/video file. Stop, then transcribe and generate detailed notes locally. Edit notes and transcript, search recordings, jump to timestamps, and export Markdown, text, or SRT. No meeting bot, dictation, account, server, subscription, or analytics in the native app.

## Run the Mac app

Requires Apple silicon, macOS 15+, Xcode with Swift 6.1+, and XcodeGen (`brew install xcodegen`). 16 GB RAM recommended; reserve several GB for models and recording storage.

```sh
./scripts/build-mac.sh
open build/Build/Products/Debug/Trilsy.app
```

Or run `xcodegen generate`, open `Trilsy.xcodeproj`, select your development team, and Run. The script makes an ad-hoc signed local debug build, not a distributable release. Enable model downloads in Settings, then generate notes. First use downloads Whisper small and Qwen2.5 3B 4-bit from Hugging Face. No audio is uploaded. Network may still be used for model resolution/cache checks; fully offline behavior must be verified on the target Mac.

System audio uses ScreenCaptureKit and needs macOS Screen & System Audio Recording permission. No screen video is stored. The microphone follows the system default. Use headphones when recording both sources. Recorded source labels are not speaker diarization.

## Run the website

```sh
cd web
npm ci
npm run dev
```

Next.js App Router, Tailwind 4, shadcn/ui, Motion, vgpu. `npm run build` checks production compilation and TypeScript. The original raymarched glass artwork caps at 30 FPS, responds to the pointer, and skips offscreen/hidden frames. Unsupported browsers play a seamless video rendered from the same shader; reduced-motion browsers show its poster. Regenerate both with `node scripts/render-shader.mjs --video` (requires ffmpeg). Brand constants live in `web/lib/brand.ts`. See [website design and verification](docs/website-design.md) for the Mobbin references and checks.

## Small on purpose

- `Sources/`: SwiftUI app, AVAudioEngine/ScreenCaptureKit capture, WhisperKit speech, MLX notes, plain JSON/files. Direct SDK calls, no plugin framework.
- `Tests/`: persistence recovery, corrupt manifests, prompt bounds, and export ordering.
- `project.yml`: reproducible XcodeGen definition; exact top-level SDK versions.
- `web/`: independent marketing site; no native runtime dependency.
- `.agents/skills/`: installed shadcn and vgpu guidance, with provenance lock.

Recordings live in `~/Library/Application Support/Trilsy/Recordings/<UUID>/`. Audio is saved in roughly 60-second CAF chunks. Metadata writes are atomic; startup recovers readable orphan chunks. Corrupt files are preserved for inspection. This is ordinary local storage, **not application-level encryption**; disk encryption depends on your Mac. Deleting a recording removes its folder; model caches are managed by their SDKs.

Detailed notes are generated in bounded sections and retained alongside an overview, so long recordings are not silently truncated into one prompt. Cancellation retains completed transcription chunks; retry skips those chunks. Notes are regenerated on retry. AI output needs verification against the audio; timestamp strings are model-produced and can be wrong.

## Scope and release gates

No live transcription, individual speaker recognition, calendar integration, iPhone app, cloud AI, billing, notarization, updater, or signed installer yet. Optional paid processing is a future product decision, not a hidden API dependency. Third-party SDKs and model licenses apply independently; inspect them before distribution. See [acceptance](docs/acceptance.md) and [architecture](docs/architecture.md).
