import { Reveal } from "@/components/reveal";
import { Band } from "@/components/ui/surface";

// Copy: docs/redesign/02-copy-deck.md section 3. The row names apps the Mac can
// record; it never says Trilsy works with them, integrates with them or is used
// by them. The owner confirmed on 2026-10-16 that each app was tried on a real Mac.
const line = "Trilsy records whatever your Mac plays, from the apps you already use.";
// The trademark footnote (copy deck section 3) now sits in the site footer, so
// it appears once on every page.

// `mark` is the mask utility for the Simple Icons file in public/logos/. The mark
// takes the text colour, so every one is the same grey. FaceTime has no mark in
// the set (the approved prototype shows its name alone); no mark is drawn for it.
// TODO: confirm each brand's guidelines allow a one-colour mark in a list of names.
const apps: { name: string; mark?: string }[] = [
  { name: "Zoom", mark: "mask-[url(/logos/zoom.svg)]" },
  { name: "Google Meet", mark: "mask-[url(/logos/googlemeet.svg)]" },
  { name: "Microsoft Teams", mark: "mask-[url(/logos/microsoftteams.svg)]" },
  { name: "Slack", mark: "mask-[url(/logos/slack.svg)]" },
  { name: "Discord", mark: "mask-[url(/logos/discord.svg)]" },
  { name: "Webex", mark: "mask-[url(/logos/webex.svg)]" },
  { name: "YouTube", mark: "mask-[url(/logos/youtube.svg)]" },
  { name: "Safari", mark: "mask-[url(/logos/safari.svg)]" },
  { name: "Google Chrome", mark: "mask-[url(/logos/googlechrome.svg)]" },
  { name: "FaceTime" },
];

// The second copy is the loop's seam: hidden from assistive technology, and
// hidden altogether when the row stops moving and wraps instead.
function Row({ copy }: { copy?: boolean }) {
  return (
    <ul
      aria-hidden={copy || undefined}
      className="flex shrink-0 items-center gap-12 pr-12 motion-reduce:shrink motion-reduce:flex-wrap motion-reduce:justify-center motion-reduce:gap-x-12 motion-reduce:gap-y-4 motion-reduce:pr-0 motion-reduce:data-[copy]:hidden"
      data-copy={copy || undefined}
    >
      {apps.map(({ name, mark }) => (
        <li
          key={name}
          className="flex items-center gap-2.5 whitespace-nowrap text-base font-semibold tracking-tight text-foreground/55"
        >
          {mark ? (
            <span
              aria-hidden
              className={`size-5 shrink-0 bg-current mask-contain mask-center mask-no-repeat ${mark}`}
            />
          ) : null}
          {name}
        </li>
      ))}
    </ul>
  );
}

export function TrustBand() {
  return (
    <Band aria-label="Apps Trilsy can record" tone="field" rules="both">
      <Reveal>
        <p className="px-6 pt-[18px] text-center text-[15px] text-muted-foreground">{line}</p>
        <div className="overflow-hidden pt-4 pb-5 [mask-image:linear-gradient(90deg,transparent,black_10%,black_90%,transparent)] motion-reduce:px-6 motion-reduce:[mask-image:none]">
          <div className="flex w-max animate-marquee motion-reduce:w-full motion-reduce:animate-none motion-reduce:justify-center">
            <Row />
            <Row copy />
          </div>
        </div>
      </Reveal>
    </Band>
  );
}
