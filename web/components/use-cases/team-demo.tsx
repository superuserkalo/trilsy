"use client";

import { useEffect, useState } from "react";
import { MockWindow, ViewControl } from "@/components/how-it-works/mock";
import { cn } from "@/lib/utils";
import { AudioPlayer, NoteBlock, RecordingHeader } from "./app-chrome";
import { prefersReducedMotion, usePlayOnce } from "./use-play-once";

const wrong = "Pryia"; // the same length as the right spelling, so the line does not rewrap
const right = "Priya";

const overview = (name: React.ReactNode) => (
  <>
    The team agreed to launch on 3 November. {name} will send the revised launch plan by Thursday, and hiring for a second
    designer waits until the launch is out.
  </>
);
const launch = "Moving from 27 October to 3 November gives QA a full week. Support asked to see the help articles first.";
const hiring = "One open role, a second designer. The decision is to wait until the launch is out.";

/**
 * Team meetings: the notes are rendered, and Edit opens them as Markdown to fix.
 * The model has written one name wrong. Edit is pressed and the notes turn into
 * the editor, showing the "##" headings; the word is selected and replaced, the
 * caret stays where the edit ended; Done is pressed and the corrected notes are
 * rendered again. Plays once, 40% in view; the corrected rendered notes, with no
 * caret, at once under reduced motion. The reading view and the editor share one
 * cell, and the wrong spelling is the same length as the right one, so nothing
 * shifts or rewraps.
 */
export function TeamDemo() {
  const { ref, inView } = usePlayOnce();
  // 0 as written, 1 Edit pressed, 2 the editor open, 3 word selected, 4 corrected with the caret, 5 Done pressed, 6 rendered again
  const [step, setStep] = useState(0);
  const [still, setStill] = useState(false);

  useEffect(() => {
    if (!inView) return;
    if (prefersReducedMotion()) {
      setStill(true);
      setStep(6);
      return;
    }
    const timers = [
      setTimeout(() => setStep(1), 900),
      setTimeout(() => setStep(2), 1300),
      setTimeout(() => setStep(3), 2100),
      setTimeout(() => setStep(4), 3000),
      setTimeout(() => setStep(5), 4600),
      setTimeout(() => setStep(6), 5000),
    ];
    return () => timers.forEach(clearTimeout);
  }, [inView]);

  const editing = step >= 2 && step <= 5;
  const layer = "col-start-1 row-start-1 transition-opacity duration-(--duration-base) ease-trilsy";
  const name = step >= 4 ? right : wrong;

  return (
    <MockWindow
      ref={ref}
      title="Weekly team meeting, 14 Oct"
      role="img"
      aria-label="Notes with headings: an overview and two sections. Edit is pressed and the notes open as Markdown. One name the notes model spelled wrong is selected and corrected by typing over it, then Done is pressed and the notes are shown again with the name right."
    >
      <div aria-hidden className="flex flex-col gap-4 px-4 py-4">
        <RecordingHeader title="Weekly team meeting, 14 Oct" date="14 Oct, 10:00" length="27 min" status="Ready" />
        <AudioPlayer position={0} duration={1620} />
        <ViewControl active="Notes" edit={editing ? "Done" : "Edit"} editPressed={step === 1 || step === 5} />
        <div className="grid text-[13px] leading-[1.55]">
          <div className={cn(layer, "flex flex-col gap-3.5", editing && "opacity-0")}>
            <NoteBlock h="Overview" p={overview(name)} />
            <NoteBlock h="Launch date" p={launch} />
            <NoteBlock h="Hiring" p={hiring} />
          </div>
          <div className={cn(layer, "whitespace-pre-wrap", !editing && "opacity-0")}>
            {"## Overview\n\n"}
            {overview(
              <span className="relative whitespace-nowrap">
                <span className={cn("rounded-sm", step === 3 && "bg-primary/45")}>{name}</span>
                {step === 4 && !still && (
                  <span className="absolute top-[0.2em] -right-px h-[1.1em] w-px animate-blink bg-foreground" />
                )}
              </span>,
            )}
            {`\n\n## Launch date\n\n${launch}\n\n## Hiring\n\n${hiring}`}
          </div>
        </div>
      </div>
    </MockWindow>
  );
}
