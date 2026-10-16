"use client";

import { useLayoutEffect, useRef, useState, type ReactNode } from "react";
import { m, useInView, useReducedMotion } from "motion/react";
import { instant, transition } from "@/lib/motion";

/**
 * The site's one scroll reveal (ticket 17): the block rises 16px and fades in
 * over 600ms on --ease-trilsy, once, when a fifth of it is in view. Used only
 * on home, from the trust band down; the hero section has none.
 *
 * Server-rendered visible, so the content is there without JavaScript. On mount
 * the block is hidden only if it starts below the viewport, so nothing on
 * screen ever blinks out; a block already on screen (a reload mid-page, an
 * anchor jump) just stays. Under reduced motion it is never hidden.
 */
export function Reveal({ children, className }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion() ?? false;
  const inView = useInView(ref, { once: true, amount: 0.2 });
  const [armed, setArmed] = useState(false);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el || reduced) return;
    if (el.getBoundingClientRect().top > window.innerHeight) setArmed(true);
    // Only the first layout decides; `reduced` turning on later is handled by `hidden`.
  }, []);

  const hidden = armed && !inView && !reduced;
  return (
    <m.div
      ref={ref}
      className={className}
      initial={false}
      animate={hidden ? { opacity: 0, y: 16 } : { opacity: 1, y: 0 }}
      transition={hidden || reduced ? instant : transition}
    >
      {children}
    </m.div>
  );
}
