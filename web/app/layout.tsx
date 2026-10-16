import type { Metadata, Viewport } from "next";
import { Figtree, Fraunces } from "next/font/google";
import "./globals.css";
import { home, siteUrl } from "@/lib/metadata";
import { site } from "@/lib/site";
import { MotionProvider } from "@/components/motion-provider";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
// Self-hosted at build time by next/font, with a size-adjusted fallback so the
// swap does not shift layout. Fraunces keeps its optical-size axis only.
const figtree = Figtree({
  subsets: ["latin"],
  variable: "--font-figtree",
  display: "swap",
});
const fraunces = Fraunces({
  subsets: ["latin"],
  axes: ["opsz"],
  // Normal only: nothing on the site sets italic text, and the italic file was a
  // second preload on every page.
  style: ["normal"],
  variable: "--font-fraunces",
  display: "swap",
});

// Site-wide defaults. Every page sets its own title, description, canonical URL
// and Open Graph text through pageMetadata() in lib/metadata.ts; the share image
// is app/opengraph-image.tsx. Copy: docs/redesign/02-copy-deck.md section 12.
export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  applicationName: site.name,
  title: home.title,
  description: home.description,
  openGraph: { siteName: site.name, type: "website", locale: "en_US" },
  twitter: { card: "summary_large_image" },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#fbf7ee",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${figtree.variable} ${fraunces.variable}`}>
      <body>
        {/* Keyboard users skip the header; invisible until focused. Every page's <main> has id="main". */}
        <a
          href="#main"
          className="sr-only rounded-full border-2 border-ink bg-primary text-sm font-semibold text-primary-foreground focus-visible:not-sr-only focus-visible:px-4 focus-visible:py-2 focus-visible:fixed focus-visible:top-4 focus-visible:left-4 focus-visible:z-50"
        >
          Skip to content
        </a>
        <MotionProvider>
          <SiteHeader />
          {children}
          <SiteFooter />
        </MotionProvider>
      </body>
    </html>
  );
}
