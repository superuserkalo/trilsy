// Routes and navigation data shared by the header, the footer and the pages.
// Copy: docs/redesign/02-copy-deck.md sections 1 and 7. The routes are the
// planned ones; each page arrives with its own ticket.

export const site = {
  name: "Trilsy",
  github: "https://github.com/superuserkalo/trilsy",
} as const;

// The person who provides Trilsy and this website, as the owner gave them on
// 2026-10-16: Kaloyan Gantchev, Baslergasse 50-66. Printed on /terms (the imprint)
// and /privacy. That is all the owner has given.
// TODO: confirm, left off the page on purpose (an Austrian or EU imprint usually
// also names these; none is invented here):
// - the postcode and city of Baslergasse 50-66, and the country
// - a contact email (until then the contact route is GitHub issues)
// - whether an imprint needs more for this kind of site (trade registration or
//   VAT number, if one exists; a lawyer or the owner to confirm)
export const operator = {
  name: "Kaloyan Gantchev",
  street: "Baslergasse 50-66",
} as const;

// Copy: docs/redesign/02-copy-deck.md section 7, word for word. `lead` is the
// dropdown line and the page's lead; `learning` pages end with the Students line.
export type UseCase = {
  slug: string;
  name: string;
  lead: string;
  h1: string;
  situation: string;
  description: string;
  learning?: boolean;
};

// Two groups of six, in the order of the copy deck. The groups are not shown
// as headings (the owner dropped categories); they are the two dropdown columns.
export const useCaseGroups: { label: string; items: UseCase[] }[] = [
  {
    label: "Work",
    items: [
      {
        slug: "sales-calls",
        name: "Sales calls",
        lead: "Record the call, get a transcript and notes, and search what the customer said.",
        h1: "Notes from your sales calls",
        situation: "You are on the call, not typing: afterwards the transcript has what they said, with timestamps.",
        description: "Record a sales call on your Mac, get a transcript and notes you can edit, and search what the customer said.",
      },
      {
        slug: "customer-calls",
        name: "Customer calls",
        lead: "Keep every call as a transcript, and find the question people keep asking.",
        h1: "Keep every customer call",
        situation: "Search across your recordings for the word a customer used.",
        description: "Keep customer calls as searchable transcripts and notes on your Mac.",
      },
      {
        slug: "team-meetings",
        name: "Team meetings",
        lead: "Take part while Trilsy writes the notes; edit them and search past meetings.",
        h1: "Notes from your team meeting",
        situation: "You talk; Trilsy listens and writes the overview.",
        description: "Record team meetings on your Mac and get editable notes and a transcript.",
      },
      {
        slug: "client-meetings",
        name: "Client meetings",
        lead: "A record of what was agreed, to read before the next call.",
        h1: "A record of what was agreed",
        situation: "Open the last meeting's notes before you start the next.",
        description: "Keep a transcript and notes of every client meeting, saved on your Mac.",
      },
      {
        slug: "recruiting",
        name: "Recruiting",
        lead: "An interview transcript and notes you can compare across candidates.",
        h1: "Interview notes you can compare",
        situation: "Every interview has the same shape of notes: an overview, then the detail.",
        description: "Record interviews on your Mac and get a transcript and notes for each candidate.",
      },
      {
        slug: "incident-calls",
        name: "Incident calls",
        lead: "Record the call, then search the transcript when you write the postmortem.",
        h1: "The incident call, written down",
        situation: "The timestamps tell you what was said when.",
        description: "Record an incident call and search the timed transcript afterwards.",
      },
    ],
  },
  {
    label: "Learning and media",
    items: [
      {
        slug: "lectures",
        name: "Lectures",
        lead: "Lecture transcripts and notes you can edit and search before the exam.",
        h1: "Lecture notes you can search",
        situation: "Sit and listen; the notes are waiting when it ends.",
        description: "Record a lecture on your Mac, get a transcript and notes, and search them before the exam.",
        learning: true,
      },
      {
        slug: "talks-courses-and-webinars",
        name: "Talks, courses and webinars",
        lead: "Record what your Mac plays and keep the transcript and notes.",
        h1: "Notes from anything that plays sound",
        situation: "A video in a browser tab is recorded the same way as a call.",
        description: "Record a talk, a course or a webinar playing on your Mac and keep the transcript and notes.",
        learning: true,
      },
      {
        slug: "research-interviews",
        name: "Research interviews",
        lead: "Interview transcripts to quote from, notes to code, audio kept on your Mac.",
        h1: "Interviews to quote from",
        situation: "The audio never leaves your Mac.",
        description: "Record research interviews on your Mac and keep the transcript, notes and audio.",
      },
      {
        slug: "journalism",
        name: "Journalism",
        lead: "Interview transcripts you can quote from, search and export as text.",
        h1: "Interview transcripts you can quote",
        situation: "Export the transcript as plain text, with timestamps.",
        description: "Record an interview on your Mac and export the transcript as text.",
      },
      {
        slug: "podcasts-and-video",
        name: "Podcasts and video",
        lead: "A transcript and subtitles (SRT) from a recorded conversation.",
        h1: "A transcript and subtitles",
        situation: "One export gives you a subtitle file.",
        description: "Turn a recorded conversation into a transcript and an SRT subtitle file on your Mac.",
      },
      {
        slug: "voice-notes",
        name: "Voice notes",
        lead: "Think out loud; get a transcript and Markdown notes.",
        h1: "Think out loud",
        situation: "Press record, talk, and read the notes.",
        description: "Record a voice note on your Mac and get a transcript and Markdown notes.",
      },
    ],
  },
];

// All twelve, flat, in the copy deck's order.
export const useCases: UseCase[] = useCaseGroups.flatMap((g) => g.items);

export const useCasePath = (slug: string) => `/use-cases/${slug}`;

// The plain links beside the Use cases dropdown, in header order.
export const headerLinks = [
  { href: "/pricing", label: "Pricing" },
  { href: "/how-it-works", label: "How it works" },
  { href: "/students", label: "Students" },
] as const;
