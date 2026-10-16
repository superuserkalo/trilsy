// Content, timing and geometry for the home page's first section: the hero
// and the pinned story (ticket 04). The approved prototype is
// docs/redesign/prototypes/d4-hero-combo.html?v=1; numbers here are its
// stage coordinates (a 1440 by 900 stage) and its storyboard seconds.

export type SettingKey = "lecture" | "meeting" | "interview";
export type Source = "Microphone" | "System";

export type Figure = {
  /** File under /public/characters. */
  src: string;
  /** Drawn width at the stage's 500px figure height. */
  w: number;
  /** Left edge in stage coordinates. */
  x: number;
  flip?: boolean;
  alt: string;
};

export type Line = {
  /** Index into the setting's figures: who says it. */
  fig: number;
  who: string;
  src: Source;
  text: string;
  /** Bubble left edge and width in stage coordinates. */
  bx: number;
  bw: number;
};

export type NoteBlock = { h: string; p?: string; li?: string[] };

export type Setting = {
  key: SettingKey;
  label: string;
  title: string;
  /** Whether the System source is switched on for this recording. */
  system: boolean;
  figures: Figure[];
  lines: [Line, Line, Line];
  notes: NoteBlock[];
};

const pack = (name: string, x: number, alt: string, flip?: boolean): Figure => ({
  src: `/characters/${name}.svg`,
  w: 269,
  x,
  flip,
  alt,
});

export const settings: Record<SettingKey, Setting> = {
  lecture: {
    key: "lecture",
    label: "Lecture",
    title: "Biology 201, lecture 9",
    system: false,
    figures: [
      // The professor is not in the SVG pack; this is the approved cast sheet's figure.
      { src: "/characters/professor.png", w: 163, x: 249, alt: "A professor with grey hair and clasped hands, speaking" },
      pack("04-blue-wave", 964, "A student with her hair in a bun, raising a hand to ask a question"),
      pack("11-blue-headscarf", 1164, "A student in a headscarf, listening"),
    ],
    lines: [
      { fig: 0, who: "Professor", src: "Microphone", text: "Mitosis has four stages. Prophase comes first.", bx: 90, bw: 300 },
      { fig: 1, who: "Student", src: "Microphone", text: "Is prophase the longest?", bx: 1040, bw: 250 },
      { fig: 0, who: "Professor", src: "Microphone", text: "Usually, yes. The chromosomes condense there.", bx: 90, bw: 330 },
    ],
    notes: [
      { h: "Overview", p: "Mitosis has four stages. Prophase comes first and is usually the longest." },
      { h: "Key terms", li: ["Prophase: chromosomes condense", "Metaphase: chromosomes line up"] },
      { h: "To review", li: ["Read chapter 7 before Thursday"] },
    ],
  },
  meeting: {
    key: "meeting",
    label: "Meeting",
    title: "Product sync",
    system: true,
    figures: [
      pack("12-mustard-gesture", 24, "Marcus, in a mustard sweater, making a point with an open hand"),
      pack("03-sage-glasses", 194, "A colleague in glasses and a green jacket, listening"),
      pack("06-terracotta-beard", 989, "A bearded colleague with crossed arms, listening"),
      pack("07-sage-curls", 1119, "Priya, with curly hair and a hand on her hip, replying", true),
    ],
    lines: [
      { fig: 0, who: "Marcus", src: "Microphone", text: "Can we move the launch to the 14th?", bx: 60, bw: 290 },
      { fig: 3, who: "Priya", src: "System", text: "Legal needs two more days on the review.", bx: 1090, bw: 290 },
      { fig: 0, who: "Marcus", src: "Microphone", text: "Fine. Dev sends the timeline by Friday.", bx: 60, bw: 300 },
    ],
    notes: [
      { h: "Overview", p: "The launch moves to the 14th so legal can finish its review." },
      { h: "Decisions", li: ["Launch date is the 14th", "Legal gets two more days"] },
      { h: "Next", li: ["Dev sends the revised timeline by Friday"] },
    ],
  },
  interview: {
    key: "interview",
    label: "Interview",
    title: "Ana Ribeiro, product designer",
    system: true,
    figures: [
      pack("10-sage-long-hair", 239, "Ana, the guest, with long hair, answering"),
      pack("08-blue-crop", 999, "Sam, the host, in blue, asking a question", true),
    ],
    lines: [
      { fig: 0, who: "Ana", src: "System", text: "We moved the whole team to Lisbon in March.", bx: 70, bw: 320 },
      { fig: 1, who: "Sam", src: "Microphone", text: "What changed first?", bx: 1040, bw: 240 },
      { fig: 0, who: "Ana", src: "System", text: "Honestly, our standups. Eight a.m. became two p.m.", bx: 70, bw: 330 },
    ],
    notes: [
      { h: "Overview", p: "Ana's team moved to Lisbon in March. The first thing to change was meeting times." },
      { h: "Key points", li: ["Team relocated in March", "Standups moved from 8 a.m. to 2 p.m."] },
      { h: "Follow-ups", li: ["Ask about hiring in the new time zone"] },
    ],
  },
};

export const order: SettingKey[] = ["lecture", "meeting", "interview"];

