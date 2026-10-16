import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/metadata";

// Permissive on purpose: search engines, answer engines and AI agents may all
// read and cite the site. The named user agents are allowed explicitly, so a
// crawler that only obeys its own group still finds a rule. Only the dev-only
// check pages are disallowed (they 404 in production anyway).
const crawlers = [
  "Googlebot",
  "Bingbot",
  "DuckDuckBot",
  "Applebot",
  "Applebot-Extended",
  "GPTBot",
  "OAI-SearchBot",
  "ChatGPT-User",
  "ClaudeBot",
  "Claude-SearchBot",
  "Claude-User",
  "anthropic-ai",
  "PerplexityBot",
  "Perplexity-User",
  "Google-Extended",
  "CCBot",
  "Meta-ExternalAgent",
  "Amazonbot",
  "cohere-ai",
  "MistralAI-User",
  "YouBot",
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: "/scratch" },
      { userAgent: crawlers, allow: "/", disallow: "/scratch" },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  };
}
