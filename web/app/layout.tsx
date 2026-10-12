import type { Metadata } from "next";
import "./globals.css";
import { brand } from "@/lib/brand";
export const metadata: Metadata = {
  metadataBase: new URL("https://trilsy.com"),
  alternates: { canonical: "/" },
  title: `${brand.name} — Be here. We’ll take the notes.`,
  description:
    "A private, botless notetaker for Mac. Turn conversations into thoughtful, detailed notes with local AI. Explore the interactive preview.",
  openGraph: {
    title: `${brand.name} — Your conversations, beautifully kept.`,
    description: "Private notes for the conversations worth remembering.",
    type: "website",
  },
  robots: { index: true, follow: true },
};
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
