"use client";

import { useEffect, useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { Loading03Icon, PauseIcon, StopIcon } from "@hugeicons/core-free-icons";
import { MockWindow, ViewControl } from "@/components/how-it-works/mock";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { DrawnSwitch, EmptyPane } from "./app-controls";
import { prefersReducedMotion, usePlayOnce } from "./use-play-once";

// Illustration content: a voice note recorded on a walk. The window follows the
// app's own order: Record, Stop & save, then "Transcribe & create notes", then
// the notes. The microphone is the only source, so the Mac's sound is off.
const notes = [
  {
    h: "Overview",
    p: "Thinking through whether the weekly planning meeting should move from Friday afternoon to Monday morning. Friday meetings run out of energy; Monday would give the week a shape. Nothing is decided.",
  },
  { h: "For moving to Monday", p: "People are fresher, and whatever came up over the weekend is on the table." },
  { h: "Against", p: "Monday morning is when customer messages pile up. Find out how many people already have calls then." },
] as const;

// What the strip and the pane below it show, in order.
type Step = "idle" | "recording" | "recorded" | "working" | "notes";

/**
 * Voice notes: the microphone alone. The capture strip starts with Microphone on
 * and App audio off, as Trilsy does; Record turns it into the recording row (a
 * red dot, the time, Pause, Stop & save), which gives the strip back after Stop & save, and the app waits for
 * "Transcribe & create notes", shows its progress, and ends on the notes. Plays
 * once, 40% in view; the notes at once under reduced motion. The two strips share
 * one cell and the four panes share another, so nothing shifts.
 */
export function VoiceDemo() {
  const { ref, inView } = usePlayOnce();
  const [step, setStep] = useState<Step>("idle");
  const [pressed, setPressed] = useState<"record" | "stop" | "transcribe" | null>(null);

  useEffect(() => {
    if (!inView) return;
    if (prefersReducedMotion()) {
      setStep("notes");
      return;
    }
    const timers = [
      setTimeout(() => setPressed("record"), 900),
      setTimeout(() => {
        setPressed(null);
        setStep("recording");
      }, 1300),
      setTimeout(() => setPressed("stop"), 3000),
      setTimeout(() => {
        setPressed(null);
        setStep("recorded");
      }, 3400),
      setTimeout(() => setPressed("transcribe"), 4400),
      setTimeout(() => {
        setPressed(null);
        setStep("working");
      }, 4800),
      setTimeout(() => setStep("notes"), 6200),
    ];
    return () => timers.forEach(clearTimeout);
  }, [inView]);

  const recording = step === "recording";
  const layer = "col-start-1 row-start-1 transition-opacity duration-(--duration-base) ease-trilsy";

  return (
    <MockWindow
      ref={ref}
      title="Trilsy"
      role="img"
      aria-label="The recording controls with the microphone on and App audio off. Record is pressed and the controls become a recording row with the time and a Stop and save button. After it, the app offers Transcribe and create notes, shows its progress, and ends on the notes of a voice note: an overview and two sections."
    >
      <div aria-hidden>
        <div className="grid border-b border-border">
          <div className={cn(layer, "flex flex-wrap items-center gap-x-5 gap-y-3 px-4 py-4", recording && "pointer-events-none opacity-0")}>
            <span className="flex items-center gap-2 font-semibold">
              <DrawnSwitch on />
              Microphone
            </span>
            <span className="flex items-center gap-2 font-semibold text-muted-foreground">
              <DrawnSwitch on={false} />
              App audio
            </span>
            <span
              className={cn(
                buttonVariants({ size: "sm" }),
                "ml-auto gap-2 transition-transform duration-(--duration-base) ease-trilsy",
                pressed === "record" && "translate-y-px",
              )}
            >
              <i className="size-2 rounded-full bg-recording" />
              Record
            </span>
          </div>
          <div
            className={cn(
              layer,
              "flex flex-wrap items-center gap-x-4 gap-y-3 px-4 py-4",
              !recording && "opacity-0",
            )}
          >
            <i className="size-3 rounded-full bg-recording" />
            <span className="font-mono text-base">00:00:41</span>
            <span className="text-muted-foreground">Recording</span>
            <span className="h-1.5 w-16 overflow-hidden rounded-full bg-border">
              <span className="block h-full w-2/5 bg-accent" />
            </span>
            <span className="ml-auto flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-md border border-border px-2.5 py-1 text-xs font-semibold">
                <HugeiconsIcon icon={PauseIcon} strokeWidth={2} className="size-3.5" />
                Pause
              </span>
              <span
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1 text-xs font-semibold transition-colors duration-(--duration-base) ease-trilsy",
                  pressed === "stop" ? "border-ink bg-primary text-primary-foreground" : "border-border",
                )}
              >
                <HugeiconsIcon icon={StopIcon} strokeWidth={2} className="size-3.5" />
                Stop &amp; save
              </span>
            </span>
          </div>
        </div>

        <div className="grid">
          <EmptyPane className={cn(layer, step !== "idle" && "opacity-0")} />
          <EmptyPane
            className={cn(layer, !recording && "opacity-0")}
            title="The conversation, made useful"
            text="Stop recording, then generate a transcript and detailed notes. Processing happens on this Mac."
          />

          <div className={cn(layer, "flex flex-col gap-4 px-4 py-4", step !== "recorded" && step !== "working" && "opacity-0")}>
            <div>
              <p className="font-display text-lg leading-tight font-semibold">Walk to work, 15 Oct</p>
              <p className="text-xs text-muted-foreground">00:01:12 · Recorded</p>
            </div>
            <span className="flex items-center gap-2 text-xs font-semibold">
              <span className="relative inline-grid">
                <span
                  className={cn(
                    buttonVariants({ size: "sm" }),
                    "col-start-1 row-start-1 transition-opacity duration-(--duration-base) ease-trilsy",
                    step === "working" && "opacity-0",
                    pressed === "transcribe" && "translate-y-px",
                  )}
                >
                  Transcribe &amp; create notes
                </span>
                <span
                  className={cn(
                    "col-start-1 row-start-1 flex items-center gap-2 transition-opacity duration-(--duration-base) ease-trilsy",
                    step !== "working" && "opacity-0",
                  )}
                >
                  <HugeiconsIcon icon={Loading03Icon} strokeWidth={2} className="size-4 animate-spin motion-reduce:animate-none" />
                  Writing detailed notes 1 of 1…
                </span>
              </span>
            </span>
          </div>

          <div className={cn(layer, "flex flex-col gap-4 px-4 py-4", step !== "notes" && "opacity-0")}>
            <p className="font-display text-lg leading-tight font-semibold">Walk to work, 15 Oct</p>
            <ViewControl active="Notes" />
            <div className="flex flex-col gap-3.5 text-[13px] leading-[1.55]">
              {notes.map((n) => (
                <div key={n.h}>
                  <p className="font-semibold">## {n.h}</p>
                  <p>{n.p}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </MockWindow>
  );
}
