import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowRight01Icon } from "@hugeicons/core-free-icons";
import { FaqList } from "@/components/faq/faq-list";
import { JsonLd } from "@/components/json-ld";
import { Marker } from "@/components/hero/marker";
import { Button } from "@/components/ui/button";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Band } from "@/components/ui/surface";
import type { Faq } from "@/lib/faq";
import { breadcrumbSchema } from "@/lib/schema";
import { site, useCasePath, type UseCase } from "@/lib/site";

/**
 * The shape of every use-case page (Lectures sets it; Work and Learning and media
 * follow it):
 *   1. pale blue band: breadcrumb, the H1 (its last words in the marker), the lead,
 *      View on GitHub, and one or two characters cropped at the band's rule;
 *   2. paper band: the situation sentence as the heading, one sentence on what the
 *      page's behavior is, and the window that shows it. Each page shows a
 *      different behavior; the window is the only thing that changes shape;
 *   3. paper row under a dotted rule: "Good questions." and the page's two questions;
 *   4. learning pages only: the Students line, a link row under its own rule.
 * Everything below the first band is paper, ruled into rows like How it works, so
 * the last row never touches the pale blue footer, whichever rows a page has.
 * Copy for the H1, lead, situation and meta description is the approved copy deck
 * (lib/site.ts); `behavior`, the questions and the windows' content are new.
 * `marker` is how many words at the end of the H1 sit in the marker.
 */
export function UseCasePage({
  useCase,
  marker = 3,
  figures,
  behavior,
  visual,
  questions,
}: {
  useCase: UseCase;
  marker?: number;
  figures: readonly { src: string; alt: string }[];
  behavior: string;
  visual: React.ReactNode;
  questions: Faq[];
}) {
  const words = useCase.h1.split(" ");
  const head = words.slice(0, -marker).join(" ");
  const marked = words.slice(-marker).join(" ");

  return (
    <main id="main">
      {/* The visible breadcrumb below, as JSON-LD. */}
      <JsonLd
        data={breadcrumbSchema([
          { name: site.name, path: "/" },
          { name: "Use cases", path: "/use-cases" },
          { name: useCase.name, path: useCasePath(useCase.slug) },
        ])}
      />
      <Band tone="field" rules="bottom" id={useCase.slug} aria-labelledby="use-case-heading">
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-10 px-6 pt-10 lg:grid-cols-[7fr_5fr] lg:gap-12 lg:pt-16">
          <div className="flex flex-col items-start gap-8 pb-4 lg:pb-24">
            <Breadcrumb aria-label="Breadcrumb">
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink render={<Link href="/" />}>{site.name}</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink render={<Link href="/use-cases" />}>Use cases</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>{useCase.name}</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
            <h1
              id="use-case-heading"
              className="max-w-[12em] text-[40px] leading-[1.08] font-semibold tracking-[-0.015em] text-balance lg:text-6xl"
            >
              {head} <Marker>{marked}</Marker>
            </h1>
            <p className="max-w-[32em] text-[17px] leading-relaxed text-foreground/85 lg:text-lg">{useCase.lead}</p>
            <Button
              size="lg"
              nativeButton={false}
              render={<a href={site.github} target="_blank" rel="noopener noreferrer" />}
            >
              View on GitHub
            </Button>
          </div>

          {/* Waist-up: the box is shorter than the drawings, so the rule below cuts them off. */}
          <div className="flex h-52 items-start justify-center self-end overflow-hidden lg:h-64 lg:justify-end">
            {figures.map(({ src, alt }, i) => (
              <img
                key={src}
                src={src}
                alt={alt}
                width={280}
                height={520}
                className={i ? "-ml-6 w-52 shrink-0 lg:w-60" : "w-52 shrink-0 lg:w-60"}
              />
            ))}
          </div>
        </div>
      </Band>

      <Band tone="paper" rules="none" aria-labelledby="situation-heading">
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 px-6 py-12 lg:grid-cols-[5fr_7fr] lg:gap-20 lg:py-20">
          <h2
            id="situation-heading"
            className="text-3xl leading-[1.05] font-semibold tracking-[-0.015em] text-balance lg:text-[2.5rem]"
          >
            {useCase.situation}
          </h2>
          <div className="flex min-w-0 flex-col gap-8">
            <p className="max-w-[34em] text-[17px] leading-relaxed text-foreground/85 lg:text-lg">{behavior}</p>
            {visual}
          </div>
        </div>
      </Band>

      <Band tone="paper" rules="top" aria-labelledby="questions-heading">
        <div className="mx-auto grid max-w-6xl gap-10 px-6 py-16 lg:grid-cols-[5fr_7fr] lg:gap-20 lg:py-24">
          <h2 id="questions-heading" className="text-4xl leading-[1.05] font-semibold tracking-[-0.015em] lg:text-5xl">
            Good questions.
          </h2>
          <FaqList items={questions} />
        </div>
      </Band>

      {useCase.learning && (
        <Band tone="paper" rules="top" aria-label="For students">
          <div className="mx-auto max-w-6xl px-6 py-4 lg:py-8">
            <Link href="/students" className="group flex items-center justify-between gap-6 py-6 lg:py-8">
              <span className="max-w-[26em] text-xl leading-snug font-semibold tracking-[-0.01em] text-balance lg:text-3xl">
                Students get 50% off every paid plan. See the{" "}
                <span className="underline decoration-primary decoration-2 underline-offset-4 transition-colors duration-(--duration-base) ease-trilsy group-hover:decoration-foreground">
                  Students page
                </span>
                .
              </span>
              <HugeiconsIcon
                icon={ArrowRight01Icon}
                aria-hidden
                className="size-8 shrink-0 transition-transform duration-(--duration-base) ease-trilsy group-hover:translate-x-1 motion-reduce:transition-none"
              />
            </Link>
          </div>
        </Band>
      )}
    </main>
  );
}
