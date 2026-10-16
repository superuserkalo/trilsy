"use client";

import { useEffect, useState } from "react";
import { m } from "motion/react";
import { MockWindow, ViewControl } from "@/components/how-it-works/mock";
import { transition, useMotionTransition } from "@/lib/motion";
import { cn } from "@/lib/utils";
import { TranscriptLine } from "./transcript-line";
import { prefersReducedMotion, usePlayOnce } from "./use-play-once";

// Illustration content. The transcript is Trilsy's. The second window is the
// reader's own document, which they write from the timestamps; Trilsy does not
// write it. Timestamps count from the start of the recording, not the time of day.
const lines = [
  { at: "00:03:12", src: "Microphone", text: "Checkout errors are spiking. About one in three is failing." },
  { at: "00:07:45", src: "System", text: "We deployed the payment service update at ten past two." },
  { at: "00:11:20", src: "Microphone", text: "Rolling back now." },
  { at: "00:14:02", src: "System", text: "Errors are back to normal." },
] as const;

const timeline = [
  "Checkout errors spike.",
  "Payment service update (deployed 14:10) named as the likely cause.",
  "Rollback started.",
  "Errors back to normal.",
] as const;

const STEP_MS = 1000;

/**
 * Incident calls: the timestamps become the order of events. The transcript is
 * read down line by line; as each line is marked, the matching line of the
 * reader's own postmortem document is written beside its timestamp. Plays once,
 * 40% in view; the finished state at once under reduced motion. Both windows lay
 * out every line from the start, so nothing shifts.
 */
export function IncidentDemo() {
  const { ref, inView } = usePlayOnce();
  const slow = useMotionTransition(transition);
  const [step, setStep] = useState(0); // 0 nothing, 1 to 4 the line being read

  useEffect(() => {
    if (!inView) return;
    if (prefersReducedMotion()) {
      setStep(lines.length);
      return;
    }
    const timers = lines.map((_, i) => setTimeout(() => setStep(i + 1), 700 + i * STEP_MS));
    return () => timers.forEach(clearTimeout);
  }, [inView]);

  return (
    <div
      ref={ref}
      role="img"
      aria-label="A timed transcript of an incident call with four lines, and below it a postmortem document the reader writes from it: a timeline with the same four timestamps."
      className="flex flex-col gap-5"
    >
      <MockWindow title="Checkout outage, 12 Oct">
        <div aria-hidden className="flex flex-col gap-3 px-4 py-4">
          <ViewControl active="Transcript" />
          <ul className="flex flex-col">
            {lines.map((l, i) => (
              <TranscriptLine key={l.at} {...l} active={step === i + 1} />
            ))}
          </ul>
        </div>
      </MockWindow>
      <MockWindow title="postmortem.md">
        <div aria-hidden className="flex flex-col gap-2 px-4 py-4 text-[13px] leading-[1.55]">
          <p className="font-semibold">## Timeline</p>
          <ul className="flex flex-col gap-1">
            {timeline.map((t, i) => (
              <m.li
                key={lines[i].at}
                initial={false}
                animate={{ opacity: step > i ? 1 : 0, y: step > i ? 0 : 6 }}
                transition={slow}
                className={cn("grid grid-cols-[auto_1fr] gap-x-3")}
              >
                <span className="font-mono text-xs leading-[1.9]">{lines[i].at}</span>
                <span>{t}</span>
              </m.li>
            ))}
          </ul>
        </div>
      </MockWindow>
    </div>
  );
}
