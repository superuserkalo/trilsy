"use client";

import { useEffect, useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { PlayIcon, StopIcon } from "@hugeicons/core-free-icons";
import { MockWindow, ViewControl } from "@/components/how-it-works/mock";
import { cn } from "@/lib/utils";
import { TranscriptLine } from "./transcript-line";
import { prefersReducedMotion, usePlayOnce } from "./use-play-once";

// Illustration content. The labels are the app's: audio sources, not people.
const lines = [
  { at: "00:12:58", src: "Microphone", text: "So that is the setup for ten seats." },
  {
    at: "00:14:32",
    src: "System",
    text: "Honestly the price is fine. What I would need to check is whether security signs off first.",
  },
  { at: "00:15:10", src: "Microphone", text: "Who does the security review on your side?" },
  { at: "00:15:21", src: "System", text: "Our IT lead, Marta. She is out until Thursday." },
] as const;

const PLAYED = 1; // the line whose timestamp is pressed

/**
 * Sales calls: press a timestamp and the audio plays from that line. The window
 * starts with the Play button idle; after a beat the second line's timestamp is
 * pressed, the line is marked and the button becomes "Stop playback", as the app
 * shows it. Plays once, when the window is 40% in view; the finished state at
 * once under reduced motion. Nothing in the window changes size.
 */
export function SalesDemo() {
  const { ref, inView } = usePlayOnce();
  const [pressed, setPressed] = useState(false);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    if (!inView) return;
    if (prefersReducedMotion()) {
      setPressed(true);
      setPlaying(true);
      return;
    }
    const timers = [setTimeout(() => setPressed(true), 900), setTimeout(() => setPlaying(true), 1250)];
    return () => timers.forEach(clearTimeout);
  }, [inView]);

  return (
    <MockWindow
      ref={ref}
      title="Pricing call, 12 Oct"
      role="img"
      aria-label="A transcript of four lines, each with a timestamp and the source it came from. The timestamp 00:14:32 on a line from System is pressed, the line is marked and the Play button becomes Stop playback, because the audio is now playing from that point."
    >
      <div aria-hidden className="flex flex-col gap-3 px-4 py-4">
        <div className="flex items-center justify-between gap-3">
          <ViewControl active="Transcript" />
          <span
            className={cn(
              "inline-flex items-center gap-1.5 rounded-md border border-border px-2.5 py-1 text-xs font-semibold transition-colors duration-(--duration-base) ease-trilsy",
              playing && "border-ink bg-primary text-primary-foreground",
            )}
          >
            <HugeiconsIcon icon={playing ? StopIcon : PlayIcon} strokeWidth={2} className="size-3.5" />
            {/* Both labels share one grid cell, so the button keeps the width of the longer one. */}
            <span className="grid">
              <span className={cn("col-start-1 row-start-1", playing && "invisible")}>Play</span>
              <span className={cn("col-start-1 row-start-1", !playing && "invisible")}>Stop playback</span>
            </span>
          </span>
        </div>
        <ul className="flex flex-col">
          {lines.map((l, i) => (
            <TranscriptLine key={l.at} {...l} active={playing && i === PLAYED} pressed={pressed && i === PLAYED} />
          ))}
        </ul>
      </div>
    </MockWindow>
  );
}
