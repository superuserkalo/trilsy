import type { Metadata } from "next";
import { pageMetadata } from "@/lib/metadata";
import { CustomerDemo } from "@/components/use-cases/customer-demo";
import { UseCasePage } from "@/components/use-cases/use-case-page";
import type { Faq } from "@/lib/faq";
import { useCasePath, useCases } from "@/lib/site";

const useCase = useCases.find((u) => u.slug === "customer-calls")!;

// The title is new copy for review. The description is the copy deck's.
export const metadata: Metadata = pageMetadata({
  title: "Keep every customer call: searchable transcripts on your Mac",
  description: useCase.description,
  path: useCasePath(useCase.slug),
});

const figures = [
  { src: "/characters/10-sage-long-hair.svg", alt: "A person with long hair in a sage jumper, on a call" },
] as const;

// New copy for review. The behavior is reading across calls: search narrows the
// list to the calls that mention a word, and each one opens on its transcript.
// Search matches the letters typed, not a meaning, and does not mark the word
// inside a recording (fact check, b8).
const behavior =
  "Every call stays in your list as a transcript and notes. Search a word and open the calls it comes up in, one after another, to see how each customer put it.";

const questions: Faq[] = [
  {
    id: "find-by-name",
    question: "Can I find a call by the customer’s name?",
    answer:
      "If the name is in the title, the transcript or the notes, yes. The title is editable like the notes, so put the customer’s name in it after the call and the search box will always find it.",
  },
  {
    id: "exact-word",
    question: "Does search find a word that means the same thing?",
    answer:
      "No. Search matches the letters you type, upper or lower case, against the title, the transcript and the notes. Searching for refund will not find money back, so try the words a customer is likely to use.",
  },
];

export default function CustomerCallsPage() {
  return (
    <UseCasePage
      useCase={useCase}
      marker={3}
      figures={figures}
      behavior={behavior}
      visual={<CustomerDemo />}
      questions={questions}
    />
  );
}
