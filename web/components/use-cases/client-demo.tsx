"use client";

import { useEffect, useState } from "react";
import { m } from "motion/react";
import { HugeiconsIcon } from "@hugeicons/react";
import { RecordIcon, StopIcon } from "@hugeicons/core-free-icons";
import { MockWindow, ViewControl } from "@/components/how-it-works/mock";
import { transition, transitionBase, useMotionTransition } from "@/lib/motion";
import { cn } from "@/lib/utils";
import { prefersReducedMotion, usePlayOnce } from "./use-play-once";

// Illustration content: the last client meeting, open before the next one starts.
const meetings = [
  { title: "Client review", date: "8 Oct 2026" },
  { title: "Kickoff with the client", date: "24 Sep 2026" },
  { title: "Intro call", date: "12 Sep 2026" },
] as const;

const notes = [
  {
    h: "Overview",
    p: "The client approved the three-page structure and asked for the pricing page to come first. The first draft is due on 24 October.",
  },
  { h: "Scope", p: "Three pages: home, pricing and contact. A blog is left for later." },
  { h: "Timing", p: "First draft on 24 October. Feedback within three working days." },
  { h: "Open questions", p: "Who supplies the photographs? The client will ask their team." },
] as const;

const ROW = 56;
const T_RECORD = 2800; // the notes have been on screen long enough to read
const clock = (s: number) => `00:00:0${s}`;

/**
 * Client meetings: before the next call, open the last meeting's notes and read
 * what was agreed, then press Record. The last meeting's notes are open; after a
 * beat Record is pressed, a new recording starts at the top of the list and the
 * pane turns to it. Plays once, 40% in view. Under reduced motion the notes stay
 * open with Record ready, which is the half that matters. The list keeps its
 * height and the two panes share one grid cell, so nothing shifts.
 */
export function ClientDemo() {
  const { ref, inView } = usePlayOnce();
  const slow = useMotionTransition(transition);
  const tBase = useMotionTransition(transitionBase);
  const [recording, setRecording] = useState(false);
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    if (!inView || prefersReducedMotion()) return;
    const timers = [
      setTimeout(() => {
        setRecording(true);
        setSeconds(1);
      }, T_RECORD),
      setTimeout(() => setSeconds(2), T_RECORD + 1000),
      setTimeout(() => setSeconds(3), T_RECORD + 2000),
    ];
    return () => timers.forEach(clearTimeout);
  }, [inView]);

  return (
    <MockWindow
      ref={ref}
      title="Trilsy"
      role="img"
      aria-label="The notes of the last client meeting, Client review, are open: an overview, then scope, timing and open questions. Below, the Record button is pressed and a new recording starts at the top of the list."
    >
      <div aria-hidden>
        <div className="grid md:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
          <div className="border-b border-border px-4 py-4 md:border-r md:border-b-0">
            <ul className="flex h-[224px] flex-col overflow-hidden">
            <m.li
              initial={false}
              animate={{ height: recording ? ROW : 0, opacity: recording ? 1 : 0 }}
              transition={tBase}
              className="shrink-0 overflow-hidden"
            >
              <div className="flex h-14 flex-col justify-center rounded-md bg-field px-2.5">
                <p className="truncate font-semibold">New recording</p>
                <p className="text-xs text-muted-foreground">15 Oct 2026</p>
              </div>
            </m.li>
            {meetings.map((r, i) => (
              <li key={r.title} className="shrink-0">
                <div
                  className={cn(
                    "flex h-14 flex-col justify-center rounded-md px-2.5 transition-colors duration-(--duration-base) ease-trilsy",
                    i === 0 && !recording && "bg-field",
                  )}
                >
                  <p className="truncate font-semibold">{r.title}</p>
                  <p className="text-xs text-muted-foreground">{r.date}</p>
                </div>
              </li>
            ))}
            </ul>
          </div>
          <div className="grid px-4 py-4">
            <m.div
              initial={false}
              animate={{ opacity: recording ? 0 : 1 }}
              transition={slow}
              className="col-start-1 row-start-1 flex flex-col gap-4"
            >
              <p className="font-display text-lg leading-tight font-semibold">Client review</p>
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
            <m.div
              initial={false}
              animate={{ opacity: recording ? 1 : 0 }}
              transition={slow}
              className="col-start-1 row-start-1 flex flex-col gap-2"
            >
              <p className="font-display text-lg leading-tight font-semibold">New recording</p>
              <p className="text-muted-foreground">Recording. Stop when the meeting ends.</p>
            </m.div>
          </div>
        </div>
        <div className="flex items-center justify-between gap-3 border-t border-border bg-muted/40 px-4 py-3">
          <span className="flex items-center gap-2 text-xs font-semibold text-muted-foreground">
            <i
              className={cn(
                "size-2 rounded-full bg-recording transition-opacity duration-(--duration-base) ease-trilsy",
                recording ? "opacity-100" : "opacity-0",
              )}
            />
            <span className="font-mono">{recording ? clock(seconds) : "00:00:00"}</span>
          </span>
          <span
            className={cn(
              "inline-flex items-center gap-1.5 rounded-md border border-border bg-card px-3 py-1 text-xs font-semibold transition-colors duration-(--duration-base) ease-trilsy",
              recording && "border-ink bg-primary text-primary-foreground",
            )}
          >
            <HugeiconsIcon
              icon={recording ? StopIcon : RecordIcon}
              strokeWidth={2}
              className={cn("size-3.5", !recording && "text-recording")}
            />
            <span className="grid">
              <span className={cn("col-start-1 row-start-1", recording && "invisible")}>Record</span>
              <span className={cn("col-start-1 row-start-1", !recording && "invisible")}>Stop &amp; save</span>
            </span>
          </span>
        </div>
      </div>
    </MockWindow>
  );
}
