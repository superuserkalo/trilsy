"use client";

import { useEffect, useRef, useState } from "react";
import { useInView } from "motion/react";
import {
  AppBody,
  AudioSourcesButton,
  AudioSourcesMenu,
  LibraryHeader,
  SidebarRow,
} from "@/components/use-cases/app-chrome";
import { MockWindow } from "./mock";

/**
 * Block 1. The app's Audio sources menu, open: Microphone is on, App audio is
 * off, and New recording stays available while either is on. When the window
 * scrolls into view App audio switches on once, so the order reads "off until you
 * turn it on", and the Application picker and Refresh apps appear. The two
 * toggles are real buttons: the visitor can flip either one. Under reduced motion
 * it starts switched on. The pane keeps the height of the longest menu, so
 * nothing moves when the toggles do.
 */
export function SourcesDemo() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.7 });
  const [mic, setMic] = useState(true);
  const [system, setSystem] = useState(false);
  const touched = useRef(false);

  useEffect(() => {
    if (!inView || touched.current) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setSystem(true);
      return;
    }
    const t = setTimeout(() => !touched.current && setSystem(true), 900);
    return () => clearTimeout(t);
  }, [inView]);

  const toggle = (source: "mic" | "system") => {
    touched.current = true;
    if (source === "mic") setMic((v) => !v);
    else setSystem((v) => !v);
  };

  return (
    <MockWindow ref={ref} title="Trilsy" toolbar={<AudioSourcesButton pressed />}>
      <AppBody
        disabled={!mic && !system}
        count={2}
        list={
          <>
            <li>
              <SidebarRow title="Design review" />
            </li>
            <li>
              <SidebarRow title="Onboarding interviews, round 2" />
            </li>
          </>
        }
      >
        <div className="flex min-h-[236px] flex-col gap-3 px-4 py-4">
          <LibraryHeader importButton={false} />
          <AudioSourcesMenu mic={mic} system={system} onToggle={toggle} className="relative top-auto right-auto z-0 mt-0 ml-auto" />
        </div>
      </AppBody>
    </MockWindow>
  );
}
