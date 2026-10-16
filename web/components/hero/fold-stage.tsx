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
 * The desktop stage (lg and up): the hero scene and the pinned story drawn on
 * one 1440 by 900 stage, scaled to the viewport by CSS (`--stage-s`).
 * `progress` folds it from the hero (0) to the pinned layout (1); `scrollY`
 * moves the parts that leave with the page. Under reduced motion nothing
 * travels: the two layouts swap by an opacity cross-fade at `layout`.
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
      win.current.style.transform = `translate(${wx}px, calc(${wy}px + var(--dy) * ${keep})) scale(${lerp(1, PIN_WINDOW.w / HERO_WINDOW.w, p)})`;
    }
    if (band.current) band.current.style.transform = `translateY(calc(${BAND_TOP - ys}px + var(--dy)))`;
    f.bubbleFade = clamp(1 - p * 3);
    bubbles.current.forEach((b, i) => {
      if (!b) return;
      b.style.transform = `translate(${setting.lines[i].bx}px, calc(${BUBBLE_TOP - ys}px + var(--dy)))`;
    });
    // People fold into tiles on the window's left edge, one a little after another.
    f.tiles = setting.figures.map((fig, i) => {
      const k = easeTrilsy(clamp((p - 0.05 * i) / 0.85));
      const heroY = FLOOR - FIGURE_VISIBLE - ys;
      const tileY = wy + TILE.dy + TILE.gap * i;
      const x = lerp(fig.x, wx + TILE.dx, k);
      const y = lerp(heroY, tileY, k);
      const w = lerp(fig.w, TILE.size, k);
      const h = lerp(FIGURE_VISIBLE, TILE.size, k);
      const s = lerp(1, TILE.scale, k);
      const el = figures.current[i];
      const inner = inners.current[i];
      if (el) {
        el.style.transform = `translate(${x}px, calc(${y}px + var(--dy) * ${lerp(1, keep, k)}))`;
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
          b.style.scale = String(0.96 + 0.04 * kin);
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
        "pointer-events-none overflow-hidden [--dy:calc(404px/var(--stage-s)-404px)]",
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
          style={{ width: PHOTO.w, height: PHOTO.h }}
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
              transform: `translate(${fig.x}px, calc(${FLOOR - FIGURE_VISIBLE}px + var(--dy)))`,
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
          style={{ transform: `translate(${HERO_WINDOW.x}px, calc(${HERO_WINDOW.y}px + var(--dy)))` }}
        >
          <DemoWindow variant="desktop" />
        </div>

        {setting.lines.map((line, i) => {
          const fig = setting.figures[line.fig];
          const tail = clamp(fig.x + fig.w / 2 - line.bx, 30, line.bw - 30);
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
                  "--tail": `${tail}px`,
                  transform: `translate(${line.bx}px, calc(${BUBBLE_TOP}px + var(--dy)))`,
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
