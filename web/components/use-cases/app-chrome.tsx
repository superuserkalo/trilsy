import { HugeiconsIcon } from "@hugeicons/react";
import {
  Add01Icon,
  ArrowReloadHorizontalIcon,
  ArrowRight01Icon,
  AudioWave01Icon,
  Calendar03Icon,
  CheckmarkCircle02Icon,
  Clock01Icon,
  Delete02Icon,
  Download01Icon,
  File01Icon,
  Layers01Icon,
  Loading03Icon,
  MoreHorizontalIcon,
  Note01Icon,
  NoteAddIcon,
  PauseIcon,
  PencilEdit01Icon,
  PlayIcon,
  Search01Icon,
  Share08Icon,
  SlidersHorizontalIcon,
  StopIcon,
  Tick02Icon,
} from "@hugeicons/core-free-icons";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/*
 * Drawn copies of the Mac app's chrome, one source for every window on the site.
 * Each label here is the app's own, read from the working tree on 2026-10-16
 * (Sources/ContentView.swift, WorkspaceViews.swift, App.swift). Where the app
 * changes a string, change it here once.
 *
 *   sidebar       "New recording", "Search notes", "All notes", "Recent" or "Matches"
 *   toolbar       the "Audio sources" menu (Microphone, App audio, Application,
 *                 Refresh apps), or while recording the time, Pause, "Stop & save"
 *   recording     title, a status line (date, rounded length, status), the player,
 *                 the Notes / Transcript tabs with "Edit" and the "…" menu
 *                 ("Note instructions…", "Rewrite notes", "Export", "Delete recording")
 *   empty panes   the library and a recording without notes
 *
 * They are decoration inside an `aria-hidden` window, so none is focusable (the
 * one exception is the Audio sources menu on How it works, which takes
 * `onToggle`). Each keeps its size in every state, so a window never changes
 * height while it plays.
 */

const fade = "transition-colors duration-(--duration-base) ease-trilsy";
/** A small outlined control: toolbar buttons, Cancel, Import file. */
export const control = `inline-flex items-center gap-1.5 rounded-md border border-border bg-card px-2.5 py-1 text-xs font-semibold whitespace-nowrap ${fade}`;
/** The ink-bordered, mustard state of a control that is pressed or open. */
export const controlOn = "border-ink bg-primary text-primary-foreground";

/** "00:14:32", the app's `timestamp()`. */
export function clock(seconds: number) {
  const s = Math.max(0, Math.floor(seconds));
  const two = (n: number) => String(n).padStart(2, "0");
  return `${two(Math.floor(s / 3600))}:${two(Math.floor(s / 60) % 60)}:${two(s % 60)}`;
}

/* ------------------------------------------------------------------ menus */

function MenuPanel({ open = true, className, children }: { open?: boolean; className?: string; children: React.ReactNode }) {
  return (
    <ul
      role="menu"
      className={cn(
        "absolute top-full right-0 z-10 mt-1 w-52 rounded-lg border-2 border-ink bg-card p-1 text-[13px] font-semibold transition-opacity duration-(--duration-base) ease-trilsy",
        open ? "opacity-100" : "pointer-events-none opacity-0",
        className,
      )}
    >
      {children}
    </ul>
  );
}

function MenuItem({
  label,
  check,
  icon,
  chevron,
  highlighted,
  destructive,
  onClick,
  children,
}: {
  label: string;
  check?: boolean;
  icon?: typeof Tick02Icon;
  chevron?: boolean;
  highlighted?: boolean;
  destructive?: boolean;
  onClick?: () => void;
  children?: React.ReactNode;
}) {
  const row = cn(
    "flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left whitespace-nowrap",
    fade,
    highlighted && "bg-primary text-primary-foreground",
    destructive && !highlighted && "text-destructive",
  );
  const inner = (
    <>
      <span className="grid size-3.5 shrink-0 place-items-center">
        {check ? (
          <HugeiconsIcon icon={Tick02Icon} strokeWidth={2} className="size-3.5" />
        ) : icon ? (
          <HugeiconsIcon icon={icon} strokeWidth={2} className="size-3.5" />
        ) : null}
      </span>
      <span className="flex-1">{label}</span>
      {chevron && <HugeiconsIcon icon={ArrowRight01Icon} strokeWidth={2} className="size-3" />}
    </>
  );
  return (
    <li role={onClick ? "none" : "menuitem"} className="relative">
      {onClick ? (
        <button type="button" role="menuitemcheckbox" aria-checked={!!check} onClick={onClick} className={cn(row, "cursor-pointer")}>
          {inner}
        </button>
      ) : (
        <div className={row}>{inner}</div>
      )}
      {children}
    </li>
  );
}

