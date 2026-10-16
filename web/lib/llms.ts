// The text of /llms.txt and /llms-full.txt (https://llmstxt.org), built from the
// same data the pages render where that data exists (use cases, FAQ), so they
// cannot drift apart. Rules (master and copy deck 12): only what the app does
// today; no prices or discount figures (they are placeholders); nothing unbuilt
// stated as available; no claim about bots.
// The How it works paragraphs restate app/how-it-works/page.tsx in plain text;
// change both together.
import { faqs, plain, quickFaqs } from "@/lib/faq";
import { siteUrl } from "@/lib/metadata";
import { site, useCasePath, useCases } from "@/lib/site";

const url = (path: string) => `${siteUrl}${path === "/" ? "" : path}`;

// Copy deck section 12, the llms.txt summary, word for word.
const summary =
  "Trilsy is a Mac app for Apple silicon (macOS 15 or later). It records the microphone, the Mac's sound or both, transcribes the recording after it ends with Whisper on the Mac, and writes editable notes with a local language model. Files stay on the Mac. Export: Markdown, text, SRT. Source on GitHub. No signed release yet.";

const facts = [
  "Records the microphone, the Mac's sound or both. Recording the Mac's sound is one switch, off by default, and needs macOS's Screen & System Audio Recording permission.",
  "Can import an audio or video file instead of recording.",
  "Works with any app that plays sound, and with in-person rooms through the microphone. App names on the site are examples, not a tested list.",
  "Transcribes after the recording ends, on the Mac, with Whisper. It does not transcribe live.",
  "Writes notes section by section with a short overview on top, using a language model on the Mac. Notes are plain-text Markdown and can be edited.",
  "Every transcript line has a timestamp that plays the audio from that point.",
  "Transcript lines are labelled by audio source (Microphone, System, Import), not by person. There is no speaker recognition.",
  "The recording list can be searched by title, transcript and notes.",
  "Exports: Markdown (notes and transcript), plain text (transcript), SRT subtitles (transcript).",
  "Audio, transcript and notes are ordinary files in ~/Library/Application Support/Trilsy/Recordings. No account, no upload, no analytics. The two models download once from Hugging Face before first use.",
  "Needs an Apple silicon Mac with macOS 15 or later; 16 GB of memory is recommended.",
  "The app is free, with no time limit. A paid plan is not available yet.",
  `The source is on GitHub (${site.github}). No licence has been chosen yet. There is no signed installer or public release yet.`,
];

const pages = [
  { path: "/", name: "Home", about: "What Trilsy is, in one screen, and the common questions." },
  { path: "/how-it-works", name: "How it works", about: "What is recorded, where the files live, how the transcript and notes are made, what your Mac needs." },
  { path: "/pricing", name: "Pricing", about: "The free app, and what other notetakers charge for the hours you record." },
  { path: "/students", name: "Students", about: "Recording lectures and courses, and the student offer on paid plans." },
  { path: "/faq", name: "Questions", about: "Every question and answer." },
  { path: "/privacy", name: "Privacy", about: "What the Mac app and this website do with your data." },
  { path: "/terms", name: "Terms", about: "The terms for the Mac app and this website." },
  { path: "/use-cases", name: "Use cases", about: "Twelve situations Trilsy is used in." },
];

export function llmsTxt() {
  return [
    `# ${site.name}`,
    "",
    `> ${summary}`,
    "",
    "## Facts",
    "",
    ...facts.map((f) => `- ${f}`),
    "",
    "## Pages",
    "",
    ...pages.map((p) => `- [${p.name}](${url(p.path)}): ${p.about}`),
    "",
    "## Use cases",
    "",
    ...useCases.map((u) => `- [${u.name}](${url(useCasePath(u.slug))}): ${u.lead}`),
    "",
    "## Optional",
    "",
    `- [Full text for language models](${url("/llms-full.txt")}): the facts, how it works and every answer in one file.`,
    `- [Source code](${site.github})`,
    "",
  ].join("\n");
}

const howItWorks = [
  [
    "What is recorded",
    "Your microphone, your Mac's sound or both. System sound is a switch, off until you turn it on, and needs macOS's Screen & System Audio Recording permission. Wear headphones when you record both. You can also import an audio or video file.",
  ],
  [
    "Where it lives",
    "Audio is saved as short files in a folder on your Mac, Library/Application Support/Trilsy/Recordings. The transcript and notes are files next to it. Trilsy has no account and uploads nothing. Your Mac's disk encryption protects them; Trilsy does not add its own.",
  ],
  [
    "How the transcript is made",
    "After you stop, Trilsy transcribes on your Mac with Whisper (the small model). Language is detected, or you pick one. You can add words it should know.",
  ],
  [
    "How the notes are written",
    "A language model on your Mac writes detailed notes section by section, then puts a short overview on top. Check them against the audio; the model can be wrong, and a timestamp it writes into the notes is not a link.",
  ],
  [
    "What you can do with them",
    "Edit the notes, the transcript and the title. Search your recordings by title, transcript and notes. Export Markdown (notes and transcript), text (transcript) or SRT subtitles (transcript).",
  ],
  [
    "What you need",
    "Apple silicon, macOS 15 or later, 16 GB of memory recommended. The two models download once from Hugging Face and take several GB; recordings are saved uncompressed, so they are large.",
  ],
] as const;

export function llmsFullTxt() {
  return [
    `# ${site.name}`,
    "",
    `> ${summary}`,
    "",
    `Website: ${siteUrl}. Source: ${site.github}.`,
    "",
    "## What Trilsy is",
    "",
    "Trilsy is a notetaker for the Mac. You press record during a call, a lecture, an interview or a meeting; when you stop, Trilsy transcribes the recording on your Mac and writes notes you can edit. Nothing is uploaded and there is no account.",
    "",
    "## Facts",
    "",
    ...facts.map((f) => `- ${f}`),
    "",
    "## How it works",
    "",
    ...howItWorks.flatMap(([title, text]) => [`### ${title}`, "", text, ""]),
    "## Questions",
    "",
    ...[...faqs, ...quickFaqs].flatMap(({ question, answer, schemaAnswer }) => [
      `### ${question}`,
      "",
      plain(schemaAnswer ?? answer),
      "",
    ]),
    "## Use cases",
    "",
    ...useCases.flatMap((u) => [`### ${u.name}`, "", `${u.description} ${u.situation}`, "", url(useCasePath(u.slug)), ""]),
  ].join("\n");
}
