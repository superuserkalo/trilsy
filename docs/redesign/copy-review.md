# Copy review: everything written without your review

Written 2026-10-16 by the design lane, read-only on `web/`. Source: the files in `web/` as they stood when this was written.

## How to use this

This is every piece of site copy the workers wrote after you said "I dont want to decide or review anything go" (2026-10-15), plus anything that is not in the approved copy deck (`docs/redesign/02-copy-deck.md`) as it stood at Gate B. Items are grouped by page, in site order. Each item gives where it appears, the exact current text, and an empty `Change:` line: write the new wording there, or write "ok". Items that make a promise, a legal statement or a product claim start with **[claim]**; read those first (search the file for `[claim]`). Copy you approved at Gate B is skipped unless it has changed since; changed copy shows old and new side by side. Invented mock content (names, notes, transcripts, window titles) is a compact list per page, first line and file only.

Three caveats.
- `web/components/hero/story.ts` and `demo-window.tsx` were being edited by another worker while this was written (both last changed 15:59 on 2026-10-16). The home items quoted from them may still change.
- The FAQ answers: the deck's section 11 was synced to the shipped, lengthened answers on 2026-10-16, and git holds no earlier version, so the Gate B wording of the ten answers cannot be shown. Each is listed as unreviewed in full.
- Strings in mock app windows ("Ready to make sense of it" and the like) are copied from the Swift source by the workers (their comments say "the app's words, exactly"). I did not re-check them against `Sources/` here, except the delete dialog, "Refresh apps" and the two empty-document lines, which I found in `Sources/ContentView.swift`.

### Item counts

| Page | Items | Of which [claim] |
| --- | --- | --- |
| Home | 10 | 5 |
| How it works | 7 | 1 |
| Pricing | 3 | 1 |
| Students | 1 | 0 |
| FAQ | 10 | 10 |
| Use cases index | 2 | 0 |
| Sales calls | 6 | 2 |
| Customer calls | 6 | 2 |
| Team meetings | 6 | 2 |
| Client meetings | 6 | 2 |
| Recruiting | 6 | 2 |
| Incident calls | 6 | 2 |
| Lectures | 6 | 2 |
| Talks, courses and webinars | 6 | 2 |
| Research interviews | 6 | 2 |
| Journalism | 6 | 2 |
| Podcasts and video | 6 | 2 |
| Voice notes | 6 | 2 |
| Privacy | 8 | 5 |
| Terms (with the imprint) | 10 | 8 |
| Footer | 2 | 1 |
| Site-wide (skip link, menu names) | 1 | 0 |
| Page titles and descriptions (one table, rows) | 19 | 4 |
| Share image | 1 | 1 |
| llms.txt, llms-full.txt and JSON-LD | 4 | 4 |
| **Total** | **150** | **64** |

Items with old and new side by side: Home 4 (H2, H3, H6, H7), How it works 1, FAQ 2 (F6, F7), llms 2 (L1, L2).

---

## Home (`/`)

**H1. Hero subhead.** Hero, `web/components/hero/hero-copy.tsx`. Deck offered three subheads, recommended first; the ticket worker took option 1 as a default.
> Record your microphone, your Mac’s sound or both. Trilsy transcribes it and writes notes you can edit.

Change:

**H2. [claim] Hero helper line, changed.** Hero, under the button, `hero-copy.tsx`. The deck's helper had a second sentence that is now gone.
- Gate B: Apple silicon, macOS 15 or later. No signed download yet.
- Now: Apple silicon, macOS 15 or later

The honesty rule is that there is no signed installer yet; the page now says it nowhere on the hero (it is in Terms and in llms.txt).

Change:

**H3. [claim] Hero window: recording states and hints, changed.** Hero window, `web/components/hero/demo-window.tsx` (still being edited). Describes how the app works.
- Gate B prototype, button in the strip: "Stop". Now: "Stop & save", then a strip reading "00:21 recorded" with a button "Create notes", then "Transcribing", then "00:21 recorded". Title-bar state labels: Recording, Transcribing, Writing notes.
- Gate B hint: "The transcript appears when you stop." Now: "The transcript appears when you press Create notes."
- Unchanged and approved: "Notes follow the transcript." Also in the window: the "Writing notes" travelling row, panel labels "Transcript" and "Notes".

Change:

**H4. Hero window mock content (invented).** `web/components/hero/story.ts`. First line of each, all three settings (tabs Lecture, Meeting, Interview).
- Lecture, title "Biology 201, lecture 9". Lines: "Mitosis has four stages. Prophase comes first." (Professor) / "Is prophase the longest?" (Student) / "Usually, yes. The chromosomes condense there." Notes: Overview "Mitosis has four stages. Prophase comes first and is usually the longest."; Key terms "Prophase: chromosomes condense", "Metaphase: chromosomes line up"; To review "Read chapter 7 before Thursday".
- Meeting, title "Product sync". Lines: "Can we move the launch to the 14th?" (Marcus) / "Legal needs two more days on the review." (Priya, System) / "Fine. Dev sends the timeline by Friday." Notes: Overview "The launch moves to the 14th so legal can finish its review."; Decisions "Launch date is the 14th", "Legal gets two more days"; Next "Dev sends the revised timeline by Friday".
- Interview, title "Ana Ribeiro, product designer". Lines: "We moved the whole team to Lisbon in March." (Ana, System) / "What changed first?" (Sam) / "Honestly, our standups. Eight a.m. became two p.m." Notes: Overview "Ana's team moved to Lisbon in March. The first thing to change was meeting times."; Key points "Team relocated in March", "Standups moved from 8 a.m. to 2 p.m."; Follow-ups "Ask about hiring in the new time zone".
- Speaker names on bubbles: Professor, Student, Marcus, Priya, Ana, Sam. Note: the deck's bubbles (Gate B) were the first line of each setting only; the rest came from the approved prototype `d4-hero-combo.html`.

Change:

**H5. Figure descriptions and accessible names.** Hero and pinned story, `story.ts`, `hero-section.tsx`, `demo-window.tsx`. New wording (the deck gave only one example).
- "A professor with grey hair and clasped hands, speaking"
- "A student with her hair in a bun, raising a hand to ask a question"
- "A student in a headscarf, listening"
- "Marcus, in a mustard sweater, making a point with an open hand"
- "A colleague in glasses and a green jacket, listening"
- "A bearded colleague with crossed arms, listening"
- "Priya, with curly hair and a hand on her hip, replying"
- "Ana, the guest, with long hair, answering"
- "Sam, the host, in blue, asking a question"
- Screen-reader names: the hero section is labelled "Trilsy"; the window's tab list is labelled "Recording type".

