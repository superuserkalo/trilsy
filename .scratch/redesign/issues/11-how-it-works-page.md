# 11: How it works page

Status: done
Lane: design
Blocked by: 02

**Section:** the `/how-it-works` page. Privacy and trust live here ("Where it lives"), since B3 moved audio location off the home page.

**What to build:** heading "Press record. Read the notes." and the seven blocks: what is recorded, where it lives, how the transcript is made, how the notes are written, what you can do with them, what you need, the code. Concrete and specific, as the copy says it. Motion only where it explains a block; one idea appears once on the page. Page title and description.

- Mobbin: 3 how-it-works or explainer-page references to `docs/redesign/refs/how-it-works/`.

**Approved copy:** `docs/redesign/02-copy-deck.md` section 8.
**Behavior spec:** none required.

**Images needed from the owner:** none.

- [x] All seven blocks, copy exactly as approved
- [x] Layout at 1440 and 390
- [x] Typecheck and build pass

## Answer

Design lane, Sonnet 5.5, loop mode, 2026-10-15.

- **The page.** `web/app/how-it-works/page.tsx` (Server Component): a pale blue band with the H1 "Press record. Read the notes." (the second sentence in the hero's `Marker`, so the one brand mark carries over), then seven blocks on paper separated by the dotted rule. Page title and description are new copy for review, with no price and nothing unbuilt; canonical `/how-it-works`. The copy is the deck's section 8 word for word (curly apostrophes only).
- **Block layout** (`web/components/how-it-works/block.tsx`): a quiet Fraunces number and the title on the left, the text and, where a picture explains it, one window on the right (`5fr / 7fr` from 1024px; stacked below, number beside the title). Each block has an id (`what-is-recorded`, `where-it-lives`, `the-transcript`, `the-notes`, `what-you-can-do`, `what-you-need`, `the-code`) and a `section` labelled by its title. The numbers are signposts, `aria-hidden`.
- **The windows** (`mock.tsx` is the shared frame and the Notes / Transcript control; all are illustrations, labelled with the app's own words): 1 `sources-demo.tsx`, the capture strip with real switches; 2 `files-demo.tsx`, the Recordings folder as the app lays it out (names follow `RecordingStore.swift` and `Recorder.swift`: a UUID folder, `recording.json`, `<source>_<ms>_<UUID>.caf`); 3 `transcript-demo.tsx`, three lines with HH:MM:SS stamps and Microphone or System chips, plus the language and vocabulary fields; 4 `notes-demo.tsx`, plain Markdown notes; 5 `library-demo.tsx`, the search field filtering the list and the Export menu with the app's three entries. Blocks 6 and 7 have no picture: restating "what you need" as a spec table or tiles would say the same sentence twice.
- **Motion, only where it explains.** Block 1: when the window is 70% in view, App audio switches on once (900ms later, 400ms on `ease-trilsy`) and the app picker appears, so the order reads "off until you turn it on". It is a real switch; either one can be flipped, and a touch stops the automatic flip. Block 4: the sections appear one after another, 900ms apart, the status line counts them, and the overview is written last into the space kept for it on top (600ms fades, the one easing, no layout shift). Under `prefers-reduced-motion` block 1 starts switched on and block 4 shows the finished notes at once (read from the code: the tool cannot emulate the media feature). Nothing else moves.
- **Components.** shadcn `Switch` added (`web/components/ui/switch.tsx`, Base UI) and restyled to the tokens (ink border, mustard on, ink thumb, flat). `Window`, `Band`, `Badge`, `Button` reused. Hugeicons only, `strokeWidth` 2.
- **Mobbin.** Two queries, 24 sections read; four kept in `docs/redesign/refs/how-it-works/` with what each informed (Wild, Zaro, In Common With, and Sequence as the thing to avoid).
- **Checked.** Chrome (dev server) at 1440 by 900 and 390 by 844 (and 390 by 500 for the in-view trigger): the whole page at both widths (`docs/redesign/prototypes/d11-how-it-works-1440.png`, `d11-how-it-works-390.png`); no horizontal overflow at 390 (a nowrap file name widened the grid at first; fixed with `min-w-0` and wrapping notes); no console messages; the switch flips about 900ms after the window enters the view; the notes' parts reach full opacity in order (about 1.2s, 2.0s, 2.8s, 4.0s). Typecheck and build pass. The 390 by 844 viewport shows the first window at load, so on a phone the flip happens during the first scroll.
- **Defaults taken.** Recording and file content in the windows is invented illustration ("Design review", the three lines, the notes), not copy from the deck; the file names are not (they follow the code). The notes window shows an overview over three sections to illustrate the order, though the transcript window shows only the first three lines of the same recording. The H1 band is pale blue (the FAQ page's is paper). One button, mustard, as on the hero. No in-page contents list (it would repeat the block titles).
- **Open.** Safari and Firefox not checked (Playwright's WebKit does not launch here; the `Marker` SVG filter was already open from ticket 04). Reduced motion not run live. `TODO: confirm` (from the deck): the Whisper "small" model and the several-GB figure are from the code, not measured on a Mac; "16 GB recommended" is the README's.
