# Phase B: Concept (no code except throwaway prototypes)

Read `00-master.md`, `/docs/redesign/STATE.md`, and the Phase A outputs. Run `superpowers:brainstorming` and read the design skills in full. Write `/docs/redesign/01-concept.md`, but work with me one topic at a time (see co-design rules).

## B1. Positioning
One sentence. A first-time visitor must know within 3 seconds what it is, who it is for, and what is different (records on your Mac, no bot).

## B2. Hero: three concepts
Each has a headline plus subhead, a 4 to 6 beat storyboard of what the visual does over time, where the trust band sits, and why it communicates the product faster than the alternatives.

All three combine a **realistic product UI** (a real-looking Mac recording window, live transcript filling in, notes assembling) with **hand-drawn illustrated characters** in a meeting, lecture or interview setting. They differ in composition and story. The characters talk, speech bubbles appear, their words stream into live transcript lines, and a "Create notes" action assembles clean notes, as one smooth animated flow that reads at a glance without sound or interaction, loops gracefully and stays calm.

The feel is warm, hand-drawn and editorial. References I provide: a hand-drawn meeting scene with laptop, plant and speech bubbles around a real UI card; a sticker-style hand-drawn illustration above a serif headline. It is **not** Saturday-morning cartoon, mascots or corporate stock. Do not copy any reference artwork. Recommend one, with reasoning.

**Illustration sourcing, with licenses:** (a) original SVG characters you draw in one consistent style, (b) a permissively licensed hand-drawn set (check commercial use and attribution), (c) a commissioned set I supply later. Recommend one. Characters must be consistent in line weight, palette and proportions across the site, and diverse. Choose an animation approach (motion with SVG, Lottie, Rive), weighing quality, bundle size and fit, and justify it.

## B3. Page structure
One job per section. Do not keep the current order by default. Justify each choice from the teardown.

## B4. Type and color
Guided by the design skills, with their principles named. One display face and one text face, each with a reason. Avoid Inter, Geist, Space Grotesk, DM Sans and Plus Jakarta unless defended. Palette as shadcn CSS variables, light and dark. Gradients only where they carry meaning.

## B5. Motion plan
Hero storyboard with timing, plus scroll choreography (pinned storytelling for record, transcribe, notes), based on the Phase A behavior specs. Rules: every animation explains something, guides attention or confirms an action. One easing token, 400 to 600ms. No decorative parallax, cursor effects, floating blobs, bouncy springs, or staggered fade-up on everything.

## B6. Logo (SVG)
Use `brandkit`, the design skills, and Mobbin/web references. Deliver a sheet of **3 distinct directions**, rendered large and at 16, 32 and 64px, light and dark, each with a one-line rationale. Simple, memorable, works as a favicon, a wordmark that pairs with the chosen display face, and a hand-made, warm mark consistent with the illustrations. Avoid generic waveform or mic icons, sparkles, gradient blobs, clouds, stock "AI" marks. After I pick one, refine it with me, then export: horizontal and stacked lockups, mark-only, monochrome, favicon set, app-icon square, OG version. Clean outlined paths, no raster, no font dependencies.

## B7. Integrations and MCP conversation
Show what Otter, Fireflies, Granola, Wispr Flow and Superwhisper offer. Suggest 2 or 3 candidate launch sets aimed at business plus students (with reasoning), propose what an MCP server could expose, and let me choose. Include a roadmap list only if I approve it. Record the decisions in STATE.md.

## B8. Cloud features and pricing: settle the conflict

The product facts in `00-master.md` describe transcription and notes through an API (bring your own key, or Pro cloud models) and paid plans. The repo's `README.md` says the native app today has no cloud AI, account, server, subscription or billing, and calls paid processing a future decision. Both cannot go on the site as written.

Before the copy deck, lay out for me what the app does today (from `README.md`, `docs/architecture.md` and `Sources/`) against what the master claims, then ask me, one topic at a time:
- which cloud and bring-your-own-key capabilities the site may state as available, which as `Coming soon`, and which not at all;
- whether pricing appears at launch, and in what form (full tiers, Free only, or "pricing coming");
- how the student offer is shown if Pro is not yet for sale.

Record the decisions in STATE.md. Then make the sources agree: update the product facts in `00-master.md` and the scope section of `README.md` to match what I decided, so no later session meets the conflict again. The copy deck follows these decisions.

## B9. Copy deck
`/docs/redesign/02-copy-deck.md`, written to the copy-playbook rules: hero H1 and subhead (3 options each), trust band, every section heading and body line, integrations and MCP copy, pricing and student offer, FAQ (8 to 10 real questions), CTAs and microcopy. No code starts until I approve the copy.

**GATE B:** I choose the hero concept, logo, integrations set, cloud and pricing scope, structure and copy. Update STATE.md and the ledger. Then stop.
