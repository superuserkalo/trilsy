import type { Metadata } from "next";
import { pageMetadata } from "@/lib/metadata";
import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowRight01Icon } from "@hugeicons/core-free-icons";
import { Marker } from "@/components/hero/marker";
import { Button } from "@/components/ui/button";
import { Band } from "@/components/ui/surface";
import { site, useCasePath } from "@/lib/site";

// Title and description are new copy for review (not in the copy deck). Neither
// carries a price or a discount figure: the figure is a placeholder.
export const metadata: Metadata = pageMetadata({
  title: "Trilsy for students: free lecture notes on your Mac, and a student discount",
  description:
    "Record a lecture, a seminar or an online course on your Mac and keep a transcript and notes you can search before the exam. Trilsy is free, and students get a discount on paid plans.",
  path: "/students",
});

// Two students from the owner's character pack, cropped at the waist by the
// band's lower rule like the figures in the hero.
const students = [
  {
    src: "/characters/04-blue-wave.svg",
    alt: "A student with her hair in a bun, raising a hand to ask a question",
  },
  {
    src: "/characters/12-mustard-gesture.svg",
    alt: "A student in a mustard sweater, explaining something with an open hand",
  },
] as const;

// What a student does next: one sentence, one link each. The links are the
// approved copy's "see Lectures" and "see Talks, courses and webinars".
const next = [
  {
    text: "Lecture notes you can search before the exam: see",
    label: "Lectures",
    href: useCasePath("lectures"),
  },
  {
    text: "Study with the course videos you already watch: see",
    label: "Talks, courses and webinars",
    href: useCasePath("talks-courses-and-webinars"),
  },
] as const;

// Copy: docs/redesign/02-copy-deck.md section 10, word for word. The 50% and the
// verification were confirmed by the owner on 2026-10-16.
export default function StudentsPage() {
  return (
    <main id="main">
      <Band tone="field" rules="bottom" aria-labelledby="students-heading">
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-10 px-6 pt-14 lg:grid-cols-[7fr_5fr] lg:gap-12 lg:pt-24">
          <div className="flex flex-col items-start gap-8 pb-4 lg:pb-24">
            <h1
              id="students-heading"
              className="max-w-[12em] text-[40px] leading-[1.08] font-semibold tracking-[-0.015em] text-balance lg:text-6xl"
            >
              Students get <Marker>50% off everything paid.</Marker>
            </h1>
            <p className="max-w-[32em] text-[17px] leading-relaxed text-foreground/85 lg:text-lg">
              Trilsy is free, and recording a lecture, a seminar or a course costs nothing. When paid plans are available, students and educators get 50% off every one, with a verified student or school email.
            </p>
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
            {students.map(({ src, alt }, i) => (
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

      <Band tone="paper" rules="none" aria-label="More for students">
        <ul className="mx-auto flex max-w-6xl flex-col px-6 py-6 lg:py-10">
          {next.map(({ text, label, href }, i) => (
            <li
              key={href}
              className={i ? "border-t-[1.5px] border-dotted border-foreground" : undefined}
            >
              <Link
                href={href}
                className="group flex items-center justify-between gap-6 py-6 lg:py-8"
              >
                <span className="max-w-[26em] text-xl leading-snug font-semibold tracking-[-0.01em] text-balance lg:text-3xl">
                  {text}{" "}
                  <span className="underline decoration-primary decoration-2 underline-offset-4 transition-colors duration-(--duration-base) ease-trilsy group-hover:decoration-foreground">
                    {label}
                  </span>
                  .
                </span>
                <HugeiconsIcon
                  icon={ArrowRight01Icon}
                  aria-hidden
                  className="size-8 shrink-0 transition-transform duration-(--duration-base) ease-trilsy group-hover:translate-x-1 motion-reduce:transition-none"
                />
              </Link>
            </li>
          ))}
        </ul>
      </Band>
    </main>
  );
}
