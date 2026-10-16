import type { Metadata } from "next";
import { pageMetadata } from "@/lib/metadata";
import { TalksDemo } from "@/components/use-cases/talks-demo";
import { UseCasePage } from "@/components/use-cases/use-case-page";
import type { Faq } from "@/lib/faq";
import { useCasePath, useCases } from "@/lib/site";

const useCase = useCases.find((u) => u.slug === "talks-courses-and-webinars")!;

// The title is new copy for review. The description is the copy deck's.
export const metadata: Metadata = pageMetadata({
  title: "Notes from anything that plays sound: record talks and courses on your Mac",
  description: useCase.description,
  path: useCasePath(useCase.slug),
});

const figures = [
  { src: "/characters/08-blue-crop.svg", alt: "A person in a blue top, watching a talk" },
  { src: "/characters/11-blue-headscarf.svg", alt: "A person in a blue headscarf, watching a talk and taking it in" },
] as const;

// New copy for review (not in the copy deck). The behavior is the app's own
// capture strip: Microphone off, App audio on, one app picked from the list. The
// recording is sound only (the capture asks for a 2 by 2 pixel picture and keeps
// none). The browser case was confirmed by the owner on 2026-10-16.
const behavior =
  "Turn on your Mac’s sound, leave the microphone off, and pick the app that is playing, such as your browser. Trilsy records what that app plays, and every line of the transcript comes back marked System.";

const questions: Faq[] = [
  {
    id: "one-tab",
    question: "Can I record one tab and not the others?",
    answer:
      "No. Trilsy records one app or all of them, not one tab. Pick your browser and you get everything it plays, so close the tabs you do not want recorded before you press Record.",
  },
  {
    id: "slides",
    question: "Does it record the slides?",
    answer:
      "No. Trilsy records sound only. It saves no video and no screenshots, so the transcript and the notes hold what was said. Something that is on a slide and never spoken is not in them.",
  },
];

export default function TalksCoursesAndWebinarsPage() {
  return (
    <UseCasePage
      useCase={useCase}
      marker={2}
      figures={figures}
      behavior={behavior}
      visual={<TalksDemo />}
      questions={questions}
    />
  );
}
