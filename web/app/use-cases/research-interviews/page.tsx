import type { Metadata } from "next";
import { pageMetadata } from "@/lib/metadata";
import { ResearchDemo } from "@/components/use-cases/research-demo";
import { UseCasePage } from "@/components/use-cases/use-case-page";
import type { Faq } from "@/lib/faq";
import { useCasePath, useCases } from "@/lib/site";

const useCase = useCases.find((u) => u.slug === "research-interviews")!;

// The title is new copy for review. The description is the copy deck's.
export const metadata: Metadata = pageMetadata({
  title: "Interviews to quote from: record research interviews on your Mac",
  description: useCase.description,
  path: useCasePath(useCase.slug),
});

const figures = [
  { src: "/characters/03-sage-glasses.svg", alt: "A person with glasses in a sage jumper, asking a question" },
  { src: "/characters/10-sage-long-hair.svg", alt: "A person with long hair in a sage jumper, answering" },
] as const;

// New copy for review (not in the copy deck). The behavior is what the Mac's
// owner can do with audio that never leaves it: Delete recording in the recording's "…" menu, with the app's
// confirmation ("Permanently delete this recording, audio, and notes?"). The page
// claims nothing about ethics boards, consent or data-protection law.
const behavior =
  "Each interview stays on your Mac as audio, a transcript and notes, and Trilsy does not upload it. If a participant withdraws, one Delete, after one question, removes all three.";

const questions: Faq[] = [
  {
    id: "withdraws",
    question: "If a participant withdraws, can I remove everything?",
    answer:
      "Yes. Delete removes the recording’s folder from your Mac, with its audio, transcript and notes, after one confirmation, and it does not go to the Bin. Copies you made yourself are still there, such as an export or a backup of your disk.",
  },
  {
    id: "keeps-audio",
    question: "Does Trilsy keep the audio once the transcript is written?",
    answer:
      "Yes, until you delete the recording. Every timestamp plays from that audio, so you can check a quote against the voice. The audio is saved uncompressed, so a long study takes room: check your free space before a day of interviews.",
  },
];

export default function ResearchInterviewsPage() {
  return (
    <UseCasePage
      useCase={useCase}
      marker={3}
      figures={figures}
      behavior={behavior}
      visual={<ResearchDemo />}
      questions={questions}
    />
  );
}
