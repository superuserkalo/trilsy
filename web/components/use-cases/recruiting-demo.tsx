"use client";

import { useEffect, useState } from "react";
import { m } from "motion/react";
import { MockWindow } from "@/components/how-it-works/mock";
import { transition, useMotionTransition } from "@/lib/motion";
import { cn } from "@/lib/utils";
import { NoteBlock } from "./app-chrome";
import { usePlayOnce } from "./use-play-once";

// Illustration content: two interviews for the same role. The notes model picks
// its own section headings, so only the shape is shared: an overview on top, then
// the detail. The candidates are invented.
const interviews = [
  {
    title: "Product designer, Jonas",
    date: "9 Oct 2026",
    overview:
      "Jonas has six years in product design, mostly on mobile apps. He moved his last team from ad hoc reviews to a weekly critique and wants to work closer to research.",
    sections: [
      { h: "Recent work", p: "Redesigned the onboarding for a banking app and cut the sign-up from nine steps to five." },
      { h: "Why this role", p: "Wants to spend less time on visual polish and more on what users do." },
    ],
  },
  {
    title: "Product designer, Amara",
    date: "11 Oct 2026",
    overview:
      "Amara has four years in design, the last two as the only designer at a small startup. She ran her own user interviews and wants a larger team to learn from.",
    sections: [
      { h: "The startup years", p: "Built the design system for the web app and set up a monthly round of user interviews." },
      { h: "What she is looking for", p: "Senior designers to learn from, and a team that tests with users." },
    ],
  },
] as const;

/**
 * Recruiting: two interviews' notes side by side, rendered as the app shows them
 * (headings, not Markdown), each starting with its overview.
 * Both columns sit on the same three grid rows (a subgrid), so the overviews
 * line up whatever their length. The first interview is there; the second comes
 * in beside it, and a field-coloured band marks the two overviews as one row.
 * Plays once, 40% in view; under reduced motion with fades only.
 * Below 768px the two stack.
 */
export function RecruitingDemo() {
  const { ref, inView } = usePlayOnce();
  const slow = useMotionTransition(transition);
  const [second, setSecond] = useState(false);
  const [band, setBand] = useState(false);

  useEffect(() => {
    if (!inView) return;
    const timers = [setTimeout(() => setSecond(true), 700), setTimeout(() => setBand(true), 1700)];
    return () => timers.forEach(clearTimeout);
  }, [inView]);

  return (
    <MockWindow
      ref={ref}
      title="Trilsy"
      role="img"
      aria-label="The notes of two interviews for the same role, side by side. Each starts with an overview, then a section on recent work and one on why the person wants the role. The two overviews are marked as one row."
    >
      <div aria-hidden className="grid grid-cols-1 md:grid-cols-2 md:grid-rows-[auto_auto_1fr]">
        {interviews.map((iv, col) => (
          <m.div
            key={iv.title}
            initial={false}
            animate={{ opacity: col === 0 || second ? 1 : 0, x: col === 0 || second ? 0 : 12 }}
            transition={slow}
            className={cn(
              "grid gap-0 md:row-span-3 md:grid-rows-subgrid",
              col === 1 && "border-t border-border md:border-t-0 md:border-l",
            )}
          >
            <div className="px-4 pt-4 pb-3">
              <p className="font-display text-lg leading-tight font-semibold">{iv.title}</p>
              <p className="text-xs text-muted-foreground">{iv.date}</p>
            </div>
            <div className={cn("px-4 py-3 text-[13px] leading-[1.55] transition-colors duration-(--duration-base) ease-trilsy", band && "bg-field")}>
              <NoteBlock h="Overview" p={iv.overview} />
            </div>
            <div className="flex flex-col gap-3.5 px-4 pt-3 pb-4 text-[13px] leading-[1.55]">
              {iv.sections.map((s) => (
                <NoteBlock key={s.h} {...s} />
              ))}
            </div>
          </m.div>
        ))}
      </div>
    </MockWindow>
  );
}
