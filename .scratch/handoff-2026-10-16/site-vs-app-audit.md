# Site claims checked against the rewritten app (2026-10-16)

Read-only audit of the web/ copy and mocks against the working-tree Swift, which includes the owner's uncommitted edits. Line numbers were current on 2026-10-16.

## False in code (fix first)

1. **Pause in the menu bar.** The claim is in `web/app/use-cases/voice-notes/page.tsx:33` and `client-meetings/page.tsx:39`, with a comment at voice-notes :22-23. The menu bar has only Open Trilsy, New Recording or Stop Recording, and Quit (`Sources/App.swift:27-36`). Pause exists only in the app's toolbar (`ContentView.swift:183`).
2. **Plain-text export mock.** `journalism-demo.tsx:113` (comment :12-14) shows `[Microphone]`. The app writes lower-case `[microphone]` and `[system]` (`Recording.swift:34`). Soften `journalism/page.tsx:41` to match.

## Changed by the rewrite

3. **"Transcribe & create notes" is now "Create notes"** (`ContentView.swift:331`). Update `voice-demo.tsx:153`, its comments and aria-label, and `voice-notes/page.tsx:26` and :39.
4. **Note instructions moved.** They are now "Note instructions…" in the recording's "…" menu, opening a popover (`ContentView.swift:276`, :374-383). Update `voice-notes/page.tsx:39`.
5. **Transcription is never automatic.** Stop only saves; transcription starts when you press Create notes. Fix "when you stop, it transcribes" in `lib/faq.ts:68` and `components/hero/story.ts:132` (both also feed llms-full.txt) and in how-it-works :52. `voice-notes/page.tsx:22-26` already says it correctly.
6. **Settings labels.** "Names & vocabulary" (`ContentView.swift:415`) goes in `recruiting/page.tsx:40` and `transcript-demo.tsx:41`. The language field's placeholder is "Auto-detect" (`transcript-demo.tsx:38`).
7. **No "Record" button.**
   - The app has "New recording" in the sidebar (`ContentView.swift:114`) and "New Recording" ⌘N in the menu. Update `sources-demo.tsx`, `talks-demo.tsx`, `voice-demo.tsx`, `client-demo.tsx`, and the "press Record" lines in `talks-courses-and-webinars/page.tsx:34` and `incident-calls/page.tsx:32`.
   - Microphone and App audio are now toggles inside a toolbar menu called "Audio sources", together with the Application picker (`ContentView.swift:188-205`). The "capture strip" mock should become that menu.
8. **App strings that comments call "the app's own".**
   - `app-controls.tsx:91-98`. The empty library state is now "A place for your next conversation" / "Start a new recording or import an audio file. Your notes will appear here." (`WorkspaceViews.swift:90-92`).
   - `voice-demo.tsx:134-135`. The empty notes pane is now "Ready to make sense of it" / "Turn this recording into a transcript and detailed notes, processed on your Mac." (`ContentView.swift:326-328`).
   - `client-demo.tsx:122-123`. A new recording is titled "Recording <date, time>", and the pane says "Recording in progress".
9. **Search placeholder** is "Search notes" (`ContentView.swift:123`). Update `lectures-demo.tsx:98` and `customer-demo.tsx:100`.
10. **Notes are rendered, not raw.** Headings, bullets and tables are rendered (`NotesDocument.swift`), and editing needs the Edit button, which opens a raw Markdown editor (`ContentView.swift:232`, :241-244). The mocks show raw "##" and editing in place: `notes-demo`, `team-demo` (whose whole point is typing a correction), `client-demo` and `lectures-demo`. "Plain text, so you edit them like any note" (`story.ts:139`) needs care.
11. **Placement.** Export (the same three entries) and Delete recording now sit in the recording's "…" menu, not as a top-level button or trash icon. Update `journalism`, `podcasts`, `research` and `library-demo`. Playback is an icon button with a scrub slider and times, so update `sales-demo.tsx:67-68`. Notes/Transcript are underline tabs, so update the ViewControl in `how-it-works/mock.tsx`.
12. **Progress and status strings.**
    - Progress reads "Writing detailed notes N of M…", with no separate overview step (`AppModel.swift:197`). Update `notes-demo.tsx:18`.
    - The status line shows the date, a rounded length ("1 min") and the status text. The demos show "00:01:12 · Recorded".
13. **Offline claim.** `lib/faq.ts:45` says it works offline after the download, which the owner confirmed on 2026-10-16. `README.md:22` still says offline behaviour must be verified. Align them with the owner's confirmation.

Still true: recording sources and their labels; App audio off by default; the app picker with "All apps"; capture is audio only; the permission text; storage path and files; uncompressed audio; no encryption; export formats; search over title, transcript and notes; playback from a timestamp; editable transcript and title; sections then an overview; the delete dialog text; the two Hugging Face models; no account, upload or analytics; "Allow model downloads".

## Native notes from the same audit

- `systemEnabled` is still `false` and not persisted. The uncommitted edits handle a missing Screen Recording permission with an alert that offers "Open System Settings" and "Show This Copy in Finder". The picker now lists running dock apps without needing capture access. Two new tests cover this, making 7 in total, which are uncommitted.
- **Picker risk:** the picker lists only `.regular` apps. Menu-bar-only apps are gone, and whether browser helper processes are captured needs testing on a real Mac.
- **Test risk:** `testApplicationPickerListsRunningAppsWithoutCaptureAccess` assumes another dock app is running on the CI runner.
- **Failed starts:** a failed start, such as a denied permission, leaves an empty "Recording could not start" entry each time.
