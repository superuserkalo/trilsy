"use client";

import { useEffect, useState } from "react";
import { MockWindow, ViewControl } from "@/components/how-it-works/mock";
import { cn } from "@/lib/utils";
import {
  AppBody,
  AudioPlayer,
  AudioSourcesButton,
  AudioSourcesMenu,
  EmptyPane,
  RecordingHeader,
  RecordingMenu,
  SidebarRow,
} from "./app-chrome";
import { TranscriptLine } from "./transcript-line";
import { usePlayOnce } from "./use-play-once";

// Illustration content. The app lists the apps that are running; "All apps" is
// first. Every line is System: the microphone is off, so nothing else is
// recorded. The app transcribes when Create notes is pressed, so the lines
// arrive in one piece. The title is the one the app gives a new recording.
const apps = ["All apps", "Safari", "Mail", "Music"] as const;
const SAFARI = 1;
const TITLE = "Recording 15 Oct 2026, 09:30";

const lines = [
  { at: "00:00:05", src: "System", text: "Welcome back. This week is about sampling, and why a small sample can still tell you something." },
  { at: "00:00:21", src: "System", text: "Start with the population: everyone you want to know about. The sample is the part you actually measure." },
  { at: "00:00:44", src: "System", text: "Here is the question to hold on to. If we drew another sample, how different would the answer be?" },
  { at: "00:01:10", src: "System", text: "That difference is what the standard error measures. We will build it up one step at a time." },
] as const;

/**
 * Talks, courses and webinars: record what a browser plays. The Audio sources
 * menu opens with the microphone off and App audio on; its Application picker
 * opens, Safari is chosen, and New recording is pressed. The recording that comes
 * of it is a transcript whose every line is System. Plays once, 40% in view;
 * under reduced motion with fades only. The menus open over the window, the
 * empty pane and the recording share one cell, so nothing shifts.
 */
export function TalksDemo() {
  const { ref, inView } = usePlayOnce();
  const [menuOpen, setMenuOpen] = useState(false);
  const [appOpen, setAppOpen] = useState(false);
  const [highlight, setHighlight] = useState<"application" | undefined>(undefined);
  const [appHighlight, setAppHighlight] = useState<number | undefined>(undefined);
  const [app, setApp] = useState(0);
  const [pressedNew, setPressedNew] = useState(false);
  const [done, setDone] = useState(false);
  const [shown, setShown] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const timers = [
      setTimeout(() => setMenuOpen(true), 800),
      setTimeout(() => {
        setHighlight("application");
        setAppOpen(true);
      }, 1500),
      setTimeout(() => setAppHighlight(SAFARI), 2100),
      setTimeout(() => {
        setApp(SAFARI);
        setMenuOpen(false);
        setAppOpen(false);
        setHighlight(undefined);
        setAppHighlight(undefined);
      }, 2700),
      setTimeout(() => setPressedNew(true), 3300),
      setTimeout(() => {
        setPressedNew(false);
        setDone(true);
      }, 3700),
      ...lines.map((_, i) => setTimeout(() => setShown(i + 1), 4100 + i * 450)),
    ];
    return () => timers.forEach(clearTimeout);
  }, [inView]);

  return (
    <MockWindow
      ref={ref}
      title="Trilsy"
      role="img"
      aria-label="The Audio sources menu is opened with the microphone off and App audio on. Its Application list is opened and Safari is chosen. The recording that follows is a transcript of an online course video, and every line is marked System, because the sound came from the Mac and not from the microphone."
      toolbar={
        <span className="relative">
          <AudioSourcesButton pressed={menuOpen} />
          <AudioSourcesMenu
            mic={false}
            system
            open={menuOpen}
            apps={apps}
            app={app}
            appOpen={appOpen}
            highlight={highlight}
            appHighlight={appHighlight}
          />
        </span>
      }
    >
      <div aria-hidden>
        <AppBody
          pressed={pressedNew}
          allSelected={!done}
          list={
            <li className={cn("transition-opacity duration-(--duration-base) ease-trilsy", !done && "opacity-0")}>
              <SidebarRow title={TITLE} selected />
            </li>
          }
          listClassName="min-h-8"
        >
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
              <RecordingHeader title={TITLE} date="15 Oct, 09:30" length="1 min" status="Ready" />
              <AudioPlayer position={0} duration={92} />
              <ViewControl active="Transcript" menu={<RecordingMenu />} />
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
        </AppBody>
      </div>
    </MockWindow>
  );
}
