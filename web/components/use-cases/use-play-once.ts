"use client";

import { useRef } from "react";
import { useInView } from "motion/react";

/**
 * The use-case windows play once, when they come into view. Under
 * `prefers-reduced-motion` they play the same steps, with fades in place of
 * moves (see `useMotionTransition` in lib/motion.ts and the reduced-motion rule
 * in app/globals.css). `ref` goes on the window; `inView` turns true once and
 * stays true.
 */
export function usePlayOnce(amount = 0.4) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount });
  return { ref, inView };
}

