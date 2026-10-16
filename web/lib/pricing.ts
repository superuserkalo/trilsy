// The pricing comparison's data and rule. Owned by the logic lane. Every figure is
// a competitor's monthly-billing list price in USD, read from that company's own
// pricing page on 15 October 2026 and recorded in
// `docs/redesign/refs/pricing-checked-2026-10-15.md` (the comparison was
// confirmed by the owner on 2026-10-16). A figure that file does not hold does not go here. No price
// from this file goes into an OG image, JSON-LD or llms.txt; only the /pricing
// calculator imports it.
//
// The rule: for N hours of meetings a month, each competitor shows its cheapest
// published plan that covers N hours. A plan "covers" N hours when its pricing
// page lets you record N hours of meetings in a month and keep them:
//   - A monthly allowance in minutes counts up to and including its limit
//     (Otter Basic's 300 minutes covers 5 hours exactly; Pro's 1,200 covers 20).
//   - A per-meeting cap does not reduce coverage, because the slider counts hours,
//     not meetings; the cap is disclosed in `sources` instead. Reading it this way
//     favours the competitor, so it never inflates a saving.
//   - A plan whose page states a limit on keeping recordings (Granola Basic: 30
//     days of history) does not cover any hours, since Trilsy keeps every
//     recording on the Mac.
//   - A plan whose page states no meeting allowance and does state a cap of
//     another kind (Wispr Flow Free: 2,000 words a week; notetaker minutes not
//     given) cannot be shown to cover any hours, so it is not counted. A paid plan
//     whose page states no limit (Granola Business, Wispr Flow Pro) is counted as
//     covering every N.
// The saving is the cheapest covering plan's monthly price times 12, rounded
// down so it never overstates. When that plan costs $0 the result is a tie.

export const checkedOn = "15 October 2026";

export type BandId = "light" | "typical" | "heavy";

// Bands describe how much someone records, not any competitor's tiers. The edges
// read as the labels do: 5 hours is Typical ("5 to 20"), 20 hours is Heavy ("20
// and up").
export const bands: { id: BandId; label: string; range: string }[] = [
  { id: "light", label: "Light", range: "under 5 hours" },
  { id: "typical", label: "Typical", range: "5 to 20 hours" },
  { id: "heavy", label: "Heavy", range: "20 hours and up" },
];

/** Hours the slider stops at, in order. 5 and 20 are stops, so the band edges are reachable. */
export const hourStops = [1, 2, 3, 4, 5, 6, 7, 8, 10, 12, 14, 16, 18, 20, 25, 30, 40, 50, 60] as const;

export function bandFor(hours: number): BandId {
  return hours < 5 ? "light" : hours < 20 ? "typical" : "heavy";
}

export type PlanRow = {
  name: string;
  /** The plan the price belongs to, shown small beside the name. */
  plan: string;
  /** USD a month. */
  monthly: number;
};

const OTTER_BASIC: PlanRow = { name: "Otter", plan: "Basic", monthly: 0 };
const OTTER_PRO: PlanRow = { name: "Otter", plan: "Pro", monthly: 16.99 };
const OTTER_BUSINESS: PlanRow = { name: "Otter", plan: "Business", monthly: 30 };
// Granola Basic ($0, 30 days of history) and Wispr Flow Free ($0, 2,000 words a
// week) do not cover any hours under the rule above, so the paid plans stand in.
const GRANOLA_BUSINESS: PlanRow = { name: "Granola", plan: "Business", monthly: 14 };
const WISPR_PRO: PlanRow = { name: "Wispr Flow", plan: "Pro", monthly: 15 };

/** Otter's own limits, in minutes a month, each inclusive: Basic 300, Pro 1,200, Business unlimited. */
function otterFor(hours: number): PlanRow {
  const minutes = hours * 60;
  if (minutes <= 300) return OTTER_BASIC;
  if (minutes <= 1200) return OTTER_PRO;
  return OTTER_BUSINESS;
}

/** The most any shown plan costs, so the bar scale never moves while the slider does. */
const SCALE_MAX = Math.max(OTTER_BASIC.monthly, OTTER_PRO.monthly, OTTER_BUSINESS.monthly, GRANOLA_BUSINESS.monthly, WISPR_PRO.monthly);

export type Comparison = {
  trilsy: PlanRow;
  competitors: PlanRow[];
  /** The most the bars can show, so the scale never moves while the slider does. */
  scaleMax: number;
  result:
    | { kind: "saving"; yearly: number; vs: PlanRow }
    | { kind: "tie"; vs: PlanRow };
};

/** Pure: the same hours always give the same comparison. */
export function comparisonFor(hours: number): Comparison {
  const competitors: PlanRow[] = [otterFor(hours), GRANOLA_BUSINESS, WISPR_PRO];
  // Strict "<" keeps the first listed on a tie in price, so the result is stable.
  const cheapest = competitors.reduce((a, b) => (b.monthly < a.monthly ? b : a));
  return {
    trilsy: { name: "Trilsy", plan: "free, on your Mac", monthly: 0 },
    competitors,
    scaleMax: SCALE_MAX,
    result:
      cheapest.monthly > 0
        ? { kind: "saving", yearly: Math.floor(cheapest.monthly * 12), vs: cheapest }
        : { kind: "tie", vs: cheapest },
  };
}

/** Where each plan's price was read and what limits it carries; shown under the bars. */
export const sources =
  "Otter: Basic is free for 300 minutes a month and 30 minutes a meeting; Pro is $16.99 for 1,200 minutes and 90 minutes a meeting; Business is $30 for unlimited meetings. Granola: Business is $14; the free plan keeps 30 days. Wispr Flow: Pro is $15; the free plan has a weekly limit.";
