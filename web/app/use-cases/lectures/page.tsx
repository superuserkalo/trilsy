import type { Metadata } from "next";
import { pageMetadata } from "@/lib/metadata";
import { LecturesDemo } from "@/components/use-cases/lectures-demo";
import { UseCasePage } from "@/components/use-cases/use-case-page";
import type { Faq } from "@/lib/faq";
import { useCasePath, useCases } from "@/lib/site";

const useCase = useCases.find((u) => u.slug === "lectures")!;

// The title is new copy for review. The description is the copy deck's.
export const metadata: Metadata = pageMetadata({
  title: "Lecture notes you can search: record lectures on your Mac",
  description: useCase.description,
  path: useCasePath(useCase.slug),
});

// Two students from the owner's character pack, not the two on /students.
const figures = [
  { src: "/characters/07-sage-curls.svg", alt: "A student with curly hair in a sage sweater, listening" },
  { src: "/characters/11-blue-headscarf.svg", alt: "A student in a blue headscarf, listening and taking it in" },
] as const;

// New copy for review (not in the copy deck). Every claim is in the product
// facts: search covers title, transcript and notes; system sound is a switch,
// off by default, with a macOS permission; the notes are written by a model.
const behavior =
  "Search looks through the title, the transcript and the notes of every recording, so the lecture where your professor used a word comes back with the rest.";

const questions: Faq[] = [
  {
    id: "online-lecture",
    question: "Can I record an online lecture as well as one in the room?",
    answer:
      "Yes. In a room Trilsy uses your microphone. For a lecture that plays on your Mac, turn on your Mac’s sound, a switch that is off until you turn it on and needs macOS’s Screen & System Audio Recording permission. Record both together if you want your own voice too.",
  },
  {
    id: "rely-on-notes",
    question: "Can I rely on the notes for an exam?",
    answer:
      "Read them against the audio first. A language model on your Mac writes the notes and it can be wrong. Every line of the transcript has a timestamp that plays the audio from that point, so you can check a claim in a few seconds.",
  },
];

// Copy: docs/redesign/02-copy-deck.md section 7, Lectures row. The page shows
// one behavior no other use-case page repeats: search before the exam.
export default function LecturesPage() {
  return (
    <UseCasePage
      useCase={useCase}
      marker={3}
      figures={figures}
      behavior={behavior}
      visual={<LecturesDemo />}
      questions={questions}
    />
  );
}
