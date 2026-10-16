import { Badge } from "@/components/ui/badge";
import { MockWindow, ViewControl } from "./mock";

const lines = [
  { at: "00:00:12", src: "Microphone", text: "Let’s start with the onboarding screens." },
  { at: "00:00:19", src: "System", text: "The second one loses people. They stop at the permissions step." },
  { at: "00:00:31", src: "Microphone", text: "Then we move the permissions step to after the first recording." },
] as const;

/**
 * Block 3: a transcript, and the two settings the text mentions (the language and
 * the words it should know). The source labels are the app's: sources, not
 * people. The settings are its Transcription section: the field "Language code"
 * (empty it shows "Auto-detect") and "Names & vocabulary".
 */
export function TranscriptDemo() {
  return (
    <MockWindow
      title="Design review"
      role="img"
      aria-label="A transcript of three lines, each with a timestamp and the source it came from, Microphone or System. Below it, the language and vocabulary settings."
    >
      <div aria-hidden className="flex flex-col gap-4 px-4 py-4">
        <ViewControl active="Transcript" />
        <ul className="flex flex-col gap-3">
          {lines.map((l) => (
            <li key={l.at} className="grid grid-cols-[auto_1fr] items-baseline gap-x-3">
              <span className="font-mono text-xs text-secondary underline underline-offset-2">{l.at}</span>
              <span className="flex flex-col items-start gap-1">
                <Badge variant={l.src === "Microphone" ? "microphone" : "system"}>{l.src}</Badge>
                <span>{l.text}</span>
              </span>
            </li>
          ))}
        </ul>
      </div>
      <dl aria-hidden className="grid gap-3 border-t border-border bg-muted/40 px-4 py-3 text-xs sm:grid-cols-[1fr_2fr]">
        <div className="flex flex-col gap-1">
          <dt className="font-semibold text-muted-foreground">Language code</dt>
          <dd className="rounded-md border border-border bg-card px-2 py-1 text-muted-foreground">Auto-detect</dd>
        </div>
        <div className="flex flex-col gap-1">
          <dt className="font-semibold text-muted-foreground">Names &amp; vocabulary</dt>
          <dd className="truncate rounded-md border border-border bg-card px-2 py-1">Okonkwo, Figma, onboarding</dd>
        </div>
      </dl>
    </MockWindow>
  );
}
