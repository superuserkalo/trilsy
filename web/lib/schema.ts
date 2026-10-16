// Schema.org JSON-LD for the site, rendered by components/json-ld.tsx.
// Every statement is a product fact in docs/redesign-brief/00-master.md, true of
// the app today. No price, no offer and no rating: Pro's figures are placeholders
// (master: none in JSON-LD), and there is no signed download to offer. The free
// app is stated as `isAccessibleForFree` instead. FAQPage lives in lib/faq.ts.
import { home, siteUrl } from "@/lib/metadata";
import { site } from "@/lib/site";

const orgId = `${siteUrl}/#organization`;
const appId = `${siteUrl}/#software`;

// The home page's graph: who makes Trilsy and what it is. No logo until the
// owner supplies one (TODO: logo).
export const homeSchema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": orgId,
      name: site.name,
      url: siteUrl,
    },
    {
      "@type": "WebSite",
      "@id": `${siteUrl}/#website`,
      name: site.name,
      url: siteUrl,
      publisher: { "@id": orgId },
      inLanguage: "en",
    },
    {
      "@type": "SoftwareApplication",
      "@id": appId,
      name: site.name,
      url: siteUrl,
      description: home.description.replace(" Free, no account.", ""),
      applicationCategory: "BusinessApplication",
      operatingSystem: "macOS 15 or later",
      processorRequirements: "Apple silicon",
      memoryRequirements: "16 GB recommended",
      isAccessibleForFree: true,
      license: "https://opensource.org/license/mit",
      sameAs: [site.github],
      publisher: { "@id": orgId },
      featureList: [
        "Records the microphone, the Mac's sound or both",
        "Imports an audio or video file",
        "Transcribes on the Mac after the recording ends",
        "Writes editable notes in Markdown, section by section with an overview",
        "Timestamps on every transcript line that play the audio from that point",
        "Searches recordings by title, transcript and notes",
        "Exports Markdown, plain text and SRT subtitles",
        "Keeps audio, transcript and notes as files on the Mac, with no account and no upload",
      ],
    },
  ],
};

// A BreadcrumbList matching a page's visible breadcrumb, home first.
export function breadcrumbSchema(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map(({ name, path }, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name,
      item: `${siteUrl}${path === "/" ? "" : path}`,
    })),
  };
}