Change:

**H6. [claim] Story chapter 2, changed.** Pinned story, `story.ts`. Heading "Get the transcript." is unchanged.
- Gate B: When you stop, Trilsy transcribes on your Mac. Every line has a timestamp that plays the audio from that point.
- Now: When you press Create notes, Trilsy transcribes on your Mac. Every line has a timestamp that plays the audio from that point.

Change:

**H7. [claim] Story chapter 3, changed.** Pinned story, `story.ts`. Heading "Read the notes." is unchanged.
- Gate B: Notes come section by section with a short overview on top. They are plain text, so you edit them like any note.
- Now: Notes come section by section with a short overview on top. You can edit them: press Edit to open the Markdown.

Change:

**H8. [claim] Trust band: screen-reader label and the logos.** `web/components/trust-band.tsx`. The line, ten names and footnote are approved and unchanged (the footnote now sits in the footer). New: the band's accessible name, "Apps Trilsy can record". Also not in the deck: the marks are the brands' own full-colour logos at your instruction, but none came from a brand's own press kit (SVG Logos set and Wikimedia Commons; Webex from a traced copy on a logo-collection site; FaceTime has no mark, Zoom shows its wordmark only). Whether that is acceptable for the brands' guidelines is open.

Change:

**H9. "All questions" button.** Questions section, `web/components/faq/faq-section.tsx`. The heading "Good questions." and the first six answers (reviewed under FAQ) are approved.
> All questions

Change:

**H10. Closing band heading.** Closing band, `web/components/closing-band.tsx`. Deck offered three headings, recommended first; the worker took option 1. The button "View on GitHub" and the helper "Free, on your Mac, no account." are approved.
> Walk out with the notes.

Change:

---

## How it works (`/how-it-works`)

The H1 "Press record. Read the notes." and blocks 1, 2, 4, 5, 6, 7 are word for word from the deck. Title and description are in the table below.

**W1. [claim] Block 3, "How the transcript is made.", changed.** `web/app/how-it-works/page.tsx`.
- Gate B: After you stop, Trilsy transcribes on your Mac with Whisper (the small model). Language is detected, or you pick one. You can add words it should know.
- Now: After you stop and press Create notes, Trilsy transcribes on your Mac with Whisper (the small model). Language is detected, or you pick one. You can add words it should know.

Change:

**W2. Mock: block 1 window.** `web/components/how-it-works/sources-demo.tsx`. Window title "Trilsy"; sidebar rows "Design review", "Onboarding interviews, round 2"; the app's Audio sources menu. Screen reader: none (it is interactive).

Change:

**W3. Mock: block 2 window.** `files-demo.tsx`. Window title "Recordings"; path `Library/Application Support/Trilsy/Recordings/`; folder `7C1E9A04-5B3D-4E21-A8F6-0D93B2C41E57`; files `recording.json` ("title, transcript and notes"), `microphone_0_4F1C….caf` ("audio, about 60 seconds"), `system_0_9B2E….caf`, and two more. Screen reader: "The Recordings folder holds one folder per recording. A recording's folder holds short audio files and a recording.json file with the title, transcript and notes."

Change:

**W4. Mock: block 3 window.** `transcript-demo.tsx`. Window title "Design review"; first line "Let’s start with the onboarding screens." (Microphone, 00:00:12), then "The second one loses people. They stop at the permissions step." (System) and "Then we move the permissions step to after the first recording."; settings "Language code: Auto-detect", "Names & vocabulary: Okonkwo, Figma, onboarding". Screen reader: "A transcript of three lines, each with a timestamp and the source it came from, Microphone or System. Below it, the language and vocabulary settings."

Change:

**W5. Mock: block 4 window.** `notes-demo.tsx`. Window title "Design review"; sections "Onboarding screens" ("Screen two loses people at the permissions step. [00:00:19]"), "Permissions", "Next steps"; overview "The onboarding drop-off is at the permissions step. The team will move it to after the first recording."; progress line "Writing detailed notes 1 of 3…" up to "3 of 3…". Screen reader: "Notes as the app shows them, with headings. The detailed notes are written one part after another, and an overview is written last and placed above them."

Change:

**W6. Mock: block 5 window.** `library-demo.tsx`. Window title "Trilsy"; search "permissions"; list "Design review", "Onboarding interviews, round 2"; recording "Design review", "15 Oct, 10:30", "24 min", "Ready"; Export menu entries "Markdown with transcript", "Plain text transcript", "SRT subtitles". Screen reader: "The recording list filtered by the search word permissions, and the menu of the open recording with Export opened: Markdown with transcript, Plain text transcript and SRT subtitles."

Change:

**W7. Shared app-window text.** `web/components/use-cases/app-chrome.tsx`, used by this page and by most use-case windows. Menu and button labels: "New recording", "Search notes", "All notes", "Recent", "Matches", "Audio sources", "Microphone", "App audio", "Application", "All apps", "Refresh apps", "Pause", "Stop & save", "Recording", "Note instructions…", "Rewrite notes", "Export", "Delete recording", "Edit", "Done", "Import file", "Cancel", "Notes", "Transcript". Sentences: "Your conversations, all in one place." / "A place for your next conversation" / "Start a new recording or import an audio file. Your notes will appear here." / "Ready to make sense of it" / "Turn this recording into a transcript and detailed notes, processed on your Mac." / "Recording in progress" / "Your audio is being saved on this Mac. Stop recording when you’re ready to create notes."

Change:

---

## Pricing (`/pricing`)

H1 "Recording and notes on your Mac are free.", the Free card, the Pro card ("Not available yet", $12, $96, the sync/MCP/connections line, the student line), the band names and the sentence "The app costs nothing at any usage." are deck copy, confirmed by you on 2026-10-16. Competitors' figures are in `web/lib/pricing.ts`.

**P1. Calculator labels.** `web/components/pricing/calculator.tsx`, `lib/pricing.ts`. New wording around the deck's "If you record [slider] hours of meetings a month".
- "If you record" / "{n} hours of meetings a month" ("1 hour" for one)
- Trilsy bar: "Trilsy" with plan "free, on your Mac", "$0 /month"; other bars "{Company} {Plan}" and "$x /month"
- "$0" "/month with Trilsy"
- Slider screen-reader name: "Hours of meetings a month"; bands "Light under 5 hours", "Typical 5 to 20 hours", "Heavy 20 hours and up" (deck: "20 and up")

Change:

