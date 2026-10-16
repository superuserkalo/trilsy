"use client";

import { useEffect, useState, type ReactNode } from "react";
import { useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

/** Pages without the hero: the island shrinks once the page has scrolled by the header strip (96px). */
const THRESHOLD = 96;

/**
 * The island's height (ticket 17): 80px, or 56px once compact, over 400ms on
 * --ease-trilsy. A state change, not scroll-linked. On home it follows the
 * hero's fold through `<html data-hero-fold>` (ticket 07): compact once the
 * fold is "done", full again while it is "open", so it never moves during the
 * fold. Elsewhere it follows a scroll threshold. The 96px strip around it keeps
 * its height, so nothing else on the page moves. Under reduced motion the
 * island stays at 80px.
 */
export function HeaderIsland({ className, children }: { className?: string; children: ReactNode }) {
  const reduced = useReducedMotion() ?? false;
  const [compact, setCompact] = useState(false);

  useEffect(() => {
    const html = document.documentElement;
    const read = () => {
      const fold = html.dataset.heroFold;
      setCompact(fold ? fold === "done" : window.scrollY > THRESHOLD);
    };
    read();
    const observer = new MutationObserver(read);
    observer.observe(html, { attributes: true, attributeFilter: ["data-hero-fold"] });
    window.addEventListener("scroll", read, { passive: true });
    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", read);
    };
  }, []);

  return (
    <div
      data-island
      data-compact={compact && !reduced ? "" : undefined}
      className={cn(
        "h-20 transition-[height] duration-(--duration-base) ease-trilsy data-compact:h-14",
        className,
      )}
    >
      {children}
    </div>
  );
}
