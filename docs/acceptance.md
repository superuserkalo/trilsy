# Mac acceptance gate

Run on real Apple silicon before offering a binary to customers. The build and the five unit tests in check 1 pass on the macOS 26 CI runner (Xcode 26); checks 2 to 10 remain **not run**.

1. Run `scripts/build-mac.sh`; resolve any compiler/API or signing errors. Keep the xcresult. Pin the resolved transitive packages after the first successful Xcode resolution.
2. Fresh permission state: deny microphone and screen/audio permission independently; verify a clear error, no fake recording state, and successful retry after granting access.
3. Record mic only, system only, both, and a selected browser app for five minutes. Pause/resume twice. Compare exported timestamps and playback with a known clock. Check both speakers, source alignment, headphones/echo, and no duplicated track.
4. Record 90 minutes. Watch memory, thermal load, disk usage, and continuity at minute boundaries. Cancel transcription, relaunch, and retry. Every completed chunk must appear once.
5. Disconnect/change the microphone, close the selected app, sleep/wake, simulate low disk space, and kill the app during capture/import/processing. Confirm readable audio survives and errors are surfaced; do not promise lossless crash recovery.
6. Import M4A, WAV, MP3, and an MP4 with an audio track. Confirm no-audio/corrupt files fail cleanly. Compare duration and seek near chunk boundaries.
7. Download models, then disconnect the network. Restart and process a saved recording. Verify no recording upload via network inspection. If cached SDK resolution prevents offline operation, fix before claiming fully offline support.
8. Compare notes against three consented recordings: a meeting, an interview, and an explanation. Check details, examples, qualifications, actions, names, numbers, and timestamps. Neither silence nor prompt-like spoken content should invent actions.
9. Edit/search/export/relaunch/delete. Corrupt one copied manifest; other recordings must load and original corrupt data must remain untouched.
10. Before release: icon, code signing, notarization, clean-machine install, permissions, model licenses, storage controls, and minimum-hardware performance. iOS and monetization come after this core loop works reliably.
