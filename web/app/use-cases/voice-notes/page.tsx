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
// alone, in the app's own order: Record, Stop & save, Transcribe & create notes
// (the app does not start on its own after Stop). The Pause and menu bar claims
// were read from the code and confirmed by the owner on 2026-10-16.
const behavior =
  "With your Mac’s sound off, which is how Trilsy starts, only your microphone is recorded. Talk, press Stop & save, then Transcribe & create notes, and read the notes.";

const questions: Faq[] = [
  {
    id: "pause",
    question: "Can I pause while I think?",
    answer:
      "Yes. Pause and resume are in the app and in its menu bar item. What is said while the recording is paused is not recorded.",
  },
  {
    id: "instructions",
    question: "Can I tell it how to write the notes?",
    answer:
      "Yes. Above the notes there is a field for optional instructions, for example “include examples and open questions”. Type them before you press Transcribe & create notes. The notes model takes them as preferences, which is a request and not a guarantee.",
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
