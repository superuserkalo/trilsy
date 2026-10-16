# 06: Pinned story, composition

Status: resolved
Lane: design
Blocked by: 02

**Section:** home, the pinned story (record, transcribe, notes), on warm paper.

**What to build:** the look of the story in each of its states, with the active chapter as a prop, so ticket 07 only has to wire scroll.

- Chapter 1, Record: wide frame (about 1200 by 800) with the recording card (timer, waveform in the product style) over the photo's dark lower third; heading left on paper.
- Chapter 2, Transcribe: 4:5 portrait frame on the right; the card becomes a transcript.
- Chapter 3, Notes: portrait frame; the card becomes notes assembling as in the hero.
- Under the story, one quiet line: "Your recordings stay on your Mac."
- Phone (390px): three stacked cards, each a portrait photo with its product card over the bottom.
- Photo boxes at exact final dimensions marked `TODO: image`, so nothing shifts when files arrive. Photo alt text from the copy deck.
- Mobbin: 3 references for pinned/scroll storytelling to `docs/redesign/refs/story/`.

**Approved copy:** `docs/redesign/02-copy-deck.md` section 4.
**Behavior spec:** `01-concept.md` B5 "Pinned story"; `behavior-wisprflow.md` pattern 1 (the photo scroll effect) for craft only; the owner said not to copy any reference 1:1.

**Images needed from the owner:** `story-record.jpg` (3:2, 3600 by 2400), `story-transcribe.jpg` (4:5, 2400 by 3000), `story-notes.jpg` (4:5, 2400 by 3000). Requests in `docs/redesign/STATE.md`, "Open image requests".

- [ ] All three chapter states render from one component with a chapter prop
- [ ] Phone stacked layout at 390px
- [ ] Photo boxes at final size, marked TODO: image
- [ ] Typecheck and build pass

## Answer

Superseded 2026-10-15, not built. The owner approved hero option 1, "the room folds into the window" ("I agree with number one. Um, fix what's still rough.", then "I approve and build."), which makes the hero and the pinned story one section. This ticket's composition is folded into ticket 04, because what it described no longer exists on its own: the hero's window is the story's product card (no separate recording card), all three photographs are 4:5 behind that window (the wide 3:2 chapter 1 frame and the wide-to-portrait reshape are gone), and the phone's three stacked cards are replaced by a pinned stage with tiles, photo, window and a chapter caption. The chapters' copy, the photo boxes marked `TODO: image`, the photo alt text and the quiet line "Your recordings stay on your Mac." all move to 04. The scroll half is ticket 07, rewritten.
