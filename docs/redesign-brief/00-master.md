# Trilsy website redesign: MASTER BRIEF

Read this file first in EVERY session. It never changes between phases. The work is split into phase files (`01a` to `05`). **Do only the phase file I point you to, then stop.** At the end of each phase, update `/docs/redesign/STATE.md` (decisions made, files produced, open questions, skills ledger) so the next session can continue from it. Read STATE.md at the start of every session if it exists.

## Ending a session: hand me the next prompt

Every session ends the same way, after STATE.md and the ledger are updated:

1. Write a `Next session` line at the top of STATE.md naming the file or ticket that comes next. Take the order from the Phases list below; in Phase D it is the next unblocked ticket in `.scratch/redesign/issues/`.
2. As the last thing in your final message, give me the exact prompt to paste into a fresh session, in a code block, in this shape:

   ```
   Read docs/redesign-brief/00-master.md, then do only docs/redesign-brief/<next file>. Follow the co-design rules. Stop at the gate.
   ```

   For a Phase D ticket, name `04-phase-d-build.md` and the ticket path. If a gate is waiting on my decision, say which decision first, then give the prompt for after I have made it. After Phase E, say the redesign is complete instead.

## Standing rules

`CLAUDE.md` at the repo root holds the standing design rules, the co-design rules and the ask-me rule. They apply to every phase. Redesign-only additions:

- When I say "this feels off", ask what specifically, offer two fixes, try one. Do not defend your work.
- Never go silent during a long build. Short progress messages.
- Subagents and worktrees are fine for parallel research.
- Also stop and ask when you need to know which integrations are live or what the MCP server exposes. Illustrations are approved only via the sourcing options in Phase B.

## Skills preflight (mandatory, once, at the start of `01a`)

A previous attempt failed because the agent skipped most skills, used its own unaided taste, hand-rolled everything, and ran the Vercel guidelines only as a final self-check. Not acceptable.

1. List every installed skill (ListSkills / SearchSkills, plus AGENTS.md / CLAUDE.md). Write `/docs/redesign/skills-ledger.md`.
2. **Required** (match to installed names, which may be spelled slightly differently; if one is missing, tell me):
   - Process: `superpowers:brainstorming` (run before Phase B).
   - Design direction (read in full before Phase B, apply in Phase D): `frontend-design`, `impeccable`, `design-taste-frontend`, `redesign-existing-projects`, `brandkit`.
   - Components: `shadcn` (in `.agents/skills/shadcn/`; read its styling rules in full).
   - Inspiration: `mobbin:search`, used per section.
   - Shaders: `vgpu` (in `.agents/skills/vgpu/`), all docs including the 3D scene guide.
   - Next.js and React: `vercel:nextjs`, `vercel:next-cache-components`, `vercel:react-best-practices`, `vercel-react-best-practices` (read the rule files, not just the index).
   - Review (Phase E only): `web-design-guidelines`.
   - Deploy: `deploy-to-vercel`. Forms: the forms skill if installed.
3. In the ledger, per skill: read in full (yes/no), which phase, and the **concrete decision it changed**. A skill with no recorded decision counts as unused. Update at the end of each phase and show it to me. Never skip a required skill silently.

## Product facts (source of truth for all copy)

- Trilsy is a Mac app that records any call, lecture or interview (system audio plus microphone), transcribes it and writes notes. No bot joins the meeting.
- Works with any app that makes sound: Zoom, Meet, Teams, FaceTime, browser tabs, in-person rooms. Never list specific apps as if exhaustive.
- Audio is stored locally. Transcription and notes can run on-device **or** through an API (bring your own key, or Pro cloud models). Never imply only one.
- Notes are editable and searchable. Export as Markdown, text, subtitles.
- Open source on GitHub. Apple silicon, macOS 15+.
- **Positioning: universal.** Not "a student app". Hero, header and trust band speak to anyone in conversations (calls, lectures, interviews, meetings). Students are the largest audience, and we reach them **with an offer, not positioning**: a 50% student discount (modeled on Wispr Flow), a pricing element, a `/students` page with its own SEO copy, and a lectures/study use case. No "for students" in the hero.
- **Pricing (modeled on Superwhisper). PLACEHOLDERS, mark each with `TODO: confirm`, list at the end, never put in OG images, JSON-LD or llms.txt:** Free (app, BYOK and local models, no time limit); Pro $12/month, $96/year, $199 lifetime (adds Trilsy-hosted cloud AI models, priority processing, unlimited cloud notes); Student 50% off Pro with a verified student email; Enterprise custom (SSO, admin controls, deployment support).
- **Open conflict, settled with me in Phase B (B8):** the cloud, API and pricing facts above describe the intended product. The native app today is local-only, with no cloud AI, account or billing (`README.md`). Until B8 is decided, state no cloud or paid capability as available.
- **Brand tone:** friendly and playful with premium Mac-native craft: warm, human, slightly delightful, Apple-level polish and restraint. Playfulness comes from **hand-drawn illustrated characters**, motion and copy voice. Never from childish type, loud color or clutter.
- **Integrations and MCP: undecided, co-designed with me** (Phase B). Do not propose a final list alone or invent any. Until decided, design the section flexibly and mark everything `Coming soon`.

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
