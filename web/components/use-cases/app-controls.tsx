import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowDown01Icon, AudioWave01Icon } from "@hugeicons/core-free-icons";
import { cn } from "@/lib/utils";

/*
 * Drawn copies of the app's controls for the use-case windows that play a
 * click-through (the recording sources, the app picker, the Export menu). They
 * are decoration inside an `aria-hidden` window, so none of them is focusable;
 * the real `Switch` on How it works is the one a visitor can use. Each keeps its
 * size in every state, so a window never changes height while it plays.
 */

/** The Trilsy switch, drawn: ink-bordered pill, mustard when on. */
export function DrawnSwitch({ on }: { on: boolean }) {
  return (
    <span
      className={cn(
        "relative inline-flex h-6 w-10 shrink-0 items-center rounded-full border-2 border-ink transition-colors duration-(--duration-base) ease-trilsy",
        on ? "bg-primary" : "bg-card",
      )}
    >
      <span
        className={cn(
          "block size-4 rounded-full bg-ink transition-transform duration-(--duration-base) ease-trilsy",
          on ? "translate-x-[18px]" : "translate-x-0.5",
        )}
      />
    </span>
  );
}

/**
 * A small drop-down menu that opens over what is below it. It is always in the
 * DOM and fades, so opening it moves nothing. `highlighted` is the row under the
 * pointer, `checked` the row the picker holds.
 */
export function PopMenu({
  items,
  open,
  highlighted,
  checked,
  className,
}: {
  items: readonly string[];
  open: boolean;
  highlighted?: number;
  checked?: number;
  className?: string;
}) {
  return (
    <ul
      className={cn(
        "absolute top-full z-10 mt-1 min-w-44 rounded-lg border-2 border-ink bg-card p-1 text-[13px] font-semibold transition-opacity duration-(--duration-base) ease-trilsy",
        open ? "opacity-100" : "pointer-events-none opacity-0",
        className,
      )}
    >
      {items.map((item, i) => (
        <li
          key={item}
          className={cn(
            "flex items-center justify-between gap-4 rounded-md px-2.5 py-1.5 whitespace-nowrap transition-colors duration-(--duration-base) ease-trilsy",
            highlighted === i && "bg-primary text-primary-foreground",
          )}
        >
          {item}
          {checked === i && <span className="size-1.5 rounded-full bg-current" />}
        </li>
      ))}
    </ul>
  );
}

/** A drop-down button: a label and a chevron. `pressed` is the ink-bordered, mustard state. */
export function MenuButton({ label, pressed = false, className }: { label: string; pressed?: boolean; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-md border border-border bg-card px-2.5 py-1 text-xs font-semibold transition-colors duration-(--duration-base) ease-trilsy",
        pressed && "border-ink bg-primary text-primary-foreground",
        className,
      )}
    >
      {label}
      <HugeiconsIcon icon={ArrowDown01Icon} strokeWidth={2} className="size-3" />
    </span>
  );
}

/**
 * The panes the app shows when there is nothing to read yet. The words are the
 * app's own: with no recording selected, and with a recording that has no notes.
 * The windows that start from nothing show one first and cross-fade out of it.
 */
export function EmptyPane({
  className,
  title,
  text = "Record a conversation or import a file. Your audio, transcript and notes stay on this Mac.",
}: {
  className?: string;
  title?: string;
  text?: string;
}) {
  return (
    <div className={cn("flex flex-col items-center justify-center gap-3 px-8 text-center", className)}>
      <HugeiconsIcon icon={AudioWave01Icon} strokeWidth={2} className="size-8 text-muted-foreground" />
      <div className="flex max-w-[22em] flex-col gap-1">
        {title && <p className="font-semibold">{title}</p>}
        <p className="text-muted-foreground">{text}</p>
      </div>
    </div>
  );
}
