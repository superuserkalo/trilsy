# 15: Use cases, Work pages

Status: done
Lane: design
Blocked by: 14

**Section:** six use-case pages: Sales calls, Customer calls, Team meetings, Client meetings, Recruiting, Incident calls.

**What to build:** each page in the shape set by 14, with its H1, lead, situation sentence and meta description from the copy deck, a notes example in its own setting, and two questions. Each page shows a different behavior of the product (for example search across recordings, timestamps, a record before the next call, comparable notes shape) so no page is a template with nouns swapped. No claim of action items, CRM, follow-ups or integrations.

- New copy (notes examples, questions) listed for the owner to review.

**Approved copy:** `docs/redesign/02-copy-deck.md` section 7.
**Behavior spec:** none.

**Images needed from the owner:** none.

- [x] Six pages, each with a distinct product behavior
- [x] New copy listed for review
- [x] Typecheck and build pass

## Answer

Design lane, Sonnet 5.5, loop mode, 2026-10-15.

- **Six pages**, each a folder `web/app/use-cases/<slug>/page.tsx` on the shared `UseCasePage` shape from 14: metadata (title new, description the deck's, canonical), two pack characters (or one), the `behavior` sentence, the window, two questions. H1, lead and situation sentence come unchanged from `lib/site.ts`. The windows are in `web/components/use-cases/`: `sales-demo`, `customer-demo`, `team-demo`, `client-demo`, `recruiting-demo`, `incident-demo`, plus `transcript-line.tsx` (one transcript row as the app shows it: HH:MM:SS timestamp, Microphone or System chip, text) and `use-play-once.ts` (plays once at 40% in view; finished state at once under reduced motion). Lectures was left as it was.
- **The behavior each page shows**, none repeated:
  1. **Sales calls:** press a timestamp and the audio plays from that line (the line is marked and the Play button becomes "Stop playback").
  2. **Customer calls:** search a word, the list narrows to the three calls it comes up in, and their transcripts open one after another so you read how each customer put the same question (invoice).
  3. **Team meetings:** the notes are plain text you can edit; a misspelled name is selected and typed over, the caret stays.
  4. **Client meetings:** read the last meeting's notes before the call, then press Record; a new recording starts at the top of the list and the pane turns to it.
  5. **Recruiting:** two interviews' notes side by side on shared grid rows (subgrid), the two overviews lined up and marked as one row. Section headings differ between the two on purpose (the notes model picks its own); only the shape is shared.
  6. **Incident calls:** the transcript is read down line by line and a postmortem timeline (the reader's own `postmortem.md`, not a Trilsy feature) is written beside the same timestamps.
- **Checked.** Chrome at 1440 by 900 and at 390 by 844 (emulated mobile), dev server on port 3155, stopped. No horizontal overflow on any page at either width. Every window's height is constant during its animation at both widths, sampled every 400 to 500ms (Sales 415 at 390; Customer 587; Client 763; Recruiting 746; Incident 616; Team 346; at 1440: Customer 449, Team 306, Client 506, Recruiting 391, Incident 562). Team had a one-line rewrap when the caret appeared on a phone; fixed (the wrong spelling is the same length as the right one and the caret is absolutely placed). No console errors or warnings. Captures `docs/redesign/prototypes/d15-*.png`. Typecheck and build pass; the six routes prerender static. Not run: Safari, Firefox, reduced motion live (read from code: each window sets its finished state at once; Client shows its first state, notes open with Record ready, because that is the half that matters; the caret is not drawn).
- **Mobbin.** Two queries; three kept in `docs/redesign/refs/use-cases/` (Grain, Dovetail, Arc) with what each informed, appended to that folder's README.
- **No claim of** action items, CRM, follow-ups, integrations, ranking, or speaker names. Honest limits are in the copy: no echo cancellation (headphones), transcription after you stop, search matches letters and not meaning, "Continue processing" edits not mentioned, timestamps are not clock times.

### New copy for the owner to review

Not in the copy deck. Every claim is checked against `docs/redesign/b8-fact-check.md`.

Titles (new): "Notes from your sales calls: record calls on your Mac" / "Keep every customer call: searchable transcripts on your Mac" / "Notes from your team meeting: record and edit on your Mac" / "A record of what was agreed: client meeting notes on your Mac" / "Interview notes you can compare: record interviews on your Mac" / "The incident call, written down: a timed transcript on your Mac".

The sentence beside each window (`behavior`):
1. Sales: "Every line of the transcript has a timestamp. Press it and the audio plays from that line, so the customer's exact words are one press away."
2. Customer: "Every call stays in your list as a transcript and notes. Search a word and open the calls it comes up in, one after another, to see how each customer put it."
3. Team: "The notes are plain text you can edit like any note: fix a name, cut a line, add what the notes model missed. The title and the transcript lines are editable too."
4. Client: "Every meeting stays in your list. Before the next one, open the last meeting's notes and read what was agreed, then press Record."
5. Recruiting: "The overview comes first every time, so you can read one candidate's notes and then the next without hunting for where each begins."
6. Incident: "Every line of the transcript carries the time it was said, counted from the start of the recording. Read down the timestamps and you have the order of events for your postmortem."

Questions (two per page):
- Sales. Q: "Should I wear headphones on a call?" A: "Yes. Trilsy records your microphone and your Mac's sound as two separate sources and does not cancel echo. On speakers, your microphone picks the customer up a second time. Headphones keep the two apart." Q: "Is the transcript ready when the call ends?" A: "Not quite. Trilsy transcribes after you stop, not while you talk, and writes the notes after that. How long it takes depends on the length of the call and on your Mac."
- Customer. Q: "Can I find a call by the customer's name?" A: "If the name is in the title, the transcript or the notes, yes. The title is editable like the notes, so put the customer's name in it after the call and the search box will always find it." Q: "Does search find a word that means the same thing?" A: "No. Search matches the letters you type, upper or lower case, against the title, the transcript and the notes. Searching for refund will not find money back, so try the words a customer is likely to use."
- Team. Q: "How do I share the notes with the team?" A: "Export the recording as Markdown: one file with the notes, then the transcript. Send that file the way you send any other." Q: "Does it work in a meeting room?" A: "Yes. Leave your Mac's sound off and Trilsy records through your microphone. How well it hears the far end of a room depends on your Mac's microphone and where the Mac sits."
- Client. Q: "Do the notes list what we agreed?" A: "Only if the conversation said so. The notes model is asked to write decisions and open questions only when the recording supports them, and there is no separate list of agreements. Read the notes against the transcript before you rely on one." Q: "Can I pause when the client asks me to?" A: "Yes. Pause and resume are in the app and in its menu bar item, and what is said while the recording is paused is not recorded."
- Recruiting. Q: "Does Trilsy rate or rank candidates?" A: "No. It writes a transcript and notes of what was said and scores no one. The comparison, and the decision, stay with you." Q: "Can I make sure a candidate's name is spelled right?" A: "Add the name to Names and specialist vocabulary in Trilsy's settings before you record. It goes to the transcription as a hint, not a guarantee, so check the name afterwards. The notes are plain text you can correct."
- Incident. Q: "Are the timestamps the time of day?" A: "No. They count from the start of the recording, so 00:11:20 is eleven minutes and twenty seconds in. Note the clock time when you press Record and you can turn any timestamp into a time of day." Q: "Will Trilsy write the postmortem?" A: "No. The notes summarize what was said and can include a decision when the call made one. The postmortem is yours to write, and the timestamps are what you write it from."

The notes and transcripts in the windows are invented illustration content (people, dates in September and October 2026, a checkout outage), with no label saying so.

Defaults taken: Sales and Incident both use timestamps but differently (playing the audio, versus reading the order of events into a document); if the owner wants no overlap, Incident can drop to a plain timeline with no second window. Customer and Lectures both use the search field; Customer differs by reading across several calls' transcripts, not opening notes. Questions avoid the consent point (FAQ 1) and the "who said what" point (FAQ 8) so the FAQ is not repeated. Character pairs are reused across pages from the pack's unused figures (03, 06, 08, 10, and 04 and 12 which `/students` also uses). Open: the two "Pause" and "menu bar item" claims come from the code (`App.swift`, `AppModel.swift`), not from a run of the app; the whole app has had no real run (`TODO: confirm` with the other app facts).
