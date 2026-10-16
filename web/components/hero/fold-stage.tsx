"use client";

import { useEffect, useLayoutEffect, useRef } from "react";
import { animate, useMotionValueEvent, type MotionValue } from "motion/react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { ease } from "@/lib/motion";
import { DemoWindow } from "./demo-window";
import { useStoryClock, type Frame } from "./story-clock";
import {
  BAND_TOP,
  BUBBLE_TOP,
  FIGURE_H,
  FIGURE_VISIBLE,
  FLOOR,
  HERO_WINDOW,
  PHOTO,
  PIN_WINDOW,
  SPEAK,
  TILE,
  beat,
  chapters,
  clamp,
  easeTrilsy,
  lerp,
  speakingFigure,
  type Chapter,
} from "./story";

const useIsoLayoutEffect = typeof window === "undefined" ? useEffect : useLayoutEffect;

/**
 * Between 1024px and about 1274px the window is drawn larger than the stage scale (`--wf`,
 * set on the section: how many times larger, 1 from 1274px up) so its text stays near 11.5px.
 * It grows about its centre, so the people and their bubbles step outward by `--push`, the
 * growth of one window half in stage units, never past the stage edge (they may bleed off it
 * by the transparent margin of their drawing). All of it is CSS, so the first paint is right.
 */
const BLEED = 40;
const CENTER = HERO_WINDOW.x + HERO_WINDOW.w / 2;
/** A leftward (-1) or rightward (1) step of `--push`, held back to `room` stage units, fading out with `k`. */
const step = (dir: 1 | -1, room: number, k = 0) =>
  `calc(${dir * (1 - k)} * min(var(--push), ${Math.max(0, room)}) * 1px)`;
const figureStep = (fig: { x: number; w: number }, k = 0) =>
  fig.x + fig.w / 2 < CENTER ? step(-1, fig.x + BLEED, k) : step(1, 1440 + BLEED - fig.x - fig.w, k);
const bubbleStep = (line: { bx: number; bw: number }, fig: { x: number; w: number }) =>
  fig.x + fig.w / 2 < CENTER ? step(-1, line.bx - 8) : step(1, 1432 - line.bx - line.bw);

/**
 * The desktop stage (lg and up): the hero scene and the pinned story drawn on
 * one 1440 by 900 stage, scaled to the viewport by CSS (`--stage-s`).
 * `progress` folds it from the hero (0) to the pinned layout (1); `scrollY`
 * moves the parts that leave with the page. Under reduced motion nothing
 * travels: the two layouts swap by an opacity cross-fade at `layout`, and the
 * demo keeps playing on its clock with fades only.
 *
 * The stage's top edge is the top of the page (the header included); its
 * container decides where that is (ticket 07 pins it).
 */