**P2. Result lines.** `calculator.tsx`.
- Saving: "Save $168 a year" with "vs Granola Business at $14/month, billed monthly" (the figure follows the hours; above 5 hours it is always this line). The ", billed monthly" is a worker default.
- Tie (1 to 5 hours): "Otter Basic is free here too" with "Trilsy stays $0 as you record more."

Change:

**P3. [claim] Footnote and competitor limits.** `calculator.tsx`, `lib/pricing.ts`. Deck text plus additions (the Otter and Granola limits, the Wispr sentence, the last sentence).
> Other companies’ monthly plans, read from each company’s own pricing page on 15 October 2026, for the cheapest plan that covers the hours above. Otter: Basic is free for 300 minutes a month and 30 minutes a meeting; Pro is $16.99 for 1,200 minutes and 90 minutes a meeting; Business is $30 for unlimited meetings. Granola: Business is $14; the free plan keeps 30 days. Wispr Flow: Pro is $15; the free plan has a weekly limit. Prices change; check the company’s page. Trilsy Pro is not shown: it is not available yet.

You confirmed "the pricing comparison footnote" on 2026-10-16; the figures and limits above are as read by a worker on 15 October.

Change:

---

## Students (`/students`)

H1 "Students get 50% off everything paid.", the body, "View on GitHub" and the two link rows are deck copy. Title and description are in the table.

**S1. Figure descriptions and one screen-reader label.** `web/app/students/page.tsx`. New wording.
- "A student with her hair in a bun, raising a hand to ask a question"
- "A student in a mustard sweater, explaining something with an open hand"
- The second band is labelled "More for students".

Change:

---

## FAQ (`/faq`, and the first six on home)

The heading "Good questions.", the ten questions and the two one-line answers ("Is there an iPhone app? Not yet." and "What languages? Detected, or pick one.") are deck copy. The ten answers are the lengthened versions (40 to 60 words) written under the no-review instruction; `web/lib/faq.ts`. The first six also appear on home. In JSON-LD, answer 5 leaves out its third sentence.

**F1. [claim] Will the people on my call know I am recording?**
> They may not. Trilsy records on your Mac, so other people on a call may see nothing at all. You are responsible for telling everyone before you begin, and the law on recording differs by place. Say so first, whether you are on a call, in a meeting room or in a lecture hall.

Change:

**F2. [claim] Which apps does it work with?**
> Any app that plays sound: one app or all of them, picked in a list. In a room it uses your microphone instead. Zoom, Google Meet, Microsoft Teams, Slack, FaceTime, Webex and a browser tab are examples of apps that make sound, not a tested list and not integrations.

Change:

**F3. [claim] Where are my recordings kept?**
> On your Mac, as ordinary files in `Library/Application Support/Trilsy/Recordings`, one folder for each recording. Trilsy does not encrypt them itself; your disk encryption does. Delete the folder and the recording is gone. Nothing is kept anywhere else, because there is no account and no upload.

Change:

