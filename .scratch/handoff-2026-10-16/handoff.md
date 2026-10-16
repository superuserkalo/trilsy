# Handoff: CI failure and loose ends (2026-10-16)

Written at the end of the redesign session that shipped commit `3d42a43` to `main` and deployed `web/` to trilsy.com. The site is live and its CI job passes. The Mac job fails. The owner chose to leave the native work as it is for now; this file is for whoever picks it up.

## 1. Mac CI fails (blocking)

- Run: https://github.com/superuserkalo/trilsy/actions/runs/38890753362. `web` passed, `mac` failed with exit code 65.
- Error: `Reference to member 'glassProminent' cannot be resolved without a contextual type`, in `Sources/ContentView.swift` around lines 410 to 418:
  ```swift
  if #available(macOS 26.0, *) {
      if prominent { content.buttonStyle(.glassProminent) }
      else { content.buttonStyle(.glass) }
  ```
- Cause: `#available` is a runtime check. The symbols must still exist in the SDK at compile time. CI runs `macos-15` with Xcode 16.4 (macOS 15 SDK), which has no `.glass` or `.glassProminent`. `project.yml` targets macOS 15.0 with Swift 5.0 language mode, and the README says Xcode 16.4 or later.
- Fix options:
  1. Wrap the glass branch in `#if compiler(>=6.2)` (Xcode 26) with the existing fallback in `#else`, then keep the `#available` check inside it. Smallest change; CI stays on Xcode 16.4.
  2. Move CI to a runner with Xcode 26 and update the README's Xcode requirement.
- How this happened: in-progress native work that the redesign session did not write was in the working tree, and `git add -A` committed it with the site. The redesign session did not review, compile or test any of it. It covers:
  - `Sources/ContentView.swift`: about 500 lines changed;
  - `Sources/NotesDocument.swift` and `Sources/WorkspaceViews.swift`: new files;
  - `Sources/App.swift`: `.defaultSize(1080x760)` and `.windowToolbarStyle(.unifiedCompact(showsTitle: false))`.
  The only native edit the redesign session made itself is the "Continue processing" confirm dialog (`confirmContinue`). It survives in the rewrite at lines 14, 75 and 237.
- Check after the fix: `./scripts/build-mac.sh` locally, then a green `mac` job. Nothing in `Tests/RecordingTests.swift` exercises recording, transcription or notes, so a green build says little about the rewrite's behaviour.

## 2. Native app, noticed but not done

- `systemEnabled` defaults to `false` in `AppModel.swift`. Turning it on by default would make recording fail outright without Screen Recording permission. This is still the owner's decision.
- CLAUDE.md, README and `docs/acceptance.md` describe the native code as "builds and its five unit tests pass on the macOS 15 CI runner". That is false while CI is red, and the rewrite may change what those docs say about the UI.
- No real run of the app is on record (CLAUDE.md status line). The site now states several behaviours as confirmed by the owner on 2026-10-16:
  - works offline after the model download;
  - Pause and the menu bar;
  - choosing an app captures all of its sound (`SCContentFilter` on the application);
  - the tested apps and languages.
  Re-check these against the rewritten UI.

## 3. Website, open items

- Owner assets:
  - Logo: the wordmark is plain Fraunces type, and `web/app/icon.svg` is still the old mark.
  - Four photographs: `story-record`, `story-transcribe` and `story-notes` (4:5, 2400x3000, subject in the top half toward the right) and `closing-band` (21:9 and 4:5, dark behind the text). Specs are in `docs/redesign/STATE.md`. The boxes are plain colour fields today.
- Legal pages: no legal entity, address, governing law, contact email or effective date. These are noted only as code comments in `web/app/privacy/page.tsx` and `web/app/terms/page.tsx`. The liability line "to the extent the law allows" needs a legal read.
- Licence: none chosen. FAQ 6 and /terms say so.
- Vercel dashboard: confirm Web Analytics and Speed Insights are off and check log retention, since /privacy says the site runs no analytics.
- Trust band: no one has checked whether each brand's guidelines allow its mark in one flat grey (Google, Microsoft, Zoom, Slack, Discord, Cisco, Apple, YouTube). FAQ 2 still says the apps are "not a tested list", although the owner has now confirmed them.
- Untested: a real trackpad and mouse wheel on the hero scroll, Safari (including the marker's SVG filter) and Firefox. Playwright's WebKit would not start on this Mac. Dark tokens exist but nothing switches them on, and they are untested.
- Optional follow-ups, recorded in STATE.md:
  - Hero window text is 9 to 13px between 1024 and 1439px wide. Fixing it needs a floor on `--stage-s` and a re-probe of ticket 07, because it moves the fold.
  - Fraunces `display: "swap"` causes CLS 0.024 on `/use-cases/client-meetings` at 390 on slow 4G. `optional` would remove it, but first-time visitors would then see the fallback face.
  - The professor cut-out (`public/characters/professor.png`, 165x505) looks soft on 2x screens.
- Brief docs out of date: `docs/redesign-brief/02-phase-b-concept.md` B3 still puts the trust band under the hero. `docs/redesign-brief/04-phase-d-build.md` still has an Integrations section and lists Free, Pro, Student and Enterprise pricing.
- All copy written after the owner's 2026-10-15 "I dont want to decide or review anything go" is listed under "Defaults taken" in STATE.md and the ticket Answers in `.scratch/redesign/issues/`. It has not been reviewed.

## 4. Process notes

- Redesign workers stopped other projects' Next dev servers twice: `~/obgrm/apps/web` on ports 3000 and 3012. They may still be down. `docs/redesign-brief/orchestrator.md` now says to stop servers by port only.
- Third-party reference captures (`docs/redesign/refs/`, `docs/redesign/behavior/`, prototype screenshots) are gitignored and exist only on the owner's Mac.
