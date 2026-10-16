import type { Metadata } from "next";
import { pageMetadata } from "@/lib/metadata";
import { VoiceDemo } from "@/components/use-cases/voice-demo";
import { UseCasePage } from "@/components/use-cases/use-case-page";
import type { Faq } from "@/lib/faq";
import { useCasePath, useCases } from "@/lib/site";

const useCase = useCases.find((u) => u.slug === "voice-notes")!;

// The title is new copy for review. The description is the copy deck's.
export const metadata: Metadata = pageMetadata({
  title: "Think out loud: voice notes on your Mac",
  description: useCase.description,
  path: useCasePath(useCase.slug),
});

const figures = [
  { src: "/characters/12-mustard-gesture.svg", alt: "A person in a mustard jumper, thinking out loud" },
] as const;

// New copy for review (not in the copy deck). The behavior is the microphone
// alone, in the app's order: New recording, Stop & save, Create notes. Stop only
// saves: nothing is transcribed until Create notes is pressed
// (Sources/ContentView.swift). Pause and Resume are in the app's toolbar while a
// recording runs; the menu bar item has only Open Trilsy, New Recording or Stop
// Recording, and Quit (Sources/App.swift), so the page does not put Pause there.
// Note instructions… is in the recording's "…" menu and opens a popover.
const behavior =
  "With your Mac’s sound off, which is how Trilsy starts, only your microphone is recorded. Press New recording, talk, press Stop & save, then Create notes, and read the notes.";

const questions: Faq[] = [
  {
    id: "pause",
    question: "Can I pause while I think?",
    answer:
      "Yes. Pause and resume are in the app’s toolbar while you record. What is said while the recording is paused is not recorded.",
  },
  {
    id: "instructions",
    question: "Can I tell it how to write the notes?",
    answer:
      "Yes. Open Note instructions… from the recording’s … menu and type what you want, for example “include examples and open questions”. Do it before you press Create notes. The notes model takes them as preferences, which is a request and not a guarantee.",
  },
];

export default function VoiceNotesPage() {
  return (
    <UseCasePage
      useCase={useCase}
      marker={2}
      figures={figures}
      behavior={behavior}
      visual={<VoiceDemo />}
      questions={questions}
    />
  );
}
