import { Window } from "@/components/ui/surface";
import { cn } from "@/lib/utils";

/**
 * A Trilsy window as an illustration on the How it works page: the three Mac
 * window dots, a title and a body. Flat, with a hard ink offset like the hero's.
 * Pass `role="img"` and an `aria-label` for a window that only illustrates; leave
 * both off when it holds something a visitor can use.
 */
export function MockWindow({
  title,
  className,
  children,
  ...props
}: Omit<React.ComponentProps<typeof Window>, "title"> & { title: string }) {
  return (
    <Window radius="lg" lift="soft" className={cn("overflow-hidden text-[13px] leading-[1.4]", className)} {...props}>
      <div aria-hidden className="flex items-center gap-3 border-b border-border bg-muted/60 px-3.5 py-2">
        <span className="flex gap-1.5">
          <i className="size-[11px] rounded-full bg-mac-close" />
          <i className="size-[11px] rounded-full bg-mac-minimize" />
          <i className="size-[11px] rounded-full bg-mac-zoom" />
        </span>
        <span className="truncate text-xs font-semibold text-muted-foreground">{title}</span>
      </div>
      {children}
    </Window>
  );
}

/** One row of the Notes / Transcript control the app shows above a recording. */
export function ViewControl({ active }: { active: "Notes" | "Transcript" }) {
  return (
    <div aria-hidden className="inline-flex w-fit gap-0.5 rounded-lg bg-border/60 p-0.5 text-xs font-semibold">
      {(["Notes", "Transcript"] as const).map((v) => (
        <span
          key={v}
          className={cn("rounded-md px-3 py-1", v === active ? "bg-card text-foreground shadow-[0_0_0_1px_var(--border)]" : "text-muted-foreground")}
        >
          {v}
        </span>
      ))}
    </div>
  );
}
