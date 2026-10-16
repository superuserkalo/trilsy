"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
  type RefObject,
} from "react";
import { useReducedMotion } from "motion/react";
import {
  T_END,
  beat,
  chapterTime,
  order,
  settings,
  type Chapter,
  type Setting,
  type SettingKey,
} from "./story";

/** What every painter receives once per frame. */
export type Frame = {
  /** Storyboard seconds. */
  t: number;
  setting: Setting;
  /** Opacity of the scene at the seam between two settings (600ms cross-fade). */
  seam: number;
  /** A tab was clicked: the cycle has stopped on that setting. */
  manual: boolean;
  chapter: Chapter;
  reduced: boolean;
};
export type Painter = (frame: Frame) => void;

type StoryClockValue = {
  setting: Setting;
  select: (key: SettingKey) => void;
  register: (painter: Painter) => () => void;
  reduced: boolean;
};

const StoryClockContext = createContext<StoryClockValue | null>(null);

export function useStoryClock() {
  const value = useContext(StoryClockContext);
  if (!value) throw new Error("useStoryClock needs a <StoryClock> above it");
  return value;
}

/**
 * Runs the hero's demo on its own clock. The window, the bubbles and the tiles
 * all paint from the same storyboard time, so speech, waveform, timer and
 * transcript can never disagree. Pauses when the section is more than 100px
 * off screen and resumes where it stopped. Under reduced motion the clock runs
 * the same; the painters swap moves for fades (`Frame.reduced`).
 */
export function StoryClock({
  chapter,
  rootRef,
  freezeAt,
  children,
}: {
  /** -1 in the hero; 0, 1 or 2 when a story chapter is active. */
  chapter: Chapter;
  /** The element whose visibility pauses the clock. */
  rootRef: RefObject<HTMLElement | null>;
  /** Development check only: hold the storyboard at this time. */
  freezeAt?: number;
  children: ReactNode;
}) {
  const reduced = useReducedMotion() ?? false;
  const [key, setKey] = useState<SettingKey>("lecture");
  const painters = useRef(new Set<Painter>());
  const live = useRef({ key, chapter, reduced, freezeAt, manual: false, t: 0, chapterClock: 0, visible: true });
  live.current.key = key;
  live.current.chapter = chapter;
  live.current.reduced = reduced;
  live.current.freezeAt = freezeAt;

  // A new chapter restarts its beat.
  useEffect(() => {
    live.current.chapterClock = 0;
  }, [chapter]);

  useEffect(() => {
    const root = rootRef.current;
    const io = new IntersectionObserver(([entry]) => (live.current.visible = entry.isIntersecting), {
      rootMargin: "100px",
    });
    if (root) io.observe(root);

    // The clock runs on elapsed time, not frame counts, so a browser that throttles
    // requestAnimationFrame (battery savers, frame limiters) slows the painting but
    // not the story. A step of more than a second (a tab that was hidden) is held to
    // one second. If frames stop arriving while the page is visible, a slow timer
    // keeps the story moving.
    let raf = 0;
    let last = performance.now();
    const tick = (now: number) => {
      const s = live.current;
      const dt = Math.min(1, Math.max(0, (now - last) / 1000));
      last = now;
      if (!s.visible) return;
      if (s.freezeAt === undefined) {
        if (s.chapter >= 0) s.chapterClock += dt;
        else {
          s.t += dt;
          if (s.t >= T_END) {
            if (s.manual) s.t = T_END - 0.01;
            else {
              s.t = 0;
              const next = order[(order.indexOf(s.key) + 1) % order.length];
              s.key = next;
              setKey(next);
            }
          }
        }
      }
      const t = s.freezeAt ?? chapterTime(s.chapter, s.chapterClock, s.t);
      const still = s.chapter >= 0 || s.manual || s.freezeAt !== undefined;
      const seam = still ? 1 : Math.min(beat(t, 0, 0.6), 1 - beat(t, T_END - 0.6, 0.6));
      const f: Frame = { t, setting: settings[s.key], seam, manual: s.manual, chapter: s.chapter, reduced: s.reduced };
      painters.current.forEach((paint) => paint(f));
    };
    const frame = (now: number) => {
      tick(now);
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);
    const fallback = window.setInterval(() => {
      const now = performance.now();
      if (document.visibilityState === "visible" && now - last > 250) tick(now);
    }, 250);
    return () => {
      cancelAnimationFrame(raf);
      window.clearInterval(fallback);
      io.disconnect();
    };
  }, [rootRef]);

  const select = useCallback((next: SettingKey) => {
    Object.assign(live.current, { key: next, manual: true, t: 0, chapterClock: 0 });
    setKey(next);
  }, []);

  const register = useCallback((painter: Painter) => {
    painters.current.add(painter);
    return () => {
      painters.current.delete(painter);
    };
  }, []);

  const value = useMemo(
    () => ({ setting: settings[key], select, register, reduced }),
    [key, select, register, reduced],
  );
  return <StoryClockContext.Provider value={value}>{children}</StoryClockContext.Provider>;
}
