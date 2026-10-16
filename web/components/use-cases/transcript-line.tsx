import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

/**
 * One transcript line the way the app shows it: the timestamp (HH:MM:SS) in front,
 * the audio source as a chip (Microphone or System, never a person), then the
 * text. `active` marks the line being played or read. The row keeps its padding
 * either way, so marking a line moves nothing.
 */
export function TranscriptLine({
  at,
  src,
  text,
  active = false,
  pressed = false,
  className,
}: {
  at: string;
  src: "Microphone" | "System";
  text: string;
  active?: boolean;
  pressed?: boolean;
  className?: string;
}) {
  return (
    <li
      className={cn(
        "grid grid-cols-[auto_1fr] items-baseline gap-x-3 rounded-md px-2.5 py-2 transition-colors duration-(--duration-base) ease-trilsy",
        active && "bg-field",
        className,
      )}
    >
      <span
        className={cn(
          "rounded-sm px-1 font-mono text-xs text-secondary underline underline-offset-2 transition-colors duration-(--duration-base) ease-trilsy",
          pressed && "bg-primary text-primary-foreground",
        )}
      >
        {at}
      </span>
      <span className="flex flex-col items-start gap-1">
        <Badge variant={src === "Microphone" ? "microphone" : "system"}>{src}</Badge>
        <span>{text}</span>
      </span>
    </li>
  );
}
