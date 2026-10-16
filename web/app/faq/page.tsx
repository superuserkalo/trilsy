import type { Metadata } from "next";
import { pageMetadata } from "@/lib/metadata";
import { FaqList } from "@/components/faq/faq-list";
import { JsonLd } from "@/components/json-ld";
import { Band } from "@/components/ui/surface";
import { faqPageSchema, faqs, quickFaqs } from "@/lib/faq";

// Title and description are new copy for review (not in the copy deck). Neither
// carries a price or a discount.
export const metadata: Metadata = pageMetadata({
  title: "Questions about Trilsy: recording, privacy and cost",
  description:
    "Answers about recording calls, where your files are kept, what leaves your Mac, what Trilsy costs and what you need to run it.",
  path: "/faq",
});

export default function FaqPage() {
  return (
    <main id="main">
      {/* Both lists are visible on this page, so both are in the FAQPage. */}
      <JsonLd data={faqPageSchema([...faqs, ...quickFaqs])} />
      <Band tone="paper" rules="none" aria-labelledby="faq-heading">
        <div className="mx-auto grid max-w-6xl gap-10 px-6 pt-12 pb-20 lg:grid-cols-[5fr_7fr] lg:gap-20 lg:pt-20 lg:pb-28">
          <div>
            <h1
              id="faq-heading"
              className="text-4xl leading-[1.05] font-semibold tracking-[-0.015em] lg:sticky lg:top-32 lg:text-5xl"
            >
              Good questions.
            </h1>
          </div>
          <div className="flex flex-col gap-10">
            <FaqList items={faqs} level={2} />
            <dl className="flex flex-col gap-3">
              {quickFaqs.map(({ id, question, answer }) => (
                <div key={id} className="flex flex-wrap gap-x-3">
                  <dt className="font-semibold">{question}</dt>
                  <dd className="text-foreground/80">{answer}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </Band>
    </main>
  );
}
