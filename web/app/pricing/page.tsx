import type { Metadata } from "next";
import { pageMetadata } from "@/lib/metadata";
import { Marker } from "@/components/hero/marker";
import { Calculator } from "@/components/pricing/calculator";
import { Plans } from "@/components/pricing/plans";
import { Band } from "@/components/ui/surface";

// Title and description are new copy for review. Neither carries a price or a
// discount, and neither names anything that is not built.
export const metadata: Metadata = pageMetadata({
  title: "Trilsy pricing: recording and notes on your Mac are free",
  description:
    "Trilsy is free on your Mac, with no time limit and no account. See what other notetakers cost for the hours you record.",
  path: "/pricing",
});

// Copy: docs/redesign/02-copy-deck.md section 9. The figures were confirmed by the owner on 2026-10-16.
export default function PricingPage() {
  return (
    <main id="main">
      <Band tone="field" rules="bottom" aria-labelledby="pricing-heading">
        <div className="mx-auto flex max-w-6xl flex-col gap-12 px-6 pt-14 pb-16 lg:gap-16 lg:pt-24 lg:pb-24">
          <h1
            id="pricing-heading"
            className="max-w-[14em] text-[40px] leading-[1.08] font-semibold tracking-[-0.015em] text-balance lg:text-6xl"
          >
            Recording and notes on your Mac <Marker>are free.</Marker>
          </h1>
          <Plans />
        </div>
      </Band>

      <Band tone="paper" rules="none" aria-label="What other notetakers cost">
        <div className="mx-auto max-w-6xl px-6 py-12 lg:py-20">
          <Calculator />
        </div>
      </Band>
    </main>
  );
}
