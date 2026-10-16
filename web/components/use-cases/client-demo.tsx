"use client";

import { useEffect, useState } from "react";
import { m } from "motion/react";
import { MockWindow, ViewControl } from "@/components/how-it-works/mock";
import { transition, transitionBase, useMotionTransition } from "@/lib/motion";
import { cn } from "@/lib/utils";
import {
  AppBody,
  AudioSourcesButton,
  EmptyDocument,
  NotesDoc,
  RecordingHeader,
  RecordingMenu,
  RecordingToolbar,
  SidebarRow,
} from "./app-chrome";
import { usePlayOnce } from "./use-play-once";

// Illustration content: the last client meeting, open before the next one starts.
// A new recording is titled "Recording" and the date and time (it follows the
// Mac's language and region), and its pane reads "Recording in progress".
const meetings = ["Client review", "Kickoff with the client", "Intro call"] as const;
const NEW_TITLE = "Recording 15 Oct 2026, 10:02";

const notes = [
  {
    h: "Overview",
    p: "The client approved the three-page structure and asked for the pricing page to come first. The first draft is due on 24 October.",
  },
  { h: "Scope", p: "Three pages: home, pricing and contact. A blog is left for later." },
  { h: "Timing", p: "First draft on 24 October. Feedback within three working days." },
  { h: "Open questions", p: "Who supplies the photographs? The client will ask their team." },
] as const;

const ROW = 32;
const T_RECORD = 2800; // the notes have been on screen long enough to read
const clock = (s: number) => `00:00:0${s}`;

/**
 * Client meetings: before the next call, open the last meeting's notes and read
 * what was agreed, then press New recording. The last meeting's notes are open;
 * after a beat New recording is pressed, a new recording starts at the top of the
 * list, the toolbar becomes the recording row and the pane turns to it. Plays
 * once, 40% in view; under reduced motion with fades only. The list keeps its height and the two
 * panes share one grid cell, so nothing shifts.
 */
export function ClientDemo() {
  const { ref, inView } = usePlayOnce();
  const slow = useMotionTransition(transition);
  const tBase = useMotionTransition(transitionBase);
  const [recording, setRecording] = useState(false);
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    if (!inView) return;
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
      aria-label="The notes of the last client meeting, Client review, are open: an overview, then scope, timing and open questions. New recording is pressed and a new recording starts at the top of the list, with the toolbar showing the time and Stop and save."
      toolbar={recording ? <RecordingToolbar time={clock(seconds)} /> : <AudioSourcesButton />}
    >
      <div aria-hidden>
        <AppBody
          pressed={recording && seconds === 1}
          disabled={recording}
          allSelected={false}
          collapse={false}
          list={
            <>
              <m.li
                initial={false}
                animate={{ height: recording ? ROW : 0, opacity: recording ? 1 : 0 }}
                transition={tBase}
                className="shrink-0 overflow-hidden"
              >
                <SidebarRow title={NEW_TITLE} ready={false} selected />
              </m.li>
              {meetings.map((title, i) => (
                <li key={title} className="shrink-0">
                  <SidebarRow title={title} selected={i === 0 && !recording} />
                </li>
              ))}
            </>
          }
          listClassName="h-32 overflow-hidden"
        >
          <div className="grid px-4 py-4">
            <m.div
              initial={false}
              animate={{ opacity: recording ? 0 : 1 }}
              transition={slow}
              className="col-start-1 row-start-1 flex flex-col gap-4"
            >
              <RecordingHeader title="Client review" date="8 Oct, 14:00" length="38 min" status="Ready" />
              <ViewControl active="Notes" />
              <NotesDoc sections={notes} />
            </m.div>
            <m.div
              initial={false}
              animate={{ opacity: recording ? 1 : 0 }}
              transition={slow}
              className={cn("col-start-1 row-start-1 flex flex-col gap-4")}
            >
              <RecordingHeader title={NEW_TITLE} date="15 Oct, 10:02" length="0 sec" status="Recording" />
              <ViewControl active="Notes" edit={null} menu={<RecordingMenu rewrite={false} />} />
              <EmptyDocument recording />
            </m.div>
          </div>
        </AppBody>
      </div>
    </MockWindow>
  );
}
