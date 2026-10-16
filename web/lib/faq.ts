// The questions. One source for the home section, the /faq page and the FAQPage
// JSON-LD, so the three can never drift apart.
// Copy: docs/redesign/02-copy-deck.md sections 5 and 11, word for word.
//
// `answer` is plain text; a `backtick` span is a file path and renders as code
// (the JSON-LD strips the backticks). `todo` is a fact the owner has not
// confirmed yet (copy deck 13). It is never printed on the page and never goes
// into JSON-LD. The owner confirmed every other open fact on 2026-10-16 (the
// apps, offline use, the student discount, the languages); only the licence
// is still open.
// `schemaAnswer` replaces `answer` in JSON-LD where the page text carries a
// price figure (master: no price in JSON-LD, OG or llms.txt).

export type Faq = {
  id: string;
  question: string;
  answer: string;
  todo?: string;
  schemaAnswer?: string;
};

export const faqs: Faq[] = [
  {
    id: "recording-notice",
    question: "Will the people on my call know I am recording?",
    answer:
      "They may not. Trilsy records on your Mac, so other people on a call may see nothing at all. You are responsible for telling everyone before you begin, and the law on recording differs by place. Say so first, whether you are on a call, in a meeting room or in a lecture hall.",
  },
  {
    id: "which-apps",
    question: "Which apps does it work with?",
    answer:
      "Any app that plays sound: one app or all of them, picked in a list. In a room it uses your microphone instead. Zoom, Google Meet, Microsoft Teams, Slack, FaceTime, Webex and a browser tab are examples of apps that make sound, not a tested list and not integrations.",
  },
  {
    id: "where-kept",
    question: "Where are my recordings kept?",
    answer:
      "On your Mac, as ordinary files in `Library/Application Support/Trilsy/Recordings`, one folder for each recording. Trilsy does not encrypt them itself; your disk encryption does. Delete the folder and the recording is gone. Nothing is kept anywhere else, because there is no account and no upload.",
  },
  {
    id: "leaves-mac",
    question: "Does anything leave my Mac?",
    answer:
      "No. Your audio, transcript and notes stay on your Mac as files. Trilsy has no account, no upload and no analytics. The only download is the two models, once from Hugging Face before first use, which needs a connection; after that it works offline. Nothing you record is sent anywhere, and nothing is kept for you on a server.",
  },
  {
    id: "cost",
    question: "What does it cost?",
    answer:
      "The app is free, with no time limit, and it needs no account. A paid Pro plan is not available yet. Students get 50% off every paid plan. The free app always stays local, with your recordings kept as files on your Mac, so what you pay for later never decides whether you can keep them.",
    // The 50% was confirmed on 2026-10-16; the JSON-LD still leaves it out under
    // the master's no-price rule.
    schemaAnswer:
      "The app is free, with no time limit, and it needs no account. A paid Pro plan is not available yet. The free app always stays local, with your recordings kept as files on your Mac, so what you pay for later never decides whether you can keep them.",
  },
  {
    id: "open-source",
    question: "Is it open source?",
    answer:
      "Not yet. The source is on GitHub, where anyone can read it, but we have not chosen a licence, so we do not call it open source. That decision is still to be made, and until it is, the code is there to read and nothing should be assumed about reusing it.",
    todo: "Re-word once the licence is chosen (copy deck 13, item 6).",
  },
  {
    id: "live-transcript",
    question: "Does it transcribe while I talk?",
    answer:
      "No. Trilsy records first, and when you stop it transcribes the recording on your Mac and then writes the notes. You get the transcript and the notes after the recording ends, not line by line while you talk. An audio or video file you import goes through the same steps.",
  },
  {
    id: "who-said-what",
    question: "Does it know who said what?",
    answer:
      "No. Trilsy does not identify speakers. Each transcript line is labelled by where the sound came from: Microphone, System or Import, not by person. With your Mac's sound switched on, your own voice arrives through the microphone and the people you hear through your Mac arrive as System, unnamed.",
  },
  {
    id: "requirements",
    question: "What do I need?",
    answer:
      "An Apple silicon Mac with macOS 15 or later; 16 GB of memory is recommended. The two models take several GB and recordings are saved uncompressed, so leave room on your disk. You also need an internet connection once, to download the models before first use, so allow for that download the first time.",
  },
  {
    id: "connections",
    question: "Can it connect to my apps or my AI assistant?",
    answer:
      "Not yet. A paid plan is planned to add connections to Google Calendar, Notion, Slack, Google Drive and Microsoft apps, and an MCP server so an assistant can search, read and write your notes and start and stop a recording. None of it exists yet. A recording an assistant starts is still a recording: tell people.",
  },
];

// The first six, in order: what the home section shows.
export const homeFaqs = faqs.slice(0, 6);

// The two one-line answers that only the /faq page carries.
export const quickFaqs: Faq[] = [
  { id: "iphone", question: "Is there an iPhone app?", answer: "Not yet." },
  {
    id: "languages",
    question: "What languages?",
    answer: "Detected, or pick one.",
  },
];

// The text the page and the JSON-LD both start from.
export const plain = (text: string) => text.replaceAll("`", "");

// A Schema.org FAQPage for the given rows, in page order. Each answer is the
// visible text, except where `schemaAnswer` drops a price figure. `todo`
// never goes in.
export function faqPageSchema(items: Faq[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map(({ question, answer, schemaAnswer }) => ({
      "@type": "Question",
      name: question,
      acceptedAnswer: { "@type": "Answer", text: plain(schemaAnswer ?? answer) },
    })),
  };
}
