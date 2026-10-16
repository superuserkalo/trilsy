"use client";

import { useRef } from "react";
import { useInView } from "motion/react";

/**
 * The use-case windows play once, when they come into view, and show their
 * finished state at once under `prefers-reduced-motion`. `ref` goes on the
 * window; `inView` turns true once and stays true.
 */
export function usePlayOnce(amount = 0.4) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount });
  return { ref, inView };
}

export const prefersReducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;