export function FoldStage({
  progress,
  scrollY,
  chapter,
  layout,
  className,
}: {
  progress: MotionValue<number>;
  scrollY: MotionValue<number>;
  chapter: Chapter;
  /** Reduced motion only: which layout is showing. Derived from progress if omitted. */
  layout?: "hero" | "pinned";
  className?: string;
}) {
  const { setting, register, reduced } = useStoryClock();
  const box = useRef<HTMLDivElement>(null);
  const band = useRef<HTMLDivElement>(null);
  const win = useRef<HTMLDivElement>(null);
  const photo = useRef<HTMLDivElement>(null);
  const figures = useRef<(HTMLDivElement | null)[]>([]);
  const inners = useRef<(HTMLDivElement | null)[]>([]);
  const bubbles = useRef<(HTMLDivElement | null)[]>([]);
  const fold = useRef({ scale: 1, shown: 0, bubbleFade: 1, tiles: [] as number[] });

  // Everything is a transform, so the fold never shifts layout.
  const update = () => {
    const f = fold.current;
    const p = reduced ? f.shown : progress.get();
    const ys = scrollY.get() / f.scale;
    const keep = 1 - p; // how much of the hero's vertical offset (--dy) still applies
    const wx = lerp(HERO_WINDOW.x, PIN_WINDOW.x, p);
    const wy = reduced && p === 0 ? HERO_WINDOW.y - ys : lerp(HERO_WINDOW.y, PIN_WINDOW.y, p);
    if (win.current) {
      win.current.style.transform = `translate(calc(${wx}px - ${keep} * var(--push) * 1px), calc(${wy}px + var(--dy) * ${keep})) scale(calc(${lerp(1, PIN_WINDOW.w / HERO_WINDOW.w, p)} * var(--wf, 1)))`;
    }
    if (band.current) band.current.style.transform = `translateY(calc(${BAND_TOP - ys}px + var(--dy)))`;
    f.bubbleFade = clamp(1 - p * 3);
    bubbles.current.forEach((b, i) => {
      if (!b) return;
      const line = setting.lines[i];
      b.style.transform = `translate(calc(${line.bx}px + ${bubbleStep(line, setting.figures[line.fig])}), calc(${BUBBLE_TOP - ys}px + var(--dy)))`;
    });
    // People fold into tiles on the window's left edge, one a little after another.
    f.tiles = setting.figures.map((fig, i) => {
      const k = easeTrilsy(clamp((p - 0.05 * i) / 0.85));
      const heroY = FLOOR - FIGURE_VISIBLE - ys;
      const tileY = wy + TILE.dy + TILE.gap * i;
      // The tile target sits on the window's left edge, which moves with the window's growth (keep of --push).
      const x = lerp(fig.x, wx + TILE.dx, k);
      const y = lerp(heroY, tileY, k);
      const w = lerp(fig.w, TILE.size, k);
      const h = lerp(FIGURE_VISIBLE, TILE.size, k);
      const s = lerp(1, TILE.scale, k);
      const el = figures.current[i];
      const inner = inners.current[i];
      if (el) {
        el.style.transform = `translate(calc(${x}px + ${figureStep(fig, k)} - ${keep * k} * var(--push) * 1px), calc(${y}px + var(--dy) * ${lerp(1, keep, k)}))`;
        el.style.width = `${w}px`;
        el.style.height = `${h}px`;
        el.style.borderRadius = `${TILE.radius * k}px`;
        el.style.borderWidth = k > 0.5 ? "2px" : "0px";
        el.style.backgroundColor = `color-mix(in srgb, var(--field) ${k * 100}%, transparent)`;
        el.style.zIndex = k > 0.3 ? "4" : "1";
      }
      if (inner) {
        inner.style.transform = `translate(${lerp(0, TILE.size / 2 - (fig.w * TILE.scale) / 2, k)}px, ${lerp(0, 7, k)}px) scale(${s})`;
      }
      return k;
    });
    if (photo.current) {
      const k = clamp((p - 0.35) / 0.65);
      photo.current.style.opacity = String(k);
      photo.current.style.transform = `translate(${PHOTO.x - 180 * (1 - k)}px, ${PHOTO.y + 160 * (1 - k)}px) scale(${0.8 + 0.2 * k})`;
    }
  };

  // The stage's real scale, for turning page scroll into stage units.
  useIsoLayoutEffect(() => {
    const measure = () => {
      if (box.current) fold.current.scale = box.current.getBoundingClientRect().width / 1440 || 1;
      update();
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  });

  useMotionValueEvent(progress, "change", () => {
    if (!reduced) update();
  });
  useMotionValueEvent(scrollY, "change", update);

  // Reduced motion: no travel. Fade out, switch layout, fade in (200ms each way).
  const target = layout ?? "hero";
  useEffect(() => {
    if (!reduced) return;
    const next = target === "pinned" ? 1 : 0;
    if (fold.current.shown === next || !box.current) return;
    const el = box.current;
    const controls = animate(el, { opacity: 0 }, { duration: 0.2, ease });
    controls.then(() => {
      fold.current.shown = next;
      update();
      animate(el, { opacity: 1 }, { duration: 0.2, ease });
    });
    return () => controls.stop();
    // `update` reads refs only.
  }, [reduced, target]);
  useMotionValueEvent(progress, "change", (v) => {
    if (reduced && layout === undefined) {
      const next = v > 0.5 ? 1 : 0;
      if (next !== fold.current.shown && box.current) {
        const el = box.current;
        animate(el, { opacity: 0 }, { duration: 0.2, ease }).then(() => {
          fold.current.shown = next;
          update();
          animate(el, { opacity: 1 }, { duration: 0.2, ease });
        });
      }
    }
  });

  // The clock paints what depends on storyboard time: bubbles, the speaking tile, the seam.
  useEffect(
    () =>
      register((f: Frame) => {
        const s = f.setting;
        bubbles.current.forEach((b, i) => {
          if (!b) return;
          const [a, e] = SPEAK[i];
          const kin = beat(f.t, a, 0.6);
          const k = kin * (1 - beat(f.t, e + 0.3, 0.4));
          b.style.opacity = String(k * fold.current.bubbleFade);
          b.style.scale = f.reduced ? "" : String(0.96 + 0.04 * kin);
        });
        const speaking = speakingFigure(s, f.t);
        figures.current.forEach((el, i) => {
          if (!el) return;
          el.style.opacity = String(f.seam);
          const folded = (fold.current.tiles[i] ?? 0) > 0.95;
          el.style.boxShadow = folded && i === speaking ? "0 0 0 3px var(--mustard)" : "none";
        });
      }),
    [register],
  );

  return (
    <div
      className={cn(
        "pointer-events-none overflow-hidden [--dy:calc(404px/var(--stage-s)-404px)] [--push:calc(290*(var(--wf,1)_-_1))] [--pf:calc(1_+_0.75*(var(--wf,1)_-_1))]",
        className,
      )}
    >
      <div
        ref={box}
        className="absolute top-0 left-1/2 h-[900px] w-[1440px] origin-top -translate-x-1/2 scale-(--stage-s) [&>*]:absolute [&>*]:top-0 [&>*]:left-0"
      >
        <div
          ref={band}
          className="-left-[2000px]! h-[448px] w-[5440px] border-t-[1.5px] border-dotted border-ink bg-field"
          style={{ transform: `translateY(calc(${BAND_TOP}px + var(--dy)))` }}
        />

        <div
          ref={photo}
          role="img"
          aria-label={chapters[Math.max(0, chapter)].alt}
          className="overflow-hidden rounded-[18px] border-[1.5px] border-ink opacity-0"
          style={{ width: `calc(${PHOTO.w}px * var(--pf, 1))`, height: `calc(${PHOTO.h}px * var(--pf, 1))` }}
        >
          {chapters.map((c, i) => (
            // TODO: image `{c.photo}` (4:5). A plain colour field at the final size
            // until the owner's photograph arrives; no visible label on the live site.
            <div
              key={c.photo}
              className={cn(
                "absolute inset-0 transition-opacity duration-(--duration-slow) ease-trilsy",
                c.tint,
                i === Math.max(0, chapter) ? "opacity-100" : "opacity-0",
              )}
            />
          ))}
        </div>

        {setting.figures.map((fig, i) => (
          <div
            key={`${setting.key}-${fig.src}`}
            ref={(n) => {
              figures.current[i] = n;
            }}
            className="overflow-hidden border-0 border-ink"
            style={{
              width: fig.w,
              height: FIGURE_VISIBLE,
              transform: `translate(calc(${fig.x}px + ${figureStep(fig)}), calc(${FLOOR - FIGURE_VISIBLE}px + var(--dy)))`,
            }}
          >
            <div
              ref={(n) => {
                inners.current[i] = n;
              }}
              className="absolute top-0 left-0 origin-top-left"
            >
              <img
                src={fig.src}
                alt={fig.alt}
                width={fig.w}
                height={FIGURE_H}
                className={cn("block max-w-none origin-[50%_62%] animate-idle", fig.flip && "-scale-x-100")}
                style={{ animationDuration: `${[6.2, 7.9, 5.3, 9.1][i]}s`, animationDelay: `-${i * 1.7}s` }}
              />
            </div>
          </div>
        ))}

        <div
          ref={win}
          className="z-[3] w-[580px] origin-top-left pointer-events-auto"
          style={{ transform: `translate(calc(${HERO_WINDOW.x}px - var(--push) * 1px), calc(${HERO_WINDOW.y}px + var(--dy))) scale(var(--wf, 1))` }}
        >
          <DemoWindow variant="desktop" />
        </div>

        {setting.lines.map((line, i) => {
          const fig = setting.figures[line.fig];
          const tail = fig.x + fig.w / 2 - line.bx;
          return (
            <div
              key={`${setting.key}-${i}`}
              ref={(n) => {
                bubbles.current[i] = n;
              }}
              className="z-[5] origin-bottom rounded-[14px] border-[2.2px] border-ink bg-card px-4 pt-2.5 pb-3 opacity-0 after:absolute after:-bottom-3.5 after:left-[calc(var(--tail)-9px)] after:h-3.5 after:w-[18px] after:rounded-b-sm after:border-[2.2px] after:border-t-0 after:border-ink after:bg-card after:[clip-path:polygon(0_0,100%_0,40%_100%)]"
              style={
                {
                  width: line.bw,
                  // The tail follows the figure: both step outward, the bubble held back by its own room.
                  "--tail": `clamp(30px, calc(${tail}px + ${figureStep(fig)} - ${bubbleStep(line, fig)}), ${line.bw - 30}px)`,
                  transform: `translate(calc(${line.bx}px + ${bubbleStep(line, fig)}), calc(${BUBBLE_TOP}px + var(--dy)))`,
                } as React.CSSProperties
              }
            >
              <Badge variant={line.src === "System" ? "system" : "microphone"}>{line.who}</Badge>
              <p className="mt-1.5 font-hand text-[19px] leading-tight">{line.text}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
