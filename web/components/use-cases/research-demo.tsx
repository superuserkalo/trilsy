"use client";

import { useEffect, useState } from "react";
import { m } from "motion/react";
import { MockWindow, ViewControl } from "@/components/how-it-works/mock";
import { transitionBase, useMotionTransition } from "@/lib/motion";
import { cn } from "@/lib/utils";
import { AppBody, AudioPlayer, NotesDoc, RecordingHeader, RecordingMenu, SidebarRow } from "./app-chrome";
import { prefersReducedMotion, usePlayOnce } from "./use-play-once";

// Illustration content: a study of where students work. Interviews are listed
// newest first, as the app lists them. Delete recording is in the "…" menu; it
// removes the recording's folder (audio, transcript and notes) after one
// confirmation, and the app then selects the first recording that is left.
const recordings = [
  { title: "Participant 7", date: "14 Oct, 11:00", length: "47 min" },
  { title: "Participant 6", date: "12 Oct, 15:30", length: "52 min" },
  { title: "Participant 5", date: "11 Oct, 09:15", length: "41 min" },
  { title: "Participant 4", date: "9 Oct, 14:00", length: "38 min", wide: true },
] as const;

const notes = [
  [
    {
      h: "Overview",
      p: "Studies in the library on weekdays and at home at weekends, and picks each place for its noise, not its distance. Says a quiet room matters more than a good desk.",
    },
    { h: "Choosing a place", p: "Walks past the nearer library because the reading room there is loud after lunch." },
  ],
  [
    {
      h: "Overview",
      p: "Works at the kitchen table in the morning and moves to a café when the flat gets busy. Treats the move as the signal to start the hard reading.",
    },
    { h: "What gets in the way", p: "Housemates, and the café’s music once the lunch crowd arrives." },
  ],
] as const;

const ROW = 32;
const T_MENU = 800; // the "…" menu opens
const T_PICK = 1400; // "Delete recording" is under the pointer
const T_DIALOG = 2000; // the menu closes, the confirmation opens
const T_CONFIRM = 3500; // "Delete recording" is pressed in the confirmation
const T_GONE = 3950; // the sheet closes, the row collapses, the next recording opens

/**
 * Research interviews: the audio is on the Mac, and the Mac's owner decides what
 * happens to it. A participant's interview is open; the "…" menu is opened and
 * Delete recording chosen, the app asks once ("Permanently delete this recording,
 * audio, and notes?"), the interview leaves the list and the next one opens. Plays
 * once, 40% in view; the state after the delete at once under reduced motion. Both
 * interviews are laid out in one grid cell, the list keeps the height of its rows,
 * and the menu and the sheet sit over the window, so nothing shifts.
 */
export function ResearchDemo() {
  const { ref, inView } = usePlayOnce();
  const tBase = useMotionTransition(transitionBase);
  const [menu, setMenu] = useState(false);
  const [picked, setPicked] = useState(false);
  const [asking, setAsking] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [gone, setGone] = useState(false);

  useEffect(() => {
    if (!inView) return;
    if (prefersReducedMotion()) {
      setGone(true);
      return;
    }
    const timers = [
      setTimeout(() => setMenu(true), T_MENU),
      setTimeout(() => setPicked(true), T_PICK),
      setTimeout(() => {
        setMenu(false);
        setPicked(false);
        setAsking(true);
      }, T_DIALOG),
      setTimeout(() => setConfirmed(true), T_CONFIRM),
      setTimeout(() => {
        setAsking(false);
        setGone(true);
      }, T_GONE),
    ];
    return () => timers.forEach(clearTimeout);
  }, [inView]);

  return (
    <MockWindow
      ref={ref}
      title="Trilsy"
      role="img"
      aria-label="A list of four interview recordings with the first one open. In its menu, Delete recording is chosen and the app asks: Permanently delete this recording, audio, and notes? The recording is deleted, it leaves the list, and the next interview opens."
      className="relative"
    >
      <div aria-hidden>
        <AppBody
          allSelected={false}
          collapse={false}
          list={recordings.map((r, i) => (
            <m.li
              key={r.title}
              initial={false}
              animate={{ height: i === 0 && gone ? 0 : ROW, opacity: i === 0 && gone ? 0 : 1 }}
              transition={tBase}
              className={cn("shrink-0 overflow-hidden", "wide" in r && "max-sm:hidden")}
            >
              <SidebarRow title={r.title} selected={(i === 0 && !gone) || (i === 1 && gone)} />
            </m.li>
          ))}
          listClassName="h-32 overflow-hidden sm:h-32"
        >
          <div className="grid">
            {[0, 1].map((n) => {
              const r = recordings[n];
              const visible = n === 0 ? !gone : gone;
              return (
                <div
                  key={r.title}
                  className={cn(
                    "col-start-1 row-start-1 flex flex-col gap-4 px-4 py-4 transition-opacity duration-(--duration-base) ease-trilsy",
                    !visible && "opacity-0",
                  )}
                >
                  <RecordingHeader title={r.title} date={r.date} length={r.length} status="Ready" />
                  <AudioPlayer position={0} duration={2832} />
                  <ViewControl
                    active="Notes"
                    menu={<RecordingMenu open={n === 0 && menu} highlight={n === 0 && picked ? "delete" : undefined} />}
                  />
                  <NotesDoc sections={notes[n]} />
                </div>
              );
            })}
          </div>
        </AppBody>
      </div>

      {/* The confirmation, over the window. The app's own words. */}
      <div
        aria-hidden
        className={cn(
          "absolute inset-x-0 top-24 flex justify-center px-4 transition-opacity duration-(--duration-base) ease-trilsy",
          asking ? "opacity-100" : "pointer-events-none opacity-0",
        )}
      >
        <div className="w-full max-w-72 rounded-xl border-2 border-ink bg-card p-4 shadow-[4px_5px_0_var(--ink)]">
          <p className="font-semibold">Permanently delete this recording, audio, and notes?</p>
          <div className="mt-4 flex justify-end gap-2 text-xs font-semibold">
            <span className="rounded-md border border-border px-3 py-1.5">Cancel</span>
            <span
              className={cn(
                "rounded-md border px-3 py-1.5 transition-colors duration-(--duration-base) ease-trilsy",
                confirmed ? "border-ink bg-destructive text-destructive-foreground" : "border-destructive text-destructive",
              )}
            >
              Delete recording
            </span>
          </div>
        </div>
      </div>
    </MockWindow>
  );
}
