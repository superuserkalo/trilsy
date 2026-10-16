import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowRight01Icon } from "@hugeicons/core-free-icons";
import { FaqList } from "@/components/faq/faq-list";
import { Reveal } from "@/components/reveal";
import { Button } from "@/components/ui/button";
import { Band } from "@/components/ui/surface";
import { homeFaqs } from "@/lib/faq";

// Home "Good questions." (copy deck section 5): the first six, a way to the rest.
// On paper, not the pale blue the ticket named: the trust band above it is the
// blue band, and two neighbours may not share a tone (concept B4). One word to change.
export function FaqSection() {
  return (
    <Band tone="paper" rules="none" aria-labelledby="faq-heading">
      <Reveal className="mx-auto grid max-w-6xl gap-10 px-6 py-16 lg:grid-cols-[5fr_7fr] lg:gap-20 lg:py-24">
        <div className="flex flex-col items-start gap-6">
          <h2 id="faq-heading" className="text-4xl leading-[1.05] font-semibold tracking-[-0.015em] lg:text-5xl">
            Good questions.
          </h2>
          <Button variant="outline" nativeButton={false} render={<Link href="/faq" />}>
            All questions
            <HugeiconsIcon icon={ArrowRight01Icon} strokeWidth={2} data-icon="inline-end" />
          </Button>
        </div>
        <FaqList items={homeFaqs} />
      </Reveal>
    </Band>
  );
}
