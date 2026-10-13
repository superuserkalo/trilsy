# Phase D: Build

Read `00-master.md`, `/docs/redesign/STATE.md`, the approved concept, the copy deck, the logo files, and the behavior specs. Build only what Gates B and C approved. Use only the approved copy.

## Break it down first

Phase D is too large for one session. In the first Phase D session, build nothing: turn the structure approved at Gate B into one ticket per section (header, hero, trust band, each approved section, footer, then motion and scroll), following `docs/agents/issue-tracker.md`, under `.scratch/redesign/issues/`. Each ticket names its section, the approved copy, the behavior spec it re-implements, and what it is blocked by. Each ticket also carries a `Lane:` line under its `Status:` line, which `scripts/redesign` reads to pick the model (see Lanes in `00-master.md`): `Lane: design` for every section ticket, `Lane: logic` for motion and scroll and for a ticket with nothing to look at (data, metadata, build plumbing). The hero ticket takes its lines from the Phase B bake-off result in STATE.md (`Effort: xhigh` if Sonnet won, `Model: opus` if Opus won); no ticket uses max. Each ticket lists the images it needs from me, or says it needs none. Ask me to run `/mattpocock-skills:to-tickets` for this; it is a skill only I can start. Show me the ticket list, then stop.

Every later session builds exactly one ticket, following the process below, then stops.

## Process per section
- **Mobbin, per section (not once up front).** Before building each section (hero, trust band, how it works, use cases, integrations, pricing, FAQ, header, footer), run `mobbin:search` for that pattern, pick 3 references, note what you borrow, save screenshots to `/docs/redesign/refs/<section>/`. Build after.
- **No hand-rolling by default.** Check in order: (1) a shadcn/ui primitive, (2) the shadcn registry directory and community registries (current and maintained ones such as Magic UI, Motion Primitives, Kibo UI, Cult UI, Aceternity UI, and others you find), (3) a vgpu gallery effect. Write a custom component only when nothing fits, and record why in the ledger. Do not choose a component because it is flashy.
- Show me each major section as a running preview before moving on. Ask at most one question per section.

## Hero
- H1 states what Trilsy is in plain words. Subhead adds who it is for and the key difference. Primary and secondary CTA visible without scrolling.
- The visual is the approved animated conversation (characters speak, words stream into live transcript lines, notes assemble). No dashed placeholder waveforms, no empty cards.
- **A trust band, not a capability band, directly under the hero.** Do not repeat the old four-capability strip. Content: open source with the live GitHub star count, "no bot joins your call", on-device processing, local audio, macOS and chip support, and (only when real) press, reviews, user counts or logos. One quiet row. No invented logos, testimonials or numbers. Mark placeholders `TODO` and list them at the end.

## Sections
- **Integrations** (section plus `/integrations` page): logo row of tools we really connect to, then cards saying what flows where (reference: a rounded-logo row ending in "and more", and a large headline with description cards). A dedicated **MCP block**: what the server lets an AI client do with your meetings, one realistic example prompt and response, a copyable shadcn code block with the config. Use the set we chose in Phase B, show `Available` or `Coming soon` honestly, use official brand assets under their guidelines.
- **Pricing:** Free / Pro / Student / Enterprise per the master, with placeholders flagged.
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
- No parallax for its own sake, cursor effects, floating blobs, bouncy springs, or staggered fade-up on everything.

## Performance
- Server Components by default, `use client` only for interactive leaves. `next/image`, `next/font`, no layout shift, lazy-load heavy visuals, Suspense boundaries.
- Targets: LCP < 2s, CLS 0, INP < 200ms.
- Apply the Vercel Next.js and React skills (start at https://vercel.com/docs/agent-resources/skills). If a page does not load, stop and ask me.

Update STATE.md and the ledger at the end of each section. When the last ticket is built, stop and tell me.
