"use client";

import { useState } from "react";
import { Slider } from "@/components/ui/slider";
import { Window } from "@/components/ui/surface";
import { bandFor, bands, checkedOn, comparisonFor, hourStops, sources, type BandId, type PlanRow } from "@/lib/pricing";
import { cn } from "@/lib/utils";

const money = (n: number) => `$${Number.isInteger(n) ? n : n.toFixed(2)}`;
const hoursText = (h: number) => `${h} ${h === 1 ? "hour" : "hours"}`;

// Bands take the share of the track their stops take, so the lit band always sits
// under the thumb.
const bandStops = bands.map((b) => hourStops.filter((h) => bandFor(h) === b.id).length);

function Bar({ row, scaleMax, tone }: { row: PlanRow; scaleMax: number; tone: "trilsy" | "other" }) {
  return (
    <li className="flex flex-col gap-2">
      <div className="flex items-baseline justify-between gap-4">
        <span className="min-w-0">
          <span className={cn("text-[17px]", tone === "trilsy" ? "font-bold" : "font-semibold text-foreground/80")}>{row.name}</span>
          <span className="ml-2 text-sm text-muted-foreground">{row.plan}</span>
        </span>
        <span className="shrink-0 tabular-nums">
          <span className={cn("text-[17px]", tone === "trilsy" ? "font-bold" : "font-semibold text-foreground/80")}>{money(row.monthly)}</span>
          <span className="ml-1 text-sm text-muted-foreground">/month</span>
        </span>
      </div>
      {/* The fill scales from the left on the site's easing, so a change in hours reads as the price moving. */}
      <div className="h-3 overflow-hidden rounded-full border-2 border-ink bg-muted" aria-hidden>
        <div
          className={cn(
            "h-full origin-left transition-transform duration-(--duration-base) ease-trilsy motion-reduce:transition-none",
            tone === "trilsy" ? "bg-primary" : "bg-secondary",
          )}
          style={{ transform: `scaleX(${row.monthly / scaleMax})` }}
        />
      </div>
    </li>
  );
}

// Copy: docs/redesign/02-copy-deck.md section 9. The figures and the rule come from lib/pricing.ts.
export function Calculator() {
  const [index, setIndex] = useState(hourStops.indexOf(10));
  const hours = hourStops[index];
  const active: BandId = bandFor(hours);
  const { trilsy, competitors, scaleMax, result } = comparisonFor(hours);

  return (
    <Window lift="hard" radius="lg" className="flex flex-col gap-8 p-5 sm:p-8 lg:p-10">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6">
          <label id="hours-label" className="text-xl text-muted-foreground lg:text-2xl">
            If you record
          </label>
          <output htmlFor="hours" className="text-xl font-bold tabular-nums lg:text-2xl">
            {hoursText(hours)} of meetings a month
          </output>
        </div>
        <div className="flex flex-col gap-3">
          <Slider
            id="hours"
            aria-labelledby="hours-label"
            min={0}
            max={hourStops.length - 1}
            step={1}
            value={index}
            onValueChange={(v) => setIndex(v as number)}
            getAriaLabel={() => "Hours of meetings a month"}
            getAriaValueText={(_, v) => `${hoursText(hourStops[v])} of meetings a month`}
          />
          <div className="grid gap-1.5" style={{ gridTemplateColumns: bandStops.map((n) => `${n}fr`).join(" ") }}>
            {bands.map((b) => (
              <div key={b.id} className="flex flex-col gap-2">
                <div
                  className={cn(
                    "h-[3px] rounded-full transition-colors duration-(--duration-base) ease-trilsy",
                    active === b.id ? "bg-ink" : "bg-border",
                  )}
                />
                <p className={cn("text-center text-xs leading-tight sm:text-sm", active === b.id ? "text-foreground" : "text-muted-foreground")}>
                  <span className={cn("block text-[13px] sm:text-[15px]", active === b.id ? "font-bold" : "font-medium")}>{b.label}</span>
                  {b.range}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <ul className="flex flex-col gap-5">
        <Bar row={trilsy} scaleMax={scaleMax} tone="trilsy" />
        {competitors.map((row) => (
          <Bar key={row.name} row={row} scaleMax={scaleMax} tone="other" />
        ))}
      </ul>

      <div
        aria-live="polite"
        className="flex flex-col gap-6 border-t-[1.5px] border-dotted border-foreground pt-8 sm:flex-row sm:items-end sm:justify-between"
      >
        <div className="flex flex-col gap-1">
          <p className="flex flex-wrap items-baseline gap-x-3">
            <span className="font-display text-7xl leading-none font-semibold tabular-nums lg:text-8xl">$0</span>
            <span className="text-xl font-semibold lg:text-2xl">/month with Trilsy</span>
          </p>
          <p className="mt-2 text-muted-foreground">The app costs nothing at any usage.</p>
        </div>
        <div className="flex flex-col gap-1 sm:items-end sm:text-right">
          {result.kind === "saving" ? (
            <>
              <p className="text-2xl font-bold tabular-nums lg:text-3xl">Save {money(result.yearly)} a year</p>
              <p className="text-muted-foreground">
                vs {result.vs.name} {result.vs.plan} at {money(result.vs.monthly)}/month, billed monthly
              </p>
            </>
          ) : (
            <>
              <p className="text-2xl font-bold lg:text-3xl">
                {result.vs.name} {result.vs.plan} is free here too
              </p>
              <p className="text-muted-foreground">Trilsy stays $0 as you record more.</p>
            </>
          )}
        </div>
      </div>

      <p className="max-w-[60em] text-[13px] leading-relaxed text-muted-foreground">
        Other companies’ monthly plans, read from each company’s own pricing page on {checkedOn}, for the cheapest plan that covers the hours above. {sources} Prices change; check the company’s page. Trilsy Pro is not shown: it is not available yet.
      </p>
    </Window>
  );
}
