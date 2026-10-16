import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/metadata";
import { useCasePath, useCases } from "@/lib/site";

// Every public page. The use-case pages come from lib/site.ts, so a new one is
// listed as soon as it is in the data. No lastModified: the site has no content
// dates to report, and a build date would claim changes that did not happen.
export default function sitemap(): MetadataRoute.Sitemap {
  const pages: { path: string; priority: number }[] = [
    { path: "/", priority: 1 },
    { path: "/how-it-works", priority: 0.8 },
    { path: "/pricing", priority: 0.8 },
    { path: "/students", priority: 0.8 },
    { path: "/faq", priority: 0.7 },
    { path: "/use-cases", priority: 0.7 },
    { path: "/privacy", priority: 0.3 },
    { path: "/terms", priority: 0.3 },
    ...useCases.map((u) => ({ path: useCasePath(u.slug), priority: 0.6 })),
  ];
  return pages.map(({ path, priority }) => ({ url: `${siteUrl}${path === "/" ? "" : path}`, priority }));
}
