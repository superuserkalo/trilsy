import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Window } from "@/components/ui/surface";
import { site } from "@/lib/site";

// Copy: docs/redesign/02-copy-deck.md section 9, word for word. Two plans only.
// Free carries the one true action; Pro carries none, because it is not available.
export function Plans() {
  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-10">
      <Window lift="hard" radius="lg" className="flex flex-col gap-6 p-6 lg:p-8" aria-labelledby="plan-free">
        <div className="flex items-center justify-between gap-4">
          <h2 id="plan-free" className="text-3xl font-semibold tracking-[-0.015em]">
            Free
          </h2>
          <Badge variant="default" className="h-6 px-3 text-[13px]">
            Available
          </Badge>
        </div>
        <p className="font-display text-6xl leading-none font-semibold tabular-nums">
          $0<span className="ml-2 font-sans text-base font-medium text-muted-foreground">/month</span>
        </p>
        <p className="max-w-[28em] text-[17px] leading-relaxed text-foreground/85">
          The whole app, no time limit, no account. Record, import, transcribe, write notes, edit, search, export. Always on your Mac.
        </p>
        <div className="mt-auto pt-2">
          <Button size="lg" nativeButton={false} render={<a href={site.github} target="_blank" rel="noopener noreferrer" />}>
            View on GitHub
          </Button>
        </div>
      </Window>

      <Window tone="paper" edge="dashed" radius="lg" className="flex flex-col gap-6 p-6 lg:p-8" aria-labelledby="plan-pro">
        <div className="flex items-center justify-between gap-4">
          <h2 id="plan-pro" className="text-3xl font-semibold tracking-[-0.015em]">
            Pro
          </h2>
          <Badge variant="off" className="h-6 border-ink px-3 text-[13px] text-foreground">
            Not available yet
          </Badge>
        </div>
        <p className="font-display text-6xl leading-none font-semibold tabular-nums">
          $12<span className="ml-2 font-sans text-base font-medium text-muted-foreground">/month</span>
        </p>
        <p className="-mt-2 text-[17px] text-foreground/85">
          or $96 a year
        </p>
        <p className="max-w-[28em] text-[17px] leading-relaxed text-foreground/85">
          Sync of your transcripts and notes, an MCP server, and connections to your apps. Your recordings stay on your Mac.
        </p>
        <p className="mt-auto border-t-[1.5px] border-dotted border-foreground pt-5 text-[17px] leading-relaxed">
          <Link
            href="/students"
            className="font-semibold underline decoration-primary decoration-2 underline-offset-4 transition-colors duration-(--duration-base) ease-trilsy hover:decoration-foreground"
          >
            Students get 50% off every paid plan
          </Link>
        </p>
      </Window>
    </div>
  );
}
