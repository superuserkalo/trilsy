"use client";

import { useEffect, useState } from "react";
import { MockWindow } from "@/components/how-it-works/mock";
import { cn } from "@/lib/utils";
import { MenuButton, PopMenu } from "./app-controls";
import { prefersReducedMotion, usePlayOnce } from "./use-play-once";

// Illustration content. A subtitle file is what the app writes: a number, the
// start and end as HH:MM:SS,mmm, the text, and a blank line, for every line of
// the transcript, with no speaker label. The drawn frame beside it is only there
// to show what a cue does when it is played back; it is not part of Trilsy.
const cues = [
  { start: "00:00:03,200", end: "00:00:07,840", text: "Welcome back to the show. Today it is just the two of us." },
  { start: "00:00:08,100", end: "00:00:12,510", text: "And a very large pot of coffee." },
  { start: "00:00:12,980", end: "00:00:17,060", text: "So, where do we start?" },
] as const;

const exports = ["Markdown with transcript", "Plain text transcript", "SRT subtitles"] as const;
const SRT = 2;
const STEP_MS = 1700;

/**
 * Podcasts and video: one export gives a subtitle file. Export is pressed, "SRT
 * subtitles" is chosen, the file appears beside a drawn video frame, and the
 * cues play in turn, each marked in the file and shown as the frame's caption
 * while a thin bar crosses the frame. Plays once, 40% in view; the finished
 * state at once under reduced motion. The file's cues and the frame are laid
 * out from the start, the caption slot has a fixed height, and the menu opens
 * over the file, so nothing shifts.
 */
export function PodcastsDemo() {
  const { ref, inView } = usePlayOnce();
  const [open, setOpen] = useState(false);
  const [pressed, setPressed] = useState(false);
  const [highlight, setHighlight] = useState<number | undefined>(undefined);
  const [written, setWritten] = useState(false);
  const [cue, setCue] = useState(0); // 0 none, 1 to 3 the cue on screen

  useEffect(() => {
    if (!inView) return;
    if (prefersReducedMotion()) {
      setWritten(true);
      setCue(cues.length);
      return;
    }
    const timers = [
      setTimeout(() => {
        setPressed(true);
        setOpen(true);
      }, 800),
      setTimeout(() => setHighlight(SRT), 1500),
      setTimeout(() => {
        setOpen(false);
        setPressed(false);
      }, 2100),
      setTimeout(() => setWritten(true), 2500),
      ...cues.map((_, i) => setTimeout(() => setCue(i + 1), 3300 + i * STEP_MS)),
    ];
    return () => timers.forEach(clearTimeout);
  }, [inView]);

  return (
    <MockWindow
      ref={ref}
      title="Kitchen table, episode 12"
      role="img"
      aria-label="The Export menu is opened and SRT subtitles is chosen. The subtitle file it writes has three numbered cues, each with a start time, an end time and a line of text. Beside it, a plain frame shows each cue as a caption in its turn, with a thin bar crossing the frame."
    >
      <div aria-hidden>
        <div className="flex items-center justify-between gap-3 border-b border-border px-4 py-3">
          <p className="text-xs text-muted-foreground">00:00:17 · Recorded</p>
          <span className="relative">
            <MenuButton label="Export" pressed={pressed} />
            <PopMenu items={exports} open={open} highlighted={highlight} className="right-0" />
          </span>
        </div>
        <div
          className={cn(
            "grid gap-4 px-4 py-4 transition-opacity duration-(--duration-base) ease-trilsy md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]",
            written ? "opacity-100" : "opacity-0",
          )}
        >
          <div className="flex flex-col gap-2">
            <p className="font-mono text-xs text-muted-foreground">kitchen-table-12.srt</p>
            <ol className="flex flex-col gap-1 font-mono text-[12.5px] leading-[1.5]">
              {cues.map((c, i) => (
                <li
                  key={c.start}
                  className={cn(
                    "rounded-md px-2 py-1.5 transition-colors duration-(--duration-base) ease-trilsy",
                    cue === i + 1 && "bg-field",
                  )}
                >
                  <span className="block">{i + 1}</span>
                  <span className="block">
                    {c.start} --&gt; {c.end}
                  </span>
                  <span className="block font-sans text-[13px]">{c.text}</span>
                </li>
              ))}
            </ol>
          </div>

          <div className="flex flex-col justify-center">
            <div className="relative aspect-video overflow-hidden rounded-lg border-2 border-ink bg-dusk">
              <p className="absolute inset-x-3 bottom-5 text-center text-[13px] leading-snug font-semibold text-dusk-foreground">
                {cues.map((c, i) => (
                  <span
                    key={c.start}
                    className={cn(
                      "absolute inset-x-0 bottom-0 transition-opacity duration-(--duration-base) ease-trilsy",
                      cue === i + 1 ? "opacity-100" : "opacity-0",
                    )}
                  >
                    {c.text}
                  </span>
                ))}
              </p>
              <span className="absolute inset-x-0 bottom-0 h-1 bg-dusk-foreground/25">
                <span
                  className="block h-full origin-left bg-primary transition-transform duration-(--duration-slow) ease-trilsy"
                  style={{ transform: `scaleX(${cue / cues.length})` }}
                />
              </span>
            </div>
          </div>
        </div>
      </div>
    </MockWindow>
  );
}
