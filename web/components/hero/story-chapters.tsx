import { cn } from "@/lib/utils";
import { chapters, type Chapter } from "./story";

/**
 * The story's three chapters (copy deck section 4). Pinned (ticket 07): on
 * desktop, 80vh blocks in the left column beside the pinned window, the active
 * one at full strength; on the phone, invisible 70vh scroll markers, because the
 * phone stage shows the caption itself. Flow: plain blocks in reading order, for
 * the page before ticket 07 wires the scroll.
 */
export function StoryChapters({
  chapter,
  mode,
  className,
}: {
  chapter: Chapter;
  mode: "flow" | "pinned";
  className?: string;
}) {
  if (mode === "flow") {
    return (
      <ol className={cn("mx-auto grid max-w-6xl gap-10 px-6 py-16 lg:grid-cols-3 lg:gap-12", className)}>
        {chapters.map((c) => (
          <li key={c.heading} className="flex flex-col gap-3">
            <h2 className="text-3xl leading-tight font-semibold lg:text-4xl">{c.heading}</h2>
            <p className="text-lg text-foreground/80">{c.body}</p>
          </li>
        ))}
      </ol>
    );
  }
  return (
    <ol className={cn("relative", className)}>
      {chapters.map((c, i) => (
        <li
          key={c.heading}
          data-chapter={i}
          className="flex h-[70vh] items-end pb-[6vh] max-lg:invisible lg:mx-auto lg:h-[80vh] lg:w-full lg:max-w-[1440px] lg:items-center lg:pb-0 lg:pl-[calc(120px*var(--stage-s,1))]"
        >
          <div className="flex max-w-[440px] flex-col gap-3">
            {/* The other two chapters step back to the muted ink (5.5:1 on paper, so they still
                read), not to a fade: the active one leads by colour. */}
            <h2
              className={cn(
                "text-[44px] leading-[1.1] font-semibold tracking-tight transition-colors duration-(--duration-base) ease-trilsy",
                i === chapter ? "text-foreground" : "text-muted-foreground",
              )}
            >
              {c.heading}
            </h2>
            <p
              className={cn(
                "text-lg transition-colors duration-(--duration-base) ease-trilsy",
                i === chapter ? "text-foreground/80" : "text-muted-foreground",
              )}
            >
              {c.body}
            </p>
          </div>
        </li>
      ))}
    </ol>
  );
}
