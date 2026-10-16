# Mac smoke test retry, 2026-10-15

Build and five unit tests passed on the owner's Mac. Native app launched successfully. Full recording-to-notes acceptance remains incomplete.

## Environment and build

- macOS 26.0, Xcode 26.1.1, arm64 destination.
- Initial free space on retry: 47 GiB.
- Command: `./scripts/build-mac.sh`.
- Five tests passed, zero failures. Build terminal output: `retry-build.log`.
- Result bundle: `/Users/kalo/trilsy/build/Logs/Test/Test-Trilsy-2026.10.15_21-19-22-+0200.xcresult`.
- Resolved dependency versions copied to `Package.resolved` beside this report for provenance.

## Verified in the native UI

- App launches and shows an empty library on first launch.
- Synthetic speech WAV imports successfully. Its original duration is 17.947392 seconds; persisted imported audio duration matches.
- Play changes to Stop playback and the playback position advances. Audible quality was not independently verified.
- M4A, MP3, and MP4 audio imports succeed. MP3 reports 18.024490 seconds, consistent with encoding padding.
- A 70-second WAV imports into two parts: 60.001360544 seconds at offset 0 and 9.998639456 seconds at offset 60.001360544. Total is 70 seconds without a gap or overlap in metadata.
- Transcribe & create notes with downloads disabled shows a clear consent-required message.
- A video with no audio shows `This file has no readable audio track.`
- A corrupt WAV shows `The operation could not be completed`. App remains responsive.
- Renaming the long test recording to `Trilsy chunk boundary smoke test` works. Searching `chunk boundary smoke` filters the library to that recording.
- During testing the owner started a live microphone recording. The UI showed Recording, an advancing timer, and a nonzero microphone level. The agent left that recording running rather than interrupting the owner.

## Observed issue

Failed imports retain empty library entries labeled `Interrupted — ready to resume processing`, while playback and processing are disabled because there are no audio parts. Reproduced with both no-audio MP4 and corrupt WAV. This is misleading and gives no usable retry action. Source explanation: `AppModel.importMedia` persists status Importing; its error handler calls reload; `RecordingStore.load` relabels Importing as Interrupted without checking whether the recording contains recoverable audio.

## Still unverified

- Recording stop/save/playback, pause/resume, source alignment, permissions denial/retry, and system/app audio capture.
- Speech and notes model downloads and a complete transcript-to-notes run. Download consent was requested from the owner and remains pending.
- Transcript/notes accuracy, editing and exports after processing, saved-data relaunch, offline processing, cancellation and crash recovery.
- Long recording, route changes, sleep/wake, clean-machine install, signing and notarization.

Only synthetic fixtures were imported by the agent. No app source was changed, and unrelated dirty work was preserved. Test fixtures are under `/tmp/trilsy-smoke-20261015/`.

## Recording follow-up

The owner stopped the live recording before this turn ended. The app returned to idle. Its saved manifest reports Recorded, one microphone audio part, and approximately 19.075 seconds duration. Saved audio playback and its content were not verified. This establishes a short microphone start/stop/save run in addition to the earlier import checks.

## Processing run started

The owner approved model downloads. A second owner-created microphone recording was already processing when the agent resumed. It reached the notes stage after transcription. The app still labels the stage `Writing detailed notes 1 of 1` while the notes model is downloading. An active CFNetwork download confirmed continued progress, so the unchanged UI was not evidence of a stalled process. Model download progress is not exposed to the UI.

## Audio integrity check

Decoded the original 70-second WAV and the app's two saved CAF chunks to float PCM. Concatenating the saved chunks reproduces all 1,543,500 source samples byte for byte. SHA-256 is `f8e586da34dfa098435622daea128554c7357f4a2c03627232c4f5196c80097d`. This verifies audio preservation across the import chunk boundary, beyond matching metadata timestamps.
