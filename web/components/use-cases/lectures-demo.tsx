"use client";

import { useEffect, useRef, useState } from "react";
import { m, useInView } from "motion/react";
import { MockWindow, ViewControl } from "@/components/how-it-works/mock";
import { transition, transitionBase, useMotionTransition } from "@/lib/motion";
import { cn } from "@/lib/utils";
import { AppBody, AudioSourcesButton, NotesDoc, RecordingHeader, SidebarRow } from "./app-chrome";

// The search word, and a student's recordings. The app's search keeps a recording
// when the word is in its title, transcript or notes, and the sidebar then lists
// the matches ("Matches" instead of "Recent"), so the list is all the search
// changes. Titles and dates are illustration.
const word = "elasticity";

const recordings = [
  { title: "Economics, lecture 8", match: false },
  { title: "History, lecture 5", match: false, wide: true },
  { title: "Statistics, lecture 7", match: false, wide: true },
  { title: "Economics, lecture 6", match: true },
  { title: "Economics, lecture 3", match: true },
] as const;

// The notes of the first match, the way the app shows them: rendered, an overview
// on top, then a section each. The Edit button opens the Markdown. A timestamp
// inside the notes is text, not a link. No checkbox glyphs: action items are not
// a feature.
const notes = [
  {
    h: "Overview",
    p: "Elasticity measures how far the quantity people buy moves when the price moves. Demand is elastic when buyers react a lot and inelastic when they barely react. The lecture ends on what that means for a seller\u2019s revenue.",
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

// One sidebar row is 32px (h-8). The list keeps the height of every row it
// starts with, so filtering moves nothing: five rows from 640px up, three on a phone
// (the `wide` rows are left out there, so the stacked window is not mostly blank).
const ROW = 32;
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
      toolbar={<AudioSourcesButton />}
    >
      <div aria-hidden>
        <AppBody
          search={typed === 0 ? undefined : word.slice(0, typed)}
          label={typed === 0 ? "Recent" : "Matches"}
          allSelected={!opened}
          collapse={false}
          list={recordings.map((r) => {
            const gone = filtered && !r.match;
            return (
              <m.li
                key={r.title}
                initial={false}
                animate={{ height: gone ? 0 : ROW, opacity: gone ? 0 : 1 }}
                transition={tBase}
                className={cn("shrink-0 overflow-hidden", "wide" in r && "max-sm:hidden")}
              >
                <SidebarRow title={r.title} selected={opened && r.title === "Economics, lecture 6"} />
              </m.li>
            );
          })}
          listClassName="h-24 overflow-hidden sm:h-40"
        >
          <m.div
            initial={false}
            animate={{ opacity: opened ? 1 : 0, y: opened ? 0 : 6 }}
            transition={slow}
            className="flex flex-col gap-4 px-4 py-4"
          >
            <RecordingHeader title="Economics, lecture 6" date="7 Oct, 10:15" length="52 min" status="Ready" />
            <ViewControl active="Notes" />
            <NotesDoc sections={notes} />
          </m.div>
        </AppBody>
      </div>
    </MockWindow>
  );
}
