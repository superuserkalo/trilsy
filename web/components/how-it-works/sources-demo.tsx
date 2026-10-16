"use client";

import { useEffect, useRef, useState } from "react";
import { useInView } from "motion/react";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowDown01Icon, Download01Icon } from "@hugeicons/core-free-icons";
import { buttonVariants } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import { MockWindow } from "./mock";

/**
 * Block 1. The app's capture strip: Microphone is on, App audio is off. When
 * the window scrolls into view App audio switches on once, so the order reads
 * "off until you turn it on", and the app picker appears. It is a real switch:
 * the visitor can flip either one. Under reduced motion it starts switched on.
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

  return (
    <MockWindow ref={ref} title="Design review">
      <div className="flex flex-wrap items-center gap-x-6 gap-y-3 px-4 py-4">
        <label className="flex items-center gap-2 font-semibold">
          <Switch
            checked={mic}
            onCheckedChange={(v) => {
              touched.current = true;
              setMic(v);
            }}
          />
          Microphone
        </label>
        <label className="flex items-center gap-2 font-semibold">
          <Switch
            checked={system}
            onCheckedChange={(v) => {
              touched.current = true;
              setSystem(v);
            }}
          />
          App audio
        </label>
        <span
          aria-hidden={!system}
          className={cn(
            "inline-flex items-center gap-1.5 rounded-md border border-border bg-card px-2.5 py-1 text-xs font-semibold transition-opacity duration-(--duration-base) ease-trilsy",
            system ? "opacity-100" : "opacity-0",
          )}
        >
          All apps
          <HugeiconsIcon icon={ArrowDown01Icon} strokeWidth={2} className="size-3" />
        </span>
        <span
          aria-hidden
          className={cn(
            buttonVariants({ size: "sm" }),
            "ml-auto gap-2 transition-opacity duration-(--duration-base) ease-trilsy",
            !mic && !system && "opacity-50",
          )}
        >
          <i className="size-2 rounded-full bg-recording" />
          Record
        </span>
      </div>
      <div className="flex items-center gap-2 border-t border-border bg-muted/40 px-4 py-2.5 text-xs font-semibold text-muted-foreground">
        <HugeiconsIcon icon={Download01Icon} strokeWidth={2} className="size-3.5" />
        Import audio or video…
      </div>
    </MockWindow>
  );
}
