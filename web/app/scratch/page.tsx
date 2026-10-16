import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowRight01Icon } from "@hugeicons/core-free-icons";
import { Button } from "@/components/ui/button";
import { Band, Window } from "@/components/ui/surface";

// Development-only check of the design system. Delete it, or leave it: in
// production it is a 404 and is never indexed.
export const metadata: Metadata = {
  title: "Scratch",
  robots: { index: false, follow: false },
};

const fills = [
  ["background", "bg-background"],
  ["card", "bg-card"],
  ["field", "bg-field"],
  ["muted", "bg-muted"],
  ["foreground / ink", "bg-ink"],
  ["primary / mustard", "bg-primary"],
  ["secondary", "bg-secondary"],
  ["accent", "bg-accent"],
  ["terracotta (fill)", "bg-terracotta"],
  ["sage (fill)", "bg-sage"],
  ["dusty blue (fill)", "bg-dusty-blue"],
  ["skin light", "bg-skin-light"],
  ["skin mid", "bg-skin-mid"],
  ["skin deep", "bg-skin-deep"],
] as const;

// Computed from the B4 values in globals.css (WCAG 2.x, light mode).
const contrast = [
  ["Ink on paper", "15.4"],
  ["Ink on field", "13.1"],
  ["Ink on mustard (primary button)", "8.1"],
  ["White on dusty blue (secondary button)", "5.9"],
  ["Muted text on paper", "5.5"],
  ["Muted text on field", "4.7"],
  ["Deep terracotta on paper (emphasis text)", "5.6"],
  ["Deep terracotta on field", "4.7"],
  ["Terracotta on paper (fill only, not text)", "3.6"],
  ["Mustard on paper (fill only, never text)", "1.9"],
] as const;

export default function Scratch() {
  if (process.env.NODE_ENV === "production") notFound();

  return (
    <main>
      <Band tone="paper" rules="none" className="px-6 py-16">
        <div className="mx-auto flex max-w-5xl flex-col gap-12">
          <header className="flex flex-col gap-4">
            <h1 className="max-w-3xl text-5xl leading-[1.05] font-semibold text-balance sm:text-6xl">
              Your meetings, written up. Trilsy writes the notes.
            </h1>
            <p className="max-w-xl text-lg text-muted-foreground">
              Figtree at text size, Fraunces for display. Body copy sits in muted
              ink on paper at 5.5:1.
            </p>
          </header>

          <section className="flex flex-col gap-4" aria-labelledby="buttons">
            <h2 id="buttons" className="text-2xl font-semibold">
              Buttons
            </h2>
            <div className="flex flex-wrap items-center gap-3">
              <Button size="lg">
                Download for Mac
                <HugeiconsIcon icon={ArrowRight01Icon} data-icon="inline-end" strokeWidth={2} />
              </Button>
              <Button size="lg" variant="secondary">
                See how it works
              </Button>
              <Button>Primary</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="outline">Outline</Button>
              <Button variant="ghost">Ghost</Button>
              <Button variant="link">Link</Button>
              <Button variant="destructive">Delete</Button>
              <Button disabled>Disabled</Button>
              <Button size="sm">Small</Button>
              <Button size="xs">Extra small</Button>
              <Button size="icon" aria-label="Next">
                <HugeiconsIcon icon={ArrowRight01Icon} strokeWidth={2} />
              </Button>
            </div>
          </section>

          <section className="flex flex-col gap-4" aria-labelledby="colour">
            <h2 id="colour" className="text-2xl font-semibold">
              Colour tokens
            </h2>
            <ul className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-7">
              {fills.map(([name, cls]) => (
                <li key={name} className="flex flex-col gap-2 text-sm">
                  <span className={`${cls} h-16 rounded-xl border border-border`} />
                  {name}
                </li>
              ))}
            </ul>
            <table className="mt-2 w-full max-w-2xl text-left text-sm">
              <caption className="sr-only">Contrast ratios</caption>
              <tbody>
                {contrast.map(([pair, ratio]) => (
                  <tr key={pair} className="border-b border-border">
                    <th scope="row" className="py-2 pr-4 font-normal">
                      {pair}
                    </th>
                    <td className="py-2 font-semibold tabular-nums">{ratio}:1</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        </div>
      </Band>

      <Band tone="field" className="px-6 py-16">
        <div className="mx-auto flex max-w-5xl flex-col gap-8">
          <h2 className="max-w-2xl text-4xl font-semibold text-balance">
            The pale blue field, with dotted ink rules at its edges.
          </h2>
          <p className="max-w-xl text-muted-foreground">
            Muted text on the field reads at 4.7:1. Buttons keep their ink border
            here, so they stand off the blue.
          </p>
          <div className="flex flex-wrap gap-3">
            <Button size="lg">Download for Mac</Button>
            <Button size="lg" variant="secondary">
              Read the notes
            </Button>
          </div>
          <Window className="max-w-2xl p-6">
            <h3 className="text-xl font-semibold">Biology 101: mitosis</h3>
            <p className="mt-2 text-muted-foreground">
              Product window: 2px ink border, card fill. Prophase comes first and
              is usually the longest stage.
            </p>
          </Window>
        </div>
      </Band>

      <Band tone="paper" rules="none" className="px-6 py-16">
        <div className="mx-auto flex max-w-5xl flex-col gap-4">
          <h2 className="text-2xl font-semibold">Motion token</h2>
          <p className="max-w-xl text-muted-foreground">
            Hover or focus the box: it moves on the one easing token over 600ms.
            Reduced motion makes it instant.
          </p>
          <div
            tabIndex={0}
            className="group w-72 rounded-full border-2 border-ink bg-card p-1.5 outline-none"
          >
            <span className="block size-10 rounded-full border-2 border-ink bg-primary transition-transform duration-(--duration-slow) ease-trilsy group-hover:translate-x-58 group-focus:translate-x-58" />
          </div>
        </div>
      </Band>
    </main>
  );
}
