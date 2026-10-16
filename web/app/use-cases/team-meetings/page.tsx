import type { Metadata } from "next";
import { pageMetadata } from "@/lib/metadata";
import { TeamDemo } from "@/components/use-cases/team-demo";
import { UseCasePage } from "@/components/use-cases/use-case-page";
import type { Faq } from "@/lib/faq";
import { useCasePath, useCases } from "@/lib/site";

const useCase = useCases.find((u) => u.slug === "team-meetings")!;

// The title is new copy for review. The description is the copy deck's.
export const metadata: Metadata = pageMetadata({
  title: "Notes from your team meeting: record and edit on your Mac",
  description: useCase.description,
  path: useCasePath(useCase.slug),
});

const figures = [
  { src: "/characters/12-mustard-gesture.svg", alt: "A person in a mustard jumper, making a point in a meeting" },
  { src: "/characters/08-blue-crop.svg", alt: "A person in a blue top, listening in a meeting" },
] as const;

// New copy for review. The behavior is editing: the notes are a plain-text
// Markdown editor, and the title and each transcript line are editable too. The
// page does not say edits are safe from a re-run ("Continue processing" replaces
// them without asking, b8 fact check).
const behavior =
  "The notes are plain text you can edit like any note: fix a name, cut a line, add what the notes model missed. The title and the transcript lines are editable too.";

const questions: Faq[] = [
  {
    id: "share",
    question: "How do I share the notes with the team?",
    answer:
      "Export the recording as Markdown: one file with the notes, then the transcript. Send that file the way you send any other.",
  },
  {
    id: "in-a-room",
    question: "Does it work in a meeting room?",
    answer:
      "Yes. Leave your Mac’s sound off and Trilsy records through your microphone. How well it hears the far end of a room depends on your Mac’s microphone and where the Mac sits.",
  },
];

export default function TeamMeetingsPage() {
  return (
    <UseCasePage
      useCase={useCase}
      marker={2}
      figures={figures}
      behavior={behavior}
      visual={<TeamDemo />}
      questions={questions}
    />
  );
}
