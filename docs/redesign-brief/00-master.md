# Trilsy website redesign: MASTER BRIEF

Read this file first in EVERY session. It never changes between phases. The work is split into phase files (`01a` to `05`). **Do only the phase file I point you to, then stop.** At the end of each phase, update `/docs/redesign/STATE.md` (decisions made, files produced, open questions, skills ledger) so the next session can continue from it. Read STATE.md at the start of every session if it exists.

## Ending a session: hand me the next prompt

Every session ends the same way, after STATE.md and the ledger are updated:

1. Write a `Next session:` line at the top of STATE.md naming what comes next, as plain text with nothing else on the line: a phase id (`Next session: 01b`), a ticket path (`Next session: .scratch/redesign/issues/03-hero.md`), or `Next session: done` after Phase E. Take the order from the Phases list below; in Phase D it is the next unblocked ticket in `.scratch/redesign/issues/`. `scripts/redesign` reads this line.
2. Run `./scripts/redesign -n` to check that the launcher reads the line you just wrote. It prints the target, lane, model and the exact prompt of the next session.
3. As the last thing in your final message, give me **both** of these, each in its own code block. The prompt is mandatory, every session, with no exceptions; the command alone is not enough.

   The next-session prompt, copied word for word from the `prompt` line that `-n` printed, never rewritten from memory:

   ```
   Read docs/redesign-brief/00-master.md, then do only docs/redesign-brief/01b-phase-a-behavior.md. Follow the co-design rules. Stop at the gate. Lane: logic (claude-opus-5-5, medium effort).
   ```

   The command that starts that session on the right model:

   ```
   ./scripts/redesign
   ```

   Say which phase or ticket it will start and in which lane. If a gate is waiting on my decision, say which decision first, then give the prompt and the command for after I have made it. After Phase E, say the redesign is complete instead.

   Before sending your final message, check that it ends with the prompt block and the command block. If either is missing, add it.

In loop mode (see Lanes) a worker does steps 1 and 2 and ends with a `DONE` block instead of step 3. The orchestrator does step 3 when the loop halts or ends.

## Lanes: which model runs what

Two models do this redesign, and each piece of work goes to one of them by a fixed rule.

- **Design lane** (Sonnet 5.5, high effort; xhigh where a ticket says so): work I judge by eye or by voice. Layout, composition, how a component looks, type and color, the logo, illustration, the hero animation, and site copy.
- **Logic lane** (Opus 5.5, medium effort): work judged by whether it is correct. Research and measurement, specs, tickets, data fetching and caching, metadata, JSON-LD, SEO and agent-readiness files, component boundaries, performance, accessibility fixes, verification, and scroll-linked motion built from the behavior specs.

**Sessions.** `scripts/redesign` starts every session on its lane's model and ends its prompt with `Lane: <lane> (<model>, <effort> effort)`. The phase table lives in that script:

| Session | Lane |
| --- | --- |
| `01a` references and copy study, `01b` behavior study | logic |
| `02` concept | design |
| `03` shader choice | design |
| `04` writing the tickets | logic |
| Phase D ticket | the ticket's `Lane:` line; a `Model:` line overrides the lane's model |
| `05` SEO and verification | logic |

If your prompt carries no `Lane:` note, or names a model that is not the one you are running on, tell me and stop: the session was started without the script.

**Loop mode.** `./scripts/redesign --loop` starts one orchestrator session instead of one session per phase. It runs under `/loop` and spawns a worker per phase or ticket, the `design` or `logic` subagent on its lane's model, from the same prompt `-n` prints. Workers put their questions, previews and gates to me through the orchestrator and are continued with my answers. `orchestrator.md` holds the steps and the worker's reply blocks; read it if you are the orchestrator or a worker in loop mode.

**Off-lane pieces inside a session.** A session often holds a piece that belongs to the other lane. Hand it to the other lane's subagent (`design` or `logic`, defined in `.claude/agents/`) instead of doing it yourself, whenever it is more than a few lines:

