# Phase A, session 2 of 2: Behavior study (read-only, prototypes only)

Read `00-master.md`, `/docs/redesign/STATE.md`, and the session 1 outputs (`/docs/redesign/00-teardown.md`, `/docs/redesign/copy-playbook.md`). Use a real browser (Playwright or browser-use).

## A3. Reference behavior study (fully automated, no help from me)

Sites: the Aerivoice site (https://aerivoice.app), Superwhisper, and the Wispr Flow notetaker page. Goal: understand how their motion and scroll work well enough to build at that level. I do not have their code, and the Aerivoice GitHub repo is the Swift Mac app, not the website. **Do not ask me for source code or recordings.**

**Scope cap:** per site, study only the **5 or 6 patterns that matter most** (for example the pinned storytelling section, the hero demo, a before/after panel, a staged text reveal). Do not catalogue everything. One pattern is required: the scroll effect that uses grainy, washed-out, film-style photographs, which sits well below the hero on a site that otherwise uses a hand-drawn style. I called the site "Whisper": look on wisprflow.ai and its notetaker page first, then Superwhisper, and study it wherever it is. Record how the photographs enter, change and leave as the page scrolls.

**Method (numbers first, pictures second, to keep it cheap and reliable):**
1. **Numeric scroll log.** At desktop 1440px and mobile 390px, scroll in fixed steps (about 5% of page height). At each step record `scrollY` and, for each pattern's elements, `transform`, `opacity`, `getBoundingClientRect` and text content. From the curves, determine: scroll-linked (follows scrollY continuously) vs. triggered once vs. time-based, pinned (and for how many pixels), easing shape, and thresholds.
2. **Video capture, not a screenshot per step.** Record a Playwright video of a slow scroll and of each time-based animation, and extract frames only where something changes. Take **key-moment screenshots** (start, middle, end of each pattern) and make one contact sheet per pattern. Smooth-scroll libraries such as Lenis can distort scripted scrolling, so cross-check frames against the numeric log.
3. **Identify the tooling:** check script URLs, globals and the DOM for GSAP/ScrollTrigger, Lenis, motion/Framer Motion, Rive, Lottie, WebGL/canvas.
4. **If that is not enough** (WebGL or canvas logic, unreadable minified code, page will not load normally), use **REA (Reverse Engineer Anything)**, https://github.com/morluto/rea, an MCP server and CLI that inspects websites (page structure, scripts, network observations; needs a Chrome-family browser). Install with `npx rea-agents setup` (Node 22.19+, 24.11+ or 26+). Tell me if I need to restart the session for it to register (this is the one acceptable reason to interrupt me), then use it to trace the animation logic.
5. **If a pattern still cannot be figured out,** mark it "unverified" in the spec, skip it, and move on. Do not block the phase on it.

Write one `/docs/redesign/behavior-<site>.md` per site: for each pattern, its trigger, what changes at each step, easing and timing, pinning, the apparent libraries, and the frames. Validate by prototyping **one** pattern per site and running the same capture on it. The sequences should match.

**Legal and ethical rule:** this is study for understanding and interoperability. Re-implement with our own code, assets, copy and illustrations. Never copy bundles, source, illustrations, copy or brand assets, unless a license confirms you may (the MIT license on the Aerivoice app repo does not cover its website).

## Done when

- Each of the three sites has a `behavior-<site>.md` covering 5 or 6 patterns, each with trigger, per-step changes, easing and timing, pinning, libraries and frames, or an explicit "unverified" mark.
- One pattern per site is prototyped and its capture matches the original's sequence.

## Output and gate

Update `/docs/redesign/STATE.md` and the skills ledger.

**GATE A:** show me the teardown, the copy playbook, and the three behavior specs (short summaries first). Then stop.
