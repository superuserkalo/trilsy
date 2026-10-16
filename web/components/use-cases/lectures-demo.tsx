"use client";

import { useEffect, useRef, useState } from "react";
import { m, useInView } from "motion/react";
import { HugeiconsIcon } from "@hugeicons/react";
import { Search01Icon } from "@hugeicons/core-free-icons";
import { MockWindow, ViewControl } from "@/components/how-it-works/mock";
import { transition, transitionBase, useMotionTransition } from "@/lib/motion";
import { cn } from "@/lib/utils";

// The search word, and a student's recordings. The app's search keeps a recording
// when the word is in its title, transcript or notes, and shows the list that is
// left, so the list is all the search changes. Titles and dates are illustration.
const word = "elasticity";

const recordings = [
  { title: "Microeconomics, lecture 8", date: "14 Oct 2026", match: false },
  { title: "Modern History, lecture 5", date: "13 Oct 2026", match: false, wide: true },
  { title: "Statistics 110, lecture 7", date: "9 Oct 2026", match: false, wide: true },
  { title: "Microeconomics, lecture 6", date: "7 Oct 2026", match: true },
  { title: "Microeconomics, lecture 3", date: "23 Sep 2026", match: true },
] as const;

// The notes of the first match, the way the app writes them: plain Markdown, an
// overview on top, then a section each. A timestamp inside the notes is text,
// not a link. No checkbox glyphs: action items are not a feature.
const notes = [
  {
    h: "Overview",
    p: "Elasticity measures how far the quantity people buy moves when the price moves. Demand is elastic when buyers react a lot and inelastic when they barely react. The lecture ends on what that means for a seller’s revenue.",
  },
  {
    h: "Price elasticity of demand",
    p: "Percentage change in quantity demanded divided by the percentage change in price. Above 1 is elastic, below 1 is inelastic. [00:06:40]",
  },
  {
    h: "What makes demand inelastic",
    p: "Few close substitutes, a necessity, a small share of income. Petrol and insulin were the examples.",
  },
  {
    h: "Revenue and elasticity",
    p: "If demand is elastic, a price rise lowers revenue. If it is inelastic, the same rise raises it. The test is whether quantity falls faster than the price rises.",
  },
] as const;

// One recording row is 56px (h-14). The list keeps the height of every row it
// starts with, so filtering moves nothing: five rows from md up, three on a phone
// (the `wide` rows are left out there, so the stacked window is not mostly blank).
const ROW = 56;
const TYPE_MS = 90;
const T_FILTER = 400 + word.length * TYPE_MS + 250; // after the last letter
const T_OPEN = T_FILTER + 600; // the filter has finished closing the rows

/**
 * Lectures page: the student's search before the exam. The word is typed into the
 * search field, the recording list narrows to the lectures that mention it, and
 * the first match opens on its notes. Plays once, when the window comes into
 * view; under reduced motion the finished state is shown at once. Every part is
 * laid out from the start (the list keeps its full height, the notes keep their
 * space), so nothing shifts.
 */
export function LecturesDemo() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.4 });
  const slow = useMotionTransition(transition);
  const tBase = useMotionTransition(transitionBase);
  const [typed, setTyped] = useState(0);
  const [filtered, setFiltered] = useState(false);
  const [opened, setOpened] = useState(false);

  useEffect(() => {
    if (!inView) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setTyped(word.length);
      setFiltered(true);
      setOpened(true);
      return;
    }
    const timers: ReturnType<typeof setTimeout>[] = [];
    for (let i = 1; i <= word.length; i++) timers.push(setTimeout(() => setTyped(i), 400 + (i - 1) * TYPE_MS));
    timers.push(setTimeout(() => setFiltered(true), T_FILTER));
    timers.push(setTimeout(() => setOpened(true), T_OPEN));
    return () => timers.forEach(clearTimeout);
  }, [inView]);

  return (
    <MockWindow
      ref={ref}
      title="Trilsy"
      role="img"
      aria-label={`The recording list filtered by the search word ${word}. Two lectures match, Microeconomics lecture 6 and lecture 3, and the notes of lecture 6 are open: an overview, then a section on price elasticity of demand, one on what makes demand inelastic and one on revenue.`}
    >
      <div aria-hidden className="grid md:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
        <div className="flex flex-col gap-3 border-b border-border px-4 py-4 md:border-r md:border-b-0">
          <div className="flex items-center gap-2 rounded-md border border-border bg-card px-2.5 py-1.5">
            <HugeiconsIcon icon={Search01Icon} strokeWidth={2} className="size-3.5 shrink-0 text-muted-foreground" />
            <span className={cn("min-h-[1lh]", typed === 0 && "text-muted-foreground")}>
              {typed === 0 ? "Search your recordings" : word.slice(0, typed)}
            </span>
          </div>
          <ul className="flex h-[168px] flex-col overflow-hidden md:h-[280px]">
            {recordings.map((r) => {
              const gone = filtered && !r.match;
              const selected = opened && r.title === "Microeconomics, lecture 6";
              return (
                <m.li
                  key={r.title}
                  initial={false}
                  animate={{ height: gone ? 0 : ROW, opacity: gone ? 0 : 1 }}
                  transition={tBase}
                  className={cn("shrink-0 overflow-hidden", "wide" in r && "max-md:hidden")}
                >
                  <div
                    className={cn(
                      "flex h-14 flex-col justify-center rounded-md px-2.5 transition-colors duration-(--duration-base) ease-trilsy",
                      selected && "bg-field",
                    )}
                  >
                    <p className="truncate font-semibold">{r.title}</p>
                    <p className="text-xs text-muted-foreground">{r.date}</p>
                  </div>
                </m.li>
              );
            })}
          </ul>
        </div>
        <m.div
          initial={false}
          animate={{ opacity: opened ? 1 : 0, y: opened ? 0 : 6 }}
          transition={slow}
          className="flex flex-col gap-4 px-4 py-4"
        >
          <p className="font-display text-lg leading-tight font-semibold">Microeconomics, lecture 6</p>
          <ViewControl active="Notes" />
          <div className="flex flex-col gap-3.5 text-[13px] leading-[1.55]">
            {notes.map((n) => (
              <div key={n.h}>
                <p className="font-semibold">## {n.h}</p>
                <p>{n.p}</p>
              </div>
            ))}
          </div>
        </m.div>
      </div>
    </MockWindow>
  );
}