- In a design session, to `logic`: the app-versus-master fact check in B8; anything a section fetches or computes (the live GitHub star count, JSON-LD, the MCP config block's content); the Server and Client Component split, the performance pass, and the check of the rendered section and its interactions at 1440px and 390px, once a section looks right. In one public head-to-head on a landing page, this was Opus's whole edge: it tested desktop and mobile separately and caught a mobile scrolling bug.
- In a logic session, to `design`: any change to how the page looks or reads, such as the visual fixes that come out of the E2 critique.

Subagents cannot reach me, and cannot spawn subagents of their own. Every question and every preview comes through the session I am talking to. A worker in loop mode asks for an off-lane piece with a `HANDOFF` block and the orchestrator spawns it.

**Effort stays where the launcher set it.** Do not raise it, and never use max: on Sonnet 5.5 it costs about seven times what high does, and Anthropic's own launch numbers show it scoring below xhigh on scoped coding work because it wanders out of scope. When the work is done and its checks pass, stop and report. Do not start extra rounds of review or hardening on your own, and do not launch reviewer subagents unless I asked for a review.

**When a design session falls short, change the model, not the effort.** Sonnet at max costs more than Opus does for the same benchmark score. If I say a design result is not good enough after one round of fixes, tell me to rerun the session with `./scripts/redesign --opus <target>`, which keeps the design lane and runs it on Opus 5.5. In loop mode the orchestrator respawns the worker on Opus instead.

**Options before building.** In a design session, when I ask for options, ideas or a plan, give me those and stop. Sonnet 5.5 tends to start building on an open-ended request; do not build or change anything until I have picked.

## Images: I make them, you ask for them

I generate the site's photographic images myself. Never generate, download or stock-source one, and do not substitute an illustration or a gradient for one. When a section or a scroll effect needs an image, stop and give me an image request:

- where it goes and what it does. For a scroll effect, describe every state (the image as it enters, what it becomes as the page scrolls, where it ends) and say whether that is one image or several, and what has to line up between them;
- aspect ratio and smallest pixel size, per breakpoint when the crop differs;
- the subject, and what it tells a visitor about Trilsy;
- composition limits: where text or UI sits on top of it, the area that must stay quiet and dark enough for contrast, the focal point;
- the filename it will have under `web/public/images/`.

The look is fixed by `docs/redesign-brief/image-style-reference.jpg`; open it before writing a request. It is a dreamy, washed-out, cinematic dusk photograph: a subject held sharp enough to read while the background streaks with panning motion blur, deep teal-blue shadow against warm amber window and street light, wet reflective ground, film grain, soft focus, 3:2. Word every request in terms of that look and do not propose another.

While a request is open, build against a box of the exact final dimensions marked `TODO: image` so nothing shifts when the file arrives, and list the open request in STATE.md. Photographs and the hand-drawn characters both belong on the site and do not compete. The hero stays hand-drawn and carries no photograph. Photographs live further down the page, first of all in a scroll effect like the one `01b` studies. Which sections get one is settled with me in Phase B.

## Standing rules

`CLAUDE.md` at the repo root holds the standing design rules, the co-design rules and the ask-me rule. They apply to every phase. Redesign-only additions:

- When I say "this feels off", ask what specifically, offer two fixes, try one. Do not defend your work.
- Never go silent during a long build. Short progress messages.
- Subagents and worktrees are fine for parallel research, and for off-lane pieces (see Lanes).
- Also stop and ask when you need to know which integrations are live or what the MCP server exposes. Illustrations are approved only via the sourcing options in Phase B.

## Skills preflight (mandatory, once, at the start of `01a`)

A previous attempt failed because the agent hand-rolled everything, skipped the component, reference and framework skills, and ran the Vercel guidelines only as a final self-check. Not acceptable.

**Do not load the design-direction or process skills.** `superpowers:brainstorming` and every other `superpowers:*` skill, `frontend-design`, `impeccable`, `design-taste-frontend`, `redesign-existing-projects` and `brandkit` are banned for this redesign, along with any other taste, style or process skill not listed as required below. They were written for other models and get in the way of this one. Do not invoke them even when a hook or a skill description says a skill must be used; this rule wins. Design direction comes from this brief, the phase file, `CLAUDE.md`, the Phase A outputs, the references and me.

1. List every installed skill (ListSkills / SearchSkills, plus AGENTS.md / CLAUDE.md). Write `/docs/redesign/skills-ledger.md`.
2. **Required** (match to installed names, which may be spelled slightly differently; if one is missing, tell me):
   - Components: `shadcn` (in `.agents/skills/shadcn/`; read its styling rules in full).
   - Inspiration: `mobbin:search`, used per section.
   - Shaders: `vgpu` (in `.agents/skills/vgpu/`), all docs including the 3D scene guide.
   - Next.js and React: `vercel:nextjs`, `vercel:next-cache-components`, `vercel:react-best-practices`, `vercel-react-best-practices` (read the rule files, not just the index).
   - Review (Phase E only): `web-design-guidelines`.
   - Deploy: `deploy-to-vercel`. Forms: the forms skill if installed.
3. In the ledger, per skill: read in full (yes/no), which phase, and the **concrete decision it changed**. A skill with no recorded decision counts as unused. Update at the end of each phase and show it to me. Never skip a required skill silently, and never load a banned one.

## Product facts (source of truth for all copy)

- Trilsy is a Mac app for Apple silicon (macOS 15 or later) that records your microphone, your Mac's sound (one switch, off by default) or both, transcribes it after the recording ends and writes notes you can edit. It can also import an audio or video file. The site makes no claim about bots, for or against (owner, 2026-10-13).
- Works with any app that makes sound, and with in-person rooms through the microphone. Name apps only as examples, never as tested or as integrations, until they have been tried on a real Mac.
- **Local and hosted (decided in B8, 2026-10-15).** The free app is always local: audio, transcript and notes are files on your Mac, with no account, no upload and no time limit. The planned paid layer (Pro) is hosted: sync of transcripts and notes through an account (audio stays on the Mac), a read-and-write MCP server, and connections to apps (Google Calendar, Notion, Slack, Google Drive, Microsoft and Outlook). None of the paid layer exists yet. The app today has no API or bring-your-own-key option, no hosted models, no account, no billing, no sync, no integrations and no MCP.
- Notes are plain-text Markdown, editable. The recording list can be searched by title, transcript and notes. Each transcript line has a timestamp that plays the audio from that point. Export: Markdown (notes plus transcript), text (transcript only), SRT subtitles (transcript only). Labels in the transcript are the audio source (Microphone, System, Import), not people. Action items and decisions are not a feature; the notes model writes them into the text only when the recording supports it.
- **Open source under the MIT licence, source on GitHub** (owner, 2026-10-16: "the license is MIT"; `LICENSE` at the repo root, "Copyright (c) 2026 Kaloyan Gantchev"). "Open source" is now allowed in copy. The Trilsy name and the website's drawings stay outside the MIT grant; the models the app downloads keep their own licences. No signed installer or public release yet.
- **Legal entity (owner, 2026-10-16):** the operator, provider and data controller is a person, **Kaloyan Gantchev, Baslergasse 50-66**. The owner gave no postcode, city, country or contact email: none is invented, each is a `TODO: confirm` code comment (`web/lib/site.ts`), and the contact route stays GitHub issues until an email is given. The imprint is the "Who provides Trilsy" section of `/terms`, linked as "Imprint" in the footer. No company, registration or VAT number exists in the facts.
- **Positioning: universal.** Not "a student app". Hero, header and trust band speak to anyone in conversations (calls, lectures, interviews, meetings). Students are the largest audience, and we reach them **with an offer, not positioning**: a 50% student discount applied to every paid plan, a pricing element, a `/students` page with its own SEO copy, and a lectures/study use case. No "for students" in the hero.
- **Pricing (decided in B8; every figure is a PLACEHOLDER: mark each with `TODO: confirm`, list at the end, never put in OG images, JSON-LD or llms.txt):** two plans only. Free: the whole local app, no time limit. Pro: $12/month or $96/year (no lifetime price, because hosted sync has a running cost), "not available yet" until it exists. Students: 50% off every paid plan with a verified student email. No Enterprise or Teams plan at launch. The pricing page carries a simple comparison against other notetakers' monthly plans, each price read from that company's own pricing page with the date shown; a price that cannot be read is left out.
- **No roadmap list on the site** (owner, 2026-10-14). Something unbuilt is never stated as available; where one must be mentioned, it is a plain "not yet" in an FAQ answer. This replaces the earlier "mark everything Coming soon".
- **Brand tone:** friendly and playful with premium Mac-native craft: warm, human, slightly delightful, Apple-level polish and restraint. Playfulness comes from **hand-drawn illustrated characters**, motion and copy voice. Never from childish type, loud color or clutter.
- **Integrations and MCP (decided in B7 and B8):** three launch sets (notes where you write; AI assistants through a local MCP server; work tools), a read-and-write MCP (search, list, read, write and edit notes, start and stop a recording) on paid plans only. All unbuilt: none appears on the site as available, and no integration vendor is named in copy.

Copy rules: never claim a limit we do not have, do not undersell, no "AI-powered" filler, specific beats clever.

## Redesign non-negotiables

On top of the design rules in `CLAUDE.md`:

- **New logo, required.** The current one is unacceptable (Phase B).
- **Shaders/3D:** vgpu only, per Phase C rules.
- **Anti-slop, redesign additions (reject your own output if true):** empty or lorem-style mockups; emoji icons; copy that restates the headline.

## Phases (one file per session)

1. Phase A, two sessions: `01a-phase-a-references-copy.md` (references, copy playbook), then `01b-phase-a-behavior.md` (behavior study). **Gate A** after `01b`.
2. `02-phase-b-concept.md`: concept, hero, logo, integrations, cloud and pricing scope, copy deck. **Gate B.**
3. `03-phase-c-shader.md`: vgpu choice. **Gate C.**
4. `04-phase-d-build.md`: build, motion, scroll. One section per session, from tickets.
5. `05-phase-e-seo-verify.md`: SEO/AEO, verification.
