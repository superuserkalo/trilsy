# 16: Use cases, Learning and media pages

Status: done
Lane: design
Blocked by: 14

**Section:** five use-case pages: Talks, courses and webinars; Research interviews; Journalism; Podcasts and video; Voice notes.

**What to build:** each page in the shape set by 14, with its H1, lead, situation sentence and meta description from the copy deck, a notes example in its own setting, and two questions. Each shows a different behavior (system sound from a browser tab, audio kept on the Mac, text export with timestamps, SRT export, microphone-only voice notes). Talks, courses and webinars ends with the line to `/students`.

- New copy (notes examples, questions) listed for the owner to review.

**Approved copy:** `docs/redesign/02-copy-deck.md` section 7.
**Behavior spec:** none.

**Images needed from the owner:** none.

- [x] Five pages, each with a distinct product behavior
- [x] New copy listed for review
- [x] Typecheck and build pass

## Answer

Design lane, Sonnet 5.5, loop mode, 2026-10-15. The owner's standing instruction for this run: no review, take the recommended option, list it under Defaults taken.

- **Five pages**, each `web/app/use-cases/<slug>/page.tsx` on the shared `UseCasePage` from 14 (H1, lead, situation sentence and description from `lib/site.ts`, unchanged): talks-courses-and-webinars, research-interviews, journalism, podcasts-and-video, voice-notes. Talks ends with the Students line (its `learning` flag was already set). Windows in `web/components/use-cases/`: `talks-demo`, `research-demo`, `journalism-demo`, `podcasts-demo`, `voice-demo`. New shared `app-controls.tsx` (`DrawnSwitch`, `PopMenu`, `MenuButton`, `EmptyPane`: the app's switch, drop-down menu, Export button and empty pane drawn as decoration, none focusable); `TranscriptLine` takes a `className`.
- **The behavior each page shows**, none repeated on the other eleven:
  1. **Talks, courses and webinars:** the capture strip with Microphone off and App audio on; the app list opens, Safari is chosen; the recording is a transcript whose every line is System.
  2. **Research interviews:** audio stays on the Mac and its owner decides its fate. An interview is open, Delete is pressed, the app asks its own question ("Permanently delete this recording, audio, and notes?"), the interview leaves the list and the next one opens. (Chosen over the recording folder picture because How it works block 2 and FAQ 3 already show where the files are.)
  3. **Journalism:** Export, "Plain text transcript", and the file it writes: `[00:18:04] [Microphone] text`, the app's exact format, with one line selected as the quote.
  4. **Podcasts and video:** Export, "SRT subtitles", and the file: numbered cues with `HH:MM:SS,mmm --> HH:MM:SS,mmm`, played in turn against a drawn plain frame whose caption shows each cue.
  5. **Voice notes:** the microphone alone, in the app's own order: Record, the recording row (red dot, time, Pause, Stop & save), "Transcribe & create notes", its progress line ("Writing detailed notes 1 of 1…"), then the notes.
- **Checked.** Chrome (dev server on port 3166, stopped). Timers were stepped by hand through every state, window height sampled every 500ms: constant on all five. At 390 by 844 (emulated mobile): Talks 657px, Research 559, Journalism 728, Podcasts 567, Voice 542. At 1440 by 900: Talks 530, Research 359, Journalism 596, Podcasts 379, Voice 426. No horizontal overflow at either width, no console errors or warnings. Opened menu, dialog, recording row and end state looked at on screenshots (`docs/redesign/prototypes/d16-*.png`). Fixed on the way: the Voice strip came back blank after Stop (it now returns to the idle strip, as the app does); Voice showed the "no recording" text while recording (it now shows the app's "The conversation, made useful" text); Research's phone list cut its third row. Typecheck and build pass; the five routes prerender static. Not run: Safari, Firefox, reduced motion live (read from code: each window sets its finished state at once; Voice ends on the notes, Research after the delete, Talks on the transcript).
- **Mobbin.** Two queries; three kept in `docs/redesign/refs/use-cases/` (Descript, Current, Riverside), appended to that README with what each informed.

### New copy for the owner to review (not in the copy deck; claims checked against the code and `b8-fact-check.md`)

Titles: "Notes from anything that plays sound: record talks and courses on your Mac" / "Interviews to quote from: record research interviews on your Mac" / "Interview transcripts you can quote: export text with timestamps" / "A transcript and subtitles: SRT from a recorded conversation" / "Think out loud: voice notes on your Mac".

The sentence beside each window (`behavior`):
1. Talks: "Turn on your Mac's sound, leave the microphone off, and pick the app that is playing, such as your browser. Trilsy records what that app plays, and every line of the transcript comes back marked System."
2. Research: "Each interview stays on your Mac as audio, a transcript and notes, and Trilsy does not upload it. If a participant withdraws, one Delete, after one question, removes all three."
3. Journalism: "Export the transcript as plain text and every line keeps its timestamp and where the sound came from. Pick out a quote, keep its time, and you can find the audio again."
4. Podcasts: "One export gives you a subtitle file: every line of the transcript becomes a numbered subtitle with a start time and an end time. SRT is the plain subtitle format that most video editors and players read."
5. Voice notes: "With your Mac's sound off, which is how Trilsy starts, only your microphone is recorded. Talk, press Stop & save, then Transcribe & create notes, and read the notes."

Questions (two per page):
- Talks. "Can I record one tab and not the others?" No: one app or all of them, not one tab; pick the browser and you get everything it plays, so close the tabs you do not want. / "Does it record the slides?" No: sound only, no video, no screenshots; what is only on a slide and never spoken is not in the transcript or notes.
- Research. "If a participant withdraws, can I remove everything?" Yes: Delete removes the recording's folder (audio, transcript, notes) after one confirmation, not to the Bin; copies you made, an export or a disk backup, stay. / "Does Trilsy keep the audio once the transcript is written?" Yes, until you delete the recording; every timestamp plays from it; saved uncompressed, so check free space.
- Journalism. "Does the text file include the notes?" No: transcript only; Markdown has notes first then transcript; SRT is transcript only too. / "If I interview someone by phone or video call, are both sides in the file?" Yes if microphone and Mac's sound are recorded together: one file in time order, each line Microphone or System; wear headphones.
- Podcasts. "Can I fix a word before I export the subtitles?" Yes: each transcript line is editable and the export uses the text as it stands; a speech model can mishear names and unusual words, so read before publishing. / "Can I make subtitles for a file I already have?" Yes: Import audio or video reads a file macOS can open; lines are marked Import; one line of transcript is one subtitle and Trilsy does not split or reflow them.
- Voice notes. "Can I pause while I think?" Yes: in the app and its menu bar item; what is said while paused is not recorded. / "Can I tell it how to write the notes?" Yes: the optional instructions field above the notes, taken as preferences, a request and not a guarantee.

The windows' people, titles, dates and notes (a statistics course, a study of where students work, a bus-route interview, a kitchen-table podcast, a walk to work) are invented illustration content with no label saying so.

### Defaults taken (owner asked for no review)

Safari is the app in the picker (an illustration, never described as tested); Research shows the delete flow instead of the recording folder; Journalism's interview is unnamed ("Bus route funding"), no named official; Podcasts' video frame is a plain drawn rectangle, not a photograph and not a Trilsy feature; Voice notes' recording row shows a still time (00:00:41) and a still level bar; character pairs reused from the pack (the pack has eight figures and twelve pages, so repeats are unavoidable); marker words per H1 (2, 3, 3, 2, 2).

### Open (`TODO: confirm`)

- Talks: that the browser's whole sound is captured when it is picked in the app list, and that pickers list it, is read from the code (`SCContentFilter` on the application), not from a run on a real Mac; "one tab" depends on how the browser attributes audio.
- Voice notes: the Pause and menu bar claims come from the code, not from a run (as on ticket 15's Client page).
- Research: the uncompressed-audio line states no size on purpose (the over 1 GB an hour figure is an unmeasured estimate).
- Safari, Firefox, reduced motion run live; breadcrumb JSON-LD (ticket 18).
