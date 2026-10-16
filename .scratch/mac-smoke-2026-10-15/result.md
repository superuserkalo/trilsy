# Mac smoke test, 2026-10-15

Result: blocked before app launch by a full startup disk.

- Ran `./scripts/build-mac.sh` on the owner's Apple silicon Mac.
- The sandboxed attempt could not resolve github.com. The authorized network-enabled retry fetched packages and started native compilation.
- Xcode exited 65. Its build database and compiler outputs failed with `No space left on device` and `database or disk is full`.
- No unit tests ran. No successful app build, launch, capture, import, transcription, notes, or UI verification is claimed.
- The xcresult in `build/Logs/Test/` is incomplete because Xcode could not save it. `build.log` beside this file preserves the terminal output.
- Removed only compiler intermediates, index, and module cache generated under this checkout's previously absent `build/` directory. Dependency checkouts remain for a retry. Free space after cleanup was about 675 MiB.
- Prepared `/tmp/trilsy-smoke-20261015/meeting.wav`, 17.947 seconds of synthetic speech, for import and transcript/notes checks. It has not been imported.
- No application source changes were made. Existing dirty work was preserved.

Next: free approximately 10 GB for a fresh build plus the initial speech and notes model downloads, rerun the native tests, then launch `build/Build/Products/Debug/Trilsy.app` and begin the real-device acceptance checks. Permission prompts must be handled before microphone and system-audio capture.