const Divider = () => <li role="separator" className="my-1 h-px bg-border" />;

/**
 * A fly-out beside its row. It opens to the left, as a menu does at the right
 * edge of a window; on a phone there is no room, so it overlaps the lower rows.
 */
function Submenu({ items, checked, highlighted }: { items: readonly string[]; checked?: number; highlighted?: number }) {
  return (
    <ul
      role="menu"
      className="absolute top-0 right-full z-20 -mr-1 min-w-40 rounded-lg border-2 border-ink bg-card p-1 text-[13px] font-semibold max-sm:top-7 max-sm:right-3 max-sm:mr-0"
    >
      {items.map((item, i) => (
        <MenuItem key={item} label={item} check={checked === i} highlighted={highlighted === i} />
      ))}
    </ul>
  );
}

/** The toolbar button that opens the Audio sources menu. */
export function AudioSourcesButton({ pressed = false }: { pressed?: boolean }) {
  return (
    <span className={cn(control, pressed && controlOn)}>
      <HugeiconsIcon icon={SlidersHorizontalIcon} strokeWidth={2} className="size-3.5" />
      Audio sources
    </span>
  );
}

/**
 * The Audio sources menu: Microphone and App audio as toggles, and, while App
 * audio is on, the Application picker (a submenu: "All apps", then the running
 * apps) and "Refresh apps". `className` positions it; give it `relative` to lay
 * it out in the page instead of over it. With `onToggle` the two toggles are real
 * buttons.
 */
export function AudioSourcesMenu({
  mic,
  system,
  open = true,
  apps = ["All apps"],
  app = 0,
  appOpen = false,
  highlight,
  appHighlight,
  onToggle,
  className,
}: {
  mic: boolean;
  system: boolean;
  open?: boolean;
  apps?: readonly string[];
  app?: number;
  appOpen?: boolean;
  highlight?: "mic" | "system" | "application" | "refresh";
  appHighlight?: number;
  onToggle?: (source: "mic" | "system") => void;
  className?: string;
}) {
  return (
    <MenuPanel open={open} className={className}>
      <MenuItem label="Microphone" check={mic} highlighted={highlight === "mic"} onClick={onToggle && (() => onToggle("mic"))} />
      <MenuItem label="App audio" check={system} highlighted={highlight === "system"} onClick={onToggle && (() => onToggle("system"))} />
      {system && (
        <>
          <MenuItem label="Application" chevron highlighted={highlight === "application"}>
            {appOpen && <Submenu items={apps} checked={app} highlighted={appHighlight} />}
          </MenuItem>
          <MenuItem label="Refresh apps" icon={ArrowReloadHorizontalIcon} highlighted={highlight === "refresh"} />
        </>
      )}
    </MenuPanel>
  );
}

/** The toolbar while a recording runs: the time, Pause and "Stop & save". */
export function RecordingToolbar({ time, stopPressed = false }: { time: string; stopPressed?: boolean }) {
  return (
    <>
      <span className="flex items-center gap-1.5 text-xs">
        <i className="size-1.5 rounded-full bg-recording" />
        <span className="text-muted-foreground max-sm:hidden">Recording</span>
        <span className="font-mono tabular-nums">{time}</span>
        <span className="h-1.5 w-10 overflow-hidden rounded-full bg-border max-sm:hidden">
          <span className="block h-full w-2/5 bg-secondary" />
        </span>
      </span>
      <span className={control}>
        <HugeiconsIcon icon={PauseIcon} strokeWidth={2} className="size-3.5" />
        <span className="max-sm:hidden">Pause</span>
      </span>
      <span className={cn(control, stopPressed && controlOn)}>
        <HugeiconsIcon icon={StopIcon} strokeWidth={2} className="size-3.5" />
        Stop &amp; save
      </span>
    </>
  );
}

