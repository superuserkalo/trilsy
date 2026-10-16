import type { Metadata } from "next";
import { pageMetadata } from "@/lib/metadata";
import { Marker } from "@/components/hero/marker";
import { LegalPage, TextLink } from "@/components/legal/legal-page";
import { operator, site } from "@/lib/site";

// Title, description and every line below are new copy for review (not in the
// copy deck). The recording-consent section matches FAQ 1; the notes section
// matches How it works block 4; the "early software" and "no signed installer"
// lines come from README.md and the master. No price or discount figure: the
// pricing page owns those.
export const metadata: Metadata = pageMetadata({
  title: "Terms of use: Trilsy, the Mac app, and this website",
  description:
    "Plain terms for the Trilsy Mac app and this website: you tell people you record them, your recordings are yours, the notes can be wrong, and the software comes without warranty.",
  path: "/terms",
});

// TODO: confirm, left off the page on purpose:
// - the imprint is the "Who provides Trilsy" section: the owner gave a name and
//   a street (lib/site.ts `operator`). Still missing, and not invented: postcode,
//   city, country, a contact email, and any trade or VAT number an Austrian or EU
//   imprint may need. Until an email is given the contact route is GitHub issues.
// - governing law and courts: none is given, so none is printed.
// - an effective or "last updated" date, for the same reason as the privacy page.
// - the exact liability wording and whether it holds in the owner's
//   jurisdiction (consumer law in Austria and the EU limits what a disclaimer can
//   exclude): "to the extent the law allows" is a stand-in until a lawyer or the
//   owner reads it.
// - the licence: MIT, chosen by the owner on 2026-10-16 (LICENSE at the repo root,
//   FAQ 6). The name and this site's drawings stay outside the grant; the page says so.
export default function TermsPage() {
  return (
    <LegalPage
      heading={
        <>
          Use Trilsy freely. <Marker>Tell people you record.</Marker>
        </>
      }
      lead="The terms for the Trilsy Mac app and this website, in plain words."
      sections={[
        {
          id: "what-trilsy-is",
          title: "What Trilsy is.",
          body: (
            <>
              <p>
                Trilsy is a Mac app for Apple silicon, on macOS 15 or later. It records your microphone, your Mac’s sound or both,
                transcribes the recording and writes notes you can edit, all on your Mac.
              </p>
              <p>
                It is free, with no time limit. Paid plans are not available yet, and the <TextLink href="/pricing">Pricing</TextLink>{" "}
                page says what is planned. There is no signed installer or public release yet: today you build the app from its
                source on{" "}
                <TextLink href={site.github} external>
                  GitHub
                </TextLink>
                .
              </p>
            </>
          ),
        },
        {
          id: "tell-people",
          title: "Say so first.",
          body: (
            <p>
              Trilsy records on your Mac, so other people on a call may see nothing at all. You are responsible for telling everyone
              before you begin, and for what the law requires where you and they are, which differs by place. Say so first, whether
              you are on a call, in a meeting room or in a lecture hall.
            </p>
          ),
        },
        {
          id: "your-recordings",
          title: "Your recordings are yours.",
          body: (
            <p>
              Your audio, transcript and notes belong to you. They are files on your Mac, and Trilsy never receives them. Keeping
              them safe, backing them up and deleting them when you should is up to you.
            </p>
          ),
        },
        {
          id: "check-the-notes",
          title: "Check the notes.",
          body: (
            <p>
              The transcript and the notes are written by models on your Mac. They can mishear, and they can be wrong. Check them
              against the audio before you rely on them for a decision, a quote or anything a person could be held to. A timestamp
              the model writes into the notes is not a link.
            </p>
          ),
        },
        {
          id: "no-warranty",
          title: "No warranty.",
          body: (
            <p>
              Trilsy is early software, provided as it is, without warranty of any kind. Do not use it as the only recorder for an
              important conversation. To the extent the law allows, {operator.name}, who provides it, is not liable for any loss from using it,
              including a recording that is lost, cut short or damaged.
            </p>
          ),
        },
        {
          id: "code-and-name",
          title: "The code and the name.",
          body: (
            <p>
              Trilsy is open source under the{" "}
              <TextLink href="https://opensource.org/license/mit" external>
                MIT licence
              </TextLink>
              , and the source is on{" "}
              <TextLink href={site.github} external>
                GitHub
              </TextLink>
              . You may use, copy, change and share the code, even commercially, as long as the licence notice stays with it. The
              Trilsy name and the drawings on this site are not part of that grant: do not use them to suggest your own work is
              Trilsy. The two models the app downloads have their own licences.
            </p>
          ),
        },
        {
          id: "imprint",
          title: "Who provides Trilsy.",
          body: (
            <>
              <p>
                Trilsy and this website are provided by {operator.name}, <span className="whitespace-nowrap">{operator.street}</span>. This is the site’s imprint.
              </p>
              <p>
                To reach the provider, <TextLink href={`${site.github}/issues`} external>open an issue on GitHub</TextLink>. Issues there
                are public, so do not put anything private in one.
              </p>
            </>
          ),
        },
        {
          id: "changes",
          title: "Changes.",
          body: (
            <p>
              If these terms change, the history of this page is in the repository on GitHub, next to the code.
            </p>
          ),
        },
      ]}
    />
  );
}
