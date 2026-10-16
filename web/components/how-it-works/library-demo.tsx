import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowDown01Icon, Search01Icon } from "@hugeicons/core-free-icons";
import { MockWindow } from "./mock";

const results = [
  { title: "Design review", date: "15 Oct 2026" },
  { title: "Onboarding interviews, round 2", date: "9 Oct 2026" },
] as const;

const exports = [
  { label: "Markdown with transcript", ext: ".md" },
  { label: "Plain text transcript", ext: ".txt" },
  { label: "SRT subtitles", ext: ".srt" },
] as const;

/**
 * Block 5: the search field filtering the recording list, and the Export menu
 * with the app's three entries. Menu labels are the app's own.
 */
export function LibraryDemo() {
  return (
    <MockWindow
      title="Trilsy"
      role="img"
      aria-label="The recording list filtered by the search word permissions, and the Export menu with three entries: Markdown with transcript, Plain text transcript and SRT subtitles."
    >
      <div aria-hidden className="grid sm:grid-cols-[1fr_1fr]">
        <div className="flex flex-col gap-3 px-4 py-4 sm:border-r sm:border-border">
          <div className="flex items-center gap-2 rounded-md border border-border bg-card px-2.5 py-1.5">
            <HugeiconsIcon icon={Search01Icon} strokeWidth={2} className="size-3.5 shrink-0 text-muted-foreground" />
            <span>permissions</span>
          </div>
          <ul className="flex flex-col">
            {results.map((r, i) => (
              <li key={r.title} className={i === 0 ? "rounded-md bg-field px-2.5 py-2" : "px-2.5 py-2"}>
                <p className="font-semibold">{r.title}</p>
                <p className="text-xs text-muted-foreground">{r.date}</p>
              </li>
            ))}
          </ul>
        </div>
        <div className="flex flex-col items-start gap-2 border-t border-border px-4 py-4 sm:border-t-0">
          <span className="inline-flex items-center gap-1.5 rounded-md border border-border bg-card px-2.5 py-1.5 text-xs font-semibold">
            Export
            <HugeiconsIcon icon={ArrowDown01Icon} strokeWidth={2} className="size-3" />
          </span>
          <ul className="w-full rounded-lg border border-border bg-card py-1 shadow-[3px_4px_0_var(--border)]">
            {exports.map((e) => (
              <li key={e.ext} className="flex items-baseline justify-between gap-3 px-3 py-1.5">
                <span>{e.label}</span>
                <span className="font-mono text-xs text-muted-foreground">{e.ext}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </MockWindow>
  );
}
