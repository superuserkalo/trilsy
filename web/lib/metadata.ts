import type { Metadata } from "next";
import { site } from "@/lib/site";

// One shape for every page's metadata: the title and description also become the
// Open Graph and Twitter title and description, and the path is the canonical
// URL (relative to `metadataBase` in app/layout.tsx). The share image is
// app/opengraph-image.tsx. It is named here because a page that sets its own
// `openGraph` replaces its parent's, and the file-based image does not reach
// child segments once they do.
// No price ever goes in here (master: no placeholder figure in OG or JSON-LD).
export const siteUrl = "https://trilsy.com";

// Home: copy deck section 12, word for word. The OG title is the hero's H1.
export const home = {
  title: "Trilsy: notes for every call, lecture and interview",
  description:
    "Trilsy is a Mac app that records your microphone, your Mac's sound or both, transcribes it on your Mac and writes notes you can edit. Free, no account.",
  ogTitle: "Be in the conversation. Trilsy writes the notes.",
};

export function pageMetadata({
  title,
  description,
  path,
  ogTitle,
}: {
  title: string;
  description: string;
  path: string;
  ogTitle?: string;
}): Metadata {
  const shareTitle = ogTitle ?? title;
  const image = { url: "/opengraph-image", width: 1200, height: 630, alt: home.ogTitle, type: "image/png" };
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      title: shareTitle,
      description,
      url: path,
      siteName: site.name,
      type: "website",
      locale: "en_US",
      images: [image],
    },
    twitter: { card: "summary_large_image", title: shareTitle, description, images: [image] },
  };
}
