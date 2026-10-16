"use client";

import { useEffect, useState } from "react";
import { MockWindow, ViewControl } from "@/components/how-it-works/mock";
import { cn } from "@/lib/utils";
import { AudioPlayer, RecordingHeader, RecordingMenu } from "./app-chrome";
import { TranscriptLine } from "./transcript-line";
import { usePlayOnce } from "./use-play-once";

// Illustration content: an interview by phone, so both sources are in the file.
// The text export is exactly what the app writes: one line per transcript line,
// "[HH:MM:SS] [source] text", in time order, with the source in lower case
// ("[microphone]", "[system]", Sources/Recording.swift). The notes are not in it.
const lines = [
  { at: "00:18:04", src: "Microphone", text: "Did the council know the cost before the vote?" },
  { at: "00:18:11", src: "System", text: "We saw an estimate in March. The final figure came after the vote." },
  { at: "00:18:30", src: "Microphone", text: "So the vote was taken on the March number." },
  { at: "00:18:36", src: "System", text: "Yes, and I said so at the time." },
] as const;

const TEXT = 1; // "Plain text transcript", the second entry of Export
const QUOTE = 1; // the line the reporter picks out

/**
 * Journalism: the transcript as plain text, with its timestamps. The window is
 * the app with an interview open; the "…" menu is opened, Export is chosen, then
 * "Plain text transcript", and the file it writes appears below, where one line is
 * selected as the quote. Plays once, 40% in view; under reduced motion with fades
 * only. The file's lines are laid out from the start and fade in, and
 * the menu opens over the transcript, so nothing shifts.
 */
export function JournalismDemo() {
  const { ref, inView } = usePlayOnce();
  const [open, setOpen] = useState(false);
  const [highlight, setHighlight] = useState<"export" | undefined>(undefined);
  const [exportOpen, setExportOpen] = useState(false);
  const [exportHighlight, setExportHighlight] = useState<number | undefined>(undefined);
  const [written, setWritten] = useState(false);
  const [quoted, setQuoted] = useState(false);

  useEffect(() => {
    if (!inView) return;
    const timers = [
      setTimeout(() => setOpen(true), 800),
      setTimeout(() => {
        setHighlight("export");
        setExportOpen(true);
      }, 1400),
      setTimeout(() => setExportHighlight(TEXT), 2000),
      setTimeout(() => {
        setOpen(false);
        setExportOpen(false);
        setHighlight(undefined);
      }, 2600),
      setTimeout(() => setWritten(true), 3000),
      setTimeout(() => setQuoted(true), 4100),
    ];
    return () => timers.forEach(clearTimeout);
  }, [inView]);

  return (
    <div
      ref={ref}
      role="img"
      aria-label="An interview with four transcript lines, each with a timestamp and a source, Microphone or System. The menu is opened, Export is chosen and then Plain text transcript. Below, the file it writes, with the same four lines, each beginning with its timestamp and its source in square brackets. One line is selected as the quote."
      className="flex flex-col gap-5"
    >
      <MockWindow title="Trilsy">
        <div aria-hidden className="flex flex-col gap-3 px-4 py-4">
          <RecordingHeader title="Bus route funding, 9 Oct" date="9 Oct, 16:20" length="41 min" status="Ready" />
          <AudioPlayer position={0} duration={2518} />
          <ViewControl
            active="Transcript"
            menu={<RecordingMenu open={open} highlight={highlight} exportOpen={exportOpen} exportHighlight={exportHighlight} />}
          />
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
                [{l.at}] [{l.src.toLowerCase()}] {l.text}
              </span>
            </li>
          ))}
        </ul>
      </MockWindow>
    </div>
  );
}
