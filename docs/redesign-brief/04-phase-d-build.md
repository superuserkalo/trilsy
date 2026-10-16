# Phase D: Build

Read `00-master.md`, `/docs/redesign/STATE.md`, the approved concept, the copy deck, the logo files, and the behavior specs. Build only what Gates B and C approved. Use only the approved copy.

## Break it down first

Phase D is too large for one session. In the first Phase D session, build nothing: turn the structure approved at Gate B into one ticket per section (header, hero, trust band, each approved section, footer, then motion and scroll), following `docs/agents/issue-tracker.md`, under `.scratch/redesign/issues/`. Each ticket names its section, the approved copy, the behavior spec it re-implements, and what it is blocked by. Each ticket also carries a `Lane:` line under its `Status:` line, which `scripts/redesign` reads to pick the model (see Lanes in `00-master.md`): `Lane: design` for every section ticket, `Lane: logic` for motion and scroll and for a ticket with nothing to look at (data, metadata, build plumbing). The hero ticket takes its lines from the Phase B bake-off result in STATE.md (`Effort: xhigh` if Sonnet won, `Model: opus` if Opus won); no ticket uses max. Each ticket lists the images it needs from me, or says it needs none. Ask me to run `/mattpocock-skills:to-tickets` for this; it is a skill only I can start. Show me the ticket list, then stop.

Every later session builds exactly one ticket, following the process below, then stops.

## Process per section
- **Mobbin, per section (not once up front).** Before building each section (hero, trust band, how it works, use cases, pricing, FAQ, header, footer), run `mobbin:search` for that pattern, pick 3 references, note what you borrow, save screenshots to `/docs/redesign/refs/<section>/`. Build after.
- **No hand-rolling by default.** Check in order: (1) a shadcn/ui primitive, (2) the shadcn registry directory and community registries (current and maintained ones such as Magic UI, Motion Primitives, Kibo UI, Cult UI, Aceternity UI, and others you find). Write a custom component only when nothing fits, and record why in the ledger. Do not choose a component because it is flashy.
- Show me each major section as a running preview before moving on. Ask at most one question per section.

## Hero
- H1 states what Trilsy is in plain words. Subhead adds who it is for and the key difference. Primary and secondary CTA visible without scrolling.
- The visual is the approved animated conversation (characters speak, words stream into live transcript lines, notes assemble). No dashed placeholder waveforms, no empty cards.
- **The hero and the pinned story are one section** (owner, 2026-10-15, hero option 1, "the room folds into the window"; prototype `docs/redesign/prototypes/d4-hero-combo.html?v=1`). As the page scrolls, the people fold into portrait tiles on the window's edge, the window shrinks and pins, the story photograph comes out from behind it, and the three chapters (record, transcribe, notes) scroll beside it, each setting which step the window plays. There is no separate pinned story with its own product card: the hero's window is that card.
- **A trust band of company logos, not a capability band, after the hero and pinned story section and before Questions.** No strip of product facts or capabilities in any form: not the old four-capability strip, and not a row of "open source, on-device, local audio, macOS" either. Those facts belong in their own sections. The band is one short line above a marquee of company logos with their names. The creative work is the line: word it so that the biggest and best-known companies can stand under it truthfully, then fill the row with those. The line and the set are chosen with me in Phase B (B3) and never by you alone. The line must be true of every logo in the row: never present a company as a customer, user or partner when it is not. **Build it as the marquee in `~/forwardpass-web/src/components/trust-band.tsx`** (its CSS is the `marquee-mask` and `marquee-track` block in that project's `src/app/globals.css`), same design: a centered muted line; below it one row of 20px mark plus semibold name at `text-foreground/55`, 48px apart, duplicated once (second copy `aria-hidden`) and looped by translating the track -50% at a slow linear pace (70s there); both edges fade out through a horizontal mask (transparent to solid over the first and last 10%); under `prefers-reduced-motion` the loop stops, the copy is hidden and the row wraps centered. Port the design, not the stylesheet: here it is Tailwind utilities and theme tokens, with no component classes added to `globals.css`. No invented logos, testimonials or numbers. Mark placeholders `TODO` and list them at the end.

## Sections
- **Integrations:** no section, page or MCP block. Nothing is available to show, and the no-roadmap rule holds (B8, Phase D ticket list). FAQ 10 is the only mention, as "not yet".
- **Pricing:** Free and Pro only, per the master (Pro marked "not available yet"), plus the student discount line and the hours calculator. No Enterprise, Teams or lifetime price.
- **Use cases** (lectures and study first, then meetings, interviews, research, and so on): own anchor ids, search-intent copy, each showing a different behavior of the product.
- **How it works:** three steps, each with a motion that explains it.
- **Privacy and trust:** concrete and specific.
- **FAQ:** shadcn Accordion plus FAQPage JSON-LD.
- **Header:** look at how 5 strong sites handle sticky headers (Mobbin), implement one calm behavior.
- **Footer.**

## Motion and scroll
- Hero flow: plays once on load, then holds or loops very slowly. Pause off-screen.
- Scroll: `useScroll` / `useTransform` and pinned or sticky storytelling where one visual evolves as copy changes. **Re-implement the patterns from the Phase A behavior specs with our own code.** Do not ask me for source.
- Scroll reveals: subtle, one pattern, one easing token, 400 to 600ms. Micro-interactions only on interactive elements.
- Use `motion` with `LazyMotion`. Honor `prefers-reduced-motion`.
- **No shader anywhere on the site** (Gate C). The photograph swap between the story's chapters, behind the pinned hero window, is a Motion cross-fade, instant under `prefers-reduced-motion`.
- No parallax for its own sake, cursor effects, floating blobs, bouncy springs, or staggered fade-up on everything.

## Performance
- Server Components by default, `use client` only for interactive leaves. `next/image`, `next/font`, no layout shift, lazy-load heavy visuals, Suspense boundaries.
- Targets: LCP < 2s, CLS 0, INP < 200ms.
- Apply the Vercel Next.js and React skills (start at https://vercel.com/docs/agent-resources/skills). If a page does not load, stop and ask me.

Update STATE.md and the ledger at the end of each section. When the last ticket is built, stop and tell me.
