"use client";

import { useEffect, useRef, useState } from "react";
import { useMotionValue } from "motion/react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { FoldStage } from "./fold-stage";
import { HeroCopy } from "./hero-copy";
import { PhoneStage } from "./phone-stage";
import { StoryClock } from "./story-clock";
import { chapters, type Chapter } from "./story";

/**
 * Development check for ticket 04 (app/scratch/hero): every state of the
 * section without scroll. Progress folds the stage; scroll is simulated as
 * 0.95 of a 900px screen per unit of progress, as the prototype maps it.
 */
export function HeroCheck() {
  const root = useRef<HTMLDivElement>(null);
  const [p, setP] = useState(0);
  const [chapter, setChapter] = useState<Chapter>(-1);
  const [freeze, setFreeze] = useState<number | undefined>(undefined);
  const [layout, setLayout] = useState<"hero" | "pinned">("hero");
  const progress = useMotionValue(0);
  const scrollY = useMotionValue(0);
  const fold = (v: number) => {
    setP(v);
    progress.set(v);
    scrollY.set(v * 0.95 * 900);
    if (v < 0.98) setChapter(-1);
  };

  // Link to a state: ?p=0.45&c=1&t=10.2&layout=pinned
  useEffect(() => {
    const q = new URLSearchParams(window.location.search);
    if (q.has("p")) fold(Number(q.get("p")));
    if (q.has("c")) setChapter(Number(q.get("c")) as Chapter);
    if (q.has("t")) setFreeze(Number(q.get("t")));
    if (q.get("layout") === "pinned") setLayout("pinned");
    // Runs once, on arrival.
  }, []);

  return (
    <StoryClock chapter={chapter} rootRef={root} freezeAt={freeze}>
      <div className="sticky top-24 z-30 mx-auto flex max-w-5xl flex-wrap items-center gap-4 rounded-lg border border-border bg-card px-4 py-3 text-sm">
        <label className="flex items-center gap-2">
          Progress {p.toFixed(2)}
          <input type="range" min={0} max={1} step={0.01} value={p} onChange={(e) => fold(+e.target.value)} />
        </label>
        <span className="flex items-center gap-1.5">
          Chapter
          {([-1, 0, 1, 2] as Chapter[]).map((c) => (
            <Button
              key={c}
              size="xs"
              variant={chapter === c ? "default" : "outline"}
              onClick={() => {
                if (c >= 0) fold(1);
                setChapter(c);
                setLayout(c >= 0 ? "pinned" : "hero");
              }}
            >
              {c < 0 ? "hero" : chapters[c as 0 | 1 | 2].heading}
            </Button>
          ))}
        </span>
        <label className="flex items-center gap-2">
          Freeze at {freeze?.toFixed(1) ?? "off"}
          <input
            type="range"
            min={-0.5}
            max={15}
            step={0.1}
            value={freeze ?? -0.5}
            onChange={(e) => setFreeze(+e.target.value < 0 ? undefined : +e.target.value)}
          />
        </label>
        <Button size="xs" variant="outline" onClick={() => setLayout(layout === "hero" ? "pinned" : "hero")}>
          Reduced-motion layout: {layout}
        </Button>
      </div>

      <div
        ref={root}
        className="relative mt-4 hidden h-[calc(900px*var(--stage-s))] overflow-hidden border-y border-border [--stage-s:min(1,tan(atan2(100vw,1440px)))] supports-[scale:calc(1px/1px)]:[--stage-s:min(1,100vw/1440px)] lg:block"
      >
        <div className="absolute inset-x-0 top-24" style={{ transform: `translateY(${-p * 0.95 * 900}px)` }}>
          <HeroCopy />
        </div>
        <FoldStage progress={progress} scrollY={scrollY} chapter={chapter} layout={layout} className="absolute inset-0" />
        {chapter !== -1 && (
          <div className="absolute top-1/2 left-[calc(120px*var(--stage-s))] flex max-w-[440px] -translate-y-1/2 flex-col gap-3">
            <h2 className="text-[44px] leading-[1.1] font-semibold tracking-tight">{chapters[chapter].heading}</h2>
            <p className="text-lg text-foreground/80">{chapters[chapter].body}</p>
          </div>
        )}
      </div>

      <div className={cn("mx-auto mt-4 max-w-xl lg:hidden")}>
        <PhoneStage chapter={chapter} />
      </div>
    </StoryClock>
  );
}
