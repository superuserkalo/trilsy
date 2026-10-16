import { Button } from "@/components/ui/button";
import { site } from "@/lib/site";
import { Marker } from "./marker";

/**
 * The hero's words (copy deck section 2, subhead option 1). Server-rendered;
 * nothing sits above the headline. On desktop the block is a fixed 308px, so the
 * scene below always starts 404px from the top of the page (header included),
 * which is where the stage expects it.
 */
export function HeroCopy() {
  return (
    <div className="relative z-10 flex flex-col items-center px-4 pt-7 text-center lg:h-[308px] lg:pt-6">
      <h1 className="max-w-[15em] text-[34px] leading-[1.08] font-semibold tracking-[-0.015em] text-balance lg:text-[60px]">
        Be in the conversation. <Marker>Trilsy writes the notes.</Marker>
      </h1>
      <p className="mt-3.5 max-w-[34em] text-base text-balance text-foreground/80 lg:text-[19px]">
        Record your microphone, your Mac&rsquo;s sound or both. Trilsy transcribes it and writes notes you can edit.
      </p>
      <div className="mt-[18px] flex flex-col items-center gap-2 lg:mt-4 lg:flex-row lg:gap-4">
        <Button
          size="lg"
          nativeButton={false}
          render={<a href={site.github} target="_blank" rel="noopener noreferrer" />}
        >
          View on GitHub
        </Button>
        <span className="text-sm text-balance text-muted-foreground">Apple silicon, macOS 15 or later. No signed download yet.</span>
      </div>
    </div>
  );
}
