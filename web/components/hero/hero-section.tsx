"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { useMotionValue, useMotionValueEvent, useReducedMotion, useScroll, useTransform } from "motion/react";
import { FoldStage } from "./fold-stage";
import { PhoneStage } from "./phone-stage";
import { StoryChapters } from "./story-chapters";
import { StoryClock } from "./story-clock";
import { clamp, type Chapter } from "./story";

/** Scroll over which the hero folds into the pinned layout, as a share of the viewport height. */
const FOLD = 0.95;
/** A chapter is active once its block's top has passed this share of the viewport height. */
const LINE_DESKTOP = 0.45;
const LINE_PHONE = 0.7;
/** The chapters wait for the fold to finish. */
const FOLDED = 0.98;
/** Reduced motion: the hero and pinned layouts swap here. */
const SWAP = 0.5;
/** The window is never drawn smaller than this scale, so its 13px text stays near 11.5px. */
const WINDOW_MIN = 0.885;

/**
 * The home page's first section (ticket 07): one sticky track that carries the
 * hero, its fold and the pinned story.
 *
 * Desktop (lg and up): the track starts at the top of the page, under the
 * header. The 100vh stage is sticky at the top; the hero copy sits over it in
 * the first 100vh (plus 124px); then the three 80vh chapter blocks and a 30vh tail. Phone:
 * the copy, then the phone stage sticky under the header, then the three 70vh
 * chapter markers and the same tail.
 *
 * Scroll drives two Motion values and two rarely changing states. `progress`
 * is scroll into the track over 0.95 of the viewport height, clamped and
 * linear (the stage eases per element); `scrollY` is scroll into the track,
 * passed through. `chapter` and, under reduced motion, `layout` are React
 * state, written only when they change, never per frame.
 *
 * For the header (ticket 17): `<html data-hero-fold>` is "open" while the fold
 * runs and "done" once progress reaches 1; it is removed when the section
 * unmounts, so other pages carry no attribute.
 */
