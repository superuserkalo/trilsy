import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowUpRight01Icon } from "@hugeicons/core-free-icons";
import { bandVariants } from "@/components/ui/surface";
import { cn } from "@/lib/utils";
import { headerLinks, site, useCaseGroups, useCasePath } from "@/lib/site";

// Every page, last. Copy: docs/redesign/02-copy-deck.md section 12 (footer) and
// section 3 (the trademark line, moved here from the trust band so the sentence
// appears once on a page that holds both). One job: the way to every page. The
// pale blue field with a dotted ink rule on top, the twelve use cases in plain
// columns, the site pages, the legal links. No motion, no illustration.
//
// TODO: logo. The wordmark is plain Fraunces until the owner supplies the logo.

const trademarkLine =
  "App names and marks belong to their owners; no affiliation or endorsement is implied.";

const siteLinks = [...headerLinks, { href: "/faq", label: "FAQ" }] as const;

const legalLinks = [
  { href: "/privacy", label: "Privacy" },
  { href: "/terms", label: "Terms" },
] as const;

const useCases = useCaseGroups.flatMap((group) => group.items);

// One link style for the whole footer: ink, a mustard underline that darkens on
// hover, and a tall enough target to hit with a thumb.
const linkClass =
  "inline-flex min-h-9 items-center rounded-sm text-[15px] leading-snug text-foreground underline decoration-transparent decoration-2 underline-offset-4 transition-colors duration-(--duration-base) ease-trilsy hover:decoration-primary focus-visible:decoration-primary focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none";

function Heading({ children, id }: { children: React.ReactNode; id: string }) {
  return (
    <h2 id={id} className="mb-2 font-display text-lg font-semibold tracking-tight">
      {children}
    </h2>
  );
}

export function SiteFooter() {
  return (
    <footer
      className={cn(bandVariants({ tone: "field", rules: "top" }), "px-6 pt-12 pb-8 sm:pt-14")}
    >
      <div className="mx-auto flex max-w-6xl flex-col gap-12">
        <div className="grid gap-10 md:grid-cols-[1fr_auto] lg:grid-cols-[1fr_minmax(0,34rem)_12rem] lg:gap-12">
          {/* TODO: logo */}
          <Link
            href="/"
            className="w-fit self-start rounded-sm font-display text-2xl font-semibold tracking-tight focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none md:col-span-2 lg:col-span-1"
          >
            {site.name}
          </Link>

          <nav aria-labelledby="footer-use-cases">
            <Heading id="footer-use-cases">Use cases</Heading>
            <ul className="grid gap-x-8 sm:grid-flow-col sm:grid-rows-6">
              {useCases.map((item) => (
                <li key={item.slug}>
                  <Link href={useCasePath(item.slug)} className={linkClass}>
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-labelledby="footer-site">
            <Heading id="footer-site">Product</Heading>
            <ul className="flex flex-col">
              {siteLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className={linkClass}>
                    {link.label}
                  </Link>
                </li>
              ))}
              <li>
                <a
                  href={site.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(linkClass, "gap-1")}
                >
                  GitHub
                  <HugeiconsIcon
                    icon={ArrowUpRight01Icon}
                    strokeWidth={2}
                    className="size-4"
                    aria-hidden
                  />
                  <span className="sr-only">(opens in a new tab)</span>
                </a>
              </li>
            </ul>
          </nav>
        </div>

        <div className="flex flex-col gap-4 border-t-[1.5px] border-dotted border-foreground pt-6 sm:flex-row sm:items-start sm:justify-between sm:gap-10">
          <p className="max-w-md text-[13px] leading-relaxed text-foreground/75">
            {trademarkLine}
          </p>
          <nav aria-label="Legal">
            <ul className="flex gap-6">
              {legalLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className={cn(linkClass, "min-h-0 text-[13px]")}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>
    </footer>
  );
}
