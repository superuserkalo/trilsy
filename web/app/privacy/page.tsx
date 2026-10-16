import type { Metadata } from "next";
import { pageMetadata } from "@/lib/metadata";
import { Marker } from "@/components/hero/marker";
import { LegalPage, Path, TextLink } from "@/components/legal/legal-page";
import { site } from "@/lib/site";

// Title, description and every line below are new copy for review (not in the
// copy deck). Written from the code: the app reads no network except Hugging
// Face for its two models (Sources/AppModel.swift: downloads need the
// "Allow model downloads" switch), and the site (web/) has no analytics, cookie,
// form, third-party script, font or image request. The description carries no
// price.
export const metadata: Metadata = pageMetadata({
  title: "Privacy: Trilsy keeps your recordings on your Mac",
  description:
    "What the Trilsy Mac app and this website do with your data: recordings, transcripts and notes stay on your Mac, there is no account and no analytics, and the models download once from Hugging Face.",
  path: "/privacy",
});

// TODO: confirm, left off the page on purpose:
// - who is the controller (a company name, an address, a jurisdiction and a
//   contact email): none is in the master or the repo, so none is printed. The
//   page points to GitHub issues instead.
// - an effective or "last updated" date: the owner has not set one, and a date
//   would be a promise. The page says the history is in the repository.
// - the Vercel project's settings: the page says the host keeps ordinary server
//   logs; confirm Vercel Web Analytics and Speed Insights are off in the project
//   dashboard (the code does not load either) and how long logs are kept.
// - that the app never contacts Hugging Face again once the models are saved.
//   Offline use after the download was confirmed by the owner on 2026-10-16
//   (FAQ 4), but that is not the same claim; the page says it "may" check,
//   which is true either way.
export default function PrivacyPage() {
  return (
    <LegalPage
      heading={
        <>
          Your recordings <Marker>stay on your Mac.</Marker>
        </>
      }
      lead="What the Mac app does with your recordings, what this website does with your visit, and what is downloaded from elsewhere."
      sections={[
        {
          id: "your-recordings",
          title: "What Trilsy keeps.",
          body: (
            <>
              <p>
                Audio, transcript and notes are ordinary files in <Path>Library/Application Support/Trilsy/Recordings</Path> on your
                Mac, one folder for each recording. Trilsy has no account and uploads nothing, so we never receive them, and nothing
                is kept for you on a server.
              </p>
              <p>
                Trilsy has no analytics. It does not count what you record, for how long or how often you open the app. Delete a
                recording’s folder and the recording is gone.
              </p>
            </>
          ),
        },
        {
          id: "the-models",
          title: "The models.",
          body: (
            <>
              <p>
                The transcript and the notes are made by two models that run on your Mac. They are not inside the app, so Trilsy
                downloads them from Hugging Face the first time you use it, and only after you switch on Allow model downloads in
                Settings. Hugging Face sees that request the way any website does, including your IP address, and{" "}
                <TextLink href="https://huggingface.co/privacy" external>
                  its own privacy policy
                </TextLink>{" "}
                applies to it.
              </p>
              <p>
                Later, Trilsy may contact Hugging Face again to check the copy it has saved. Those requests ask for model files.
                They carry no audio, no transcript and no notes.
              </p>
            </>
          ),
        },
        {
          id: "permissions",
          title: "What your Mac asks you for.",
          body: (
            <p>
              The first time you record, macOS asks whether Trilsy may use your microphone. Your Mac’s sound is a switch that is off
              until you turn it on, and it needs macOS’s Screen &amp; System Audio Recording permission. You can take either back in
              System Settings, under Privacy &amp; Security.
            </p>
          ),
        },
        {
          id: "this-website",
          title: "This website.",
          body: (
            <>
              <p>
                trilsy.com sets no cookies and runs no analytics, advertising or tracking scripts. It has no sign-up, form or
                login, so it asks you for nothing. Its fonts and images are served from the site itself, so a visit makes no request
                to Google or any other company.
              </p>
              <p>
                The site is hosted on Vercel. As with any host, Vercel receives each request your browser makes, including your IP
                address and browser details, and keeps ordinary server logs. We add no tracking of our own on top.
              </p>
              <p>Links to GitHub and to other sites leave this one, and their own policies apply there.</p>
            </>
          ),
        },
        {
          id: "changes",
          title: "Changes and questions.",
          body: (
            <p>
              This page changes when the app or the site does, and its history is in the repository on{" "}
              <TextLink href={site.github} external>
                GitHub
              </TextLink>
              , next to the code it describes. For a question or a correction,{" "}
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
