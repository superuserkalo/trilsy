# Copy deck (Phase B, B9) — draft for Gate B

Written to `copy-playbook.md` and the product facts in `docs/redesign-brief/00-master.md` as updated on 2026-10-15. Every claim is true of the app today per `b8-fact-check.md`, or is a plain "not yet" in an FAQ answer. No roadmap list. No claim about bots. No prices in OG images, JSON-LD or llms.txt. Every `TODO: confirm` is collected at the end. Nothing here is approved until the owner approves it; no code starts before then.

Words not used: AI-powered, seamless, effortless, magic, supercharge, unlock, #1, best, revolutionary, "for students" in the hero, "open source" (until a licence exists), "integrates", any badge.

## 1. Header

Wordmark: Trilsy (`TODO: logo`). Items: **Use cases** (dropdown), **Pricing**, **How it works**, **Students**. Button: **View on GitHub**.

## 2. Hero

**H1 (chosen by the owner):** Be in the conversation. Trilsy writes the notes.
Alternatives kept on file, in case: (b) Every call, lecture and interview, written down. (c) Notes for the conversation you are in.

**Subhead, 3 options (recommended first):**
1. Record your microphone, your Mac's sound or both. Trilsy transcribes it and writes notes you can edit.
2. Trilsy records a call, a lecture or an interview, transcribes it on your Mac and writes notes you can edit.
3. Press record in any room or on any call. When you stop, Trilsy writes the transcript and the notes.

Why 1: it is exact about the three sources (system sound is a switch, off by default), it is under 20 words per sentence, and it states the order the app really works in.

**Button:** View on GitHub. **Helper under it:** Apple silicon, macOS 15 or later. No signed download yet.
**Hero window (the mockup, an illustration):** title is the setting ("Biology 201, lecture 9", "Product sync", "Ana Ribeiro, product designer"); tabs Lecture, Meeting, Interview; the recording states read Recording, Stop, Transcribing, Writing notes, in that order; transcript chips use the app's own labels, Microphone and System; the button reads Create notes only if the app has one (to confirm with the build; the app today writes notes after processing, not on a button).
**Hero scene bubbles** (illustration, role names): "Mitosis has four stages. Prophase comes first." / "Can we move the launch to the 14th?" / "We moved the whole team to Lisbon in March."

## 3. Trust band

**Line:** Trilsy records whatever your Mac plays, from the apps you already use.
**Names:** Zoom, Google Meet, Microsoft Teams, Slack, Discord, Webex, YouTube, Safari, Google Chrome, FaceTime. **Footnote:** App names and marks belong to their owners; no affiliation or endorsement is implied. `TODO: confirm` each app on a real Mac before launch.

## 4. The story (home, pinned scroll)

Heading for the section is the first chapter's; no separate eyebrow.
- **1. Press record.** Trilsy captures your microphone, your Mac's sound or both. Pick one app or all of them. *Photo alt:* A person at a table with a laptop open, the room streaking behind them.
- **2. Get the transcript.** When you stop, Trilsy transcribes on your Mac. Every line has a timestamp that plays the audio from that point. *Alt:* Someone speaking, caught sharp while the room blurs around them.
- **3. Read the notes.** Notes come section by section with a short overview on top. They are plain text, so you edit them like any note. *Alt:* The same person alone by a window afterwards, reading.
Under the story, one quiet line: Your recordings stay on your Mac.

## 5. Questions (home shows the first six; the page holds all ten)

Heading: **Good questions.**
See section 11 for the answers.

## 6. Closing band (over the photograph)

**Heading, 3 options (recommended first):** Walk out with the notes. / Be in the room, not behind a notebook. / Keep the conversation. We kept the details.
**Button:** View on GitHub. **Helper:** Free, on your Mac, no account.

## 7. Use cases

