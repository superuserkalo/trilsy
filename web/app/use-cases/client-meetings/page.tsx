import type { Metadata } from "next";
import { pageMetadata } from "@/lib/metadata";
import { ClientDemo } from "@/components/use-cases/client-demo";
import { UseCasePage } from "@/components/use-cases/use-case-page";
import type { Faq } from "@/lib/faq";
import { useCasePath, useCases } from "@/lib/site";

const useCase = useCases.find((u) => u.slug === "client-meetings")!;

// The title is new copy for review. The description is the copy deck's.
export const metadata: Metadata = pageMetadata({
  title: "A record of what was agreed: client meeting notes on your Mac",
  description: useCase.description,
  path: useCasePath(useCase.slug),
});

const figures = [
  { src: "/characters/03-sage-glasses.svg", alt: "A person with glasses in a sage jumper, at a meeting" },
  { src: "/characters/10-sage-long-hair.svg", alt: "A person with long hair in a sage jumper, at a meeting" },
] as const;

// New copy for review. The behavior is the order of use: read the last meeting's
// notes, then press New recording. Decisions are written into the notes only when the
// recording supports them; there is no separate list of agreements.
const behavior =
  "Every meeting stays in your list. Before the next one, open the last meeting’s notes and read what was agreed, then press New recording.";

const questions: Faq[] = [
  {
    id: "what-was-agreed",
    question: "Do the notes list what we agreed?",
    answer:
      "Only if the conversation said so. The notes model is asked to write decisions and open questions only when the recording supports them, and there is no separate list of agreements. Read the notes against the transcript before you rely on one.",
  },
  {
    id: "pause",
    question: "Can I pause when the client asks me to?",
    answer:
      "Yes. Pause and resume are in the app’s toolbar while you record, and what is said while the recording is paused is not recorded.",
  },
];

export default function ClientMeetingsPage() {
  return (
    <UseCasePage
      useCase={useCase}
      marker={3}
      figures={figures}
      behavior={behavior}
      visual={<ClientDemo />}
      questions={questions}
    />
  );
}