const exportEntries = ["Markdown with transcript", "Plain text transcript", "SRT subtitles"] as const;

/**
 * The "…" button at the end of the Notes / Transcript row and its menu. With a
 * transcript it holds "Note instructions…", "Rewrite notes", "Export" (three
 * entries) and "Delete recording"; `rewrite={false}` is a recording that has no
 * transcript yet.
 */
export function RecordingMenu({
  open = false,
  highlight,
  exportOpen = false,
  exportHighlight,
  rewrite = true,
}: {
  open?: boolean;
  highlight?: "instructions" | "rewrite" | "export" | "delete";
  exportOpen?: boolean;
  exportHighlight?: number;
  rewrite?: boolean;
}) {
  return (
    <span className="relative">
      <span className={cn("inline-flex size-7 items-center justify-center rounded-md border border-transparent", fade, open && controlOn)}>
        <HugeiconsIcon icon={MoreHorizontalIcon} strokeWidth={2} className="size-4" />
      </span>
      <MenuPanel open={open}>
        <MenuItem label="Note instructions…" icon={NoteAddIcon} highlighted={highlight === "instructions"} />
        {rewrite && <MenuItem label="Rewrite notes" icon={ArrowReloadHorizontalIcon} highlighted={highlight === "rewrite"} />}
        <Divider />
        <MenuItem label="Export" icon={Share08Icon} chevron highlighted={highlight === "export"}>
          {exportOpen && <Submenu items={exportEntries} highlighted={exportHighlight} />}
        </MenuItem>
        <Divider />
        <MenuItem label="Delete recording" icon={Delete02Icon} destructive highlighted={highlight === "delete"} />
      </MenuPanel>
    </span>
  );
}

/** The "Edit" button above the notes; "Done" while the Markdown editor is open. */
export function EditButton({ label = "Edit", pressed = false }: { label?: "Edit" | "Done"; pressed?: boolean }) {
  return (
    <span className={cn("inline-flex items-center gap-1 rounded-md px-1.5 py-1 text-xs font-medium", fade, pressed && controlOn)}>
      <HugeiconsIcon icon={label === "Done" ? Tick02Icon : PencilEdit01Icon} strokeWidth={2} className="size-3.5" />
      {label}
    </span>
  );
}

/* ---------------------------------------------------------------- sidebar */

/** The sidebar's button. It is disabled while a recording runs or notes are written. */
export function NewRecordingButton({ pressed = false, disabled = false }: { pressed?: boolean; disabled?: boolean }) {
  return (
    <span
      className={cn(
        buttonVariants({ size: "sm" }),
        "w-full transition-all duration-(--duration-base) ease-trilsy",
        pressed && "translate-y-px",
        disabled && "opacity-50",
      )}
    >
      <HugeiconsIcon icon={Add01Icon} strokeWidth={2} />
      New recording
    </span>
  );
}

function SidebarSearch({ value }: { value?: string }) {
  return (
    <div className="flex items-center gap-2 rounded-md border border-border bg-card px-2.5 py-1.5 text-xs">
      <HugeiconsIcon icon={Search01Icon} strokeWidth={2} className="size-3.5 shrink-0 text-muted-foreground" />
      <span className={cn("min-h-[1lh] truncate", !value && "text-muted-foreground")}>{value || "Search notes"}</span>
    </div>
  );
}

