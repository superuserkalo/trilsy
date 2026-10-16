import { HugeiconsIcon } from "@hugeicons/react";
import { File01Icon, FileAudioIcon, Folder01Icon, FolderOpenIcon } from "@hugeicons/core-free-icons";
import { cn } from "@/lib/utils";
import { MockWindow } from "./mock";

// Names follow what the app writes (Sources/RecordingStore.swift, Recorder.swift):
// one folder per recording named by a UUID, audio in files of about 60 seconds
// named <source>_<start in ms>_<UUID>.caf, and recording.json beside them.
const files = [
  { icon: File01Icon, name: "recording.json", note: "title, transcript and notes" },
  { icon: FileAudioIcon, name: "microphone_0_4F1C….caf", note: "audio, about 60 seconds" },
  { icon: FileAudioIcon, name: "system_0_9B2E….caf", note: "audio, about 60 seconds" },
  { icon: FileAudioIcon, name: "microphone_60012_D07A….caf" },
  { icon: FileAudioIcon, name: "system_60012_31C8….caf" },
] as const;

/** Block 2: where the files are, drawn as the folder they sit in. Still: nothing here moves. */
export function FilesDemo() {
  return (
    <MockWindow
      title="Recordings"
      role="img"
      aria-label="The Recordings folder holds one folder per recording. A recording's folder holds short audio files and a recording.json file with the title, transcript and notes."
    >
      <div aria-hidden className="flex flex-col gap-1 overflow-x-auto px-4 py-4 font-mono text-[12.5px]">
        <p className="text-muted-foreground">Library/Application Support/Trilsy/Recordings/</p>
        <div className="mt-1 flex items-center gap-2 font-semibold">
          <HugeiconsIcon icon={FolderOpenIcon} strokeWidth={2} className="size-4 shrink-0" />
          7C1E9A04-5B3D-4E21-A8F6-0D93B2C41E57
        </div>
        <ul className="ml-2 flex flex-col gap-1 border-l-[1.5px] border-dotted border-foreground pl-4">
          {files.map((f) => (
            <li key={f.name} className="flex flex-wrap items-center gap-x-2">
              <HugeiconsIcon icon={f.icon} strokeWidth={2} className={cn("size-4 shrink-0", f.name.endsWith("json") ? "text-accent" : "text-secondary")} />
              {f.name}
              {"note" in f && <span className="font-sans text-xs text-muted-foreground">{f.note}</span>}
            </li>
          ))}
        </ul>
        <div className="mt-1 flex items-center gap-2 text-muted-foreground">
          <HugeiconsIcon icon={Folder01Icon} strokeWidth={2} className="size-4 shrink-0" />
          B02F6E19-7A44-4C0B-9E58-23D1F8A60C95
        </div>
      </div>
    </MockWindow>
  );
}
