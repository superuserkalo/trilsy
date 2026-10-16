"use client";

import { Fragment, useEffect, useLayoutEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

const useIsoLayoutEffect = typeof window === "undefined" ? useEffect : useLayoutEffect;

/**
 * The chisel-band marker behind the headline's second sentence (B4, "fix to
 * version A"). The stroke is a fixed SVG on each line's ::before at its final
 * geometry, revealed left to right by clip-path only, so it never moves while
 * it draws: 600ms per line on --ease-trilsy, line after line, from 300ms after
 * first paint. Static under reduced motion. Words are grouped into lines once
 * the fonts are in; a later resize regroups them without drawing again. The
 * line span carries no padding or margin, so grouping cannot change a line's
 * width and the headline keeps the breaks it had at first paint; the band
 * bleeds past the text on its ::before alone. A <br> sits at every line
 * start the marker knows (between its lines, and before the first one when it
 * starts a line), so the headline's text-balance cannot re-break them: it keeps
 * the breaks the words had before they were grouped. Some headlines are a 2px
 * tie between two breaks, which the unbreakable line spans alone flipped.
 */
export function Marker({ children }: { children: string }) {
  const words = children.split(" ");
  const ref = useRef<HTMLSpanElement>(null);
  // null: render one span per word and measure where each line starts.
  const [lines, setLines] = useState<string[] | null>(null);
  // The first group starts a line of its own, with text before it in the headline.
  const [lead, setLead] = useState(false);
  const [ready, setReady] = useState(false);
  const [drawn, setDrawn] = useState(false);

  // Group by the headline's real face: wait for it, and regroup if a font lands later.
  useEffect(() => {
    let cancelled = false;
    const el = ref.current;
    const style = el ? getComputedStyle(el) : null;
    const face = style ? `${style.fontWeight} ${style.fontSize} ${style.fontFamily}` : "";
    (face ? document.fonts.load(face) : document.fonts.ready).finally(() => !cancelled && setReady(true));
    const regroup = () => setLines(null);
    document.fonts.addEventListener("loadingdone", regroup);
    return () => {
      cancelled = true;
      document.fonts.removeEventListener("loadingdone", regroup);
    };
  }, []);

  useIsoLayoutEffect(() => {
    if (!ready || lines || !ref.current) return;
    const groups: string[] = [];
    let top: number | null = null;
    for (const w of Array.from(ref.current.children)) {
      const t = Math.round(w.getBoundingClientRect().top);
      if (top === null || Math.abs(t - top) > 8) {
        groups.push(w.textContent ?? "");
        top = t;
      } else groups[groups.length - 1] += ` ${w.textContent}`;
    }
    const first = ref.current.firstElementChild?.getBoundingClientRect().left ?? 0;
    const host = ref.current.parentElement?.getBoundingClientRect().left ?? 0;
    setLead(!!ref.current.previousSibling && Math.abs(first - host) < 1);
    setLines(groups);
  }, [ready, lines]);

  useEffect(() => {
    const host = ref.current?.parentElement;
    if (!host) return;
    let width = host.offsetWidth;
    const ro = new ResizeObserver(() => {
      if (host.offsetWidth === width) return;
      width = host.offsetWidth;
      setDrawn(true); // after the first draw, a new wrap shows at once
      setLines(null);
    });
    ro.observe(host);
    return () => ro.disconnect();
  }, []);

  if (!lines) {
    return (
      <span ref={ref}>
        {words.map((w, i) => (
          <Fragment key={i}>
            {i > 0 && " "}
            <span>{w}</span>
          </Fragment>
        ))}
      </span>
    );
  }
  return (
    <span ref={ref}>
      {lines.map((line, i) => (
        <Fragment key={line}>
          {(i > 0 || lead) && (
            <>
              {" "}
              <br />
            </>
          )}
          <span
            className={cn(
              "relative isolate whitespace-nowrap",
              "before:absolute before:-inset-x-[0.2em] before:-top-[9%] before:-bottom-[9%] before:-z-10 before:bg-[url(/marker-chisel.svg)] before:bg-no-repeat before:[background-size:100%_100%]",
              drawn
                ? "before:[clip-path:inset(0)]"
                : "before:animate-marker before:[animation-delay:var(--delay)] motion-reduce:before:animate-none motion-reduce:before:[clip-path:inset(0)]",
            )}
            style={{ "--delay": `${300 + i * 650}ms` } as React.CSSProperties}
          >
            {line}
          </span>
        </Fragment>
      ))}
    </span>
  );
}