/** One sidebar row: a recording (the page icon once it is Ready, a waveform before) or "All notes". */
export function SidebarRow({
  title,
  ready = true,
  selected = false,
  all = false,
  count,
  className,
}: {
  title: string;
  ready?: boolean;
  selected?: boolean;
  all?: boolean;
  count?: number;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex h-8 items-center gap-2 rounded-md px-2 text-xs",
        fade,
        selected ? "bg-field font-semibold" : "font-medium",
        className,
      )}
    >
      <HugeiconsIcon
        icon={all ? Layers01Icon : ready ? File01Icon : AudioWave01Icon}
        strokeWidth={2}
        className={cn("size-3.5 shrink-0", selected ? "text-secondary" : "text-muted-foreground")}
      />
      <span className="flex-1 truncate">{title}</span>
      {count !== undefined && <span className="font-normal text-muted-foreground">{count}</span>}
    </div>
  );
}

/**
 * The window's sidebar and the pane beside it. From 640px the sidebar is a column
 * on the left; on a phone it sits above the pane, and with `collapse` it shrinks to
 * the New recording button alone.
 */
export function AppBody({
  pressed,
  disabled,
  search,
  label = "Recent",
  allSelected = true,
  count,
  collapse = true,
  list,
  listClassName,
  children,
  className,
}: {
  pressed?: boolean;
  disabled?: boolean;
  search?: string;
  label?: "Recent" | "Matches";
  allSelected?: boolean;
  count?: number;
  collapse?: boolean;
  list?: React.ReactNode;
  listClassName?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("grid sm:grid-cols-[11.5rem_minmax(0,1fr)]", className)}>
      <div className="flex flex-col gap-3 border-b border-border bg-muted/50 p-3 sm:border-r sm:border-b-0">
        <NewRecordingButton pressed={pressed} disabled={disabled} />
        <div className={cn("flex flex-col gap-2", collapse && "max-sm:hidden")}>
          <SidebarSearch value={search} />
          <SidebarRow all title="All notes" selected={allSelected} count={count} />
          <p className="px-2 pt-1 text-[11px] font-semibold text-muted-foreground">{label}</p>
          <ul className={cn("flex flex-col", listClassName)}>{list}</ul>
        </div>
      </div>
      <div className="min-w-0">{children}</div>
    </div>
  );
}

/* ----------------------------------------------------------- library pane */

/** The library's header: "All notes", its line and "Import file". */
export function LibraryHeader({ importButton = true }: { importButton?: boolean }) {
  return (
    <div className="flex items-start justify-between gap-3">
      <div>
        <p className="font-display text-xl leading-tight font-semibold">All notes</p>
        <p className="text-xs text-muted-foreground">Your conversations, all in one place.</p>
      </div>
      {importButton && (
        <span className={control}>
          <HugeiconsIcon icon={Download01Icon} strokeWidth={2} className="size-3.5" />
          Import file
        </span>
      )}
    </div>
  );
}

/** The library with nothing in it yet: the app's words, exactly. */
export function EmptyPane({ className }: { className?: string }) {
  return (
    <div className={cn("flex flex-col gap-6 px-4 py-4", className)}>
      <LibraryHeader />
      <div className="flex flex-col gap-2">
        <HugeiconsIcon icon={Note01Icon} strokeWidth={2} className="size-6 text-secondary" />
        <p className="font-display text-lg leading-tight font-semibold">A place for your next conversation</p>
        <p className="max-w-[22em] text-muted-foreground">
          Start a new recording or import an audio file. Your notes will appear here.
        </p>
      </div>
    </div>
  );
}

/* ------------------------------------------------------- recording detail */

/** A recording's title and its status line: date, rounded length, and the status. */
export function RecordingHeader({
  title,
  date,
  length,
  status,
}: {
  title: string;
  date: string;
  length: string;
  status: "Recording" | "Recorded" | "Ready";
}) {
  return (
    <div>
      <p className="font-display text-lg leading-tight font-semibold">{title}</p>
      <p className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs text-muted-foreground">
        <span className="inline-flex items-center gap-1">
          <HugeiconsIcon icon={Calendar03Icon} strokeWidth={2} className="size-3" />
          {date}
        </span>
        <span className="inline-flex items-center gap-1">
          <HugeiconsIcon icon={Clock01Icon} strokeWidth={2} className="size-3" />
          {length}
        </span>
        <span className={cn("ml-auto inline-flex items-center gap-1", status === "Ready" && "text-secondary")}>
          {status === "Ready" && <HugeiconsIcon icon={CheckmarkCircle02Icon} strokeWidth={2} className="size-3" />}
          {status}
        </span>
      </p>
    </div>
  );
}

