# Skills ledger

Preflight run 2026-10-13 at the start of `01a`. Updated at the end of every phase. A skill with no recorded decision counts as unused.

## Required skills

| Need | Installed as | Read in full | Phase | Concrete decision it changed |
| --- | --- | --- | --- | --- |
| Components | `.agents/skills/shadcn/` (file skill; `vercel:shadcn` is also installed) | yes, from ticket 02 (SKILL.md, styling and icon rules) | D | Tokens mapped onto shadcn semantic colors and the button restyled by `cva` (02); registry `navigation-menu` and `sheet` instead of a hand-built menu (03); tabs and badge variants for the hero window (04); registry marquee rejected for a custom band (05). Details in the ticket sections below. |
| Inspiration | `mobbin:search` | yes | A, then per section in D | See below |
| Shaders | `.agents/skills/vgpu/` (`SKILL.md`, `scene.md`, `blender/`) | no, due before C | C, D | none yet |
| Next.js | `vercel:nextjs` | index read, D18; Next 16 bundled image doc read | D, E | D18: SVGs stay `<img>` with dimensions (Next sets `unoptimized` for `.svg`); fonts trimmed to the faces used |
| Next.js | `vercel:next-cache-components` | no, due before D | D | none yet |
| React | `vercel:react-best-practices` | index read, D18 | D | D18: barrel imports checked (Hugeicons tree-shaken, no change); passive scroll listener confirmed; no `next/dynamic` since nothing heavy is below the fold |
| React | `vercel-react-best-practices` (rule files) | no, due before D | D | none yet |
| Review | `web-design-guidelines` | yes, E (the live rule file fetched from vercel-labs/web-interface-guidelines) | E | E2 lint: added a skip link and `id="main"`; focus ring on the tab panel (the one focus stop with no visible focus); `transition-all` replaced with named properties in tabs, badge, accordion; hero mock window labels moved off h3/h4 (heading order) |
| Deploy | `deploy-to-vercel` | no | E | Not loaded: Phase E made no deployment (production waits for the owner's word). Load it at the first deploy. |
| Forms | **not installed** | n/a | n/a | No forms skill exists on this machine. The owner has been told. The site has no form today. |

### Banned skills

Removed from the required list by the owner on 2026-10-13, before any Phase B work was kept: `superpowers:brainstorming` (and all `superpowers:*`), `frontend-design:frontend-design`, `impeccable:impeccable`, `design-taste-frontend`, `redesign-existing-projects`, `brandkit`. Do not load them. No decision was taken from any of them.

### Decisions recorded in 01a

- **`mobbin:search`:** its rule of one section type per query with at most three constraints replaced a single broad "SaaS landing page" search with six section searches (hero, trust strip, how it works, use cases, FAQ, footer). Its rule to stay at the target's level and to say when a cited product is from another domain is why the teardown labels the Mobbin set as structure references. Sixteen sections were kept, in `refs/mobbin/`.

This session was research only, so the design, component, shader and framework skills had nothing to act on. Each must be read in full by the session that first uses it, and this table updated there.

### Decisions recorded in 01b

None. `01b` was the behavior study and no required skill covers it, so the table above is unchanged.

- `reverse-engineer-anything` and the REA tools are installed and were the brief's fallback for unreadable animation code. They were not used: the three sites' scroll logic was readable from their own scripts.
- The browser work ran through Playwright scripts (now in `docs/redesign/tools/`), not through a browser skill.
- `vgpu` is still unread. `01b` found that the photo swap on Wispr is a small fragment shader, so the vgpu docs are now needed in Phase C for that effect as well as for the hero.

## Everything installed

Listed from the session's skill registry, `CLAUDE.md` and `.agents/skills/`.

- **Design and frontend:** `brandkit`, `design-taste-frontend`, `design-taste-frontend-v1`, `form`, `frontend-design:frontend-design`, `frontend-slides:frontend-slides`, `gpt-taste`, `high-end-visual-design`, `image-to-code`, `imagegen-frontend-mobile`, `imagegen-frontend-web`, `impeccable:impeccable`, `industrial-brutalist-ui`, `minimalist-ui`, `redesign-existing-projects`, `stitch-design-taste`, `web-design-guidelines`, `writing-guidelines`, `show-shape`, `dataviz`, `full-output-enforcement`.
- **Repo file skills:** `.agents/skills/shadcn/`, `.agents/skills/vgpu/`.
- **Mobbin:** `mobbin:search`, `mobbin:redesign-screen`, `mobbin:plain-writing`.
- **Superpowers:** `brainstorming`, `diagnosing-superpowers`, `dispatching-parallel-agents`, `executing-plans`, `finishing-a-development-branch`, `receiving-code-review`, `requesting-code-review`, `subagent-driven-development`, `systematic-debugging`, `test-driven-development`, `using-git-worktrees`, `using-superpowers`, `verification-before-completion`, `writing-plans`, `writing-skills`.
- **Vercel and React:** `deploy-to-vercel`, `vercel-cli-with-tokens`, `vercel-composition-patterns`, `vercel-optimize`, `vercel-react-best-practices`, `vercel-react-native-skills`, `vercel-react-view-transitions`, and the `vercel:` plugin set (`nextjs`, `next-cache-components`, `next-upgrade`, `react-best-practices`, `shadcn`, `turbopack`, `deploy`, `deployments-cicd`, `env`, `env-vars`, `status`, `bootstrap`, `verification`, `vercel-cli`, `cdn-caching`, `runtime-cache`, `routing-middleware`, `vercel-functions`, `vercel-firewall`, `vercel-storage`, `vercel-sandbox`, `vercel-services`, `vercel-agent`, `vercel-connect`, `access-protected-vercel-deployment`, `ai-gateway`, `ai-sdk`, `auth`, `build-agents`, `chat-sdk`, `create-a-backend`, `custom-metrics`, `eve`, `flags-sdk`, `knowledge-update`, `marketplace`, `microfrontends`, `next-forge`, `queues`, `workflow`).
- **Browser:** `chrome-devtools-mcp:` (`chrome-devtools`, `chrome-devtools-cli`, `a11y-debugging`, `cookie-debugging`, `debug-optimize-lcp`, `memory-leak-debugging`, `troubleshooting`), `claude-in-chrome`, `run`.
- **Matt Pocock set:** `mattpocock-skills:` (`code-review`, `codebase-design`, `diagnosing-bugs`, `domain-modeling`, `grilling`, `prototype`, `research`, `resolving-merge-conflicts`, `tdd`, `wizard`, `writing-for-agents`), `git-guardrails-claude-code`, `migrate-to-shoehorn`, `scaffold-exercises`, `setup-pre-commit`, `obsidian-vault`.
- **Other plugins:** `cloudflare:` (12 skills), `copilotkit:` (8), `resend:` (5), `hookify:` (5), `ralph-loop:` (3), `claude-md-management:` (2), `code-review:code-review`, `skill-creator:skill-creator`, `typesafe:typesafe-ai`, `reverse-engineer-anything`, `ponytail-help`, `ponytail-review`, `find-skills`.
- **Built in:** `artifact-design`, `artifact-diagramming`, `artifact-capabilities`, `claude-api`, `code-review`, `simplify`, `security-review`, `init`, `loop`, `schedule`, `update-config`, `keybindings-help`, `fewer-permission-prompts`, `plugin-authoring`, and the `anthropic-skills:` set (`built-in-browser`, `chrome-browser`, `computer-use`, `deep-research`, `docs`, `docx`, `google-workspace`, `import-memory`, `morning`, `pdf`, `pptx`, `setup-writing-style`, `skill-creator`, `xlsx`).

### Decisions recorded in Phase B (session 02)

- `mobbin:search`: used for the logo references (splash screens and footers with hand-drawn marks); the connector failed with a DNS error afterwards, so the marker study used live sites and real photographs instead. It informed the "small plainly drawn object beside a serif wordmark" direction; the logo itself was rejected and is owner-supplied.
- `shadcn`, `vgpu`, the Next.js and React skills: not read yet; Phase B built throwaway prototypes only, no site code. Still due before Phase C and D.

### Decisions recorded in Phase C (session 03)

- `vgpu` (skill `SKILL.md`, `scene.md`, `blender/index.md` read; installed 0.5.0 docs read: getting started, Next.js, adaptive quality, shipping to production, guide list; the native macOS, ML and package-publishing guides skimmed by title only): the skill's rule to take the installed package docs as the authority led to `vgpu examples` and the examples API as the way to list the gallery, and the finding that the gallery has no image-to-image transition. That is why the pinned story's photograph melt cannot be built as published, and the recommendation is no shader, with a Motion cross-fade for the swap. Its note that `effect(gpu, source)` takes plain WGSL is what makes Option B (one small custom effect) cheap if the owner later approves it.
- `mobbin:search`: not used; the connector failed (DNS error on `api.mobbin.com`) and Phase C picks no section layout.
- `shadcn`, Next.js and React skills: not read; no component or page code was written in Phase C.

- `vgpu`, second round: the effects guide (`effect(gpu, source)`, `frame(gpu, f => f.pass(surface, fx))`, `set()` for per-frame values only) and `vgpu check --require-validation` decided how the three waveform shaders were written and checked; the surface API's rule that surface targets exist only inside `frame()` fixed a first crash in the prototype.

### Phase C outcome

`vgpu` was read and used, and the concrete decisions it changed are above (the examples API for listing the gallery, `vgpu check --require-validation` and the effects guide for the three waveform shaders). The final decision, taken by the owner, is that the site ships no shader, so no `vgpu` code reaches `web/`. The ledger rows for `vgpu` and `mobbin:search` are closed for this phase; `mobbin:search` was unavailable (DNS error) and not needed.

### Decisions recorded in Phase D, session 04 (tickets)

- `mattpocock-skills:to-tickets` (started by the owner; its SKILL.md read in full): its vertical-slice rule made each section one ticket with the clean slate (prefactor) first; its quiz step is why the list went to the owner before any file was written; its local template set one file per ticket, numbered in dependency order with a `Blocked by:` line. Adapted: `Status:` and `Lane:` are plain lines because `scripts/redesign` reads `^Lane:`.
- `mobbin:search`: not run in 04 (no section is designed here); every section ticket carries its own Mobbin step.
- `shadcn`, `vercel:nextjs`, `vercel:react-best-practices` and the rest: not read in 04, no code written; still due in the tickets that first use them (02 onward and 18).

### Decisions recorded in Phase D, ticket 01 (clean slate)

- `vgpu`: closed for good. The ticket removed the package, the loader and the shader; the CLAUDE.md line that sent component and shader work to the vgpu skill now names only shadcn. The skill files stay in `.agents/skills/` (README still lists them) in case the owner reopens shaders.
- `shadcn`: not read; no component was added or changed (the existing `components/ui/` primitives were left as they are).
- `vercel:nextjs`, `vercel:react-best-practices`: not loaded. The one Server and Client boundary decision (a small `"use client"` provider holding `LazyMotion`, so the layout stays a Server Component) follows the brief's "Server Components by default, `use client` only for interactive leaves".
- `mobbin:search`: not applicable (no section).

### Decisions recorded in Phase D, ticket 02 (tokens, type and surfaces)

- `shadcn` (SKILL.md and `rules/styling.md` read; `info --json` run): its rule "semantic colors, never raw values" and "variants before custom styles" set the token mapping (B4 hues onto `primary`, `secondary`, `accent`, `muted`, plus extra fill tokens) and made the button restyle a `cva` edit, not a new component. Its icons rule is why `components.json` now says `hugeicons`. Its warning that Tailwind 4 `dark:` utilities must match the token scheme is why dark is a class (`@custom-variant dark`), not the OS media query.
- `vercel:nextjs`, `vercel:react-best-practices`: not loaded. Fonts through `next/font` with variables on `<html>`, the surface components as Server Components, follow the brief's "Server Components by default" and "next/font, no layout shift".
- `mobbin:search`: not applicable (no section; the connector is also down).
- `vgpu`: closed (Gate C).


### Decisions recorded in Phase D, ticket 03 (header)

- `shadcn` (SKILL.md, `rules/icons.md` and the `docs` URLs for `navigation-menu` and `sheet` read; `add --dry-run` run first): its "use existing components first" rule is why the dropdown is the registry `navigation-menu` (Base UI) and the phone menu is `sheet` plus the installed `accordion`, with no hand-built menu. Its dry run warned that `add` would overwrite `button.tsx` (the Trilsy pill), so the add was run answering no and `button.tsx` was checked unchanged. Its icons rule (Hugeicons through `HugeiconsIcon`, no sizing classes inside components) fixed the chevron, menu and close icons; `accordion.tsx` and `dialog.tsx` lost their Lucide imports in the same pass. Its "no `space-*`, `gap-*` only" and "no custom z-index on overlays" rules held; the one `z-40` on the sticky strip is the page chrome, not an overlay.
- `shadcn` customization recorded: `navigation-menu.tsx` and `sheet.tsx` were restyled through their own class strings (one easing, 400ms, 3px field border, no shadow, no blur) and `navigation-menu.tsx` gained `anchor` and `sideOffset` props forwarded to the Base UI positioner, so the panel can hang off the island and not off its trigger. Nothing was hand-rolled.
- `vercel:nextjs`, `vercel:react-best-practices`: not loaded. The Server and Client split follows the brief's default: `site-header.tsx` is a Server Component; only `header-nav.tsx` (the menu) and `mobile-menu.tsx` (open state) are `"use client"`.
- `mobbin:search`: **not run**. The connector failed again with a DNS error on `api.mobbin.com`. Five live headers were captured instead and recorded in `refs/header/README.md`. The ticket's Mobbin step is therefore met by live captures, not Mobbin; a Mobbin pass is open if the owner wants one.

### Decisions recorded in the Granola behavior study (2026-10-15, extra study before ticket 04)

None from a required skill. The study used the 01b method and the capture scripts in `docs/redesign/tools/`, and no required skill covers a behavior study, so the table above is unchanged.

- `reverse-engineer-anything` and the REA tools: not used. Granola's scroll motion is plain CSS scroll-driven animation, readable as shipped, and its page script was short enough to follow after pretty-printing.
- `mobbin:search`: not applicable (no section designed; the study inspects one live site).
- Browser work ran through the Playwright scripts, not a browser skill. `pull.mjs` was added for the footer pull.
- Marker handoff: no skill involved; the design lane changed `marker.tsx`, and the logic lane re-measured CLS (see the ticket's Answer).
- No banned skill was loaded.

### Decisions recorded in the Granola hero animation study (2026-10-15, extra study before ticket 04)

- `animation-behavior-study` (global skill in `~/.claude/skills/`, not registered with the Skill tool at first call; it registered once the folder was found; SKILL.md read in full and its steps followed in order). Decisions it changed: the study measured the clock first (`timeline.mjs` on the window, then named probes synced on one beat with `SYNC`) and looked at frames second; its step 5 sent the canvas beat to source and file inspection, which is how the "two people talking" turned out to be two independent silent video loops; its step 4 checklist added the off-screen, reduced-motion, seam and 390 checks; its step 7 shaped the prototype as a timeline matched probe for probe, validated by transition times within interval plus 50ms. Scripts copied to a scratch workspace with Playwright installed there, as the skill says; nothing added to `docs/redesign/tools/`.
- `reverse-engineer-anything` and the REA tools: not used. The skill names them for canvas logic that matters; here the shipped script, pretty-printed in scratch, was short enough to read.
- `mobbin:search`: not applicable (no section designed).
- Marker handoff: no skill involved; the design lane changed `marker.tsx`, and the logic lane re-measured CLS (see the ticket's Answer).
- No banned skill was loaded.

### Decisions recorded in the ticket update for hero option 1 (2026-10-15, logic lane, before the ticket 04 build)

None from a required skill. Docs-only work: tickets 04 to 07 and 17 and `04-phase-d-build.md` were rewritten for the owner-approved merge of the hero and the pinned story, from the approved prototype's own code (`prototypes/d4-hero-combo.html`) and the issue-tracker conventions in `docs/agents/issue-tracker.md`. No required skill covers ticket editing (`/mattpocock-skills:to-tickets` is the owner's to start and was not needed for edits to existing tickets), and none was loaded.

- `mobbin:search`: not applicable (no section designed; ticket 04's references are already in `refs/hero/`).
- Marker handoff: no skill involved; the design lane changed `marker.tsx`, and the logic lane re-measured CLS (see the ticket's Answer).
- No banned skill was loaded.

### Decisions recorded in Phase D, ticket 04 (hero and pinned story, 2026-10-15)

- `shadcn` (SKILL.md read in full before component work): its "use existing components first" rule put the window's tabs on the installed `tabs` (Base UI) and the source and transcript chips on the registry `badge` (added; `add tabs badge` was answered no on the existing `tabs.tsx`, which stayed unchanged until the variant edit). Its "customize through variants, `className` for layout" rule is why the look lives in new `cva` variants (`TabsList` `window`, `Badge` `microphone`/`system`/`off`, `Window` `lift`) and not in class overrides; its "use Badge, not styled spans" rule replaced a hand-styled chip in the phone bubble with `Badge`. Semantic tokens only: the macOS window dots and the recording dot became tokens instead of raw hex.
- `mobbin:search`: run for this ticket (the connector worked). Four references in `refs/hero/` and STATE.md (Granola hero and pinned window, Grain, Charma); they shaped the combination options put to the owner. No story references were added; the build needed none.
- `vgpu`: not needed (Gate C, no shader).
- `vercel:nextjs`, `vercel:react-best-practices`: not loaded. The split follows the brief's default: the copy is a Server Component (`hero-copy.tsx`); the interactive leaves are client components; the demo paints through refs from one `requestAnimationFrame` clock, so React renders only on a setting change; every fold position is a transform, so nothing shifts layout. Next 16's bundled docs (`node_modules/next/dist/docs`) were read for Server and Client Components, as `web/AGENTS.md` asks.
- Marker handoff: no skill involved; the design lane changed `marker.tsx`, and the logic lane re-measured CLS (see the ticket's Answer).
- No banned skill was loaded.

### Decisions recorded in Phase D, ticket 05 (trust band, 2026-10-15)

- `shadcn` (SKILL.md read in full): its "use existing components first" and registry rule made me look at the registry; `npx shadcn@latest view @magicui/marquee` showed four repeats, no `aria-hidden` copy, no half-width seam and no reduced-motion wrap, so a custom Server Component follows the spec instead. Its rules decided the rest: the look is the existing `Band` variants, colours are semantic tokens (`text-foreground/55`, `text-muted-foreground`, `bg-current`), `gap-*` and `size-*`, no `space-*`, and the only new CSS is a token and keyframe in `@theme`.
- `mobbin:search`: run for this ticket (one query, twelve sections read). Three kept in `refs/trust-band/` with what each informed: one flat tone for all marks (Lattice), a quiet caption beside one thin row (Notion), a centered caption over a looping row with cut-off edges (1Password). The logo walls and the large carousel were rejected.
- `vgpu`: not needed (Gate C, no shader).
- `vercel:nextjs`, `vercel:react-best-practices`: not loaded. The band has no state or effect, so it stays a Server Component with no client JS.
- Marker handoff: no skill involved; the design lane changed `marker.tsx`, and the logic lane re-measured CLS (see the ticket's Answer).
- No banned skill was loaded.

### Decisions recorded in Phase D, ticket 07 (hero section's scroll, 2026-10-15)

- `scroll-behavior-study`: not loaded (read in full: no). The 01b probe method it describes (`docs/redesign/tools/probe.mjs`, rewritten as a scratch script for this section) was used instead: sampling the same named values on the reference and the build at fixed offsets is how the track was checked, and it found two real faults the eye would have missed: the chapter coming on one scroll event late at the 0.98 gate (a derived Motion value read inside its source's change handler), and the prototype's chapters starting 124px below 100vh, which the build now matches.
- `vercel:nextjs`, `vercel:react-best-practices`: not loaded. The section was already a client leaf with a server-rendered copy child; the change keeps scroll work out of React renders (state only on chapter or layout change).
- `shadcn`, `mobbin:search`, `vgpu`: not needed (no component, no new section look, no shader).
- Marker handoff: no skill involved; the design lane changed `marker.tsx`, and the logic lane re-measured CLS (see the ticket's Answer).
- No banned skill was loaded.
- Short-phone fit: handed to the design lane (a look change); re-probed with the same scratch script after its fix.

### Decisions recorded in Phase D, ticket 08 (questions and /faq, 2026-10-15)

- `shadcn` (SKILL.md read in full): its "use existing components first" rule kept the installed Base UI `accordion` instead of a custom list; its "variants, not class overrides" rule is why the FAQ look is a `faq` variant beside the existing `menu` one (the mobile menu still uses it) and not overrides at the call site. Semantic tokens only; no `space-*`.
- `mobbin:search`: two queries, twenty sections read. Four kept in `refs/faq/`: heading left and a ruled list right (Fiasco), a plus that turns into a cross (Teak), the left column carrying the way out (Butter), a one-column FAQ page (OpenPhone). Card-per-question and two-column accordions rejected as card-grid lookalikes.
- `vercel:nextjs`, `vercel:react-best-practices`: not loaded. The list, the section and the page are Server Components; only Base UI's own trigger runs on the client. JSON-LD and the accessibility check went to the logic lane.
- `vgpu`: not needed (Gate C).
- Marker handoff: no skill involved; the design lane changed `marker.tsx`, and the logic lane re-measured CLS (see the ticket's Answer).
- No banned skill was loaded.


## Ticket 09 (closing band)

- `mobbin:search`: two queries (a closing call to action over a full-width photograph; a final call to action band with text on the left over a dark photo), forty sections read. Three kept in `refs/closing/`: Oura Ring (heading left, subject right, the composition the photo brief already asks for), Acquired (cream serif text on a dark conversation photograph), Wix (text laid over the subject, kept as the thing to avoid). Decision it changed: no scrim or gradient behind the text; the quiet area is demanded of the photograph, and the image request now states how dark.
- `shadcn`: read the SKILL.md. The band uses the existing `Button` (`render` for the link, as in the hero) and no new component; a `Band` was not used because the photograph is the band and the dotted rules would cut it. Decision it changed: the dark fill became a theme token (`--dusk`) instead of an arbitrary colour in the class list.
- `vgpu`, `vercel:nextjs`, `vercel:react-best-practices`: not loaded; the section is a static Server Component with no animation.
- Marker handoff: no skill involved; the design lane changed `marker.tsx`, and the logic lane re-measured CLS (see the ticket's Answer).
- No banned skill was loaded.

## Ticket 10 (footer)

- `mobbin:search`: two queries (a footer with link columns and a legal line; a footer with a full-width coloured band and a wordmark), 24 sections read. Three kept in `refs/footer/`: Loom (pale tint, plain columns, thin bottom row), Wispr Flow (how little a footer says; its giant wordmark rejected while the logo is owed), Mural (the trademark sentence in the bottom row). Decision it changed: the trademark line sits in the bottom row beside the legal links, and no oversized wordmark.
- `shadcn`: read the SKILL.md. No primitive fits a link footer (it is `footer`, `nav`, `ul`), so none was added; it reuses `bandVariants` from `surface.tsx` for the field and dotted rule, and the Hugeicons family for the one external-link icon with `strokeWidth={2}` as elsewhere. Decision it changed: semantic tokens and `gap-*` only, `size-4` kept off the icon's parent component rules by passing it on the icon itself since it is not inside a shadcn component.
- `vgpu`, `vercel:nextjs`, `vercel:react-best-practices`: not loaded; a static Server Component.
- Marker handoff: no skill involved; the design lane changed `marker.tsx`, and the logic lane re-measured CLS (see the ticket's Answer).
- No banned skill was loaded.

## Ticket 11 (how it works)

- `mobbin:search`: two queries (a how-it-works page with numbered steps and a product illustration; a technical explainer with a heading left and ruled text blocks right), 24 sections read. Four kept in `refs/how-it-works/`: Wild (heading left, text right, space between rows), Zaro (numbered rows with a rule), In Common With (specs stated flat), Sequence (kept as the thing to avoid). Decision it changed: one row per block with its own small window, not three cards or one shared picture, and no picture for "what you need".
- `shadcn`: read the SKILL.md. Its "use existing components first" rule is why the recording-source control is a real `Switch` (added with the CLI, then restyled to the tokens) and not a styled span; `Window`, `Band`, `Badge` and `Button` are reused, icons are Hugeicons passed as objects, and the layout uses `gap-*` and `size-*` only. Decision it changed: the switch is interactive and carries the page's one explanatory motion.
- `vgpu`: not needed (Gate C). `vercel:nextjs`, `vercel:react-best-practices`: not loaded; the page and four of the five windows are Server Components, and only the two animated windows are client leaves.
- Marker handoff: no skill involved; the design lane changed `marker.tsx`, and the logic lane re-measured CLS (see the ticket's Answer).
- No banned skill was loaded.


## Ticket 12 (pricing page)

- `mobbin:search`: two queries (a pricing section with a free and a paid plan side by side; a pricing calculator with a slider and comparison bars), 16 sections read. Three kept in `refs/pricing/`: Craft (two plans of different weight, one button each), Vercel (bars in one ranked list under a slider, the total set large), Kit (the question is the slider's label and the value is read out beside it). Decision it changed: two plan windows with Pro dashed and without a button, and the calculator's value and bars laid out in that order.
- `shadcn`: read the SKILL.md. "Use existing components first" is why the slider is the shadcn `Slider` (added with the CLI, then restyled to the tokens) and not a custom range input; `Badge`, `Button`, `Window` and `Band` are reused. Decision it changed: Base UI marks orientation with `data-orientation`, so the slider's `data-horizontal:` selectors were rewritten as `data-[orientation=horizontal]:`; thumb labels pass through the wrapper because Base UI reads them on the thumb.
- `vgpu`: not needed (Gate C). `vercel:nextjs`, `vercel:react-best-practices`: not loaded; the page and the plans are Server Components and the calculator is the one client leaf. The comparison rule is a pure function in `lib/pricing.ts` (logic lane).
- Marker handoff: no skill involved; the design lane changed `marker.tsx`, and the logic lane re-measured CLS (see the ticket's Answer).
- No banned skill was loaded.

## Ticket 13 (students page)

- `mobbin:search`: two queries (a student discount section with a heading, short explanation and one button; an education offer page with a verification note), 40 sections read. Three kept in `refs/students/`: Wispr Flow (one big offer line beside one hand-drawn figure), Figma (heading as the whole offer, one paragraph, one action), Farfetch (the verification sentence inside the paragraph, terms as a quiet line). Decision it changed: no plan cards or tiers, and no verification badge or form; one statement, one button, one illustrated pair.
- `shadcn`: read the SKILL.md. Nothing new is needed (`Button`, `Band`, Hugeicons passed as an object); no primitive fits a two-row link list, so it is a plain `ul` with the footer's dotted rule. Decision it changed: `gap-*` layout only, semantic tokens, the arrow icon carries its own size because it is not inside a shadcn component.
- `vgpu`: not needed (Gate C). `vercel:nextjs`, `vercel:react-best-practices`: not loaded; a static Server Component with no client leaf.
- Marker handoff: no skill involved; the design lane changed `marker.tsx`, and the logic lane re-measured CLS (see the ticket's Answer).
- No banned skill was loaded.

## Ticket 14 (use cases index and Lectures)

- `mobbin:search`: two queries (a use-case page with a heading, paragraph and note screenshot; an index of use cases as names with one line each), 22 sections read. Three kept in `refs/use-cases/`: Heron AI (ruled list of roles), Notion (one setting, one paragraph, one drawn figure, then the product), Evernote (text beside a real-looking screenshot). Decision it changed: the index is a flat ruled list and not a card grid, and the page is one setting told once with the product window, with no feature icons.
- `shadcn`: read the SKILL.md. Added `Breadcrumb` with the CLI (Hugeicons already in its source); `Accordion` through the existing `FaqList`. Decision it changed: the breadcrumb is the registry component, not a hand-made `ol`; the demo window is a custom component because no registry item fits a filtered recording list, recorded here as the reason.
- `vercel:react-best-practices`: not loaded; only the demo is a client leaf, the page shape and both routes are Server Components and prerender static.
- `vgpu`: not needed (Gate C). No banned skill was loaded.

## Ticket 15 (use cases, Work pages)

- `mobbin:search`: two queries (a use-case page with a heading and an app window showing a transcript with timestamps beside a playback bar; a feature section with two documents side by side in a product window), twelve sections read. Three kept in `refs/use-cases/`: Grain (a transcript beside a player with a marked line), Dovetail (a transcript line as a timed row), Arc (two equal panes in one frame). Decision it changed: Sales shows the pressed timestamp and the Stop playback button with no scrubber (the app has none), and Recruiting is two panes on shared rows.
- `shadcn`: read the SKILL.md. No new primitive: the windows reuse `Badge` (microphone and system variants), `Button` and `Breadcrumb` through the shared page, and are illustrations built from `MockWindow`. Decision it changed: semantic tokens only, `gap-*` and `size-*`, `cn()` for state classes.
- `vercel:react-best-practices`: not loaded; the six pages are Server Components and each window is the one client leaf, so the pages prerender static.
- `vgpu`: not needed (Gate C). No banned skill was loaded.

## Ticket 17 (site motion pass)

- `shadcn`, `vgpu`, `mobbin:search`: not needed; no new component, no shader, no new section to reference. `vercel:react-best-practices`: not loaded; the header stays a Server Component with one client leaf (`HeaderIsland`), and `Reveal` is a client leaf wrapping server-rendered children.
- Marker handoff: no skill involved; the design lane changed `marker.tsx`, and the logic lane re-measured CLS (see the ticket's Answer).
- No banned skill was loaded.

## Ticket 18 (performance and render check)

- `vercel:react-best-practices` (index, D18): `bundle-barrel-imports`: `@hugeicons/core-free-icons` is a barrel, but the shipped chunks hold only the icons used (1 to 18 paths per chunk), so imports stay as they are. `client-passive-event-listeners`: the header's scroll listener is already passive. `bundle-dynamic-imports`: not applied, since no heavy visual sits below the fold (the hero is the first screen, and the inner windows are small leaves).
- `vercel:nextjs` (index, plus Next 16's bundled `image.md`): the image rule "next/image over img" was checked against the assets. Every `<img>` is an SVG, which Next does not optimize, except the professor PNG, which waits for a sharper source. All keep width and height. Font rule: Fraunces italic removed, since it was preloaded on every page and never used.
- `vercel:next-cache-components`, `vercel-react-best-practices` rule files: not loaded; every route is static, with no data fetching or caching to configure.
- Marker handoff: no skill involved; the design lane changed `marker.tsx`, and the logic lane re-measured CLS (see the ticket's Answer).
- No banned skill was loaded.

## Phase E (05, SEO and verification, 2026-10-16)

- `web-design-guidelines`: read in full and run as a lint pass only (accessibility, focus, contrast, semantics). Decisions: skip link, tab panel focus ring, explicit transition properties, heading order fixed in the hero mock window. Contrast of the inactive story chapters (1.67:1) was handed to the design lane, which moved them to muted ink (5.5:1).
- `vercel:nextjs`: not loaded as a skill; Next 16's bundled docs were read instead, as `web/AGENTS.md` requires (`opengraph-image.md`, route handlers, AI agents guide). Decision from them: a page that sets `openGraph` drops the file-based share image for child segments, so `pageMetadata()` names the image explicitly; llms files are `force-static` route handlers.
- `deploy-to-vercel`: not loaded; nothing was deployed.
- Required skills that ended the redesign with no recorded decision: `vgpu` (Gate C removed every shader, so it had nothing to decide), `vercel:next-cache-components` (Cache Components is off; nothing to cache), `vercel-react-best-practices` rule files (D18 used the `vercel:react-best-practices` index instead). Each is unused for a stated reason, not skipped silently.
