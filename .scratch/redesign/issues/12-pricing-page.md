# 12: Pricing page

Status: done
Lane: design
Blocked by: 02

**Section:** the `/pricing` page.

**What to build:** heading "Recording and notes on your Mac are free."; two plans only, Free (available) and Pro (not available yet), with Pro's $12 a month or $96 a year marked `TODO: confirm`; "Students get 50% off every paid plan" `TODO: confirm`; no Enterprise or Teams; no lifetime price.

- Calculator modelled on the owner's reference (`docs/redesign/refs/owner-pricing-reference/`, draft `prototypes/b8-pricing-1440.png`): a slider for hours of meetings a month, bands Light under 5, Typical 5 to 20, Heavy 20 and up; bars for Trilsy ($0) and Otter, Granola, Wispr Flow; the result line, "Save $X a year vs [the cheapest]", and the dated footnote. Pro appears only as a line marked "not available yet", not as a bar.
- The competitor figures and the function "cheapest published plan that covers N hours" go to the logic lane (HANDOFF), from `docs/redesign/refs/pricing-checked-2026-10-15.md`. Fireflies and Superwhisper stay out.
- No price in OG images, JSON-LD or llms.txt.
- Mobbin: 3 pricing references to `docs/redesign/refs/pricing/`.

**Approved copy:** `docs/redesign/02-copy-deck.md` section 9.
**Behavior spec:** none.

**Images needed from the owner:** none.

- [x] Two plans, every figure marked TODO: confirm and listed
- [x] Calculator correct at band edges (logic lane's result)
- [x] Slider works by keyboard
- [x] Typecheck and build pass

## Answer

Design lane, Sonnet 5.5, loop mode, 2026-10-15.

- **The page.** `web/app/pricing/page.tsx` (Server Component): a pale blue band with the H1 "Recording and notes on your Mac are free." (second half in the hero's `Marker`), then the two plans, then the calculator on paper. Title and description are new copy, no price, nothing unbuilt; canonical `/pricing`. Copy is the deck's section 9 word for word.
- **Plans** (`components/pricing/plans.tsx`): Free is a lifted window with an "Available" badge, "$0 /month", the approved sentence and the one true button, View on GitHub. Pro is a paper window with a dashed edge (new `edge="dashed"` variant on `Window`), a "Not available yet" badge, $12 /month and "or $96 a year", the approved sentence, and no button. "Students get 50% off every paid plan" sits under a dotted rule in the Pro card and links to `/students` (ticket 13). No Enterprise, Teams or lifetime price.
- **Placeholders.** Every figure carries a visible `TODO: confirm` chip (`components/pricing/todo.tsx`; delete the element, not the figure, once the owner confirms): $12, $96, the 50%, and the comparison footnote.
- **Calculator** (`components/pricing/calculator.tsx`, client): the AeriVoice shape in Trilsy's own look. Slider (new shadcn `Slider`, Base UI, restyled to tokens: ink-ruled track, mustard thumb) over 19 stops of 1 to 60 hours, so 5 and 20 are reachable and every arrow key moves one stop; the three bands are laid out under the track in proportion to their stops, so the lit band is always under the thumb. Four bars on a fixed $30 scale (Trilsy mustard, competitors dusty blue), filled by `scaleX` on `ease-trilsy` at 400ms, no transition under reduced motion. Result: "$0 /month with Trilsy", "The app costs nothing at any usage.", and "Save $X a year vs ..." or, when a competitor's free plan covers the hours, "Otter Basic is free here too". Footnote is the deck's, plus the plans' limits, plus one line that Pro is not shown because it is not available yet.
- **Data and rule (logic lane, handoff).** `web/lib/pricing.ts` was drafted by the design lane and is now the logic lane's. Its header comment states the rule: a plan "covers N hours" when its pricing page lets you record N hours of meetings in a month and keep them. Decisions: 5 hours is Typical and 20 is Heavy (bands describe usage); Otter's limits are inclusive (300 minutes is Basic, 1,200 is Pro); the 30-minute meeting cap does not change "covers" and is disclosed in the footnote; Granola Basic and Wispr Flow Free cover no hours (30 days of history, no meeting allowance), so Business $14 and Pro $15 stand in; the result line is honest as it is. No figure changed; "unlimited history" was dropped from the Granola note because it has no source. Tested at every stop and at 4, 5, 6, 19, 20, 21 hours and the 300 and 1,200 minute thresholds: 1 to 5 hours is a tie with Otter Basic; from 301 minutes the saving is $168 a year vs Granola Business, with Otter Pro $16.99 up to 1,200 minutes and Business $30 above; the bar scale is 30 at every stop. Only `calculator.tsx` imports the file, so no price reaches an OG image, JSON-LD or llms.txt.
- **Mobbin.** Two queries; three kept in `docs/redesign/refs/pricing/` with what each informed (Craft, Vercel, Kit).
- **Checked.** Chrome (dev server) at 1440 by 900 and 390 by 844: `docs/redesign/prototypes/d12-pricing-1440.png`, `d12-pricing-1440-top.png`, `d12-pricing-390.png`; no horizontal overflow at 390. Keyboard: Home goes to 1 hour, ArrowRight to the next stop. Stepping all 19 stops changed the bars, the lit band and the result line correctly against the provisional rule. Typecheck and build pass. Reduced motion is read from the CSS, not run live.
- **Decided by the design lane after the logic return (minor defaults).** The saving sub-line now ends ", billed monthly", because the saving uses monthly prices and Otter Pro billed annually is $8.33 a month (about $100 a year). Otter Pro's 90-minutes-a-meeting cap is added to the footnote (it is in the refs file), so both Otter caps are disclosed. Open for the owner, not decided: above 5 hours the result is always "Save $168 a year vs Granola Business" and only Otter's bar moves.
- **Defaults taken.** The calculator's slider uses stops, not every hour. The bars scale is fixed at $30. A free competitor plan that covers the hours is a tie, not a saving. The plans' limits stay in the footnote. The H1 band is pale blue and the calculator is on paper. The calculator section has an `aria-label` and no visible heading (the deck has none).