/** Playback: an icon button, the time, a scrub slider and the length. */
export function AudioPlayer({ position, duration, playing = false }: { position: number; duration: number; playing?: boolean }) {
  const at = `${Math.min(100, (position / duration) * 100)}%`;
  return (
    <div className="flex items-center gap-3 rounded-lg bg-muted/70 px-3 py-2">
      <span className={cn(control, "size-7 justify-center px-0", playing && controlOn)}>
        <HugeiconsIcon icon={playing ? StopIcon : PlayIcon} strokeWidth={2} className="size-3.5" />
      </span>
      <span className="font-mono text-[11px] text-muted-foreground tabular-nums">{clock(position)}</span>
      <span className="relative mx-1.5 h-1.5 flex-1 rounded-full bg-border">
        <span
          className="absolute inset-y-0 left-0 rounded-full bg-ink transition-[width] duration-(--duration-slow) ease-trilsy"
          style={{ width: at }}
        />
        <span
          className="absolute top-1/2 size-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-ink bg-primary transition-[left] duration-(--duration-slow) ease-trilsy"
          style={{ left: at }}
        />
      </span>
      <span className="font-mono text-[11px] text-muted-foreground tabular-nums">{clock(duration)}</span>
    </div>
  );
}

export type NoteSection = { h: string; p: React.ReactNode };

/** One heading and its paragraph, as the app renders the notes' Markdown (no "##"). */
export function NoteBlock({ h, p }: NoteSection) {
  return (
    <div>
      <p className="mb-0.5 text-[15px] leading-snug font-semibold">{h}</p>
      <p>{p}</p>
    </div>
  );
}

/** The notes as the app reads them: headings, then text. Editing needs the Edit button. */
export function NotesDoc({ sections, className }: { sections: readonly NoteSection[]; className?: string }) {
  return (
    <div className={cn("flex flex-col gap-3.5 text-[13px] leading-[1.55]", className)}>
      {sections.map((s) => (
        <NoteBlock key={s.h} {...s} />
      ))}
    </div>
  );
}

/** A recording that has no notes yet: its title, a line, and optionally "Create notes". */
export function EmptyDocument({
  recording = false,
  pressed = false,
  className,
}: {
  /** True while the recording runs: no button, the other line. */
  recording?: boolean;
  pressed?: boolean;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col items-start gap-2.5 py-2", className)}>
      <p className="font-display text-lg leading-tight font-semibold">
        {recording ? "Recording in progress" : "Ready to make sense of it"}
      </p>
      <p className="max-w-[26em] text-muted-foreground">
        {recording
          ? "Your audio is being saved on this Mac. Stop recording when you’re ready to create notes."
          : "Turn this recording into a transcript and detailed notes, processed on your Mac."}
      </p>
      {!recording && (
        <span className={cn(buttonVariants({ size: "sm" }), "mt-1 transition-transform duration-(--duration-base) ease-trilsy", pressed && "translate-y-px")}>
          <HugeiconsIcon icon={NoteAddIcon} strokeWidth={2} />
          Create notes
        </span>
      )}
    </div>
  );
}

/** The bar under a recording while notes are written: progress, and Cancel. */
export function ProcessingBar({ text, className }: { text?: string; className?: string }) {
  return (
    <div className={cn("flex h-11 items-center gap-2.5 border-t border-border bg-muted/60 px-4 text-xs text-muted-foreground", className)}>
      {text && (
        <>
          <HugeiconsIcon icon={Loading03Icon} strokeWidth={2} className="size-4 animate-spin motion-reduce:animate-none" />
          <span>{text}</span>
          <span className={cn(control, "ml-auto text-foreground")}>Cancel</span>
        </>
      )}
    </div>
  );
}
