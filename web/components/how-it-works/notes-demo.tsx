"use client";

import { useEffect, useRef, useState } from "react";
import { m, useInView } from "motion/react";
import { transition, useMotionTransition } from "@/lib/motion";
import { MockWindow, ViewControl } from "./mock";

// The notes are plain Markdown text, so the "##" stays. The sections are written
// first, one after another, and the overview is written last and sits on top.
const sections = [
  { h: "Onboarding screens", p: "Screen two loses people at the permissions step. [00:00:19]" },
  { h: "Permissions", p: "Ask for them after the first recording, not before it." },
  { h: "Next steps", p: "Design sends a revised flow to the team." },
] as const;
const overview = "The onboarding drop-off is at the permissions step. The team will move it to after the first recording.";

const STEP_MS = 900;
const status = ["", "Writing notes: section 1 of 3", "Writing notes: section 2 of 3", "Writing notes: section 3 of 3", "Writing the overview", ""];

/**
 * Block 4: the order the notes are made in. Sections appear one after another
 * (the status line counts them), then the overview is written into the space
 * kept for it above them. It plays once, when the window comes into view; under
 * reduced motion the finished notes are shown at once. The space for every part
 * is laid out from the start, so nothing shifts.
 */
export function NotesDemo() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.7 });
  const slow = useMotionTransition(transition);
  const [step, setStep] = useState(0); // 0 nothing, 1 to 3 sections, 4 overview, 5 done

  useEffect(() => {
    if (!inView) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setStep(5);
      return;
    }
    const timers = [1, 2, 3, 4, 5].map((s) => setTimeout(() => setStep(s), (s - 1) * STEP_MS + 300));
    return () => timers.forEach(clearTimeout);
  }, [inView]);

  const show = (visible: boolean) => ({ opacity: visible ? 1 : 0, y: visible ? 0 : 6 });

  return (
    <MockWindow
      ref={ref}
      title="Design review"
      role="img"
      aria-label="Notes in plain Markdown. The sections are written one after another, and an overview is written last and placed above them."
    >
      <div aria-hidden className="flex flex-col gap-4 px-4 py-4">
        <div className="flex items-center justify-between gap-3">
          <ViewControl active="Notes" />
          <span className="text-xs font-semibold text-muted-foreground" style={{ minHeight: "1lh" }}>
            {status[step]}
          </span>
        </div>
        <div className="flex flex-col gap-4 text-[13px] leading-[1.55]">
          <m.div initial={show(false)} animate={show(step >= 4)} transition={slow}>
            <p className="font-semibold">## Overview</p>
            <p>{overview}</p>
          </m.div>
          {sections.map((s, i) => (
            <m.div key={s.h} initial={show(false)} animate={show(step > i)} transition={slow}>
              <p className="font-semibold">## {s.h}</p>
              <p>{s.p}</p>
            </m.div>
          ))}
        </div>
      </div>
    </MockWindow>
  );
}
