import type { Metadata } from "next";
import { pageMetadata } from "@/lib/metadata";
import { PodcastsDemo } from "@/components/use-cases/podcasts-demo";
import { UseCasePage } from "@/components/use-cases/use-case-page";
import type { Faq } from "@/lib/faq";
import { useCasePath, useCases } from "@/lib/site";

const useCase = useCases.find((u) => u.slug === "podcasts-and-video")!;

// The title is new copy for review. The description is the copy deck's.
export const metadata: Metadata = pageMetadata({
  title: "A transcript and subtitles: SRT from a recorded conversation",
  description: useCase.description,
  path: useCasePath(useCase.slug),
});

const figures = [
  { src: "/characters/04-blue-wave.svg", alt: "A person in a blue top, waving at the microphone" },
  { src: "/characters/07-sage-curls.svg", alt: "A person with curly hair in a sage sweater, laughing" },
] as const;

// New copy for review (not in the copy deck). The behavior is the SRT export
// (Recording.subtitles): index, start --> end, text, blank line, one cue per
// transcript line, no source label, no reflow. The video frame in the window is a
// drawn rectangle that shows what a cue does; it is not a Trilsy feature.
const behavior =
  "One export gives you a subtitle file: every line of the transcript becomes a numbered subtitle with a start time and an end time. SRT is the plain subtitle format that most video editors and players read.";

const questions: Faq[] = [
  {
    id: "fix-words",
    question: "Can I fix a word before I export the subtitles?",
    answer:
      "Yes. Each transcript line is editable and the export uses the text as it stands. A speech model can mishear names and unusual words, so read the subtitles through before you publish them.",
  },
  {
    id: "existing-file",
    question: "Can I make subtitles for a file I already have?",
    answer:
      "Yes. Import audio or video reads the sound of a file macOS can open and transcribes it the same way, and the SRT export works the same. Its lines are marked Import. Subtitles are one line of transcript each, so Trilsy does not split or reflow them to fit the screen.",
  },
];

export default function PodcastsAndVideoPage() {
  return (
    <UseCasePage
      useCase={useCase}
      marker={2}
      figures={figures}
      behavior={behavior}
      visual={<PodcastsDemo />}
      questions={questions}
    />
  );
}
