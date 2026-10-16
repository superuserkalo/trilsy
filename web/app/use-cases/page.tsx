import type { Metadata } from "next";
import { pageMetadata } from "@/lib/metadata";
import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowRight01Icon } from "@hugeicons/core-free-icons";
import { Marker } from "@/components/hero/marker";
import { Band } from "@/components/ui/surface";
import { useCasePath, useCases } from "@/lib/site";

// Title, description and H1 are new copy for review (not in the copy deck). No
// price, no discount, nothing unbuilt.
export const metadata: Metadata = pageMetadata({
  title: "Trilsy use cases: sales calls, lectures, interviews and more on your Mac",
  description:
    "Twelve ways to use Trilsy, from sales calls and team meetings to lectures, research interviews and podcasts. Each one ends in a transcript and notes saved on your Mac.",
  path: "/use-cases",
});

// Copy: docs/redesign/02-copy-deck.md section 7, every name and lead word for
// word, in the deck's order, one flat list. Each row carries the page's anchor id.
export default function UseCasesPage() {
  return (
    <main id="main">
      <Band tone="field" rules="bottom" aria-labelledby="use-cases-heading">
        <div className="mx-auto max-w-6xl px-6 pt-14 pb-16 lg:pt-24 lg:pb-24">
          <h1
            id="use-cases-heading"
            className="max-w-[14em] text-[40px] leading-[1.08] font-semibold tracking-[-0.015em] text-balance lg:text-6xl"
          >
            Calls, lectures and interviews. <Marker>Start with yours.</Marker>
          </h1>
        </div>
      </Band>

      <Band tone="paper" rules="none" aria-label="All use cases">
        <ul className="mx-auto flex max-w-6xl flex-col px-6 py-4 lg:py-8">
          {useCases.map(({ slug, name, lead }, i) => (
            <li
              key={slug}
              id={slug}
              className={i ? "scroll-mt-24 border-t-[1.5px] border-dotted border-foreground" : "scroll-mt-24"}
            >
              <Link
                href={useCasePath(slug)}
                className="group grid grid-cols-[1fr_auto] items-center gap-x-6 gap-y-2 py-6 lg:grid-cols-[5fr_6fr_auto] lg:gap-x-12 lg:py-8"
              >
                <span className="text-2xl leading-tight font-semibold tracking-[-0.01em] text-balance lg:text-3xl">
                  <span className="underline decoration-transparent decoration-2 underline-offset-4 transition-colors duration-(--duration-base) ease-trilsy group-hover:decoration-primary">
                    {name}
                  </span>
                </span>
                <span className="col-start-1 max-w-[34em] text-[17px] leading-relaxed text-foreground/85 lg:col-start-2 lg:text-lg">
                  {lead}
                </span>
                <HugeiconsIcon
                  icon={ArrowRight01Icon}
                  aria-hidden
                  className="col-start-2 row-start-1 size-7 shrink-0 transition-transform duration-(--duration-base) ease-trilsy group-hover:translate-x-1 motion-reduce:transition-none lg:col-start-3 lg:size-8"
                />
              </Link>
            </li>
          ))}
        </ul>
      </Band>
    </main>
  );
}
