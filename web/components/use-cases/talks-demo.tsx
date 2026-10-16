"use client";

import { useEffect, useState } from "react";
import { MockWindow, ViewControl } from "@/components/how-it-works/mock";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { DrawnSwitch, EmptyPane, MenuButton, PopMenu } from "./app-controls";
import { TranscriptLine } from "./transcript-line";
import { prefersReducedMotion, usePlayOnce } from "./use-play-once";

// Illustration content. The app lists the apps that are running; "All apps" is
// first. Every line is System: the microphone is off, so nothing else is
// recorded. The app transcribes after Stop, so the lines arrive in one piece.
const apps = ["All apps", "Safari", "Mail", "Music"] as const;
const SAFARI = 1;

const lines = [
  { at: "00:00:05", src: "System", text: "Welcome back. This week is about sampling, and why a small sample can still tell you something." },
  { at: "00:00:21", src: "System", text: "Start with the population: everyone you want to know about. The sample is the part you actually measure." },
  { at: "00:00:44", src: "System", text: "Here is the question to hold on to. If we drew another sample, how different would the answer be?" },
  { at: "00:01:10", src: "System", text: "That difference is what the standard error measures. We will build it up one step at a time." },
] as const;

/**
 * Talks, courses and webinars: record what a browser plays. The window opens on
 * the app's capture strip with the microphone off and App audio on; the app
 * picker opens, Safari is chosen, and the recording that comes of it is a
 * transcript whose every line is System. Plays once, 40% in view; the finished
 * state at once under reduced motion. The strip is the same height throughout and
 * the picker opens over the window, so nothing shifts; the empty pane and the
 * recording share one cell, so the window keeps the taller one's height.
 */
export function TalksDemo() {
  const { ref, inView } = usePlayOnce();
  const [menuOpen, setMenuOpen] = useState(false);
  const [highlight, setHighlight] = useState<number | undefined>(undefined);
  const [app, setApp] = useState(0);
  const [done, setDone] = useState(false);
  const [shown, setShown] = useState(0);

  useEffect(() => {
    if (!inView) return;
    if (prefersReducedMotion()) {
      setApp(SAFARI);
      setDone(true);
      setShown(lines.length);
      return;
    }
    const timers = [
      setTimeout(() => setMenuOpen(true), 800),
      setTimeout(() => setHighlight(SAFARI), 1500),
      setTimeout(() => {
        setApp(SAFARI);
        setMenuOpen(false);
      }, 2100),
      setTimeout(() => setDone(true), 2900),
      ...lines.map((_, i) => setTimeout(() => setShown(i + 1), 3300 + i * 450)),
    ];
    return () => timers.forEach(clearTimeout);
  }, [inView]);

  return (
    <MockWindow
      ref={ref}
      title="Trilsy"
      role="img"
      aria-label="The recording controls with the microphone off and App audio on. The app list is opened and Safari is chosen. The recording that follows is a transcript of an online course video, and every line is marked System, because the sound came from the Mac and not from the microphone."
    >
      <div aria-hidden>
        <div className="flex flex-wrap items-center gap-x-5 gap-y-3 border-b border-border px-4 py-4">
          <span className="flex items-center gap-2 font-semibold text-muted-foreground">
            <DrawnSwitch on={false} />
            Microphone
          </span>
          <span className="flex items-center gap-2 font-semibold">
            <DrawnSwitch on />
            App audio
          </span>
          <span className="relative">
            <MenuButton label={apps[app]} pressed={menuOpen} className="min-w-24 justify-between" />
            <PopMenu items={apps} open={menuOpen} highlighted={highlight} checked={app} className="left-0" />
          </span>
          <span className={cn(buttonVariants({ size: "sm" }), "ml-auto gap-2")}>
            <i className="size-2 rounded-full bg-recording" />
            Record
          </span>
        </div>
        <div className="grid">
          <EmptyPane
            className={cn(
              "col-start-1 row-start-1 transition-opacity duration-(--duration-base) ease-trilsy",
              done && "opacity-0",
            )}
          />
          <div
            className={cn(
              "col-start-1 row-start-1 flex flex-col gap-3 px-4 py-4 transition-opacity duration-(--duration-base) ease-trilsy",
              !done && "opacity-0",
            )}
          >
            <div>
              <p className="font-display text-lg leading-tight font-semibold">Intro to Statistics, week 3</p>
              <p className="text-xs text-muted-foreground">00:01:32 · Recorded</p>
            </div>
            <ViewControl active="Transcript" />
            <ul className="flex flex-col">
              {lines.map((l, i) => (
                <TranscriptLine
                  key={l.at}
                  {...l}
                  className={cn("transition-opacity duration-(--duration-base) ease-trilsy", shown > i ? "opacity-100" : "opacity-0")}
                />
              ))}
            </ul>
          </div>
        </div>
      </div>
    </MockWindow>
  );
}
