import { Reveal } from "@/components/reveal";
import { Band } from "@/components/ui/surface";

// Copy: docs/redesign/02-copy-deck.md section 3. The row names apps the Mac can
// record; it never says Trilsy works with them, integrates with them or is used
// by them. The owner confirmed on 2026-10-16 that each app was tried on a real Mac.
const line = "Trilsy records whatever your Mac plays, from the apps you already use.";
// The trademark footnote (copy deck section 3) now sits in the site footer, so
// it appears once on every page.

// Each app shows its own full-colour mark (public/logos/), not recoloured, with
// its name beside it in ink at 75% (6.4:1 on the pale blue band; the old grey
// at 55% was 3.5:1). Marks are files, drawn as plain <img>: fixed height,
// intrinsic width, so nothing shifts. FaceTime has no mark: no official asset
// was available as a usable file, and none is drawn (the approved prototype
// shows its name alone).
//
// Sources, read 2026-10-16. None of these came straight from a brand's own press
// kit: Slack's media kit and the Discord branding page serve zips and logo
// sheets, Zoom's and Microsoft's brand centres sit behind a script app or a
// download. Where a file below says "Logos", it is the SVG Logos set
// (github.com/gilbarbara/logos, npm @iconify-json/logos 1.2.16, CC0 for the
// packaging; the marks themselves remain their owners' trademarks); where it says
// "Commons", it is a file on Wikimedia Commons. Each colour was checked against
// the Simple Icons official hex (simple-icons 16.35.0).
//   zoom.svg           Commons, "Zoom Logo 2022.svg": the current wordmark, #0B5CFF
//                      (Simple Icons 0B5CFF). Zoom's current mark is the wordmark, so
//                      it stands in for mark and name together.
//   googlemeet.svg     Commons, "Google Meet icon (2020).svg": Google's current icon
//                      (Simple Icons 00897B is only its green).
//   microsoftteams.svg Commons, "Microsoft Office Teams (2025-present).svg".
//   slack.svg          Logos "slack-icon": the four-colour mark.
//   discord.svg        Logos "discord-icon": #5865F2 (Simple Icons 5865F2).
//   webex.svg          Commons, "Cisco Webex logo - Brandlogos.net.svg" (a traced copy
//                      on a logo-collection site, the weakest source here), the
//                      symbol only: cropped by viewBox, wordmark removed. 49KB
//                      because of its shading; a raster render loses the shading
//                      (librsvg drops the blend modes), so it stays SVG. Simple
//                      Icons lists Webex as 000000; the symbol is the brand's blue
//                      and green.
//   youtube.svg        Logos "youtube-icon": #FF0000 (Simple Icons FF0000).
//   safari.webp        Logos "safari", rendered to 96px WebP (the SVG is 35KB).
//   googlechrome.svg   Logos "chrome": the four-colour mark (Simple Icons 4285F4 is
//                      its blue).
// TODO: confirm with the owner: swap any of these for the brand's own kit file when
// one is downloaded (Zoom Brand Center, Cisco, Apple marketing resources). The
// marks are no longer recoloured, so the old question about one-colour use in a
// list of names no longer applies; each brand's rules on a logo shown in a list of
// apps (clear space, no implied endorsement) are covered by the footer's line.
type App = { name: string; mark?: { src: string; w: number; h: number; wordmark?: boolean } };

const apps: App[] = [
  { name: "Zoom", mark: { src: "/logos/zoom.svg", w: 70, h: 16, wordmark: true } },
  { name: "Google Meet", mark: { src: "/logos/googlemeet.svg", w: 29, h: 24 } },
  { name: "Microsoft Teams", mark: { src: "/logos/microsoftteams.svg", w: 25, h: 24 } },
  { name: "Slack", mark: { src: "/logos/slack.svg", w: 24, h: 24 } },
  { name: "Discord", mark: { src: "/logos/discord.svg", w: 31, h: 24 } },
  { name: "Webex", mark: { src: "/logos/webex.svg", w: 33, h: 24 } },
  { name: "YouTube", mark: { src: "/logos/youtube.svg", w: 34, h: 24 } },
  { name: "Safari", mark: { src: "/logos/safari.webp", w: 24, h: 24 } },
  { name: "Google Chrome", mark: { src: "/logos/googlechrome.svg", w: 24, h: 24 } },
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
          className="flex items-center gap-2.5 whitespace-nowrap text-base font-semibold tracking-tight text-foreground/75"
        >
          {mark ? (
            // eslint-disable-next-line @next/next/no-img-element -- fixed-size brand marks, no optimisation needed
            <img
              src={mark.src}
              width={mark.w}
              height={mark.h}
              alt={mark.wordmark ? name : ""}
              aria-hidden={mark.wordmark ? undefined : true}
              decoding="async"
              loading="lazy"
              className="shrink-0 select-none"
            />
          ) : null}
          {mark?.wordmark ? null : name}
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
