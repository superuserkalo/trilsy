import type { Metadata } from "next";
import { pageMetadata } from "@/lib/metadata";
import { JournalismDemo } from "@/components/use-cases/journalism-demo";
import { UseCasePage } from "@/components/use-cases/use-case-page";
import type { Faq } from "@/lib/faq";
import { useCasePath, useCases } from "@/lib/site";

const useCase = useCases.find((u) => u.slug === "journalism")!;

// The title is new copy for review. The description is the copy deck's.
export const metadata: Metadata = pageMetadata({
  title: "Interview transcripts you can quote: export text with timestamps",
  description: useCase.description,
  path: useCasePath(useCase.slug),
});

const figures = [
  { src: "/characters/06-terracotta-beard.svg", alt: "A man with a beard in a terracotta jumper, asking questions" },
  { src: "/characters/08-blue-crop.svg", alt: "A person in a blue top, being interviewed" },
] as const;

// New copy for review (not in the copy deck). The behavior is the plain text
// export: one line per transcript line, "[HH:MM:SS] [source] text" with the source in
// lower case, in time order
// across sources (Sources/AppModel.swift export, Recording.transcript). The notes
// are not in it. The page does not say the transcript is accurate enough to quote
// unchecked.
const behavior =
  "Export the transcript as plain text and every line keeps its timestamp and where the sound came from. Pick out a quote, keep its time, and you can find the audio again.";

const questions: Faq[] = [
  {
    id: "text-notes",
    question: "Does the text file include the notes?",
    answer:
      "No. Plain text holds the transcript only. For the notes, export Markdown, which has the notes first and the transcript after. The SRT export is the transcript only as well.",
  },
  {
    id: "both-sides",
    question: "If I interview someone by phone or video call, are both sides in the file?",
    answer:
      "Yes, if you record your microphone and your Mac’s sound together. Both are in one file in time order, each line marked microphone or system in the file. Wear headphones, so your microphone does not pick the other person up a second time.",
  },
];

export default function JournalismPage() {
  return (
    <UseCasePage
      useCase={useCase}
      marker={3}
      figures={figures}
      behavior={behavior}
      visual={<JournalismDemo />}
      questions={questions}
    />
  );
}
