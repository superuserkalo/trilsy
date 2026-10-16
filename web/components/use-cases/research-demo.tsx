"use client";

import { useEffect, useState } from "react";
import { m } from "motion/react";
import { HugeiconsIcon } from "@hugeicons/react";
import { Delete02Icon, PlayIcon } from "@hugeicons/core-free-icons";
import { MockWindow, ViewControl } from "@/components/how-it-works/mock";
import { transitionBase, useMotionTransition } from "@/lib/motion";
import { cn } from "@/lib/utils";
import { MenuButton } from "./app-controls";
import { prefersReducedMotion, usePlayOnce } from "./use-play-once";

// Illustration content: a study of where students work. Interviews are listed
// newest first, as the app lists them. Delete removes the recording's folder
// (audio, transcript and notes) after one confirmation, and the app then selects
// the first recording that is left.
const recordings = [
  { title: "Participant 7", date: "14 Oct 2026", length: "00:47:12" },
  { title: "Participant 6", date: "12 Oct 2026", length: "00:52:40" },
  { title: "Participant 5", date: "11 Oct 2026", length: "00:41:03" },
  { title: "Participant 4", date: "9 Oct 2026", length: "00:38:25", wide: true },
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

const ROW = 56;
const T_PRESS = 900; // the trash button is pressed
const T_DIALOG = 1300; // the confirmation opens
const T_CONFIRM = 2800; // "Delete recording" is pressed
const T_GONE = 3250; // the sheet closes, the row collapses, the next recording opens

/**
 * Research interviews: the audio is on the Mac, and the Mac's owner decides what
 * happens to it. A participant's interview is open; Delete is pressed, the app
 * asks once ("Permanently delete this recording, audio, and notes?"), the
 * interview leaves the list and the next one opens. Plays once, 40% in view; the
 * state after the delete at once under reduced motion. Both interviews are laid
 * out in one grid cell, the list keeps the height of its rows, and the sheet sits
 * over the window, so nothing shifts.
 */
export function ResearchDemo() {
  const { ref, inView } = usePlayOnce();
  const tBase = useMotionTransition(transitionBase);
  const [pressed, setPressed] = useState(false);
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
      setTimeout(() => setPressed(true), T_PRESS),
      setTimeout(() => setAsking(true), T_DIALOG),
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
      aria-label="A list of four interview recordings with the first one open. Its delete button is pressed and the app asks: Permanently delete this recording, audio, and notes? The recording is deleted, it leaves the list, and the next interview opens."
      className="relative"
    >
      <div aria-hidden className="grid md:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
        <ul className="flex h-[200px] flex-col overflow-hidden border-b border-border px-4 py-4 md:h-auto md:min-h-[300px] md:border-r md:border-b-0">
          {recordings.map((r, i) => (
            <m.li
              key={r.title}
              initial={false}
              animate={{ height: i === 0 && gone ? 0 : ROW, opacity: i === 0 && gone ? 0 : 1 }}
              transition={tBase}
              className={cn("shrink-0 overflow-hidden", "wide" in r && "max-md:hidden")}
            >
              <div
                className={cn(
                  "flex h-14 flex-col justify-center rounded-md px-2.5 transition-colors duration-(--duration-base) ease-trilsy",
                  (i === 0 && !gone) || (i === 1 && gone) ? "bg-field" : "",
                )}
              >
                <p className="truncate font-semibold">{r.title}</p>
                <p className="text-xs text-muted-foreground">{r.date}</p>
              </div>
            </m.li>
          ))}
        </ul>

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
                <div>
                  <p className="font-display text-lg leading-tight font-semibold">{r.title}</p>
                  <div className="mt-1 flex flex-wrap items-center justify-between gap-x-3 gap-y-2">
                    <p className="text-xs whitespace-nowrap text-muted-foreground">{r.length} · Recorded</p>
                    <span className="flex items-center gap-2">
                      <span className="inline-flex items-center gap-1.5 rounded-md border border-border px-2.5 py-1 text-xs font-semibold">
                        <HugeiconsIcon icon={PlayIcon} strokeWidth={2} className="size-3.5" />
                        Play
                      </span>
                      <MenuButton label="Export" />
                      <span
                        className={cn(
                          "inline-flex size-7 items-center justify-center rounded-md border border-border transition-colors duration-(--duration-base) ease-trilsy",
                          n === 0 && pressed && "border-ink bg-primary text-primary-foreground",
                        )}
                      >
                        <HugeiconsIcon icon={Delete02Icon} strokeWidth={2} className="size-3.5" />
                      </span>
                    </span>
                  </div>
                </div>
                <ViewControl active="Notes" />
                <div className="flex flex-col gap-3.5 text-[13px] leading-[1.55]">
                  {notes[n].map((s) => (
                    <div key={s.h}>
                      <p className="font-semibold">## {s.h}</p>
                      <p>{s.p}</p>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* The confirmation, over the window. The app's own words. */}
      <div
        aria-hidden
        className={cn(
          "absolute inset-x-0 top-12 flex justify-center px-4 transition-opacity duration-(--duration-base) ease-trilsy",
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