**F4. [claim] Does anything leave my Mac?** (Offline use after the download was confirmed by you on 2026-10-16. "No analytics" and "nothing sent anywhere" are the worker's wording.)
> No. Your audio, transcript and notes stay on your Mac as files. Trilsy has no account, no upload and no analytics. The only download is the two models, once from Hugging Face before first use, which needs a connection; after that it works offline. Nothing you record is sent anywhere, and nothing is kept for you on a server.

Change:

**F5. [claim] What does it cost?** (The 50% and the student rule are confirmed. The last sentence is the worker's.)
> The app is free, with no time limit, and it needs no account. A paid Pro plan is not available yet. Students get 50% off every paid plan. The free app always stays local, with your recordings kept as files on your Mac, so what you pay for later never decides whether you can keep them.

Change:

**F6. [claim] Is it open source?** Changed after the MIT decision. The worker wrote the new answer.
- Before: Not yet. The source is on GitHub, where anyone can read it, but we have not chosen a licence, so we do not call it open source. That decision is still to be made, and until it is, the code is there to read and nothing should be assumed about reusing it.
- Now: Yes. Trilsy is open source under the MIT licence, and the source is on GitHub. Anyone may read, use, change and share the code, even commercially, if the licence notice stays with it. The Trilsy name and this website’s drawings are not part of that grant, and the app’s models have their own licences.

Change:

**F7. [claim] Does it transcribe while I talk?** Changed to match the app (transcription starts on Create notes).
- Before: No. Trilsy records first, and when you stop it transcribes the recording on your Mac and then writes the notes. You get the transcript and the notes after the recording ends, not line by line while you talk. An audio or video file you import goes through the same steps.
- Now: No. Trilsy records first. Stopping only saves the recording; when you press Create notes, it transcribes it on your Mac and then writes the notes. You get the transcript and the notes after the recording ends, not line by line while you talk. An audio or video file you import goes through the same steps.

Change:

**F8. [claim] Does it know who said what?**
> No. Trilsy does not identify speakers. Each transcript line is labelled by where the sound came from: Microphone, System or Import, not by person. With your Mac's sound switched on, your own voice arrives through the microphone and the people you hear through your Mac arrive as System, unnamed.

Change:

**F9. [claim] What do I need?**
> An Apple silicon Mac with macOS 15 or later; 16 GB of memory is recommended. The two models take several GB and recordings are saved uncompressed, so leave room on your disk. You also need an internet connection once, to download the models before first use, so allow for that download the first time.

Change:

**F10. [claim] Can it connect to my apps or my AI assistant?** Names unbuilt things as planned. The owner's rule is no roadmap; this is the one place it appears.
> Not yet. A paid plan is planned to add connections to Google Calendar, Notion, Slack, Google Drive and Microsoft apps, and an MCP server so an assistant can search, read and write your notes and start and stop a recording. None of it exists yet. A recording an assistant starts is still a recording: tell people.

Change:

---

## Use cases index (`/use-cases`)

The twelve names and one-line leads are deck copy. Title and description are in the table.

**U1. H1 and the list's screen-reader label.** `web/app/use-cases/page.tsx`.
> Calls, lectures and interviews. Start with yours.

The list is labelled "All use cases".

Change:

**U2. Shared by all twelve use-case pages.** `web/components/use-cases/use-case-page.tsx`. Breadcrumb "Trilsy / Use cases / {page name}" with the screen-reader name "Breadcrumb"; the band "For students" on Lectures and on Talks, courses and webinars. The H1, lead, situation sentence, "Good questions.", "View on GitHub" and the Students line "Students get 50% off every paid plan. See the Students page." are deck copy.

Change:

---

## The twelve use-case pages

For each: the page title is in the table below; the H1, lead, situation sentence and description are deck copy. Listed here: figure descriptions, the `behavior` sentence under the situation heading, the two questions, the window's screen-reader description, and the window's invented content.

### Sales calls (`/use-cases/sales-calls`)

**SC1. Figure descriptions.** "A man with a beard in a terracotta jumper, on a call" / "A person with glasses in a sage jumper, listening"

Change:

**SC2. Behavior sentence.**
> Every line of the transcript has a timestamp. Press it and the audio plays from that line, so the customer’s exact words are one press away.

Change:

**SC3. [claim] Question 1.** Should I wear headphones on a call?
> Yes. Trilsy records your microphone and your Mac’s sound as two separate sources and does not cancel echo. On speakers, your microphone picks the customer up a second time. Headphones keep the two apart.

Change:

**SC4. [claim] Question 2.** Is the transcript ready when the call ends?
> Not quite. Stopping saves the recording. Trilsy transcribes it when you press Create notes, not while you talk, and writes the notes after that. How long it takes depends on the length of the call and on your Mac.

Change:

**SC5. Window screen-reader description.** `sales-demo.tsx`
> A transcript of four lines, each with a timestamp and the source it came from. The timestamp 00:14:32 on a line from System is pressed, the line is marked, the player's play button becomes a stop button and its slider moves to 00:14:32, because the audio is now playing from that point.

Change:

**SC6. Mock content.** Window "Pricing call, 12 Oct", length 32:10. First line: "So that is the setup for ten seats." (Microphone, 00:12:58). Others: "Honestly the price is fine. What I would need to check is whether security signs off first." (System); "Who does the security review on your side?"; "Our IT lead, Marta. She is out until Thursday."

Change:

### Customer calls (`/use-cases/customer-calls`)

**CC1. Figure descriptions.** "A person with long hair in a sage jumper, on a call"

Change:

**CC2. Behavior sentence.**
> Every call stays in your list as a transcript and notes. Search a word and open the calls it comes up in, one after another, to see how each customer put it.

Change:

**CC3. [claim] Question 1.** Can I find a call by the customer’s name?
> If the name is in the title, the transcript or the notes, yes. The title is editable like the notes, so put the customer’s name in it after the call and the search box will always find it.

Change:

**CC4. [claim] Question 2.** Does search find a word that means the same thing?
> No. Search matches the letters you type, upper or lower case, against the title, the transcript and the notes. Searching for refund will not find money back, so try the words a customer is likely to use.

Change:

**CC5. Window screen-reader description.** `customer-demo.tsx`
> The recording list filtered by the search word invoice. Three customer calls match, with Dana, Lena and Tomas. Their transcripts are opened one after another, and in each the customer asks about the invoice in a different way.

Change:

**CC6. Mock content.** Search word "invoice"; calls "Call with Priya", "Call with Dana", "Call with Marcus", "Call with Lena", "Call with Tomas". First line: "That covers the seats and the plan." (Microphone, Dana, 00:21:07); "Good. Do you send one invoice for the whole team?"; "You can start whenever you are ready."; "Can the invoice go to our finance address instead of mine?"; "Anything else before we wrap up?"; "Only the invoice. Is it in euros, or in dollars?"

Change:

### Team meetings (`/use-cases/team-meetings`)

**TM1. Figure descriptions.** "A person in a mustard jumper, making a point in a meeting" / "A person in a blue top, listening in a meeting"

Change:

**TM2. Behavior sentence.**
> Press Edit and the notes open in a Markdown editor: fix a name, cut a line, add what the notes model missed. The title and the transcript lines are editable too.

Change:

**TM3. [claim] Question 1.** How do I share the notes with the team?
> Export the recording as Markdown: one file with the notes, then the transcript. Send that file the way you send any other.

Change:

**TM4. [claim] Question 2.** Does it work in a meeting room?
> Yes. Leave your Mac’s sound off and Trilsy records through your microphone. How well it hears the far end of a room depends on your Mac’s microphone and where the Mac sits.

Change:

**TM5. Window screen-reader description.** `team-demo.tsx`
> Notes with headings: an overview and two sections. Edit is pressed and the notes open as Markdown. One name the notes model spelled wrong is selected and corrected by typing over it, then Done is pressed and the notes are shown again with the name right.

Change:

**TM6. Mock content.** Window "Weekly team meeting, 14 Oct", 27 min. First line: "The team agreed to launch on 3 November. Priya will send the revised launch plan by Thursday, and hiring for a second designer waits until the launch is out." (the name is first spelled "Pryia", then corrected). Sections "Launch date" ("Moving from 27 October to 3 November gives QA a full week. Support asked to see the help articles first.") and "Hiring".

Change:

### Client meetings (`/use-cases/client-meetings`)

**CM1. Figure descriptions.** "A person with glasses in a sage jumper, at a meeting" / "A person with long hair in a sage jumper, at a meeting"

Change:

**CM2. Behavior sentence.**
> Every meeting stays in your list. Before the next one, open the last meeting’s notes and read what was agreed, then press New recording.

Change:

**CM3. [claim] Question 1.** Do the notes list what we agreed?
> Only if the conversation said so. The notes model is asked to write decisions and open questions only when the recording supports them, and there is no separate list of agreements. Read the notes against the transcript before you rely on one.

Change:

**CM4. [claim] Question 2.** Can I pause when the client asks me to?
> Yes. Pause and resume are in the app’s toolbar while you record, and what is said while the recording is paused is not recorded.

Change:

**CM5. Window screen-reader description.** `client-demo.tsx`
> The notes of the last client meeting, Client review, are open: an overview, then scope, timing and open questions. New recording is pressed and a new recording starts at the top of the list, with the toolbar showing the time and Stop and save.

Change:

**CM6. Mock content.** Meetings "Client review", "Kickoff with the client", "Intro call"; new recording "Recording 15 Oct 2026, 10:02". First line: "The client approved the three-page structure and asked for the pricing page to come first. The first draft is due on 24 October." Sections Scope, Timing, "Open questions" ("Who supplies the photographs? The client will ask their team.").

Change:

### Recruiting (`/use-cases/recruiting`)

**RC1. Figure descriptions.** "A person in a blue top, interviewing" / "A man with a beard in a terracotta jumper, being interviewed"

Change:

**RC2. Behavior sentence.**
> The overview comes first every time, so you can read one candidate’s notes and then the next without hunting for where each begins.

Change:

**RC3. [claim] Question 1.** Does Trilsy rate or rank candidates?
> No. It writes a transcript and notes of what was said and scores no one. The comparison, and the decision, stay with you.

Change:

**RC4. [claim] Question 2.** Can I make sure a candidate’s name is spelled right?
> Add the name to Names & vocabulary in Trilsy’s Settings before you record. It goes to the transcription as a hint, not a guarantee, so check the name afterwards. The notes are Markdown you can correct with the Edit button.

Change:

**RC5. Window screen-reader description.** `recruiting-demo.tsx`
> The notes of two interviews for the same role, side by side. Each starts with an overview, then a section on recent work and one on why the person wants the role. The two overviews are marked as one row.

Change:

**RC6. Mock content.** Two invented candidates. First line: "Jonas has six years in product design, mostly on mobile apps. He moved his last team from ad hoc reviews to a weekly critique and wants to work closer to research." (titled "Product designer, Jonas", 9 Oct 2026); "Product designer, Amara" (11 Oct 2026), "Amara has four years in design, the last two as the only designer at a small startup. She ran her own user interviews and wants a larger team to learn from."

Change:

### Incident calls (`/use-cases/incident-calls`)

**IC1. Figure descriptions.** "A person in a blue top, waving"

Change:

**IC2. Behavior sentence.**
> Every line of the transcript carries the time it was said, counted from the start of the recording. Read down the timestamps and you have the order of events for your postmortem.

Change:

**IC3. [claim] Question 1.** Are the timestamps the time of day?
> No. They count from the start of the recording, so 00:11:20 is eleven minutes and twenty seconds in. Note the clock time when you press New recording and you can turn any timestamp into a time of day.

Change:

**IC4. [claim] Question 2.** Will Trilsy write the postmortem?
> No. The notes summarize what was said and can include a decision when the call made one. The postmortem is yours to write, and the timestamps are what you write it from.

Change:

**IC5. Window screen-reader description.** `incident-demo.tsx`
> A timed transcript of an incident call with four lines, and below it a postmortem document the reader writes from it: a timeline with the same four timestamps.

Change:

**IC6. Mock content.** Window "Checkout outage, 12 Oct"; second window "postmortem.md" (the reader's own document, not a Trilsy feature). First line: "Checkout errors are spiking. About one in three is failing." (Microphone, 00:03:12); "We deployed the payment service update at ten past two."; "Rolling back now."; "Errors are back to normal." Timeline: "Checkout errors spike." / "Payment service update (deployed 14:10) named as the likely cause." / "Rollback started." / "Errors back to normal."

Change:

### Lectures (`/use-cases/lectures`)

**LC1. Figure descriptions.** "A student with curly hair in a sage sweater, listening" / "A student in a blue headscarf, listening and taking it in"

Change:

**LC2. Behavior sentence.**
> Search looks through the title, the transcript and the notes of every recording, so the lecture where your professor used a word comes back with the rest.

Change:

**LC3. [claim] Question 1.** Can I record an online lecture as well as one in the room?
> Yes. In a room Trilsy uses your microphone. For a lecture that plays on your Mac, turn on your Mac’s sound, a switch that is off until you turn it on and needs macOS’s Screen & System Audio Recording permission. Record both together if you want your own voice too.

Change:

**LC4. [claim] Question 2.** Can I rely on the notes for an exam?
> Read them against the audio first. A language model on your Mac writes the notes and it can be wrong. Every line of the transcript has a timestamp that plays the audio from that point, so you can check a claim in a few seconds.

Change:

**LC5. Window screen-reader description.** `lectures-demo.tsx`. Note: it says "Microeconomics lecture 6 and lecture 3", while the window's titles read "Economics, lecture 6" and "Economics, lecture 3". One of the two should change.
> The recording list filtered by the search word elasticity. Two lectures match, Microeconomics lecture 6 and lecture 3, and the notes of lecture 6 are open: an overview, then a section on price elasticity of demand, one on what makes demand inelastic and one on revenue.

Change:

**LC6. Mock content.** Search word "elasticity"; recordings "Economics, lecture 8", "History, lecture 5", "Statistics, lecture 7", "Economics, lecture 6" (7 Oct, 52 min), "Economics, lecture 3". First line of notes: "Elasticity measures how far the quantity people buy moves when the price moves. Demand is elastic when buyers react a lot and inelastic when they barely react. The lecture ends on what that means for a seller’s revenue." Sections: Price elasticity of demand, What makes demand inelastic, Revenue and elasticity.

Change:

### Talks, courses and webinars (`/use-cases/talks-courses-and-webinars`)

**TC1. Figure descriptions.** "A person in a blue top, watching a talk" / "A person in a blue headscarf, watching a talk and taking it in"

Change:

**TC2. Behavior sentence.**
> In Audio sources, turn on App audio, leave Microphone off, and pick the app that is playing, such as your browser. Trilsy records what that app plays, and every line of the transcript comes back marked System.

Change:

**TC3. [claim] Question 1.** Can I record one tab and not the others?
> No. Trilsy records one app or all of them, not one tab. Pick your browser and you get everything it plays, so close the tabs you do not want recorded before you press New recording.

Change:

**TC4. [claim] Question 2.** Does it record the slides?
> No. Trilsy records sound only. It saves no video and no screenshots, so the transcript and the notes hold what was said. Something that is on a slide and never spoken is not in them.

Change:

**TC5. Window screen-reader description.** `talks-demo.tsx`
> The Audio sources menu is opened with the microphone off and App audio on. Its Application list is opened and Safari is chosen. The recording that follows is a transcript of an online course video, and every line is marked System, because the sound came from the Mac and not from the microphone.

Change:

**TC6. Mock content.** App list "All apps", "Safari", "Mail", "Music"; recording "Recording 15 Oct 2026, 09:30". First line: "Welcome back. This week is about sampling, and why a small sample can still tell you something." (System, 00:00:05), then three more about population, sample and standard error.

Change:

### Research interviews (`/use-cases/research-interviews`)

**RI1. Figure descriptions.** "A person with glasses in a sage jumper, asking a question" / "A person with long hair in a sage jumper, answering"

Change:

**RI2. Behavior sentence.**
> Each interview stays on your Mac as audio, a transcript and notes, and Trilsy does not upload it. If a participant withdraws, one Delete, after one question, removes all three.

Change:

**RI3. [claim] Question 1.** If a participant withdraws, can I remove everything?
> Yes. Delete removes the recording’s folder from your Mac, with its audio, transcript and notes, after one confirmation, and it does not go to the Bin. Copies you made yourself are still there, such as an export or a backup of your disk.

Change:

**RI4. [claim] Question 2.** Does Trilsy keep the audio once the transcript is written?
> Yes, until you delete the recording. Every timestamp plays from that audio, so you can check a quote against the voice. The audio is saved uncompressed, so a long study takes room: check your free space before a day of interviews.

Change:

**RI5. Window screen-reader description.** `research-demo.tsx`
> A list of four interview recordings with the first one open. In its menu, Delete recording is chosen and the app asks: Permanently delete this recording, audio, and notes? The recording is deleted, it leaves the list, and the next interview opens.

Change:

**RI6. Mock content.** Recordings "Participant 4" to "Participant 7" (7: 14 Oct, 47 min). First line: "Studies in the library on weekdays and at home at weekends, and picks each place for its noise, not its distance. Says a quiet room matters more than a good desk." Second interview: "Works at the kitchen table in the morning and moves to a café when the flat gets busy. Treats the move as the signal to start the hard reading." The confirmation dialog is the app's own words.

Change:

### Journalism (`/use-cases/journalism`)

**JN1. Figure descriptions.** "A man with a beard in a terracotta jumper, asking questions" / "A person in a blue top, being interviewed"

Change:

**JN2. Behavior sentence.**
> Export the transcript as plain text and every line keeps its timestamp and where the sound came from. Pick out a quote, keep its time, and you can find the audio again.

Change:

**JN3. [claim] Question 1.** Does the text file include the notes?
> No. Plain text holds the transcript only. For the notes, export Markdown, which has the notes first and the transcript after. The SRT export is the transcript only as well.

Change:

**JN4. [claim] Question 2.** If I interview someone by phone or video call, are both sides in the file?
> Yes, if you record your microphone and your Mac’s sound together. Both are in one file in time order, each line marked microphone or system in the file. Wear headphones, so your microphone does not pick the other person up a second time.

Change:

**JN5. Window screen-reader description.** `journalism-demo.tsx`
> An interview with four transcript lines, each with a timestamp and a source, Microphone or System. The menu is opened, Export is chosen and then Plain text transcript. Below, the file it writes, with the same four lines, each beginning with its timestamp and its source in square brackets. One line is selected as the quote.

Change:

**JN6. Mock content.** Window "Bus route funding, 9 Oct", 41 min, and a file "Bus route funding, 9 Oct.txt". First line: "Did the council know the cost before the vote?" (Microphone, 00:18:04); "We saw an estimate in March. The final figure came after the vote."; "So the vote was taken on the March number."; "Yes, and I said so at the time."

Change:

### Podcasts and video (`/use-cases/podcasts-and-video`)

**PD1. Figure descriptions.** "A person in a blue top, waving at the microphone" / "A person with curly hair in a sage sweater, laughing"

Change:

**PD2. Behavior sentence.**
> One export gives you a subtitle file: every line of the transcript becomes a numbered subtitle with a start time and an end time. SRT is the plain subtitle format that most video editors and players read.

Change:

**PD3. [claim] Question 1.** Can I fix a word before I export the subtitles?
> Yes. Each transcript line is editable and the export uses the text as it stands. A speech model can mishear names and unusual words, so read the subtitles through before you publish them.

Change:

**PD4. [claim] Question 2.** Can I make subtitles for a file I already have?
> Yes. Import audio or video reads the sound of a file macOS can open and transcribes it the same way, and the SRT export works the same. Its lines are marked Import. Subtitles are one line of transcript each, so Trilsy does not split or reflow them to fit the screen.

Change:

**PD5. Window screen-reader description.** `podcasts-demo.tsx`
> The menu of a recording is opened, Export is chosen and then SRT subtitles. The subtitle file it writes has three numbered cues, each with a start time, an end time and a line of text. Beside it, a plain frame shows each cue as a caption in its turn, with a thin bar crossing the frame.

Change:

**PD6. Mock content.** Window "Kitchen table, episode 12", file `kitchen-table-12.srt`. First line: "Welcome back to the show. Today it is just the two of us." (00:00:03,200 --> 00:00:07,840); "And a very large pot of coffee."; "So, where do we start?"

Change:

### Voice notes (`/use-cases/voice-notes`)

**VN1. Figure descriptions.** "A person in a mustard jumper, thinking out loud"

Change:

**VN2. Behavior sentence.**
> With your Mac’s sound off, which is how Trilsy starts, only your microphone is recorded. Press New recording, talk, press Stop & save, then Create notes, and read the notes.

Change:

**VN3. [claim] Question 1.** Can I pause while I think?
> Yes. Pause and resume are in the app’s toolbar while you record. What is said while the recording is paused is not recorded.

Change:

**VN4. [claim] Question 2.** Can I tell it how to write the notes?
> Yes. Open Note instructions… from the recording’s … menu and type what you want, for example “include examples and open questions”. Do it before you press Create notes. The notes model takes them as preferences, which is a request and not a guarantee.

Change:

**VN5. Window screen-reader description.** `voice-demo.tsx`
> The Audio sources menu with Microphone ticked and App audio not. New recording is pressed and the toolbar becomes a recording row with the time and a Stop and save button. After it, the app offers Create notes, shows its progress, and ends on the notes of a voice note: an overview and two sections.

Change:

**VN6. Mock content.** Recording "Recording 15 Oct 2026, 08:41", 1 min; progress "Writing detailed notes 1 of 1…". First line: "Thinking through whether the weekly planning meeting should move from Friday afternoon to Monday morning. Friday meetings run out of energy; Monday would give the week a shape. Nothing is decided." Sections "For moving to Monday", "Against".

Change:

---

## Privacy (`/privacy`)

All of it is new (`web/app/privacy/page.tsx`). Written from the code; the owner items (contact email, postcode, effective date, hosting log settings) are code comments and not on the page. Title and description are in the table.

**PV1. H1.**
> Your recordings stay on your Mac.

Change:

**PV2. Lead.**
> What the Mac app does with your recordings, what this website does with your visit, and what is downloaded from elsewhere.

Change:

**PV3. [claim] "What Trilsy keeps."**
> Audio, transcript and notes are ordinary files in `Library/Application Support/Trilsy/Recordings` on your Mac, one folder for each recording. Trilsy has no account and uploads nothing, so we never receive them, and nothing is kept for you on a server.
>
> Trilsy has no analytics. It does not count what you record, for how long or how often you open the app. Delete a recording’s folder and the recording is gone.

Change:

**PV4. [claim] "The models."** The "may contact Hugging Face again" sentence is deliberately weak: whether the app does so is unconfirmed.
> The transcript and the notes are made by two models that run on your Mac. They are not inside the app, so Trilsy downloads them from Hugging Face the first time you use it, and only after you switch on Allow model downloads in Settings. Hugging Face sees that request the way any website does, including your IP address, and its own privacy policy applies to it.
>
> Later, Trilsy may contact Hugging Face again to check the copy it has saved. Those requests ask for model files. They carry no audio, no transcript and no notes.

Change:

**PV5. "What your Mac asks you for."**
> The first time you record, macOS asks whether Trilsy may use your microphone. Your Mac’s sound is a switch that is off until you turn it on, and it needs macOS’s Screen & System Audio Recording permission. You can take either back in System Settings, under Privacy & Security.

Change:

**PV6. [claim] "This website."** Says there is no third-party request and that Vercel keeps logs; Vercel settings are unconfirmed.
> trilsy.com sets no cookies and runs no analytics, advertising or tracking scripts. It has no sign-up, form or login, so it asks you for nothing. Its fonts and images are served from the site itself, so a visit makes no request to Google or any other company.
>
> The site is hosted on Vercel. As with any host, Vercel receives each request your browser makes, including your IP address and browser details, and keeps ordinary server logs. We add no tracking of our own on top.
>
> Links to GitHub and to other sites leave this one, and their own policies apply there.

Change:

**PV7. [claim] "Who is responsible."** Legal statement. The name and street are as you gave them; the wording around them and the "controller" role are the worker's.
> Kaloyan Gantchev, Baslergasse 50-66, runs the Trilsy app and this website, and is responsible for the data protection of what the website handles, described above. The app sends the provider nothing.
>
> To ask about your data, open an issue on GitHub. Issues there are public, so do not put personal details in one; ask for a private way to reply.

Change:

**PV8. [claim] "Changes."**
> This page changes when the app or the site does, and its history is in the repository on GitHub, next to the code it describes.

Change:

---

## Terms (`/terms`), including the imprint

All of it is new (`web/app/terms/page.tsx`). Open owner items, in code comments only: postcode, city and country, a contact email, any trade or VAT number, governing law and courts, an effective date, and whether the liability wording holds under Austrian and EU consumer law. Title and description are in the table.

**T1. H1.**
> Use Trilsy freely. Tell people you record.

Change:

**T2. Lead.**
> The terms for the Trilsy Mac app and this website, in plain words.

Change:

**T3. [claim] "What Trilsy is."**
> Trilsy is a Mac app for Apple silicon, on macOS 15 or later. It records your microphone, your Mac’s sound or both, transcribes the recording and writes notes you can edit, all on your Mac.
>
> It is free, with no time limit. Paid plans are not available yet, and the Pricing page says what is planned. There is no signed installer or public release yet: today you build the app from its source on GitHub.

Change:

**T4. [claim] "Say so first."** Matches FAQ 1.
> Trilsy records on your Mac, so other people on a call may see nothing at all. You are responsible for telling everyone before you begin, and for what the law requires where you and they are, which differs by place. Say so first, whether you are on a call, in a meeting room or in a lecture hall.

Change:

**T5. [claim] "Your recordings are yours."**
> Your audio, transcript and notes belong to you. They are files on your Mac, and Trilsy never receives them. Keeping them safe, backing them up and deleting them when you should is up to you.

Change:

**T6. [claim] "Check the notes."**
> The transcript and the notes are written by models on your Mac. They can mishear, and they can be wrong. Check them against the audio before you rely on them for a decision, a quote or anything a person could be held to. A timestamp the model writes into the notes is not a link.

Change:

**T7. [claim] "No warranty."** Legal statement; "to the extent the law allows" is a stand-in until a lawyer or you read it.
> Trilsy is early software, provided as it is, without warranty of any kind. Do not use it as the only recorder for an important conversation. To the extent the law allows, Kaloyan Gantchev, who provides it, is not liable for any loss from using it, including a recording that is lost, cut short or damaged.

Change:

**T8. [claim] "The code and the name."** Licence statement (MIT is your decision; the wording about the name and the drawings is the worker's).
> Trilsy is open source under the MIT licence, and the source is on GitHub. You may use, copy, change and share the code, even commercially, as long as the licence notice stays with it. The Trilsy name and the drawings on this site are not part of that grant: do not use them to suggest your own work is Trilsy. The two models the app downloads have their own licences.

Change:

**T9. [claim] "Who provides Trilsy." (the imprint, `/terms#imprint`).** Legal statement. Name and street are as you gave them; the rest is unfinished (no postcode, city, country, email or registration).
> Trilsy and this website are provided by Kaloyan Gantchev, Baslergasse 50-66. This is the site’s imprint.
>
> To reach the provider, open an issue on GitHub. Issues there are public, so do not put anything private in one.

Change:

**T10. [claim] "Changes."**
> If these terms change, the history of this page is in the repository on GitHub, next to the code.

Change:

---

## Footer (every page)

The use-case list, the trademark line ("App names and marks belong to their owners; no affiliation or endorsement is implied.", moved here from the trust band, text unchanged), "Privacy", "Terms" and "GitHub" are approved or from the deck.

**FT1. Column labels and screen-reader text.** `web/components/site-footer.tsx`. Column headings "Use cases" and "Product"; Product links "Pricing", "How it works", "Students", "FAQ", "GitHub"; the hidden text "(opens in a new tab)"; the legal nav is labelled "Legal".

Change:

**FT2. [claim] "Imprint" link.** Third legal link, to `/terms#imprint`.
> Imprint

Change:

---

## Site-wide (header and skip link)

**SW1. Accessible names.** `web/app/layout.tsx`, `mobile-menu.tsx`, `header-nav.tsx`. Skip link "Skip to content"; phone menu button "Menu"; its sheet titled "Trilsy" and described "Site navigation"; nav labelled "Main"; the two dropdown columns labelled "Work" and "Learning and media" (not shown). Header labels "Use cases", "Pricing", "How it works", "Students" and the button "View on GitHub" are approved.

Change:

---

## Page titles and descriptions

Source: `pageMetadata()` calls in each `page.tsx`, `lib/metadata.ts` for home. "Deck" = approved copy deck. Each title and description also becomes the Open Graph and Twitter text (the home OG title is the hero H1). Use-case descriptions are the deck's description column, unchanged; their titles are new.

| # | Route | Title | Description | Status | Change: |
| --- | --- | --- | --- | --- | --- |
| – | `/` | Trilsy: notes for every call, lecture and interview | Trilsy is a Mac app that records your microphone, your Mac's sound or both, transcribes it on your Mac and writes notes you can edit. Free, no account. | Deck, approved, not counted | |
| 1 | `/how-it-works` | How Trilsy works: what it records, where it lives and how the notes are made | What Trilsy records, where the files are kept on your Mac, how the transcript and the notes are made, what you can do with them and what your Mac needs. | New | |
| 2 | `/pricing` | Trilsy pricing: recording and notes on your Mac are free | Trilsy is free on your Mac, with no time limit and no account. See what other notetakers cost for the hours you record. | New. **[claim]** (free, no limit) | |
| 3 | `/students` | Trilsy for students: free lecture notes on your Mac, and a student discount | Record a lecture, a seminar or an online course on your Mac and keep a transcript and notes you can search before the exam. Trilsy is free, and students get a discount on paid plans. | New. **[claim]** (a discount exists) | |
| 4 | `/faq` | Questions about Trilsy: recording, privacy and cost | Answers about recording calls, where your files are kept, what leaves your Mac, what Trilsy costs and what you need to run it. | New | |
| 5 | `/use-cases` | Trilsy use cases: sales calls, lectures, interviews and more on your Mac | Twelve ways to use Trilsy, from sales calls and team meetings to lectures, research interviews and podcasts. Each one ends in a transcript and notes saved on your Mac. | New | |
| 6 | `/use-cases/sales-calls` | Notes from your sales calls: record calls on your Mac | (deck) | New title | |
| 7 | `/use-cases/customer-calls` | Keep every customer call: searchable transcripts on your Mac | (deck) | New title | |
| 8 | `/use-cases/team-meetings` | Notes from your team meeting: record and edit on your Mac | (deck) | New title | |
| 9 | `/use-cases/client-meetings` | A record of what was agreed: client meeting notes on your Mac | (deck) | New title | |
| 10 | `/use-cases/recruiting` | Interview notes you can compare: record interviews on your Mac | (deck) | New title | |
| 11 | `/use-cases/incident-calls` | The incident call, written down: a timed transcript on your Mac | (deck) | New title | |
| 12 | `/use-cases/lectures` | Lecture notes you can search: record lectures on your Mac | (deck) | New title | |
| 13 | `/use-cases/talks-courses-and-webinars` | Notes from anything that plays sound: record talks and courses on your Mac | (deck) | New title | |
| 14 | `/use-cases/research-interviews` | Interviews to quote from: record research interviews on your Mac | (deck) | New title | |
| 15 | `/use-cases/journalism` | Interview transcripts you can quote: export text with timestamps | (deck) | New title | |
| 16 | `/use-cases/podcasts-and-video` | A transcript and subtitles: SRT from a recorded conversation | (deck) | New title | |
| 17 | `/use-cases/voice-notes` | Think out loud: voice notes on your Mac | (deck) | New title | |
| 18 | `/privacy` | Privacy: Trilsy keeps your recordings on your Mac | What the Trilsy Mac app and this website do with your data: recordings, transcripts and notes stay on your Mac, there is no account and no analytics, and the models download once from Hugging Face. | New. **[claim]** | |
| 19 | `/terms` | Terms of use: Trilsy, the Mac app, and this website | Plain terms for the Trilsy Mac app and this website: you tell people you record them, your recordings are yours, the notes can be wrong, and the software comes without warranty. | New. **[claim]** | |

---

## Share image (`app/opengraph-image.tsx`, 1200 by 630)

**OG1. [claim] Text in the image.** Redrawn after Gate B. Headline is the approved H1, the subhead is the hero subhead (H1 above), the footer line is new. Image alt text is the hero H1.
- "Trilsy" (plain type; the logo is still owed)
- "Be in the conversation." / "Trilsy writes the notes." (second line on a mustard band)
- "Record your microphone, your Mac’s sound or both. Trilsy transcribes it and writes notes you can edit."
- "trilsy.com · Apple silicon, macOS 15 or later"
- Two pack figures on a pale blue column. No price.

Change:

---

## llms.txt, llms-full.txt and JSON-LD (summary)

Built in `web/lib/llms.ts` and `web/lib/schema.ts`. No price, no discount, no unbuilt feature stated as available.

**L1. [claim] Summary line (top of both files), changed.**
- Gate B: …Export: Markdown, text, SRT. Source on GitHub. No signed release yet.
- Now: Trilsy is a Mac app for Apple silicon (macOS 15 or later). It records the microphone, the Mac's sound or both, transcribes the recording after it ends with Whisper on the Mac, and writes editable notes with a local language model. Files stay on the Mac. Export: Markdown, text, SRT. Open source under the MIT licence, on GitHub. No signed release yet.

Change:

**L2. [claim] "What Trilsy is" paragraph (llms-full.txt only), changed.**
- Before: Trilsy is a notetaker for the Mac. You press record during a call, a lecture, an interview or a meeting; when you stop, Trilsy transcribes the recording on your Mac and writes notes you can edit. Nothing is uploaded and there is no account.
- Now: Trilsy is a notetaker for the Mac. You press New recording during a call, a lecture, an interview or a meeting; when you stop, Trilsy saves it, and when you press Create notes it transcribes the recording on your Mac and writes notes you can edit. Nothing is uploaded and there is no account.

Change:

**L3. [claim] Facts list and page descriptions.** New, derived from the pages. 13 fact bullets, starting "Records the microphone, the Mac's sound or both. Recording the Mac's sound is one switch, off by default…" and ending "Open source under the MIT licence; the source is on GitHub (https://github.com/superuserkalo/trilsy). The Trilsy name and the website's drawings are not part of the MIT grant. There is no signed installer or public release yet." Also eight one-line page descriptions (for example Pricing: "The free app, and what other notetakers charge for the hours you record."; Students: "Recording lectures and courses, and the student offer on paid plans."), and the How it works and FAQ text, which restate the pages above. File: `web/lib/llms.ts`.

Change:

**L4. [claim] JSON-LD on home.** `web/lib/schema.ts`. SoftwareApplication with the home description minus "Free, no account.", `isAccessibleForFree: true`, `license` (MIT), `applicationCategory: "BusinessApplication"`, `operatingSystem: "macOS 15 or later"`, `memoryRequirements: "16 GB recommended"`, and eight feature lines, the first "Records the microphone, the Mac's sound or both" and the last "Keeps audio, transcript and notes as files on the Mac, with no account and no upload". BreadcrumbList on the twelve use-case pages, FAQPage on `/faq` (the FAQ answers above, answer 5 without the 50%).

Change:
