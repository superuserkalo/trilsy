# 02: Tokens, type and surfaces

Status: resolved
Lane: design
Blocked by: 01

**Section:** the site's design system, used by every section ticket.

**What to build:** the approved colour, type and motion tokens and the shared surfaces, so a section can be built from tokens and variants only.

- Palette from B4 treatment 3 (`docs/redesign/01-concept.md`, B4 and "B4 colour, decided"): warm paper page, pale blue band, ink, mustard for actions and the marker, deep terracotta for emphasis, dusty blue secondary, sage and terracotta as fills only; contrast values as recorded there. Dark tokens from B4, marked untested.
- Type: Fraunces (display) and Figtree (text) through `next/font`.
- Motion: one easing token `--ease-trilsy: cubic-bezier(0.22, 1, 0.36, 1)` and the two durations, 400ms and 600ms.
- Surfaces as `cva` variants: the full-bleed pale blue field with dotted ink rules; pill buttons (mustard primary with ink text, dusty blue secondary); the 2px ink border used on product windows. `globals.css` holds tokens and base rules only.
- No gradients, no glow, no glassmorphism.

**Approved copy:** none. **Behavior spec:** none.

**Images needed from the owner:** none.

- [x] Every B4 colour is a theme token; no hex values in components
- [x] Fraunces and Figtree load with no layout shift
- [x] Easing token and durations defined once
- [x] Field and button variants exist and render on a scratch page
- [x] Typecheck and build pass
