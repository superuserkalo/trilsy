"use client";

import { useEffect, useRef, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { DemoWindow } from "./demo-window";
import { useStoryClock, type Frame } from "./story-clock";
import { FIGURE_H, SPEAK, beat, chapters, speakingFigure, speakingLine, type Chapter } from "./story";

// A figure in its 44px tile: drawn 141px tall (the stage's 500px scaled by 0.282), its
// centre 22px from the tile's inner left edge, so the head sits in the middle.
const TILE_FIGURE_H = 141;
const TILE_CENTER = 22;

/**
 * The phone stage (below lg): the people as small tiles, the window full width
 * with one pane, the story photograph behind its top right, and a caption under
 * it that changes per chapter. The speech bubble shows in the hero state only.
 * Its container decides whether it pins (ticket 07).
 *
 * Height: 599px (150 top space, 301 window, 12 gap, 136 caption). Stuck under the
 * 96px header it needs a viewport of 695px or more. Below that (max-height 699px)
 * the top space is 116px, the gap 8px and the caption a 112px block with a 24px
 * heading and 14px body: 537px (541px while the title bar's state label wraps on a
 * 360px phone), which fits a 640px-tall viewport. The window and its panes do not
 * change, so the story stays the same size.
 */
export function PhoneStage({ chapter, className }: { chapter: Chapter; className?: string }) {
  const { setting, register } = useStoryClock();
  const tiles = useRef<(HTMLSpanElement | null)[]>([]);
  const bubble = useRef<HTMLDivElement>(null);
  const [lineIndex, setLineIndex] = useState(0);
  const live = useRef(chapter);
  live.current = chapter;

  useEffect(
    () =>
      register((f: Frame) => {
        const el = bubble.current;
        if (!el || el.offsetParent === null) return;
        const i = speakingLine(f.t);
        if (i >= 0) setLineIndex(i); // React skips the render when it has not changed
        const k = i >= 0 ? Math.min(beat(f.t, SPEAK[i][0], 0.6), 1 - beat(f.t, SPEAK[i][1] + 0.3, 0.4)) : 0;
        el.style.opacity = String(live.current >= 0 ? 0 : k);
        el.style.transform = `translateY(${(1 - k) * 4}px)`;
        const speaking = speakingFigure(f.setting, f.t);
        tiles.current.forEach((t, j) => t?.toggleAttribute("data-speaking", j === speaking));
      }),
    [register],
  );

  const shown = Math.max(0, chapter);
  const line = setting.lines[lineIndex];
  return (
    <div className={cn(
        "relative bg-background px-3 pt-[150px] pb-3 [@media(max-height:699px)]:pt-[116px] [@media(max-height:699px)]:pb-2",
        className,
      )}>
      <div className="absolute top-3.5 left-3 z-[4] flex gap-1.5">
        {setting.figures.map((fig, i) => {
          // Same scale as the stage's figures (500px tall there), so every figure keeps
          // its own aspect ratio: the pack SVGs come out 76px wide, the professor 46px.
          const tileW = Math.round((fig.w * TILE_FIGURE_H) / FIGURE_H);
          return (
            <span
              key={`${setting.key}-${fig.src}`}
              ref={(n) => {
                tiles.current[i] = n;
              }}
              className="relative size-11 overflow-hidden rounded-xl border-2 border-ink bg-field transition-shadow duration-(--duration-base) ease-trilsy data-speaking:shadow-[0_0_0_3px_var(--mustard)]"
            >
              <img
                src={fig.src}
                alt={fig.alt}
                width={tileW}
                height={TILE_FIGURE_H}
                className={cn("absolute top-0.5 max-w-none", fig.flip && "-scale-x-100")}
                style={{ left: TILE_CENTER - tileW / 2 }}
              />
            </span>
          );
        })}
      </div>

      <div
        ref={bubble}
        aria-hidden
        className="absolute top-2.5 left-[170px] z-[4] max-w-[196px] [@media(max-height:699px)]:top-1.5 rounded-xl border-2 border-ink bg-card px-2.5 pt-1.5 pb-2 opacity-0"
      >
        <Badge variant={line.src === "System" ? "system" : "microphone"}>{line.who}</Badge>
        <p className="mt-1 font-hand text-base leading-tight">{line.text}</p>
      </div>

      <div
        role="img"
        aria-label={chapters[shown].alt}
        className={cn(
          "absolute top-0 right-3 z-[1] h-[225px] w-[180px] overflow-hidden rounded-[14px] border-[1.5px] border-ink transition-opacity duration-(--duration-base) ease-trilsy",
          chapter >= 0 ? "opacity-100" : "opacity-0",
        )}
      >
        {chapters.map((c, i) => (
          // TODO: image `{c.photo}` (4:5). A plain colour field at the final size
          // until the owner's photograph arrives; no visible label on the live site.
          <div
            key={c.photo}
            className={cn(
              "absolute inset-0 transition-opacity duration-(--duration-base) ease-trilsy",
              c.tint,
              i === shown ? "opacity-100" : "opacity-0",
            )}
          />
        ))}
      </div>

      <DemoWindow variant="phone" className="relative z-[3]" />

      {/* The chapter caption: on the phone the chapter blocks are only scroll markers. */}
      <div className="grid h-[136px] px-1 pt-[18px] [grid-template-areas:'caption'] [@media(max-height:699px)]:h-[112px] [@media(max-height:699px)]:pt-3.5">
        {chapters.map((c, i) => (
          <div
            key={c.heading}
            aria-hidden={i !== chapter}
            className={cn(
              "transition-opacity duration-(--duration-base) ease-trilsy [grid-area:caption]",
              i === chapter ? "opacity-100" : "opacity-0",
            )}
          >
            <h2 className="mb-1.5 text-[26px] leading-[1.1] font-semibold [@media(max-height:699px)]:text-[24px]">{c.heading}</h2>
            <p className="text-[15px] text-foreground/80 [@media(max-height:699px)]:text-[14px]">{c.body}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

