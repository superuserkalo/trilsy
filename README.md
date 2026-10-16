# Trilsy

Be here. We’ll take the notes. A private notetaker for Apple silicon Macs.

**Developer preview.** Native source builds and its unit tests pass on the macOS 26 CI runner (Xcode 26), but recording, transcription and notes have not yet been exercised on a real Mac. Do not use it as the only recorder for an important conversation until the [acceptance checks](docs/acceptance.md) pass. No signed download is available yet.

The existing website design is not approved; its replacement is specified in the [redesign brief](docs/redesign-brief/README.md). Agent guidance is in [CLAUDE.md](CLAUDE.md).

## One app, one job

Record microphone and application audio, or import an audio/video file. Stop, then transcribe and generate detailed notes locally. Edit notes and transcript, search recordings, jump to timestamps, and export Markdown, text, or SRT. No dictation, account, server, subscription, or analytics in the native app.

## Run the Mac app

Requires Apple silicon, macOS 15+, Xcode 26 (the project builds in Swift 5 language mode; Xcode 16.4 still builds it, with standard buttons in place of the macOS 26 glass styles), and XcodeGen (`brew install xcodegen`). 16 GB RAM recommended; reserve several GB for models and recording storage.

```sh
./scripts/build-mac.sh
open build/Build/Products/Debug/Trilsy.app
```

Or run `xcodegen generate`, open `Trilsy.xcodeproj`, select your development team, and Run. The script makes an ad-hoc signed local debug build, not a distributable release. Enable model downloads in Settings, then generate notes. First use downloads Whisper small and Qwen2.5 3B 4-bit from Hugging Face. No audio is uploaded. Once the models are downloaded the app works offline (confirmed by the owner, 2026-10-16); only the first download needs a connection.

On a first build, resolve compiler or SDK API issues, then verify one complete recording-to-notes flow before anything else. The Mac CI job builds the app and passes the five native tests, which cover storage, recovery, note chunking and export order; none of them exercises recording, transcription or notes. No code-signing credentials, model weights or recordings are included in the repo.

System audio uses ScreenCaptureKit and needs macOS Screen & System Audio Recording permission. No screen video is stored. The microphone follows the system default. Use headphones when recording both sources. Recorded source labels are not speaker diarization.

## Run the website

```sh
cd web
npm ci
npm run dev
```

Next.js App Router, Tailwind 4, shadcn/ui, Motion, Hugeicons. `npm run build` checks production compilation and TypeScript. The site has no shader. Brand constants live in `web/lib/brand.ts`. See [website design and verification](docs/website-design.md) for the Mobbin references and checks of this first, rejected design.

### Deployment

The site is live at https://trilsy.com from the Vercel project `trilsy` (Next.js, Node.js 24), deployed by CLI from `web/`. It needs no environment variables or API keys, and has no mailing-list database or signup endpoint. Git auto-deploy is not connected; to add it, configure the Git connection on the existing project and do not create a second project for the domain. Vercel account permissions are separate from source-code access.

## Small on purpose

- `Sources/`: SwiftUI app, AVAudioEngine/ScreenCaptureKit capture, WhisperKit speech, MLX notes, plain JSON/files. Direct SDK calls, no plugin framework.
- `Tests/`: persistence recovery, corrupt manifests, prompt bounds, and export ordering.
- `project.yml`: reproducible XcodeGen definition; exact top-level SDK versions.
- `web/`: independent marketing site; no native runtime dependency.
- `.agents/skills/`: installed shadcn and vgpu guidance, with provenance lock.

Recordings live in `~/Library/Application Support/Trilsy/Recordings/<UUID>/`. Audio is saved in roughly 60-second CAF chunks. Metadata writes are atomic; startup recovers readable orphan chunks. Corrupt files are preserved for inspection. This is ordinary local storage, **not application-level encryption**; disk encryption depends on your Mac. Deleting a recording removes its folder; model caches are managed by their SDKs.

Detailed notes are generated in bounded sections and retained alongside an overview, so long recordings are not silently truncated into one prompt. Cancellation retains completed transcription chunks; retry skips those chunks. Notes are regenerated on retry. AI output needs verification against the audio; timestamp strings are model-produced and can be wrong.

## Scope and release gates

Not in the app yet: live transcription, individual speaker recognition, any calendar or app integration, an MCP server, an iPhone app, sync, cloud or hosted AI, an account, billing, notarization, an updater or a signed installer. Direction decided with the site redesign (2026-10-15), none of it built: the free app stays local with no account; a paid Pro layer would add sync of transcripts and notes (audio stays on the Mac), a read-and-write MCP server and connections to apps. Third-party SDKs and model licenses apply independently; inspect them before distribution. See [acceptance](docs/acceptance.md) and [architecture](docs/architecture.md).

## Licence

MIT, see [LICENSE](LICENSE): Copyright (c) 2026 Kaloyan Gantchev. The Trilsy name and the drawings on the website are not part of the grant. The Whisper and Qwen models the app downloads, and its third-party SDKs, keep their own licences.

## Original development history

The public repository began as a snapshot. The original six local commits and four development branches are preserved in `archives/pre-github-history.bundle`, a historical backup and not a runtime dependency. Recover them as a separate checkout:

```sh
git clone archives/pre-github-history.bundle ../trilsy-original-history
```

Continue new development on `main`.
