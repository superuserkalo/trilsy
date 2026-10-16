"use client";

import { useEffect, useState } from "react";
import { m } from "motion/react";
import { MockWindow, ViewControl } from "@/components/how-it-works/mock";
import { transition, transitionBase, useMotionTransition } from "@/lib/motion";
import { cn } from "@/lib/utils";
import { AppBody, AudioSourcesButton, RecordingHeader, SidebarRow } from "./app-chrome";
import { TranscriptLine } from "./transcript-line";
import { usePlayOnce } from "./use-play-once";

// Illustration content. The app's search keeps a recording when the word is in
// its title, transcript or notes and the sidebar lists the matches ("Matches"
// instead of "Recent"); it does not mark the word inside a recording. The word is
// in the three matches' transcripts.
const word = "invoice";

const calls = [
  { title: "Call with Priya", match: -1 },
  { title: "Call with Dana", match: 0, date: "8 Oct, 11:00", length: "34 min" },
  { title: "Call with Marcus", match: -1, wide: true },
  { title: "Call with Lena", match: 1, date: "30 Sep, 15:30", length: "18 min" },
  { title: "Call with Tomas", match: 2, date: "22 Sep, 09:00", length: "41 min" },
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

const ROW = 32;
const TYPE_MS = 90;
const T_FILTER = 400 + word.length * TYPE_MS + 250;
const T_OPEN = T_FILTER + 600; // the filter has finished closing the rows
const HOLD = 1500; // each call stays open this long before the next

/**
 * Customer calls: search the word a customer used, then read the calls it comes
 * up in, one after another, to see how each customer put the same question. The
 * word is typed, the list narrows to the three calls, and the right pane steps
 * through their transcripts. Plays once, 40% in view; under reduced motion with
 * fades only. The three transcripts share one grid cell and the
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
      toolbar={<AudioSourcesButton />}
    >
      <div aria-hidden>
        <AppBody
          search={typed === 0 ? undefined : word.slice(0, typed)}
          label={typed === 0 ? "Recent" : "Matches"}
          allSelected={current < 0}
          collapse={false}
          list={calls.map((c) => {
            const gone = filtered && c.match < 0;
            return (
              <m.li
                key={c.title}
                initial={false}
                animate={{ height: gone ? 0 : ROW, opacity: gone ? 0 : 1 }}
                transition={tBase}
                className={cn("shrink-0 overflow-hidden", "wide" in c && "max-sm:hidden")}
              >
                <SidebarRow title={c.title} selected={c.match >= 0 && c.match === current} />
              </m.li>
            );
          })}
          listClassName="h-24 overflow-hidden sm:h-40"
        >
          <div className="grid px-4 py-4">
            {opened.map((o, i) => {
              const call = calls.find((c) => c.title === o.title)!;
              return (
                <m.div
                  key={o.title}
                  initial={false}
                  animate={{ opacity: current === i ? 1 : 0, y: current === i ? 0 : 6 }}
                  transition={slow}
                  className="col-start-1 row-start-1 flex flex-col gap-4"
                >
                  <RecordingHeader title={o.title} date={"date" in call ? call.date : ""} length={"length" in call ? call.length : ""} status="Ready" />
                  <ViewControl active="Transcript" />
                  <ul className="-mx-2.5 flex flex-col">
                    {o.lines.map((l) => (
                      <TranscriptLine key={l.at} {...l} active={l.src === "System"} />
                    ))}
                  </ul>
                </m.div>
              );
            })}
          </div>
        </AppBody>
      </div>
    </MockWindow>
  );
}
