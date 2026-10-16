"use client";

import { useEffect, useState } from "react";
import { MockWindow, ViewControl } from "@/components/how-it-works/mock";
import { cn } from "@/lib/utils";
import { prefersReducedMotion, usePlayOnce } from "./use-play-once";

const wrong = "Pryia"; // the same length as the right spelling, so the line does not rewrap
const right = "Priya";

/**
 * Team meetings: the notes are plain text, editable like any note. The model has
 * written one name wrong; the word is selected and replaced, and the caret stays
 * where the edit ended. Plays once, 40% in view; the corrected notes, with no
 * caret, at once under reduced motion. The wrong spelling is the same length as the
 * right one, so the paragraph does not rewrap.
 */
export function TeamDemo() {
  const { ref, inView } = usePlayOnce();
  const [step, setStep] = useState(0); // 0 as written, 1 word selected, 2 corrected, caret in place
  const [still, setStill] = useState(false);

  useEffect(() => {
    if (!inView) return;
    if (prefersReducedMotion()) {
      setStill(true);
      setStep(2);
      return;
    }
    const timers = [setTimeout(() => setStep(1), 1000), setTimeout(() => setStep(2), 1900)];
    return () => timers.forEach(clearTimeout);
  }, [inView]);

  return (
    <MockWindow
      ref={ref}
      title="Weekly team meeting, 14 Oct"
      role="img"
      aria-label="Notes in plain Markdown, an overview and two sections. One name the notes model spelled wrong is selected and corrected by typing over it."
    >
      <div aria-hidden className="flex flex-col gap-4 px-4 py-4">
        <ViewControl active="Notes" />
        <div className="flex flex-col gap-4 text-[13px] leading-[1.55]">
          <div>
            <p className="font-semibold">## Overview</p>
            <p>
              The team agreed to launch on 3 November.{" "}
              <span className="relative whitespace-nowrap">
                <span className={cn("rounded-sm", step === 1 && "bg-primary/45")}>{step === 2 ? right : wrong}</span>
                {step === 2 && !still && (
                  <span className="absolute top-[0.2em] -right-px h-[1.1em] w-px animate-blink bg-foreground" />
                )}
              </span>{" "}
              will send the revised launch plan by Thursday, and hiring for a second designer waits until the launch is
              out.
            </p>
          </div>
          <div>
            <p className="font-semibold">## Launch date</p>
            <p>
              Moving from 27 October to 3 November gives QA a full week. Support asked to see the help articles first.
            </p>
          </div>
          <div>
            <p className="font-semibold">## Hiring</p>
            <p>One open role, a second designer. The decision is to wait until the launch is out.</p>
          </div>
        </div>
      </div>
    </MockWindow>
  );
}
