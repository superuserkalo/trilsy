import type { Metadata } from "next";
import { JsonLd } from "@/components/json-ld";
import { home, pageMetadata } from "@/lib/metadata";
import { homeSchema } from "@/lib/schema";
import { HeroCopy } from "@/components/hero/hero-copy";
import { HeroSection } from "@/components/hero/hero-section";
import { ClosingBand } from "@/components/closing-band";
import { FaqSection } from "@/components/faq/faq-section";
import { TrustBand } from "@/components/trust-band";

export const metadata: Metadata = pageMetadata({ ...home, path: "/" });

export default function Page() {
  return (
    <main id="main">
      <JsonLd data={homeSchema} />
      <HeroSection copy={<HeroCopy />} />
      <TrustBand />
      <FaqSection />
      <ClosingBand />
    </main>
  );
}
