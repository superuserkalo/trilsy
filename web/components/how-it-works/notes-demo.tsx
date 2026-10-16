"use client";

import { useEffect, useRef, useState } from "react";
import { m, useInView } from "motion/react";
import { transition, useMotionTransition } from "@/lib/motion";
import { NoteBlock, ProcessingBar } from "@/components/use-cases/app-chrome";
import { MockWindow, ViewControl } from "./mock";

// A long recording, so the notes are written in three parts. The app writes one
// part for each stretch of transcript, then an overview of all of them, which it
// puts on top. The notes are rendered (the Edit button opens the Markdown). A
// timestamp inside the notes is text, not a link.
const sections = [
  { h: "Onboarding screens", p: "Screen two loses people at the permissions step. [00:00:19]" },
  { h: "Permissions", p: "Ask for them after the first recording, not before it." },
  { h: "Next steps", p: "Design sends a revised flow to the team." },
] as const;
const overview = {
  h: "Overview",
  p: "The onboarding drop-off is at the permissions step. The team will move it to after the first recording.",
};

const STEP_MS = 900;
// The app's progress line counts the parts and has no step of its own for the
// overview, so it still reads "3 of 3" while the overview is written.
const status = [
  "",
  "Writing detailed notes 1 of 3…",
  "Writing detailed notes 2 of 3…",
  "Writing detailed notes 3 of 3…",
  "Writing detailed notes 3 of 3…",
  "",
];

/**
 * Block 4: the order the notes are made in. The parts appear one after another
 * (the bar under the notes counts them), then the overview is written into the
 * space kept for it above them. It plays once, when the window comes into view;
 * under reduced motion with fades only. The space for every
 * part is laid out from the start, so nothing shifts.
 */
export function NotesDemo() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.7 });
  const slow = useMotionTransition(transition);
  const [step, setStep] = useState(0); // 0 nothing, 1 to 3 the parts, 4 overview, 5 done

  useEffect(() => {
    if (!inView) return;
    const timers = [1, 2, 3, 4, 5].map((s) => setTimeout(() => setStep(s), (s - 1) * STEP_MS + 300));
    return () => timers.forEach(clearTimeout);
  }, [inView]);

  const show = (visible: boolean) => ({ opacity: visible ? 1 : 0, y: visible ? 0 : 6 });

  return (
    <MockWindow
      ref={ref}
      title="Design review"
      role="img"
      aria-label="Notes as the app shows them, with headings. The detailed notes are written one part after another, and an overview is written last and placed above them."
    >
      <div aria-hidden>
        <div className="flex flex-col gap-4 px-4 py-4">
          <ViewControl active="Notes" />
          <div className="flex flex-col gap-4 text-[13px] leading-[1.55]">
            <m.div initial={show(false)} animate={show(step >= 4)} transition={slow}>
              <NoteBlock {...overview} />
            </m.div>
            {sections.map((s, i) => (
              <m.div key={s.h} initial={show(false)} animate={show(step > i)} transition={slow} className="flex flex-col gap-4">
                {i > 0 && <hr className="border-border" />}
                <NoteBlock {...s} />
              </m.div>
            ))}
          </div>
        </div>
        <ProcessingBar text={status[step]} />
      </div>
    </MockWindow>
  );
}
