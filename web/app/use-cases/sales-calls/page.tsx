import type { Metadata } from "next";
import { pageMetadata } from "@/lib/metadata";
import { SalesDemo } from "@/components/use-cases/sales-demo";
import { UseCasePage } from "@/components/use-cases/use-case-page";
import type { Faq } from "@/lib/faq";
import { useCasePath, useCases } from "@/lib/site";

const useCase = useCases.find((u) => u.slug === "sales-calls")!;

// The title is new copy for review. The description is the copy deck's.
export const metadata: Metadata = pageMetadata({
  title: "Notes from your sales calls: record calls on your Mac",
  description: useCase.description,
  path: useCasePath(useCase.slug),
});

const figures = [
  { src: "/characters/06-terracotta-beard.svg", alt: "A man with a beard in a terracotta jumper, on a call" },
  { src: "/characters/03-sage-glasses.svg", alt: "A person with glasses in a sage jumper, listening" },
] as const;

// New copy for review (not in the copy deck). The behavior is the product's
// timestamp: every transcript line has one, and pressing it plays the audio from
// that line. Questions: headphones (no echo cancellation, per the fact check) and
// when the transcript is ready (after you stop, never live).
const behavior =
  "Every line of the transcript has a timestamp. Press it and the audio plays from that line, so the customer’s exact words are one press away.";

const questions: Faq[] = [
  {
    id: "headphones",
    question: "Should I wear headphones on a call?",
    answer:
      "Yes. Trilsy records your microphone and your Mac’s sound as two separate sources and does not cancel echo. On speakers, your microphone picks the customer up a second time. Headphones keep the two apart.",
  },
  {
    id: "ready",
    question: "Is the transcript ready when the call ends?",
    answer:
      "Not quite. Trilsy transcribes after you stop, not while you talk, and writes the notes after that. How long it takes depends on the length of the call and on your Mac.",
  },
];

export default function SalesCallsPage() {
  return (
    <UseCasePage
      useCase={useCase}
      marker={2}
      figures={figures}
      behavior={behavior}
      visual={<SalesDemo />}
      questions={questions}
    />
  );
}
