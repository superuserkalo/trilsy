import { Band } from "@/components/ui/surface";

/**
 * One block of the page: a number and the approved title on the left, the
 * approved text and, where a picture explains it, a window on the right. Rows
 * are separated by the dotted rule, not by cards. The number is a signpost, not
 * a step: it gives the page rhythm and is hidden from screen readers.
 */
export function Block({
  id,
  number,
  title,
  first,
  children,
  visual,
}: {
  id: string;
  number: number;
  title: string;
  first?: boolean;
  children: React.ReactNode;
  visual?: React.ReactNode;
}) {
  return (
    <Band id={id} tone="paper" rules={first ? "none" : "top"} aria-labelledby={`${id}-title`} className="scroll-mt-24">
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-6 px-6 py-12 lg:grid-cols-[5fr_7fr] lg:gap-20 lg:py-20">
        <div className="flex items-baseline gap-4 lg:flex-col lg:gap-3">
          <span aria-hidden className="font-display text-xl text-muted-foreground tabular-nums">
            {String(number).padStart(2, "0")}
          </span>
          <h2 id={`${id}-title`} className="text-3xl leading-[1.05] font-semibold tracking-[-0.015em] text-balance lg:text-[2.5rem]">
            {title}
          </h2>
        </div>
        <div className="flex min-w-0 flex-col gap-8">
          <div className="max-w-[34em] text-[17px] leading-relaxed text-foreground/85 lg:text-lg">{children}</div>
          {visual}
        </div>
      </div>
    </Band>
  );
}

/** A backtick span in the text is a file path; the rest is plain. */
export function Text({ children }: { children: string }) {
  return (
    <p>
      {children.split("`").map((part, i) =>
        i % 2 ? (
          <code key={i} className="rounded bg-muted px-1.5 py-0.5 font-mono text-[0.82em] break-words">
            {part}
          </code>
        ) : (
          part
        ),
      )}
    </p>
  );
}