/** Copy deck section 4. */
export const chapters = [
  {
    heading: "Press record.",
    body: "Trilsy captures your microphone, your Mac’s sound or both. Pick one app or all of them.",
    photo: "story-record.jpg",
    alt: "A person at a table with a laptop open, the room streaking behind them.",
    tint: "bg-terracotta/30",
  },
  {
    heading: "Get the transcript.",
    body: "When you stop, Trilsy transcribes on your Mac. Every line has a timestamp that plays the audio from that point.",
    photo: "story-transcribe.jpg",
    alt: "Someone speaking, caught sharp while the room blurs around them.",
    tint: "bg-sage/45",
  },
  {
    heading: "Read the notes.",
    body: "Notes come section by section with a short overview on top. They are plain text, so you edit them like any note.",
    photo: "story-notes.jpg",
    alt: "The same person alone by a window afterwards, reading.",
    tint: "bg-dusty-blue/45",
  },
] as const;

export type Chapter = -1 | 0 | 1 | 2;

// ---- the storyboard, in seconds ----
/** When each of the three lines is spoken: bubble in at [0], speech ends at [1]. */
export const SPEAK: readonly [number, number][] = [
  [0.6, 2.6],
  [2.9, 4.7],
  [5.0, 7.0],
];
export const T_STOP = 7.4;
export const T_TRANSCRIBE = 7.8;
export const T_LINES = 9.4;
export const T_NOTES = 10.2;
export const T_DONE = 12.2;
export const T_END = 15;
/** Compressed time: 7.4s of animation reads as 00:00 to 00:21. */
export const REC_SECONDS = 21;
export const LINE_GAP = 0.18;

/** Storyboard time each chapter shows under reduced motion (its final frame). */
export function reducedFrame(chapter: Chapter) {
  if (chapter === 0) return 7.35;
  if (chapter === 1) return 10.18;
  return 13;
}

/** Storyboard time for a chapter after `c` seconds on it. */
export function chapterTime(chapter: Chapter, c: number, heroT: number) {
  if (chapter === 0) return c % 7.6; // Record: the recording beat loops
  if (chapter === 1) return 7.2 + Math.min(c, 2.98); // Transcribe: Stop, Transcribing, the lines
  if (chapter === 2) return 10.0 + Math.min(c, 2.8); // Notes: written, then held
  return heroT;
}

export const stamp = (i: number) => Math.floor(((SPEAK[i][0] + 0.4) / T_STOP) * REC_SECONDS);
export const clockText = (s: number) => `00:${String(Math.floor(s)).padStart(2, "0")}`;

// ---- easing, matching --ease-trilsy ----
function bezier(x1: number, y1: number, x2: number, y2: number) {
  return (x: number) => {
    let a = 0;
    let b = 1;
    let t = x;
    for (let i = 0; i < 20; i++) {
      t = (a + b) / 2;
      const xt = 3 * (1 - t) ** 2 * t * x1 + 3 * (1 - t) * t * t * x2 + t ** 3;
      if (xt < x) a = t;
      else b = t;
    }
    return 3 * (1 - t) ** 2 * t * y1 + 3 * (1 - t) * t * t * y2 + t ** 3;
  };
}
export const easeTrilsy = bezier(0.22, 1, 0.36, 1);
export const clamp = (x: number, a = 0, b = 1) => Math.min(b, Math.max(a, x));
export const lerp = (a: number, b: number, k: number) => a + (b - a) * k;
/** Eased progress of a beat that starts at `a` and lasts `d` seconds. */
export const beat = (t: number, a: number, d: number, f = easeTrilsy) => f(clamp((t - a) / d));

// ---- the waveform: a level per character of the line being spoken ----
const hash = (n: number) => {
  const s = Math.sin(n * 127.1 + 311.7) * 43758.5453;
  return s - Math.floor(s);
};
export function level(setting: Setting, tau: number) {
  for (let i = 0; i < 3; i++) {
    const a = SPEAK[i][0] + 0.4;
    const b = SPEAK[i][1];
    if (tau >= a && tau <= b) {
      const text = setting.lines[i].text;
      const f = ((tau - a) / (b - a)) * (text.length - 1);
      const k = Math.floor(f);
      const fr = f - k;
      const lv = (c: number) => {
        const ch = text[c] ?? " ";
        if (ch === " ") return 0.18;
        if (".,?".includes(ch)) return 0.06;
        return 0.38 + 0.62 * hash(c + i * 31);
      };
      const s = fr * fr * (3 - 2 * fr);
      return lerp(lv(k), lv(k + 1), s) * (0.88 + 0.12 * Math.sin(tau * 37));
    }
  }
  return 0.05 + 0.03 * Math.sin(tau * 23);
}

/** Which figure is speaking at storyboard time t, or -1. */
export function speakingFigure(setting: Setting, t: number) {
  for (let i = 0; i < 3; i++) {
    if (t >= SPEAK[i][0] && t < SPEAK[i][1] + 0.3) return setting.lines[i].fig;
  }
  return -1;
}

/** Index of the line whose bubble is up at storyboard time t, or -1. */
export function speakingLine(t: number) {
  return SPEAK.findIndex(([a, e]) => t >= a && t < e + 0.3);
}

// ---- the fold, in stage coordinates ----
export const STAGE = { w: 1440, h: 900 } as const;
export const HERO_WINDOW = { x: 430, y: 414, w: 580 } as const;
export const PIN_WINDOW = { x: 690, y: 392, w: 560 } as const;
export const PHOTO = { x: 880, y: 112, w: 452, h: 565 } as const;
/** Top of the hero scene: the copy above it is laid out in normal flow. */
export const SCENE_TOP = 404;
export const FLOOR = 820;
export const BAND_TOP = 452;
export const FIGURE_H = 500;
/** Visible part of a waist-up figure above the floor line. */
export const FIGURE_VISIBLE = 300;
export const BUBBLE_TOP = 412;
export const TILE = { size: 72, scale: 0.36, gap: 84, dx: -88, dy: 30, radius: 16 } as const;
