# B8 fact check: the Trilsy Mac app today against the master, the README and the live site

Logic-lane report, 2026-10-14, relayed unedited by the orchestrator. Read-only: no file was edited, nothing was installed or built. Paths are under `/Users/kalo/trilsy/`. "Code" means it is written in the Swift source; it does not mean it has been seen working on a Mac (see the build row).

## Table

Claim | Today | Evidence
--- | --- | ---
Records microphone and system audio together (master :107, site.tsx:753 "Capture your microphone and app audio") | Partly true. Both can be captured at once, as two separate chunk streams (not mixed into one file). The default is microphone only: "App audio" is off until the user turns it on. No echo cancellation; the app tells users to wear headphones. | Sources/AppModel.swift:13-14 (micEnabled true, systemEnabled false), :83; Sources/Recorder.swift:152-193; Sources/ContentView.swift:124-125, :143
Works with any app that makes sound: Zoom, Meet, Teams, FaceTime, browser tabs (master :108) | True in code, untested. System capture takes all apps except Trilsy, or one app picked from a list. Nothing is specific to any named app, and no named app has been tested. Needs the macOS Screen & System Audio Recording permission. | Sources/Recorder.swift:120-124, :155-164, :166-167; Sources/ContentView.swift:126-131; docs/acceptance.md:7 (check 3, not run)
In-person rooms (master :108) | True in code: microphone-only recording, default input device. | Sources/Recorder.swift:177-192; Sources/AppModel.swift:13
Transcribes it (master :107) | True in code. Engine: WhisperKit, model "openai_whisper-small". Runs only after recording stops, never live. Language auto-detect or a typed code; optional vocabulary prompt. | Sources/Transcriber.swift:9, :17-22; Sources/AppModel.swift:143, :152-165; project.yml:7-9 (argmax-oss-swift 1.1.1)
Transcription needs a network download first | True. First use downloads the model from Hugging Face; processing refuses to start until the user ticks "Allow speech and notes model downloads". Fully offline use after that is unverified. | Sources/AppModel.swift:18, :144, :152; Sources/ContentView.swift:144-145; README.md:22; docs/acceptance.md:11 (check 7, not run)
Hardware for transcription | Apple silicon only (arm64 build). README recommends 16 GB RAM; no minimum is enforced or measured. | project.yml:18; README.md:15
Writes notes (master :107) | True in code. Model: mlx-community/Qwen2.5-3B-Instruct-4bit through MLX, also downloaded on first use. | Sources/Summarizer.swift:7, :10; project.yml:10-12
Notes per section, then an overview (site.tsx:281-283, :759) | True in code. Transcript is split into pieces of at most 6,000 characters, each gets detailed notes, then a short "## Overview" is put on top. If the overview cannot be reduced to fit, the sections are kept without one. | Sources/Recording.swift:59-78; Sources/AppModel.swift:173-198; test testLongNotesKeepEveryCharacterAndBoundPrompts
Extracts action items or decisions (site demo callout site.tsx:447-450, hero.tsx:207 "A clear next step") | Not as a feature. The prompt says "Include decisions, actions and open questions only when supported"; whatever comes out is free Markdown text inside the notes. There is no action-item field, list or view. | Sources/Summarizer.swift:24; Sources/Recording.swift:20-31 (no such field)
Notes are editable (master :110) | True in code, with a catch. Notes are a plain-text Markdown editor (not rendered); title and each transcript line are editable too. "Rewrite notes" asks before replacing edits, but "Continue processing" regenerates notes and overwrites edits with no warning. | Sources/ContentView.swift:35, :59-60, :71-73, :87, :90, :107-108; Sources/AppModel.swift:181, :197
Recordings and notes are searchable (master :110, site.tsx:765) | Partly true. One sidebar field filters the list of recordings by a case-insensitive substring match over title + transcript + notes. It does not find or highlight the match inside a recording. | Sources/ContentView.swift:15-17
Export as Markdown (master :110) | True in code. One file: title, notes, then the full transcript. | Sources/AppModel.swift:213-219; Sources/ContentView.swift:44
Export as text (master :110) | Partly true. The .txt export is the transcript only (timestamp and source per line). Notes are not in it. | Sources/AppModel.swift:218; Sources/ContentView.swift:45; Sources/Recording.swift:32-36
Export as subtitles, SRT (master :110) | True in code. Numbered cues with start and end times; no source labels. | Sources/Recording.swift:44-54; Sources/ContentView.swift:46; test testTranscriptAndSubtitlesAreChronological
Audio is stored locally (master :109) | True in code. ~/Library/Application Support/Trilsy/Recordings/<UUID>/, as roughly 60-second .caf chunks per source plus recording.json. No app-level encryption. The audio is written in the capture format (system audio at 48 kHz stereo), so files are uncompressed and large. | Sources/RecordingStore.swift:8-11, :15, :22; Sources/Recorder.swift:46-48, :53, :168; README.md:50
Transcription and notes through an API, BYOK, or Trilsy-hosted (master :109, :113) | False. Not in the code. Settings holds only: download consent, language, vocabulary. No key field, no keychain use, no HTTP client, no endpoint. | Sources/ContentView.swift:140-151; Sources/AppModel.swift:16-18; grep of Sources/ for http, URLSession, key, keychain, openai: only the model name at Transcriber.swift:9
Account, login, billing, subscription, cloud storage, sync | None present. | Same grep (account, login, stripe, storekit, icloud, cloudkit: no hits); README.md:11, :56
Open source on GitHub (master :111) | Partly true. The repo is public (github.com/superuserkalo/trilsy, 0 stars). There is no LICENSE file and GitHub reports no licence, so legally it is public source with all rights reserved, not open source. Only web/package.json:15 says "ISC", which covers nothing but that package file's own field. | gh repo view: visibility PUBLIC, licenseInfo null; git ls-files shows no licence file
Apple silicon, macOS 15+ (master :111, site.tsx:208-209) | True. | project.yml:5, :17, :18, :42
Imports audio and video files (README.md:11, site.tsx:128 "an existing recording") | True in code. Open panel accepts audio and movie types; the first audio track is re-encoded into chunks. No file format has been tested. | Sources/AppModel.swift:117-140; Sources/Media.swift:7-56; docs/acceptance.md:10 (check 6, not run)
Transcript view shows timestamps (master's TODO: confirm) | Confirmed in code. Every transcript line has an HH:MM:SS button that starts playback at that point. Timestamps inside the notes are text the model copied, not links, and can be wrong. | Sources/ContentView.swift:67; Sources/Recording.swift:39-42; Sources/Summarizer.swift:23; README.md:52
Transcript view shows speaker labels (site demo names "Alex", "Sam": site.tsx:73, :98, :486) | False. Labels are the audio source (Microphone, System, Import). The app says so on screen. No diarization. | Sources/ContentView.swift:70, :79; README.md:26, :56
Integrations, MCP server, calendar, Slack, Notion, Drive, Outlook | None. No such code. | grep of Sources/ (mcp, slack, notion, eventkit, calendar): no hits; README.md:56
Analytics or network calls other than model download | None in Trilsy's own code: no networking API is called anywhere in Sources/. The only network use is inside the two SDKs when they fetch or check models. The app is not sandboxed, so nothing technically blocks network use. | Same grep; project.yml:44-47 (only the audio-input entitlement); README.md:22
"No account needed", "On-device AI / Processed on your Mac", "No upload" (site.tsx:656-667, :132, :890-892; hero.tsx:226) | True of today's code. | Rows above; Sources/ContentView.swift:57, :96, :145
"No meeting bot" / "botless" (site.tsx:661, :127-128; hero.tsx:226; app/layout.tsx:9) | True of today's app, but the owner ruled it off the site on 2026-10-13. | docs/redesign/STATE.md:62
"Will there be an iPhone app? Yes, that is the plan." (site.tsx:143-144) | Not in the code. A roadmap statement only. | README.md:56 ("No ... iPhone app ... yet")
Pause and resume, menu bar control, playback (not claimed by master or site) | Present in code. | Sources/AppModel.swift:92-102; Sources/App.swift:25-34; Sources/Media.swift:59-99
Build and test status | The project notes are out of date. GitHub Actions has run the Mac job 4 times, all green, the last on commit 57cba71 (current HEAD, 2026-10-13): macos-15 runner, Xcode 16.4, "** TEST SUCCEEDED **", all 5 tests passed. Checked from the CI log, not by building. The 5 tests cover storage recovery, corrupt files, note chunking and export order only. Nothing has ever exercised recording, WhisperKit or the notes model, and no run of the app is on record. Acceptance checks 2 to 10 are still not run. The build carries Swift concurrency warnings in Recorder.swift and Media.swift that become errors in Swift 6 mode. | gh run list (4 runs, all success); mac job log of run 38370612245; .github/workflows/check.yml:6-17; scripts/build-mac.sh:5-6; Tests/RecordingTests.swift:6-71; docs/acceptance.md:3

## List 1: where the master, the README, the site and the code disagree

1. Cloud and BYOK. Master :109: "Transcription and notes can run on-device **or** through an API (bring your own key, or Pro cloud models). Never imply only one." Code: local only, no key field. Site says the opposite of "never imply only one": "On-device AI / Processed on your Mac" (site.tsx:656-657), "Transcription and note generation run locally" (:132). The app itself says "Processing happens on this Mac" (ContentView.swift:57). Master :114 already flags this for B8.
2. Free tier. Master :113: "Free (app, BYOK and local models, no time limit)". BYOK does not exist. Site (:140): "No paid plan or subscription is available yet."
3. Open source. Master :111: "Open source on GitHub." The repo is public but has no licence. The live site never mentions GitHub or open source.
4. Text export. Master :110: "Export as Markdown, text, subtitles" placed after "Notes are editable and searchable", which reads as exporting notes. The .txt and .srt exports hold the transcript only; notes leave the app only in the Markdown file. README :11 words it the same loose way: "export Markdown, text, or SRT".
5. Search. Master :110 "searchable", README :11 "search recordings", site :765 "Search, edit, and export". The code filters the recording list; there is no search inside a note.
6. System audio by default. Master :107: "records any call ... (system audio plus microphone)". App audio is off by default (AppModel.swift:14), so a first-time user recording a call captures only their own voice unless they switch it on.
7. Named apps. Master :108: "Zoom, Meet, Teams, FaceTime, browser tabs". None has been tested (acceptance.md check 3).
8. Bots. README :3 "A private, botless notetaker", README :11 "No meeting bot", site "No meeting bot" (site.tsx:661), "No bot. No upload." (hero.tsx:226), "botless" (layout.tsx:9), CLAUDE.md first line "botless". Master :107: "The site makes no claim about bots, for or against".
9. Build status. README :5: "has not yet been compiled or exercised on a Mac". README :24: "The five native tests and the Mac CI job have not yet had an observed passing run." CLAUDE.md: "no observed successful Mac build, test run or CI run". acceptance.md :3: "not run". CI shows four passing Mac build and test runs.
10. Speakers. Site demo attributes quotes to named people ("Alex", "Sam", site.tsx:73, :98) under "Worth remembering". App: "Labels identify audio sources, not individual speakers." (ContentView.swift:79). README :56: no "individual speaker recognition".
11. Action items. Site demo shows a separate checked follow-up box (site.tsx:447-450) and "A clear next step" (hero.tsx:207). The app has no such element; actions appear only if the model writes them into the note text.
12. Timestamps. README :11 "jump to timestamps": true in the transcript tab only. The site demo's jump button sits beside the notes (site.tsx:488-495); in the app, timestamps in notes are not clickable. Site shows MM:SS, the app shows HH:MM:SS.
13. Editable notes. Master :110 "Notes are editable". README :52: "Notes are regenerated on retry." In the code, "Continue processing" replaces edited notes without the confirmation that "Rewrite notes" shows.
14. Availability. Site (:136): "not available to download yet"; (:212) "no public app download or release date yet". Master :111 presents the product as open source on GitHub, which would let anyone build it. Both can be true, but the site copy needs to choose its wording.
15. iPhone. Site (:144): "Yes, that is the plan." README :56 lists "iPhone app" under what does not exist; the master does not mention it.
16. Tagline. README :3 and layout.tsx:7: "Be here. We'll take the notes." web/lib/brand.ts:3: "Less note-taking. More being there." App empty state (ContentView.swift:96): "Be here. Keep the details." STATE.md:66 has the chosen H1: "Be in the conversation. Trilsy writes the notes."
17. Swift version. README :15: "Xcode with Swift 6.1+". project.yml:15: SWIFT_VERSION '5.0' (CI built it with Xcode 16.4 in Swift 5 language mode).

## List 2: safe to state on the site today

Each is true of the code. None has been confirmed on a real Mac beyond compiling, so wording such as "records" is a statement of what the app is built to do.

- A Mac app for Apple silicon, macOS 15 or later.
- Records the microphone, the sound of other apps, or both at once; one app can be chosen, or all of them.
- Works for in-person conversations through the microphone.
- Imports an existing audio or video file.
- Transcribes after the recording ends, on the Mac, with Whisper (small model).
- Writes notes on the Mac with a local language model: detailed notes section by section, with a short overview on top.
- Optional instructions for the notes, a language setting and a custom vocabulary list.
- Notes, transcript and title can be edited.
- The recording list can be searched by title, transcript and notes.
- Each transcript line has a timestamp that plays the audio from that point.
- Export: Markdown (notes plus transcript), plain-text transcript, SRT subtitles.
- Audio, transcript and notes are stored as ordinary files on the Mac; the app has no upload, no account and no analytics.
- Models download once from Hugging Face before first use and take several GB; that step needs a connection.
- Pause and resume; a menu bar control.
- The source code is public on GitHub (say "source on GitHub", not "open source", until a licence is added).
- No signed installer or public release yet.

Not safe today: any API, BYOK, cloud or Pro capability; "open source"; speaker names or "who said what"; action items or decisions as a feature; live transcription; any named integration, MCP or calendar; "works offline" as an absolute; named call apps as tested; "export notes as text"; any accuracy or speed figure.

## Surprises

The largest one is that the repo's own status notes are wrong in the cautious direction: the Mac app has compiled and its five tests have passed on GitHub's macOS 15 runner four times, including on the current HEAD, while README, CLAUDE.md and acceptance.md all still say no build or test run has been observed. That does not show the product works, since no test touches recording, transcription or notes. The second is that "open source" has no licence behind it, which matters because the master plans a live GitHub star count for the site (the repo has 0 stars). Third, system audio is off by default, which sits awkwardly with a product described as recording calls. Fourth, pressing "Continue processing" silently overwrites notes the user has edited. On disk space: the machine now shows about 10 GB free on the data volume (98% used), not under 500 MB. Disk space is also a product fact worth keeping in mind for copy: the models take several GB and recordings are saved uncompressed, which by estimate from the capture format (48 kHz stereo, not measured) is over 1 GB per hour for system audio alone.

Not run: `npm run typecheck` and `npm run build`, because no site code changed. The decisions these findings feed (B8 cloud and pricing scope, the licence, the README and CLAUDE.md status lines) are the owner's.
