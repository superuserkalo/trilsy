# Local processing test, 2026-10-15

Result: speech and notes models downloaded successfully. Two recordings completed the local pipeline and reached Ready. This proves a short local run, not release acceptance.

## Completed checks

- Owner-created 12-second microphone recording transcribed into two saved segments and completed notes plus overview. Its private content is omitted from this report.
- Synthetic 17.947-second meeting clip produced six transcript segments, generated detailed notes and an overview, and reached Ready.
- The transcript preserved November 3, Maya's onboarding checklist, Friday, EUR 1200, the choice between three or five teams, and the explicit absence of a final decision on team count.
- The synthetic notes preserved those facts, including that team count remains unresolved.
- Minor transcription error: the app name Trilsy was recognized as Trilse.
- Markdown export was written through the native Save panel. Its contents exactly matched the saved recording's title, notes and transcript. See `synthetic-result.md`.
- Speech cache appeared under `~/Documents/huggingface`; the notes model appeared under `~/Library/Caches/models/mlx-community/Qwen2.5-3B-Instruct-4bit`. Both were downloaded by the app.
- No application source changes were made.

## Issues observed

1. Failed imports retain empty entries labeled `Interrupted — ready to resume processing`, despite containing no audio and having processing disabled.
2. During the first notes-model download, the UI displays `Writing detailed notes 1 of 1` without download bytes or percentage. A growing CFNetwork temporary file confirmed that this was download activity rather than generation or a proven hang.
3. Processing progress is global and appears below a different selected recording if the user changes selection. The processing recording's sidebar status is the reliable indicator.
4. The synthetic overview repeats the detailed notes rather than providing only a short overview. The generated output contains stray/unbalanced Markdown code fences. Factual preservation passed this small fixture; presentation quality did not.

## Export/UI diagnostic limitation

After the Markdown export, repeated native UI observations timed out. The export file itself was present and exact. A two-second stack sample showed Trilsy's main thread predominantly idle in its ordinary AppKit event loop, with no sampled export blockage. Accessing Finder through the same UI tool eventually succeeded but took about 27 minutes. This does not establish an app hang or its cause. See `export-process-sample.txt` for the diagnostic sample.

Because the native UI connection became unreliable, plain-text and SRT UI exports, UI relaunch persistence, and further interactions were not completed. Do not describe those as passed. No restart or force-quit was used during this diagnostic.

## Remaining acceptance work

System-only/both/selected-app capture, pause/resume, permission denial/retry, long recordings, route and sleep changes, offline execution and network inspection, cancellation and recovery, note editing persistence, complete export/relaunch checks, clean-machine install, signing and notarization remain unverified. The five unit tests and shorter native checks are documented in `retry-result.md`.
