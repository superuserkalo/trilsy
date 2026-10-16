import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { HeroCheck } from "@/components/hero/hero-check";

// Development-only check of the hero and pinned story (ticket 04). A 404 in
// production, never indexed.
export const metadata: Metadata = {
  title: "Scratch: hero",
  robots: { index: false, follow: false },
};

export default function ScratchHero() {
  if (process.env.NODE_ENV === "production") notFound();
  return (
    <main className="pb-24">
      <HeroCheck />
    </main>
  );
}
