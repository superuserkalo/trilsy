# 18: Performance and render check

Status: resolved
Lane: logic
Blocked by: 07, 17

**Section:** every page.

**What to build:** the Phase D performance pass and a rendered check.

- Server Components by default, `use client` only on interactive leaves; `next/image` and `next/font`; heavy visuals lazy-loaded behind Suspense; no layout shift (TODO boxes at final size).
- Targets: LCP under 2s, CLS 0, INP under 200ms, measured and reported.
- Render every page and its interactions at 1440px and 390px (dropdown, tabs, accordion, slider, story scroll on a trackpad and a wheel) and fix what breaks.
- Apply the Vercel Next.js and React skills and record the decisions in the ledger.

**Approved copy:** none changes. **Behavior spec:** none.

**Images needed from the owner:** none.

- [x] Client boundaries listed with reasons
- [x] LCP, CLS, INP measured per page and reported
- [x] 1440 and 390 checks done; issues fixed or listed (the headline marker fixed by the design lane through a handoff)
- [x] Typecheck and build pass

## Answer

2026-10-16, logic lane, Opus 5.5, loop mode. Owner instruction for the run: no review, defaults taken.

**Changed.**

- Deleted unused `components/ui/dialog.tsx`, `toggle.tsx`, `toggle-group.tsx`, `separator.tsx` (no importers).
- `package.json`: removed `lucide-react` (no imports; Hugeicons is the icon family), `@radix-ui/react-slot`, `clsx` and `tailwind-merge` (unused once the helpers merged); moved `@hugeicons/core-free-icons` and `@hugeicons/react` from devDependencies to dependencies. Lockfile synced.
- `lib/utils.ts` now re-exports `cn` from the `cn` package, so the site has one class merger, not two (the ui files already used `cn`; the rest used clsx plus tailwind-merge). Checked: the server-rendered `class` attributes of all 18 pages are byte-identical before and after.
- `app/layout.tsx`: Fraunces loads `style: ["normal"]` only. Nothing on the site renders italic text (the only `<i>` elements are empty dots), but the italic file was preloaded on every page: 3 font preloads went to 2.
- `app/students/page.tsx`, `components/use-cases/use-case-page.tsx`: the two waist-up figures get `shrink-0`. Before the SVGs loaded, flex shrink made one figure 224px and then the other, a 16px layout shift (CLS 0.001) on every page with figures. The settled layout already had both at full width (208px, 240px from lg), so nothing looks different once loaded.

**Client boundaries** (every `"use client"` file, and why):

| File | Why it is a client component |
| --- | --- |
| `motion-provider.tsx` | `LazyMotion` context for every `m.*` |
| `reveal.tsx` | `useInView` reveal, once |
| `header-island.tsx` | scroll and `data-hero-fold` observers for the shrink |
| `header-nav.tsx` | Base UI NavigationMenu (open state, keyboard) |
| `mobile-menu.tsx` | sheet open state |
| `hero/hero-section.tsx` | `useScroll` track, chapter state; the copy is a server child passed in |
| `hero/story-clock.tsx` | the one rAF clock, off-screen pause |
| `hero/fold-stage.tsx`, `phone-stage.tsx`, `demo-window.tsx` | paint from the clock and `progress` through refs |
| `hero/marker.tsx` | measures line breaks after fonts load |
| `hero/hero-check.tsx` | dev-only `/scratch/hero` (404 in production) |
| `how-it-works/sources-demo.tsx`, `notes-demo.tsx` | play once in view |
| `pricing/calculator.tsx` | slider state |
| `use-cases/*-demo.tsx` (12), `use-play-once.ts` | each window plays once in view |
| `ui/tabs.tsx`, `slider.tsx`, `switch.tsx`, `sheet.tsx` | Base UI primitives with state |

Everything else (all pages, layout, header shell, footer, trust band, FAQ list and section, closing band, plans, every static window) is a Server Component. Every route is prerendered static.

