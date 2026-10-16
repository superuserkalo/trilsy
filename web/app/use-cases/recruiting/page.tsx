import type { Metadata } from "next";
import { pageMetadata } from "@/lib/metadata";
import { RecruitingDemo } from "@/components/use-cases/recruiting-demo";
import { UseCasePage } from "@/components/use-cases/use-case-page";
import type { Faq } from "@/lib/faq";
import { useCasePath, useCases } from "@/lib/site";

const useCase = useCases.find((u) => u.slug === "recruiting")!;

// The title is new copy for review. The description is the copy deck's.
export const metadata: Metadata = pageMetadata({
  title: "Interview notes you can compare: record interviews on your Mac",
  description: useCase.description,
  path: useCasePath(useCase.slug),
});

const figures = [
  { src: "/characters/08-blue-crop.svg", alt: "A person in a blue top, interviewing" },
  { src: "/characters/06-terracotta-beard.svg", alt: "A man with a beard in a terracotta jumper, being interviewed" },
] as const;

// New copy for review. The behavior is the shape of the notes (an overview on top,
// then the detail). The notes model chooses its own section headings, so the
// window shows different headings in each interview and the page claims only the
// shape the copy deck's situation sentence states.
const behavior =
  "The overview comes first every time, so you can read one candidate’s notes and then the next without hunting for where each begins.";

const questions: Faq[] = [
  {
    id: "rank",
    question: "Does Trilsy rate or rank candidates?",
    answer:
      "No. It writes a transcript and notes of what was said and scores no one. The comparison, and the decision, stay with you.",
  },
  {
    id: "names",
    question: "Can I make sure a candidate’s name is spelled right?",
    answer:
      "Add the name to Names & vocabulary in Trilsy’s Settings before you record. It goes to the transcription as a hint, not a guarantee, so check the name afterwards. The notes are Markdown you can correct with the Edit button.",
  },
];

export default function RecruitingPage() {
  return (
    <UseCasePage
      useCase={useCase}
      marker={3}
      figures={figures}
      behavior={behavior}
      visual={<RecruitingDemo />}
      questions={questions}
    />
  );
}
