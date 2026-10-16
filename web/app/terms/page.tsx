import type { Metadata } from "next";
import { pageMetadata } from "@/lib/metadata";
import { Marker } from "@/components/hero/marker";
import { LegalPage, TextLink } from "@/components/legal/legal-page";
import { site } from "@/lib/site";

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
// - the legal entity that offers Trilsy (a company name and address), the
//   governing law and courts, and a contact email: none is in the master or the
//   repo. The page says "Trilsy" and "its authors" and points to GitHub issues.
// - an effective or "last updated" date, for the same reason as the privacy page.
// - the exact liability wording and whether it holds in the owner's
//   jurisdiction: "to the extent the law allows" is a stand-in until a lawyer
//   or the owner reads it.
// - the licence: until one is added the code section stays as written (FAQ 6).
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
              important conversation. To the extent the law allows, its authors are not liable for any loss from using it, including
              a recording that is lost, cut short or damaged.
            </p>
          ),
        },
        {
          id: "code-and-name",
          title: "The code and the name.",
          body: (
            <p>
              The source is on GitHub for anyone to read. We have not chosen a licence, so reading the code does not give you the
              right to copy or reuse it, and we do not call it open source. The Trilsy name and the drawings on this site are not
              covered by any licence either.
            </p>
          ),
        },
        {
          id: "changes",
          title: "Changes and questions.",
          body: (
            <p>
              If these terms change, the history of this page is in the repository on GitHub. For a question,{" "}
              <TextLink href={`${site.github}/issues`} external>
                open an issue there
              </TextLink>
              .
            </p>
          ),
        },
      ]}
    />
  );
}
