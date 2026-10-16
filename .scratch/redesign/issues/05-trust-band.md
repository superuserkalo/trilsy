# 05: Trust band

Status: resolved
Lane: design
Blocked by: 04

**Section:** home, after the merged hero and pinned story section (ticket 04) and its quiet line, before Questions, on the pale blue field with dotted ink rules above and below, as in the approved prototype (`docs/redesign/prototypes/d4-hero-combo.html?v=1`). It moved there with hero option 1, approved by the owner on 2026-10-15; it is no longer under the hero.

**What to build:** the marquee from `~/forwardpass-web/src/components/trust-band.tsx` (its CSS is the `marquee-mask` and `marquee-track` block in that project's `globals.css`), ported in design, not stylesheet: a centered muted line; one row of 20px mark plus semibold name at `text-foreground/55`, 48px apart, duplicated once (second copy `aria-hidden`), track translating -50% on a 70s linear loop; both edges fade through a horizontal mask over the first and last 10%; under `prefers-reduced-motion` the loop stops, the copy is hidden and the row wraps centered. Tailwind utilities and tokens only, no component classes in `globals.css`.

- Line: "Trilsy records whatever your Mac plays, from the apps you already use."
- Marks in grey: Zoom, Google Meet, Microsoft Teams, Slack, Discord, Webex, YouTube, Safari, Google Chrome, FaceTime (marks in `docs/redesign/prototypes/logos/`, Simple Icons; check each brand's guidelines).
- Footnote: "App names and marks belong to their owners; no affiliation or endorsement is implied."
- Never the word "integrates". `TODO: confirm` each app on a real Mac before launch.
- Mobbin: 3 trust-band references to `docs/redesign/refs/trust-band/`.

**Approved copy:** `docs/redesign/02-copy-deck.md` section 3.
**Behavior spec:** the forwardpass marquee above.

**Images needed from the owner:** none.

- [x] Loop, mask and duplicate as specified; static wrapped row under reduced motion
- [x] Line and footnote exactly as approved
- [x] TODO: confirm listed
- [x] Typecheck and build pass

## Comments

- 2026-10-15, logic lane: the band moves from directly under the hero to after the story, before Questions (owner-approved hero option 1). Line, marks, footnote and marquee are unchanged. Still blocked by 04, the section it follows.

## Answer

Built 2026-10-15, design lane, Sonnet 5.5, loop mode.

- `web/components/trust-band.tsx` (Server Component, no JS): a `Band` (`field`, dotted ink rules both sides) holding the line (15px, `text-muted-foreground`, centered), one row, and the footnote (13px). The row is one `ul` of ten apps, 20px mark plus semibold name at `text-foreground/55`, 48px apart, rendered twice; the second `ul` is `aria-hidden`. The track is `w-max animate-marquee` (70s linear, -50%; measured: each copy is 1410.7px wide, so the loop's seam is exact). The wrapper masks both edges (transparent to black over the first and last 10%). Under `prefers-reduced-motion` the animation is `none`, the second copy is `display: none`, the mask is off, and the row wraps centered (one line at 1440, five lines at 390).
- Each mark is a span with `bg-current` and a CSS mask of the Simple Icons SVG, so every mark takes the text colour and all ten are one grey (the prototype used `filter: grayscale` plus 60% opacity on black files, which is a slightly different grey). The nine SVGs are copied to `web/public/logos/`. FaceTime has no mark in the set, as in the approved prototype: its name stands alone (a drawn or substituted mark would be an invented logo).
- `web/app/globals.css`: one token and one keyframe, `--animate-marquee` and `@keyframes marquee`, in the `@theme` block next to the hero's loops. No component classes.
- `web/app/page.tsx`: `<TrustBand />` after `<HeroSection />`, before Questions (not built yet).
- References: three Mobbin sections in `docs/redesign/refs/trust-band/` (Lattice, Notion, 1Password) with what each informed, in its README.
- No shadcn primitive and no registry item fits: Magic UI's `marquee` repeats the content four times with no `aria-hidden` copy, no half-width seam and no wrapped reduced-motion state, so the spec's own markup is shorter than adapting it.

Checked in Chrome: 1440 and 390 (no console messages, no horizontal overflow), and with `reducedMotion: reduce` in Playwright at 1440 and 390 (animation none, copy hidden, wrapped, no overflow). Captures: `docs/redesign/prototypes/d05-trust-band-1440.png`, `d05-trust-band-390.png`, `d05-trust-band-reduced-1440.png`, `d05-trust-band-reduced-390.png`. Typecheck and build pass.

`TODO: confirm` (also in code comments): each of the nine apps on a real Mac before launch (copy deck 13, item 4); that each brand's guidelines allow its mark in one flat grey inside a list of names (not checked: Google, Microsoft, Zoom, Slack, Discord, Cisco Webex, Apple and YouTube each publish rules, and some limit recolouring; if one forbids it, drop that mark and keep the name). Not checked: Safari and Firefox rendering of CSS masks (both support `mask-image`; the build ships the `-webkit-` form).

Defaults taken: the mask is off in the reduced-motion layout (a fade would clip the wrapped row at narrow widths); the footnote is 13px under the row. For ticket 07: the prototype gives the band `z-index: 6` so it sits over the pinned stage's tail; the band has no z-index yet, add it if the stage overlaps it.
