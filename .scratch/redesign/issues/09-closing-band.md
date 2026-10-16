# 09: Closing band

Status: resolved
Lane: design
Blocked by: 02

**Section:** home, after the questions: the call to action over one full-width photograph.

**What to build:** heading "Walk out with the notes.", the View on GitHub button and the helper "Free, on your Mac, no account." in light text on the photo's quiet left 45%; the photo static; the button presses as in the hero. A separate 4:5 phone crop with the subject in the right half. Photo box at exact final size marked `TODO: image`, with a dark enough stand-in for contrast checks.

- Mobbin: 3 closing-CTA references to `docs/redesign/refs/closing/`.

**Approved copy:** `docs/redesign/02-copy-deck.md` section 6 (heading option 1).
**Behavior spec:** none.

**Images needed from the owner:** `closing-band.jpg` (21:9, 3600 by 1543; 4:5 phone crop at least 1200 by 1500). Request in `docs/redesign/STATE.md`.

- [x] Layout at 1440 and 390 with the TODO box at final size
- [x] Text contrast passes against the stand-in
- [x] Typecheck and build pass

## Answer

Design lane, Sonnet 5.5, loop mode, 2026-10-15.

- `web/components/closing-band.tsx` (Server Component, no client code): one `<section>` at the photograph's exact ratio (4:5 below 640px, 21:9 from 640px up), the `--dusk` stand-in marked `TODO: image closing-band.jpg`, then the heading "Walk out with the notes." (Fraunces by the base rule, cream), the View on GitHub button (the hero's `Button size="lg"`, so it presses the same way: `active:translate-y-px`, mustard, 400ms on `ease-trilsy`) and the helper "Free, on your Mac, no account." The photo is static; nothing moves in the section. Mounted last on home, after `FaqSection`.
- `web/app/globals.css`: tokens `--dusk` (#1c2a35, the deep teal-blue of the dusk photographs) and `--dusk-foreground` (#fffdf8), with `bg-dusk` and `text-dusk-foreground` utilities. No component classes.
- **Placement.** From 640px up the text block is vertically centred and kept inside the left 45%: `max-w-[min(26rem,calc(45vw-3rem))]` from the page container's left edge. Measured right edge against 45% of the viewport: 640 wide, 264 of 288; 768, 322 of 346; 1024, 437 of 461; 1280, 504 of 576; 1440, 584 of 648. Phone: the block sits at the lower left, 240px wide (61% of 390), and fills the lower 40% of the 487px box.
- **Contrast** against the stand-in (#1c2a35): heading 14.4:1, helper (cream at 85%) 10.8:1, the TODO label 7.8:1, button ink on mustard 8.1:1. The photograph must be at least this dark behind the text; the image request says so.
- **Checked** in Chrome (dev server) at 1440, 1280, 1024, 768, 640 and 390 by 844 at 2x; no horizontal overflow at any; heading is two lines at every width; captures `docs/redesign/prototypes/d09-closing-1440.png` and `d09-closing-390.png`. Typecheck and build pass. Reduced motion needs nothing: there is no animation here.
- **References** in `docs/redesign/refs/closing/` (Oura Ring, Acquired, Wix; README says what each informed). Their lesson: keep the text off the subject by composition, with no scrim.
- **Defaults taken.** The 21:9 crop is used from 640px, not only on desktop, so a tablet never gets a 960px-tall band; the 4:5 crop is for phones. No dotted rules around the band; it is full-bleed and sits against the footer. The button keeps its ink border, which merges with the dark photo so it reads as a plain mustard pill. The `TODO: image` label sits top right on the phone and bottom right otherwise.
- **To swap in the photograph** (the comment at the top of the file says the same): replace `<PhotoBox />` with two `next/image` fills (`sm:hidden` for the 4:5 crop, `hidden sm:block` for the 21:9), `object-cover`, `sizes="100vw"`, alt "Someone walking out of a lit hall into the dusk, bag on shoulder". Keep `bg-dusk` on the section as the fill while it loads.
- **Open.** The photograph (owner-made; request in STATE.md, with the phone crop's quiet area now stated). The dark-mode `--dusk` is the same as light on purpose: the photograph does not change with the theme.