export function HeroSection({ copy }: { copy: ReactNode }) {
  const root = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion() ?? false;

  // Measured on mount and resize (the track's page offset is `top`): the viewport height,
  // each chapter block's page offset and whether the desktop stage is in use.
  const geo = useRef({ vh: 1, blocks: [] as number[], desktop: true });
  const top = useMotionValue(0);
  const vh = useMotionValue(1);
  const { scrollY: pageY } = useScroll();
  const scrollY = useTransform(() => pageY.get() - top.get());
  const progress = useTransform(() => clamp(scrollY.get() / (FOLD * vh.get())));

  const [chapter, setChapter] = useState<Chapter>(-1);
  const [layout, setLayout] = useState<"hero" | "pinned">("hero");
  const live = useRef({ chapter, layout, reduced });
  live.current.reduced = reduced;

  const sync = () => {
    const g = geo.current;
    // Computed here, not read from `progress`: inside this handler the derived
    // value may not have caught up with this scroll event yet.
    const y = scrollY.get();
    const p = clamp(y / (FOLD * g.vh));
    const s = live.current;

    const nextLayout = p > SWAP ? "pinned" : "hero";
    if (s.reduced && nextLayout !== s.layout) {
      s.layout = nextLayout;
      setLayout(nextLayout);
    }

    // The last block whose top has passed the line, once the fold is complete.
    // Under reduced motion the fold is the layout swap; the phone has no fold.
    const folded = !g.desktop || (s.reduced ? s.layout === "pinned" : p >= FOLDED);
    const line = g.vh * (g.desktop ? LINE_DESKTOP : LINE_PHONE);
    let next: Chapter = -1;
    if (folded) g.blocks.forEach((top, i) => top - y < line && (next = i as Chapter));
    if (next !== s.chapter) {
      s.chapter = next;
      setChapter(next);
    }

    const fold = p >= 1 ? "done" : "open";
    if (document.documentElement.dataset.heroFold !== fold) document.documentElement.dataset.heroFold = fold;
  };

  useMotionValueEvent(scrollY, "change", sync);

  useEffect(() => {
    const el = track.current;
    if (!el) return;
    const wide = window.matchMedia("(min-width: 1024px)");
    const measure = () => {
      const trackTop = el.getBoundingClientRect().top + window.scrollY;
      const blocks = [...el.querySelectorAll<HTMLElement>("[data-chapter]")].map(
        (b) => b.getBoundingClientRect().top + window.scrollY - trackTop,
      );
      geo.current = { vh: window.innerHeight, blocks, desktop: wide.matches };
      // The stage scale, min(1, 100vw / 1440px). The CSS on the section gives it for the
      // first paint; this repeats it for engines that read neither form correctly
      // (WebKit before typed division returns tan(atan2(vw, px)) with the angle taken
      // as radians when it was degrees, a negative scale that throws the stage off screen).
      // --wf is the window's size over the stage's: 1 from 1274px up, more below it (the same
      // rule as the CSS on the section).
      if (wide.matches) {
        const s = Math.min(1, window.innerWidth / 1440);
        root.current?.style.setProperty("--stage-s", String(s));
        root.current?.style.setProperty("--wf", String(Math.max(1, WINDOW_MIN / s)));
      } else {
        root.current?.style.removeProperty("--stage-s");
        root.current?.style.removeProperty("--wf");
      }
      top.set(trackTop);
      vh.set(window.innerHeight);
      sync();
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    window.addEventListener("resize", measure);
    wide.addEventListener("change", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
      wide.removeEventListener("change", measure);
      delete document.documentElement.dataset.heroFold;
    };
    // `sync` and `measure` read refs only.
  }, [top, vh]);

  // Turning reduced motion on or off mid-page settles the layout from where the page is.
  useEffect(() => {
    const next = progress.get() > SWAP ? "pinned" : "hero";
    live.current.layout = next;
    setLayout(next);
    sync();
  }, [reduced, progress]);

  return (
    <StoryClock chapter={chapter} rootRef={root}>
      {/* --stage-s: typed division where supported (Chrome 140+, Safari 26+), else
          tan(atan2()), which WebKit resolves wrongly for viewport units. --wf: how many times
          larger than the stage scale the window is drawn (0.885 is the least scale it gets). */}
      <section
        ref={root}
        aria-label="Trilsy"
        className="relative [--stage-s:1] [--wf:1] lg:[--stage-s:min(1,tan(atan2(100vw,1440px)))] lg:supports-[scale:calc(1px/1px)]:[--stage-s:min(1,100vw/1440px)] lg:[--wf:max(1,0.885/var(--stage-s))]"
      >
        {/* The track starts at the top of the page on desktop: the 96px header sits over it. */}
        <div ref={track} className="relative lg:-mt-24">
          <FoldStage
            progress={progress}
            scrollY={scrollY}
            chapter={chapter}
            layout={reduced ? layout : undefined}
            className="sticky top-0 z-[1] hidden h-screen lg:block"
          />
          {/* The hero copy, over the stage. Its block is 100vh plus the copy's 124px top
              space (header 96, copy 28), as in the prototype: that puts the first
              chapter's heading level with the pinned window when the fold completes. */}
          <div className="relative z-[5] lg:pointer-events-none lg:-mt-[100vh] lg:h-[calc(100vh+124px)] lg:pt-24 lg:[&>*]:pointer-events-auto">
            {copy}
          </div>
          <PhoneStage chapter={chapter} className="sticky top-24 z-[3] mx-auto max-w-xl lg:hidden" />
          <StoryChapters chapter={chapter} mode="pinned" />
          <div aria-hidden className="h-[30vh]" />
        </div>
        <p className="pb-10 text-center text-[15px] text-muted-foreground">Your recordings stay on your Mac.</p>
      </section>
    </StoryClock>
  );
}