Dropdown and index page, twelve pages, each a plain name and one true line (also the page's lead). Each page: an H1, the lead, one situation sentence, a notes example in the page's own setting, two questions, a button, and for the two learning pages a single line to `/students`.

| Page | H1 | Lead (dropdown line) | Situation sentence | Meta description |
| --- | --- | --- | --- | --- |
| Sales calls | Notes from your sales calls | Record the call, get a transcript and notes, and search what the customer said. | You are on the call, not typing: afterwards the transcript has what they said, with timestamps. | Record a sales call on your Mac, get a transcript and notes you can edit, and search what the customer said. |
| Customer calls | Keep every customer call | Keep every call as a transcript, and find the question people keep asking. | Search across your recordings for the word a customer used. | Keep customer calls as searchable transcripts and notes on your Mac. |
| Team meetings | Notes from your team meeting | Take part while Trilsy writes the notes; edit them and search past meetings. | You talk; Trilsy listens and writes the overview. | Record team meetings on your Mac and get editable notes and a transcript. |
| Client meetings | A record of what was agreed | A record of what was agreed, to read before the next call. | Open the last meeting's notes before you start the next. | Keep a transcript and notes of every client meeting, saved on your Mac. |
| Recruiting | Interview notes you can compare | An interview transcript and notes you can compare across candidates. | Every interview has the same shape of notes: an overview, then the detail. | Record interviews on your Mac and get a transcript and notes for each candidate. |
| Incident calls | The incident call, written down | Record the call, then search the transcript when you write the postmortem. | The timestamps tell you what was said when. | Record an incident call and search the timed transcript afterwards. |
| Lectures | Lecture notes you can search | Lecture transcripts and notes you can edit and search before the exam. | Sit and listen; the notes are waiting when it ends. | Record a lecture on your Mac, get a transcript and notes, and search them before the exam. |
| Talks, courses and webinars | Notes from anything that plays sound | Record what your Mac plays and keep the transcript and notes. | A video in a browser tab is recorded the same way as a call. | Record a talk, a course or a webinar playing on your Mac and keep the transcript and notes. |
| Research interviews | Interviews to quote from | Interview transcripts to quote from, notes to code, audio kept on your Mac. | The audio never leaves your Mac. | Record research interviews on your Mac and keep the transcript, notes and audio. |
| Journalism | Interview transcripts you can quote | Interview transcripts you can quote from, search and export as text. | Export the transcript as plain text, with timestamps. | Record an interview on your Mac and export the transcript as text. |
| Podcasts and video | A transcript and subtitles | A transcript and subtitles (SRT) from a recorded conversation. | One export gives you a subtitle file. | Turn a recorded conversation into a transcript and an SRT subtitle file on your Mac. |
| Voice notes | Think out loud | Think out loud; get a transcript and Markdown notes. | Press record, talk, and read the notes. | Record a voice note on your Mac and get a transcript and Markdown notes. |

Learning pages end with: Students get 50% off every paid plan. See the Students page. `TODO: confirm`

## 8. How it works (page)

Heading: **Press record. Read the notes.**
- **What is recorded.** Your microphone, your Mac's sound or both. System sound is a switch, off until you turn it on, and needs macOS's Screen & System Audio Recording permission. Wear headphones when you record both. You can also import an audio or video file.
- **Where it lives.** Audio is saved as short files in a folder on your Mac, `Library/Application Support/Trilsy/Recordings`. The transcript and notes are files next to it. Trilsy has no account and uploads nothing. Your Mac's disk encryption protects them; Trilsy does not add its own.
- **How the transcript is made.** After you stop, Trilsy transcribes on your Mac with Whisper (the small model). Language is detected, or you pick one. You can add words it should know.
- **How the notes are written.** A language model on your Mac writes detailed notes section by section, then puts a short overview on top. Check them against the audio; the model can be wrong, and a timestamp it writes into the notes is not a link.
- **What you can do with them.** Edit the notes, the transcript and the title. Search your recordings by title, transcript and notes. Export Markdown (notes and transcript), text (transcript) or SRT subtitles (transcript).
- **What you need.** Apple silicon, macOS 15 or later, 16 GB of memory recommended. The two models download once from Hugging Face and take several GB; recordings are saved uncompressed, so they are large.
- **The code.** The source is on GitHub. View on GitHub.

## 9. Pricing (page)

**Heading:** Recording and notes on your Mac are free.
**Free (available):** The whole app, no time limit, no account. Record, import, transcribe, write notes, edit, search, export. Always on your Mac.
**Pro (not available yet):** Sync of your transcripts and notes, an MCP server, and connections to your apps. Your recordings stay on your Mac. $12 a month or $96 a year `TODO: confirm`. **Students get 50% off every paid plan** `TODO: confirm`.
**Calculator (modelled on the owner's reference):** headline "If you record [slider] hours of meetings a month"; bands Light under 5 hours, Typical 5 to 20, Heavy 20 and up; bars for Trilsy ($0, free, on your Mac), Otter, Granola and Wispr Flow; result "$0 /month with Trilsy. The app costs nothing at any usage."; "Save $X a year vs [the cheapest]"; footnote "Other companies' monthly plans, read from each company's own pricing page on 15 October 2026, for the cheapest plan that covers the hours above. Prices change; check the company's page." Competitors' figures in `refs/pricing-checked-2026-10-15.md`; Fireflies and Superwhisper left out for lack of a readable price. The figures are re-read before launch. `TODO: confirm`
No price appears in any OG image, JSON-LD or llms.txt.

## 10. Students (page)

**H1:** Students get 50% off everything paid.
**Body:** Trilsy is free, and recording a lecture, a seminar or a course costs nothing. When paid plans are available, students and educators get 50% off every one, with a verified student or school email. `TODO: confirm` Lecture notes you can search before the exam: see Lectures. Study with the course videos you already watch: see Talks, courses and webinars. **Button:** View on GitHub.

## 11. FAQ (ten questions; the answer starts with the answer)

Synced 2026-10-16 (Phase E) to the shipped answers in `web/lib/faq.ts`, lengthened to 40 to 60 words for answer engines by the design lane under the owner's no-review instruction. JSON-LD uses the cost answer without the 50% (`schemaAnswer`).

1. **Will the people on my call know I am recording?** They may not. Trilsy records on your Mac, so other people on a call may see nothing at all. You are responsible for telling everyone before you begin, and the law on recording differs by place. Say so first, whether you are on a call, in a meeting room or in a lecture hall.
2. **Which apps does it work with?** Any app that plays sound: one app or all of them, picked in a list. In a room it uses your microphone instead. Zoom, Google Meet, Microsoft Teams, Slack, FaceTime, Webex and a browser tab are examples of apps that make sound, not a tested list and not integrations. `TODO: confirm` (Try each named app on a real Mac (copy deck 13, item 4)).
3. **Where are my recordings kept?** On your Mac, as ordinary files in `Library/Application Support/Trilsy/Recordings`, one folder for each recording. Trilsy does not encrypt them itself; your disk encryption does. Delete the folder and the recording is gone. Nothing is kept anywhere else, because there is no account and no upload.
4. **Does anything leave my Mac?** No. Your audio, transcript and notes stay on your Mac as files. Trilsy has no account, no upload and no analytics. The only download is the two models, once from Hugging Face before first use, which needs a connection; after that it works offline. Nothing you record is sent anywhere, and nothing is kept for you on a server. (Offline use confirmed by the owner, 2026-10-16.)
5. **What does it cost?** The app is free, with no time limit, and it needs no account. A paid Pro plan is not available yet. Students get 50% off every paid plan. The free app always stays local, with your recordings kept as files on your Mac, so what you pay for later never decides whether you can keep them. `TODO: confirm` (Student discount of 50% and its verification method (copy deck 13, item 2)).
6. **Is it open source?** Not yet. The source is on GitHub, where anyone can read it, but we have not chosen a licence, so we do not call it open source. That decision is still to be made, and until it is, the code is there to read and nothing should be assumed about reusing it. `TODO: confirm` (Re-word once the licence is chosen (copy deck 13, item 6)).
7. **Does it transcribe while I talk?** No. Trilsy records first, and when you stop it transcribes the recording on your Mac and then writes the notes. You get the transcript and the notes after the recording ends, not line by line while you talk. An audio or video file you import goes through the same steps.
8. **Does it know who said what?** No. Trilsy does not identify speakers. Each transcript line is labelled by where the sound came from: Microphone, System or Import, not by person. With your Mac's sound switched on, your own voice arrives through the microphone and the people you hear through your Mac arrive as System, unnamed.
9. **What do I need?** An Apple silicon Mac with macOS 15 or later; 16 GB of memory is recommended. The two models take several GB and recordings are saved uncompressed, so leave room on your disk. You also need an internet connection once, to download the models before first use, so allow for that download the first time.
10. **Can it connect to my apps or my AI assistant?** Not yet. A paid plan is planned to add connections to Google Calendar, Notion, Slack, Google Drive and Microsoft apps, and an MCP server so an assistant can search, read and write your notes and start and stop a recording. None of it exists yet. A recording an assistant starts is still a recording: tell people.
Also on the page, one line each: **Is there an iPhone app?** Not yet. **What languages?** Detected, or pick one; `TODO: confirm` which were tested.

## 12. Microcopy and metadata

- **App states in mockups:** Recording, Pause, Stop, Transcribing, Writing notes, Rewrite notes. Source labels: Microphone, System, Import. Empty search: No recordings match.
- **Buttons:** View on GitHub; Use cases; Pricing; How it works; Students.
- **Footer:** the use-case list in plain columns, the legal links, and the trademark line above. `TODO: confirm` the legal pages exist before launch.
- **Page title (home):** Trilsy: notes for every call, lecture and interview. **Meta description:** Trilsy is a Mac app that records your microphone, your Mac's sound or both, transcribes it on your Mac and writes notes you can edit. Free, no account.
- **OG title:** Be in the conversation. Trilsy writes the notes. (no price)
- **llms.txt summary:** Trilsy is a Mac app for Apple silicon (macOS 15 or later). It records the microphone, the Mac's sound or both, transcribes the recording after it ends with Whisper on the Mac, and writes editable notes with a local language model. Files stay on the Mac. Export: Markdown, text, SRT. Source on GitHub. No signed release yet. (no prices, no unbuilt features)
- **Alt text for characters:** each figure is described by role and what it does in the scene ("A professor with clasped hands, speaking").

## 13. Everything marked TODO: confirm, in one list (for the owner)

1. Pro price: $12 a month, $96 a year; no lifetime price.
2. Student discount: 50% on every paid plan; verification method.
3. The pricing comparison: re-read Otter, Granola and Wispr Flow before launch; Fireflies and Superwhisper need a readable price or stay out.
4. Each named app in the trust band and FAQ 2: tried on a real Mac.
5. Whether the app works fully offline after the model download.
6. The licence, and so the wording "open source" and any star count.
7. Which languages are tested.
8. Whether the app has a "Create notes" button, or writes notes automatically (the hero window wording).
9. That the legal pages (privacy, terms) exist.
10. The logo and the wordmark (`TODO: logo`).
11. Every image box marked `TODO: image` and every character marked `TODO: character`.
