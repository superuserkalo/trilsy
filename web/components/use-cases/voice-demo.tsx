"use client";

import { useEffect, useState } from "react";
import { MockWindow, ViewControl } from "@/components/how-it-works/mock";
import { cn } from "@/lib/utils";
import {
  AppBody,
  AudioPlayer,
  AudioSourcesButton,
  AudioSourcesMenu,
  EmptyDocument,
  EmptyPane,
  NotesDoc,
  ProcessingBar,
  RecordingHeader,
  RecordingMenu,
  RecordingToolbar,
  SidebarRow,
} from "./app-chrome";
import { prefersReducedMotion, usePlayOnce } from "./use-play-once";

// Illustration content: a voice note recorded on a walk. The window follows the
// app's order: New recording, Stop & save, then "Create notes", then the notes.
// Stop only saves; nothing is transcribed until Create notes is pressed. The
// title is the one the app gives a new recording ("Recording" and the date and
// time), which follows the Mac's language and region. The microphone is the only
// source, so App audio is off, which the menu shows first.
const TITLE = "Recording 15 Oct 2026, 08:41";
const DATE = "15 Oct, 08:41";

const notes = [
  {
    h: "Overview",
    p: "Thinking through whether the weekly planning meeting should move from Friday afternoon to Monday morning. Friday meetings run out of energy; Monday would give the week a shape. Nothing is decided.",
  },
  { h: "For moving to Monday", p: "People are fresher, and whatever came up over the weekend is on the table." },
  { h: "Against", p: "Monday morning is when customer messages pile up. Find out how many people already have calls then." },
] as const;

// What the window shows, in order.
type Step = "idle" | "recording" | "recorded" | "working" | "notes";

/**
 * Voice notes: the microphone alone. The Audio sources menu is open first, with
 * Microphone ticked and App audio not, as Trilsy starts; New recording then turns
 * the toolbar into the recording row (a red dot, the time, Pause, Stop & save),
 * which gives the menu button back after Stop & save. The app waits for Create
 * notes, shows its progress under the recording, and ends on the notes. Plays
 * once, 40% in view; the notes at once under reduced motion. The panes share one
 * cell, the progress bar floats over the foot of the window and the menu opens
 * over the pane, so nothing shifts.
 */
export function VoiceDemo() {
  const { ref, inView } = usePlayOnce();
  const [step, setStep] = useState<Step>("idle");
  const [menuOpen, setMenuOpen] = useState(true);
  const [pressed, setPressed] = useState<"new" | "stop" | "create" | null>(null);

  useEffect(() => {
    if (!inView) return;
    if (prefersReducedMotion()) {
      setMenuOpen(false);
      setStep("notes");
      return;
    }
    const timers = [
      setTimeout(() => setMenuOpen(false), 2000),
      setTimeout(() => setPressed("new"), 2600),
      setTimeout(() => {
        setPressed(null);
        setStep("recording");
      }, 3000),
      setTimeout(() => setPressed("stop"), 4700),
      setTimeout(() => {
        setPressed(null);
        setStep("recorded");
      }, 5100),
      setTimeout(() => setPressed("create"), 6100),
      setTimeout(() => {
        setPressed(null);
        setStep("working");
      }, 6500),
      setTimeout(() => setStep("notes"), 7900),
    ];
    return () => timers.forEach(clearTimeout);
  }, [inView]);

  const recording = step === "recording";
  const layer = "col-start-1 row-start-1 transition-opacity duration-(--duration-base) ease-trilsy";

  return (
    <MockWindow
      ref={ref}
      title="Trilsy"
      className="relative"
      role="img"
      aria-label="The Audio sources menu with Microphone ticked and App audio not. New recording is pressed and the toolbar becomes a recording row with the time and a Stop and save button. After it, the app offers Create notes, shows its progress, and ends on the notes of a voice note: an overview and two sections."
      toolbar={
        recording ? (
          <RecordingToolbar time="00:00:41" stopPressed={pressed === "stop"} />
        ) : (
          <span className="relative">
            <AudioSourcesButton pressed={menuOpen} />
            <AudioSourcesMenu mic system={false} open={menuOpen} />
          </span>
        )
      }
    >
      <div aria-hidden>
        <AppBody
          pressed={pressed === "new"}
          disabled={recording || step === "working"}
          allSelected={step === "idle"}
          list={
            <li className={cn("transition-opacity duration-(--duration-base) ease-trilsy", step === "idle" && "opacity-0")}>
              <SidebarRow title={TITLE} ready={step === "notes"} selected />
            </li>
          }
          listClassName="min-h-8"
        >
          <div className="grid">
            <EmptyPane className={cn(layer, step !== "idle" && "opacity-0")} />

            <div className={cn(layer, "flex flex-col gap-4 px-4 py-4", !recording && "opacity-0")}>
              <RecordingHeader title={TITLE} date={DATE} length="0 sec" status="Recording" />
              <ViewControl active="Notes" edit={null} menu={<RecordingMenu rewrite={false} />} />
              <EmptyDocument recording />
            </div>

            <div className={cn(layer, "flex flex-col gap-4 px-4 py-4", step !== "recorded" && step !== "working" && "opacity-0")}>
              <RecordingHeader title={TITLE} date={DATE} length="1 min" status="Recorded" />
              <AudioPlayer position={0} duration={72} />
              <ViewControl active="Notes" edit={null} menu={<RecordingMenu rewrite={false} />} />
              <EmptyDocument pressed={pressed === "create"} />
            </div>

            <div className={cn(layer, "flex flex-col gap-4 px-4 py-4", step !== "notes" && "opacity-0")}>
              <RecordingHeader title={TITLE} date={DATE} length="1 min" status="Ready" />
              <AudioPlayer position={0} duration={72} />
              <ViewControl active="Notes" />
              <NotesDoc sections={notes} />
            </div>
          </div>
        </AppBody>
        <ProcessingBar
          text="Writing detailed notes 1 of 1…"
          className={cn(
            "absolute inset-x-0 bottom-0 transition-opacity duration-(--duration-base) ease-trilsy",
            step !== "working" && "opacity-0",
          )}
        />
      </div>
    </MockWindow>
  );
}
