import type { Metadata } from "next";
import { pageMetadata } from "@/lib/metadata";
import { IncidentDemo } from "@/components/use-cases/incident-demo";
import { UseCasePage } from "@/components/use-cases/use-case-page";
import type { Faq } from "@/lib/faq";
import { useCasePath, useCases } from "@/lib/site";

const useCase = useCases.find((u) => u.slug === "incident-calls")!;

// The title is new copy for review. The description is the copy deck's.
export const metadata: Metadata = pageMetadata({
  title: "The incident call, written down: a timed transcript on your Mac",
  description: useCase.description,
  path: useCasePath(useCase.slug),
});

const figures = [
  { src: "/characters/04-blue-wave.svg", alt: "A person in a blue top, waving" },
] as const;

// New copy for review. The behavior is the timeline: the transcript's timestamps
// give the order of events, and the reader writes the postmortem from them. The
// second window in the demo is the reader's own document, not a Trilsy feature.
const behavior =
  "Every line of the transcript carries the time it was said, counted from the start of the recording. Read down the timestamps and you have the order of events for your postmortem.";

const questions: Faq[] = [
  {
    id: "clock-time",
    question: "Are the timestamps the time of day?",
    answer:
      "No. They count from the start of the recording, so 00:11:20 is eleven minutes and twenty seconds in. Note the clock time when you press New recording and you can turn any timestamp into a time of day.",
  },
  {
    id: "postmortem",
    question: "Will Trilsy write the postmortem?",
    answer:
      "No. The notes summarize what was said and can include a decision when the call made one. The postmortem is yours to write, and the timestamps are what you write it from.",
  },
];

export default function IncidentCallsPage() {
  return (
    <UseCasePage
      useCase={useCase}
      marker={2}
      figures={figures}
      behavior={behavior}
      visual={<IncidentDemo />}
      questions={questions}
    />
  );
}
