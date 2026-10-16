"use client";

import { useEffect, useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { PlayIcon } from "@hugeicons/core-free-icons";
import { MockWindow, ViewControl } from "@/components/how-it-works/mock";
import { cn } from "@/lib/utils";
import { MenuButton, PopMenu } from "./app-controls";
import { TranscriptLine } from "./transcript-line";
import { prefersReducedMotion, usePlayOnce } from "./use-play-once";

// Illustration content: an interview by phone, so both sources are in the file.
// The text export is exactly what the app writes: one line per transcript line,
// "[HH:MM:SS] [Source] text", in time order. The notes are not in it.
const lines = [
  { at: "00:18:04", src: "Microphone", text: "Did the council know the cost before the vote?" },
  { at: "00:18:11", src: "System", text: "We saw an estimate in March. The final figure came after the vote." },
  { at: "00:18:30", src: "Microphone", text: "So the vote was taken on the March number." },
  { at: "00:18:36", src: "System", text: "Yes, and I said so at the time." },
] as const;

const exports = ["Markdown with transcript", "Plain text transcript", "SRT subtitles"] as const;
const TEXT = 1;
const QUOTE = 1; // the line the reporter picks out

/**
 * Journalism: the transcript as plain text, with its timestamps. The window is
 * the app with an interview open; Export is pressed, "Plain text transcript" is
 * chosen, and the file it writes appears below it, where one line is selected
 * as the quote. Plays once, 40% in view; the finished state at once under
 * reduced motion. The file's lines are laid out from the start and fade in, and
 * the menu opens over the transcript, so nothing shifts.
 */
export function JournalismDemo() {
  const { ref, inView } = usePlayOnce();
  const [open, setOpen] = useState(false);
  const [pressed, setPressed] = useState(false);
  const [highlight, setHighlight] = useState<number | undefined>(undefined);
  const [written, setWritten] = useState(false);
  const [quoted, setQuoted] = useState(false);

  useEffect(() => {
    if (!inView) return;
    if (prefersReducedMotion()) {
      setWritten(true);
      return;
    }
    const timers = [
      setTimeout(() => {
        setPressed(true);
        setOpen(true);
      }, 800),
      setTimeout(() => setHighlight(TEXT), 1500),
      setTimeout(() => {
        setOpen(false);
        setPressed(false);
      }, 2100),
      setTimeout(() => setWritten(true), 2500),
      setTimeout(() => setQuoted(true), 3600),
    ];
    return () => timers.forEach(clearTimeout);
  }, [inView]);

  return (
    <div
      ref={ref}
      role="img"
      aria-label="An interview with four transcript lines, each with a timestamp and a source, Microphone or System. The Export menu is opened and Plain text transcript is chosen. Below, the file it writes, with the same four lines, each beginning with its timestamp and its source in square brackets. One line is selected as the quote."
      className="flex flex-col gap-5"
    >
      <MockWindow title="Trilsy">
        <div aria-hidden className="flex flex-col gap-3 px-4 py-4">
          <div className="flex items-center justify-between gap-3">
            <div className="flex flex-col">
              <p className="font-display text-lg leading-tight font-semibold">Bus route funding, 9 Oct</p>
              <p className="text-xs text-muted-foreground">00:41:58 · Recorded</p>
            </div>
          </div>
          <div className="flex items-center justify-between gap-3">
            <ViewControl active="Transcript" />
            <span className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-md border border-border px-2.5 py-1 text-xs font-semibold">
                <HugeiconsIcon icon={PlayIcon} strokeWidth={2} className="size-3.5" />
                Play
              </span>
              <span className="relative">
                <MenuButton label="Export" pressed={pressed} />
                <PopMenu items={exports} open={open} highlighted={highlight} className="right-0" />
              </span>
            </span>
          </div>
          <ul className="flex flex-col">
            {lines.map((l) => (
              <TranscriptLine key={l.at} {...l} />
            ))}
          </ul>
        </div>
      </MockWindow>

      <MockWindow title="Bus route funding, 9 Oct.txt">
        <ul aria-hidden className="flex flex-col gap-1.5 px-4 py-4 font-mono text-[12.5px] leading-[1.55]">
          {lines.map((l, i) => (
            <li
              key={l.at}
              className={cn(
                "transition-opacity duration-(--duration-base) ease-trilsy",
                written ? "opacity-100" : "opacity-0",
              )}
            >
              <span
                className={cn(
                  "rounded-sm transition-colors duration-(--duration-base) ease-trilsy",
                  quoted && i === QUOTE && "bg-primary/45",
                )}
              >
                [{l.at}] [{l.src}] {l.text}
              </span>
            </li>
          ))}
        </ul>
      </MockWindow>
    </div>
  );
}
