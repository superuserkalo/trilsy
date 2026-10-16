import { Window } from "@/components/ui/surface";
import { EditButton, RecordingMenu } from "@/components/use-cases/app-chrome";
import { cn } from "@/lib/utils";

/**
 * A Trilsy window as an illustration on the How it works page: the three Mac
 * window dots, a title and a body. Flat, with a hard ink offset like the hero's.
 * Pass `role="img"` and an `aria-label` for a window that only illustrates; leave
 * both off when it holds something a visitor can use. `toolbar` is the app's
 * toolbar, at the right of the title bar.
 */
export function MockWindow({
  title,
  toolbar,
  className,
  children,
  ...props
}: Omit<React.ComponentProps<typeof Window>, "title"> & { title: string; toolbar?: React.ReactNode }) {
  return (
    <Window radius="lg" lift="soft" className={cn("overflow-hidden text-[13px] leading-[1.4]", className)} {...props}>
      <div aria-hidden className="flex items-center gap-3 border-b border-border bg-muted/60 px-3.5 py-2">
        <span className="flex gap-1.5">
          <i className="size-[11px] rounded-full bg-mac-close" />
          <i className="size-[11px] rounded-full bg-mac-minimize" />
          <i className="size-[11px] rounded-full bg-mac-zoom" />
        </span>
        <span className="min-w-0 flex-1 truncate text-xs font-semibold text-muted-foreground">{title}</span>
        {toolbar && <span className="flex shrink-0 items-center gap-2">{toolbar}</span>}
      </div>
      {children}
    </Window>
  );
}

/**
 * The row the app shows above a recording's text: the Notes and Transcript tabs
 * (the open one underlined), then "Edit" (on the Notes tab, once there are
 * notes) and the "…" menu. `menu` swaps in an open or highlighted menu.
 */
export function ViewControl({
  active,
  edit = active === "Notes" ? "Edit" : null,
  editPressed = false,
  menu,
}: {
  active: "Notes" | "Transcript";
  edit?: "Edit" | "Done" | null;
  editPressed?: boolean;
  menu?: React.ReactNode;
}) {
  return (
    <div aria-hidden className="flex items-end gap-5 border-b border-border text-[13px]">
      {(["Notes", "Transcript"] as const).map((v) => (
        <span
          key={v}
          className={cn(
            "-mb-px border-b-2 pt-0.5 pb-2.5 font-medium",
            v === active ? "border-foreground text-foreground" : "border-transparent text-muted-foreground",
          )}
        >
          {v}
        </span>
      ))}
      <span className="mb-1 ml-auto flex items-center gap-1.5">
        {edit && <EditButton label={edit} pressed={editPressed} />}
        {menu ?? <RecordingMenu />}
      </span>
    </div>
  );
}
