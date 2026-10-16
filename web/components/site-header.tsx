import Link from "next/link";
import { HeaderNav } from "@/components/header-nav";
import { HeaderIsland } from "@/components/header-island";
import { MobileMenu } from "@/components/mobile-menu";
import { Button } from "@/components/ui/button";
import { site } from "@/lib/site";

// The square island header. The outer element is a fixed 96px sticky strip
// that lets clicks through; the island sits 16px under the top edge and keeps
// its place while the page scrolls. Its height (80px, 56px once the page is
// past the hero; ticket 17) is set by HeaderIsland, so the shrink changes
// nothing around it.
export function SiteHeader() {
  return (
    <header className="pointer-events-none sticky top-0 z-40 h-24 px-4 pt-4">
      <HeaderIsland
        className="pointer-events-auto mx-auto flex max-w-[912px] items-center justify-between gap-3 rounded-lg border-[3px] border-field bg-card pr-3 pl-5 lg:gap-6"
      >
        {/* TODO: logo. Plain Fraunces wordmark until the owner supplies the logo. */}
        <Link
          href="/"
          className="font-display text-2xl font-semibold tracking-tight"
        >
          {site.name}
        </Link>
        <div className="flex items-center gap-2 lg:gap-4">
          <HeaderNav />
          <Button
            nativeButton={false}
            render={
              <a href={site.github} target="_blank" rel="noopener noreferrer" />
            }
            className="px-4 sm:px-6"
          >
            View on GitHub
          </Button>
          <MobileMenu />
        </div>
      </HeaderIsland>
    </header>
  );
}