**Skills applied** (`vercel:react-best-practices`, `vercel:nextjs`, read this ticket): `bundle-barrel-imports`: Hugeicons is a barrel, but Turbopack tree-shakes it (1 to 18 icon paths per chunk, only the icons used), so no change. `client-passive-event-listeners`: the one window scroll listener is already passive. Image rule "next/image over img": every `<img>` but one is an SVG, which Next does not optimize (it sets `unoptimized` automatically for `.svg`), and all carry width and height, so they stay `<img>`; the professor PNG (165 by 505, 65KB) stays too until a sharper source exists (it is soft on 2x screens). Fonts: `next/font` with size-adjusted fallbacks, preloads trimmed as above. No Suspense or `next/dynamic` added: nothing heavy sits below the fold; the largest client piece, the hero, is the first screen.

**Measured** (production build, `next start`, Chrome via Playwright; LCP and CLS from PerformanceObserver over load plus a full wheel scroll; INP from real clicks and keys on each page's tabs, accordion, slider and menu):

| Page | 1440 LCP | 1440 CLS | 1440 INP | 390 slow LCP | 390 slow CLS | 390 slow INP |
| --- | --- | --- | --- | --- | --- | --- |
| / | 148 | 0.001 | 64 | 1312 | 0.0054 | 184 |
| /faq | 52 | 0 | 40 | 1052 | 0.0003 | 176 |
| /how-it-works | 72 | 0 | 32 | 1132 | 0.0003 | n/a |
| /pricing | 60 | 0 | 40 | 1096 | 0.0008 | n/a |
| /students | 52 | 0 | 40 | 1036 | 0.0006 | n/a |
| /use-cases | 44 | 0 | 40 | 1036 | 0.0007 | n/a |
| client-meetings | 76 | 0 | 32 | 1088 | **0.0249** | 136 |
| customer-calls | 64 | 0 | 24 | 1132 | 0.0017 | 136 |
| incident-calls | 56 | **0.0048** | 32 | 1100 | **0.0093** | 136 |
| journalism | 80 | 0 | 40 | 1124 | 0.0008 | 160 |
| lectures | 76 | 0 | 40 | 1008 | 0.001 | 168 |
| podcasts-and-video | 56 | 0 | 32 | 1100 | 0.0012 | 152 |
| recruiting | 64 | 0.0001 | 32 | 1072 | 0.0011 | 128 |
| research-interviews | 60 | 0 | 32 | 1148 | 0.0015 | 192 |
| sales-calls | 64 | 0 | 32 | 1304 | 0.0011 | 200 |
| talks-courses-and-webinars | 68 | 0 | 32 | 1236 | **0.0108** | 160 |
| team-meetings | 52 | 0.001 (fixed) | 24 | 1060 | 0.0009 | 144 |
| voice-notes | 68 | 0 | 40 | 1160 | 0.001 | 152 |

ms; "390 slow" is 390 by 844 with 1.6 Mbps, 150ms latency and 4x CPU throttling. The 1440 column is from before the figure and font fixes, on a quiet machine. The 390 column is from after them, with the machine under heavy load from other processes (load average 40 to 60), so its INP is pessimistic. A repeat 1440 run under that load read LCP 144 to 2888ms and INP 80 to 240ms. Treat that as contention, not the site: the pages are static and the quiet run is 44 to 148ms. "n/a": no interaction counted (a page with no tabs, accordion or slider, tapped on touch). **LCP is under 2s on every page in both profiles. INP is under 200ms everywhere on the quiet run and at or under 200ms throttled.** CLS is not 0 everywhere; what remains:

1. **The headline marker reflows the H1 after hydration (handed to the design lane).** `hero/marker.tsx` replaces the per-word spans with one `whitespace-nowrap` span per line carrying `px-[0.3em] -mx-[0.15em]`. That adds 0.3em to each marked line, and with `text-balance` three headlines re-break once JavaScript runs. client-meetings: "A record of what / was agreed" becomes "A record of / what was agreed". incident-calls: "The incident call, / written down" becomes "The incident / call, written down". talks at 390: "Notes from / anything that / plays sound" becomes "Notes from / anything / that plays sound". On every marker headline the marked words also step right by 0.15em (9px at 60px) at hydration. This is the 0.0048 to 0.025 CLS. The fix changes the marker's geometry or the final line breaks, so it goes to the design lane.
2. Font swap on slow connections: 0.0002 to 0.001 per page at about 2.1s. `display: swap` with next/font's adjusted fallbacks; `optional` would remove it but shows the fallback face to slow first-time visitors, which is a look decision. Not changed.
3. Header island shrink: 0.0001 per toggle (its contents move as the height animates, counted because scroll is not input). Left as ticket 17 built it.
4. Hero waveform bars animate `height` inside a flex row: each frame logs a shift, summing below 0.0001. A `scaleY` transform would flatten the 3px bars' round ends, so left as is.

**Rendered checks, 1440 and 390** (production build, wheel-scrolled top to bottom, then back to the top): all 18 pages have no horizontal overflow, no page errors and no console errors except the known `/privacy` and `/terms` 404 prefetches. Interactions: desktop Use cases dropdown opens on hover and closes on Escape; phone sheet opens, its Use cases accordion expands, Escape closes it; hero window tabs select; FAQ accordion toggles by click and by Enter; pricing slider moves by arrow keys (8 to 10) and by drag. Story scroll: 100px wheel ticks and 6px trackpad-like deltas both give chapters 0, 1, 2 in order at the same offsets (1440: 840 to 900, 1380 to 1400, 2100; 390: 400 to 426, 1000 to 1020, 1600 to 1620), with no snap-back. Contact sheets: `docs/redesign/prototypes/d18-render-1440.jpeg`, `d18-render-390.jpeg`.

**Open:** the marker handoff (item 1); a real Mac trackpad and wheel (owner-pending since 07); Safari and Firefox; the root `metadata` in `layout.tsx` still has the old "botless" copy and a site-wide `alternates.canonical: "/"` that makes every page canonicalise to home unless the page overrides it (Phase E, SEO); breadcrumb JSON-LD (Phase E).

**Marker handoff, returned and re-measured (2026-10-16).** The design lane changed `web/components/hero/marker.tsx`. The line span has no padding or margin. The band's bleed is on `::before` at `-inset-x-[0.2em]` (0.3em ran into "Mac" on /pricing). Each line start measured at first paint gets a `<br>`, because near-tie headlines still re-broke under `text-balance` without one. The first-paint breaks are kept on every page. H1 breaks with JavaScript blocked against hydrated: 18 of 18 the same at 1440 and 390. Captures `prototypes/d18-marker-{before,after}-*.png`. Re-measured on the nine marker pages, production build:

| Page | 1440 CLS | 390 slow CLS |
| --- | --- | --- |
| / | 0.001 (waveform bars, each shift about 0) | 0.0041 |
| /how-it-works | 0 | 0 |
| /pricing | 0 | 0.0005 |
| /students | 0 | 0.0003 |
| /use-cases | 0 | 0.0005 |
| client-meetings | 0 (was 0) | 0.024 (font swap, below) |
| incident-calls | 0 (was 0.0048) | 0.0005 (was 0.0093) |
| talks-courses-and-webinars | 0 | 0 (was 0.0108) |
| lectures | 0 | 0.0002 |

LCP on those pages: 60 to 104ms at 1440, 916 to 1008ms throttled. INP: at most 48ms at 1440 and at most 96ms throttled. The marker reflow is gone. The 0.024 left on client-meetings on a slow connection is the font swap, not the marker: the same shift appears with JavaScript blocked. The fallback face breaks "A record of / what was agreed", Fraunces breaks "A record of what / was agreed", and "what" moves up a line when the font lands. Removing that needs `display: "optional"` or a different headline, which is a design call, so it stays listed under item 2.
