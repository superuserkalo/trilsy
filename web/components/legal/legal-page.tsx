import Link from "next/link";
import { Band } from "@/components/ui/surface";

/**
 * The shape of Privacy and Terms: a pale blue band with the H1 (its last words
 * in the marker) and one lead sentence, then paper rows under dotted rules, the
 * way How it works is ruled: the section's title on the left, its plain text on
 * the right. No numbers (these are not steps), no cards, no motion beyond the
 * marker. Server Component; the marker is the only client part.
 */
export function LegalPage({
  heading,
  lead,
  sections,
}: {
  heading: React.ReactNode;
  lead: string;
  sections: { id: string; title: string; body: React.ReactNode }[];
}) {
  return (
    <main id="main">
      <Band tone="field" rules="bottom" aria-labelledby="legal-heading">
        <div className="mx-auto flex max-w-6xl flex-col items-start gap-8 px-6 pt-14 pb-14 lg:pt-24 lg:pb-20">
          <h1
            id="legal-heading"
            className="max-w-[14em] text-[40px] leading-[1.08] font-semibold tracking-[-0.015em] text-balance lg:text-6xl"
          >
            {heading}
          </h1>
          <p className="max-w-[32em] text-[17px] leading-relaxed text-foreground/85 lg:text-lg">{lead}</p>
        </div>
      </Band>

      {sections.map(({ id, title, body }, i) => (
        <Band
          key={id}
          id={id}
          tone="paper"
          rules={i ? "top" : "none"}
          aria-labelledby={`${id}-title`}
          className="scroll-mt-24"
        >
          <div className="mx-auto grid max-w-6xl grid-cols-1 gap-5 px-6 py-10 lg:grid-cols-[5fr_7fr] lg:gap-20 lg:py-16">
            <h2
              id={`${id}-title`}
              className="text-2xl leading-[1.1] font-semibold tracking-[-0.015em] text-balance lg:text-[2rem]"
            >
              {title}
            </h2>
            <div className="flex max-w-[34em] min-w-0 flex-col gap-4 text-[17px] leading-relaxed text-foreground/85 lg:text-lg">
              {body}
            </div>
          </div>
        </Band>
      ))}
    </main>
  );
}

const linkClass =
  "rounded-sm underline decoration-primary decoration-2 underline-offset-4 transition-colors duration-(--duration-base) ease-trilsy hover:decoration-foreground focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none";

/** A link inside legal text: ink, a mustard underline. `external` opens a new tab. */
export function TextLink({
  href,
  external,
  children,
}: {
  href: string;
  external?: boolean;
  children: React.ReactNode;
}) {
  return external ? (
    <a href={href} target="_blank" rel="noopener noreferrer" className={linkClass}>
      {children}
      <span className="sr-only"> (opens in a new tab)</span>
    </a>
  ) : (
    <Link href={href} className={linkClass}>
      {children}
    </Link>
  );
}

/** A file path, as in the rest of the site. */
export function Path({ children }: { children: string }) {
  return (
    <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-[0.82em] break-words">{children}</code>
  );
}
