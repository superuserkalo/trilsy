"use client";

import { useEffect, useState } from "react";
import { m } from "motion/react";
import { HugeiconsIcon } from "@hugeicons/react";
import { Search01Icon } from "@hugeicons/core-free-icons";
import { MockWindow, ViewControl } from "@/components/how-it-works/mock";
import { transition, transitionBase, useMotionTransition } from "@/lib/motion";
import { cn } from "@/lib/utils";
import { TranscriptLine } from "./transcript-line";
import { prefersReducedMotion, usePlayOnce } from "./use-play-once";

// Illustration content. The app's search keeps a recording when the word is in
// its title, transcript or notes and shows the list that is left; it does not
// mark the word inside a recording. The word is in the three matches' transcripts.
const word = "invoice";

const calls = [
  { title: "Call with Priya", date: "13 Oct 2026", match: -1 },
  { title: "Call with Dana", date: "8 Oct 2026", match: 0 },
  { title: "Call with Marcus", date: "5 Oct 2026", match: -1, wide: true },
  { title: "Call with Lena", date: "30 Sep 2026", match: 1 },
  { title: "Call with Tomas", date: "22 Sep 2026", match: 2 },
] as const;

// What each matching call's transcript shows: the customer's line is System.
const opened = [
  {
    title: "Call with Dana",
    lines: [
      { at: "00:21:07", src: "Microphone", text: "That covers the seats and the plan." },
      { at: "00:21:15", src: "System", text: "Good. Do you send one invoice for the whole team?" },
    ],
  },
  {
    title: "Call with Lena",
    lines: [
      { at: "00:09:42", src: "Microphone", text: "You can start whenever you are ready." },
      { at: "00:09:50", src: "System", text: "Can the invoice go to our finance address instead of mine?" },
    ],
  },
  {
    title: "Call with Tomas",
    lines: [
      { at: "00:33:18", src: "Microphone", text: "Anything else before we wrap up?" },
      { at: "00:33:24", src: "System", text: "Only the invoice. Is it in euros, or in dollars?" },
    ],
  },
] as const;

const ROW = 56;
const TYPE_MS = 90;
const T_FILTER = 400 + word.length * TYPE_MS + 250;
const T_OPEN = T_FILTER + 600; // the filter has finished closing the rows
const HOLD = 1500; // each call stays open this long before the next

/**
 * Customer calls: search the word a customer used, then read the calls it comes
 * up in, one after another, to see how each customer put the same question. The
 * word is typed, the list narrows to the three calls, and the right pane steps
 * through their transcripts. Plays once, 40% in view; under reduced motion the
 * last call is shown at once. The three transcripts share one grid cell and the
 * list keeps its height, so nothing shifts.
 */
export function CustomerDemo() {
  const { ref, inView } = usePlayOnce();
  const slow = useMotionTransition(transition);
  const tBase = useMotionTransition(transitionBase);
  const [typed, setTyped] = useState(0);
  const [filtered, setFiltered] = useState(false);
  const [current, setCurrent] = useState(-1); // which match is open

  useEffect(() => {
    if (!inView) return;
    if (prefersReducedMotion()) {
      setTyped(word.length);
      setFiltered(true);
      setCurrent(opened.length - 1);
      return;
    }
    const timers: ReturnType<typeof setTimeout>[] = [];
    for (let i = 1; i <= word.length; i++) timers.push(setTimeout(() => setTyped(i), 400 + (i - 1) * TYPE_MS));
    timers.push(setTimeout(() => setFiltered(true), T_FILTER));
    opened.forEach((_, i) => timers.push(setTimeout(() => setCurrent(i), T_OPEN + i * HOLD)));
    return () => timers.forEach(clearTimeout);
  }, [inView]);

  return (
    <MockWindow
      ref={ref}
      title="Trilsy"
      role="img"
      aria-label={`The recording list filtered by the search word ${word}. Three customer calls match, with Dana, Lena and Tomas. Their transcripts are opened one after another, and in each the customer asks about the invoice in a different way.`}
    >
      <div aria-hidden className="grid md:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
        <div className="flex flex-col gap-3 border-b border-border px-4 py-4 md:border-r md:border-b-0">
          <div className="flex items-center gap-2 rounded-md border border-border bg-card px-2.5 py-1.5">
            <HugeiconsIcon icon={Search01Icon} strokeWidth={2} className="size-3.5 shrink-0 text-muted-foreground" />
            <span className={cn("min-h-[1lh]", typed === 0 && "text-muted-foreground")}>
              {typed === 0 ? "Search your recordings" : word.slice(0, typed)}
            </span>
          </div>
          <ul className="flex h-[224px] flex-col overflow-hidden md:h-[280px]">
            {calls.map((c) => {
              const gone = filtered && c.match < 0;
              const selected = c.match >= 0 && c.match === current;
              return (
                <m.li
                  key={c.title}
                  initial={false}
                  animate={{ height: gone ? 0 : ROW, opacity: gone ? 0 : 1 }}
                  transition={tBase}
                  className={cn("shrink-0 overflow-hidden", "wide" in c && "max-md:hidden")}
                >
                  <div
                    className={cn(
                      "flex h-14 flex-col justify-center rounded-md px-2.5 transition-colors duration-(--duration-base) ease-trilsy",
                      selected && "bg-field",
                    )}
                  >
                    <p className="truncate font-semibold">{c.title}</p>
                    <p className="text-xs text-muted-foreground">{c.date}</p>
                  </div>
                </m.li>
              );
            })}
          </ul>
        </div>
        <div className="grid px-4 py-4">
          {opened.map((o, i) => (
            <m.div
              key={o.title}
              initial={false}
              animate={{ opacity: current === i ? 1 : 0, y: current === i ? 0 : 6 }}
              transition={slow}
              className="col-start-1 row-start-1 flex flex-col gap-4"
            >
              <p className="font-display text-lg leading-tight font-semibold">{o.title}</p>
              <ViewControl active="Transcript" />
              <ul className="-mx-2.5 flex flex-col">
                {o.lines.map((l) => (
                  <TranscriptLine key={l.at} {...l} active={l.src === "System"} />
                ))}
              </ul>
            </m.div>
          ))}
        </div>
      </div>
    </MockWindow>
  );
}
