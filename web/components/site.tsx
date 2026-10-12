"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, MotionConfig } from "motion/react";
import {
  Check,
  Cpu,
  FolderClosed,
  TextQuote,
  UserRoundCheck,
  ArrowRight,
  ArrowUpRight,
  CheckCheck,
  ChevronRight,
  Download,
  FileText,
  Headphones,
  LockKeyhole,
  Mic,
  Monitor,
  Pause,
  Play,
  RotateCcw,
  Sparkles,
  Square,
  Waves,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { Separator } from "@/components/ui/separator";
import { Hero, Reveal } from "./hero";
import { Mark } from "./mark";
import { cn } from "@/lib/utils";

const samples = [
  {
    id: "conversation",
    label: "A conversation",
    title: "Designing a calmer workday",
    date: "Monday, 10:30 am",
    duration: "24:18",
    intro:
      "The team wants fewer interruptions and more time for thoughtful work. The first experiment: protect the morning, and make room for conversations that need to happen.",
    sections: [
      [
        "Protect the first hour",
        "Keep the first hour of the day free for individual planning. Share priorities in writing before deciding which conversations need a meeting.",
      ],
      [
        "Keep the reasoning, too",
        "A useful note should preserve the examples and trade-offs behind a decision. An overview helps people catch up; detailed sections give them somewhere to dig deeper.",
      ],
    ],
    action: "Alex will share a draft of the new weekly rhythm before Friday.",
    quote:
      "I don’t just want a list of decisions. I want to remember how we got there.",
    time: "08:42",
    speaker: "Alex",
  },
  {
    id: "interview",
    label: "An interview",
    title: "What makes a useful note?",
    date: "Tuesday, 2:00 pm",
    duration: "32:06",
    intro:
      "The customer wants to listen closely during interviews and find specific details afterwards. The biggest frustration is replaying a long recording to find one useful example.",
    sections: [
      [
        "Make room to listen",
        "Taking notes while someone speaks makes it harder to ask good follow-up questions. Capture the conversation first, then organize it into a readable record.",
      ],
      [
        "Make the details findable",
        "Keep specific examples alongside the overview. Source timestamps should make it easy to check what was actually said, especially when a detail affects a decision.",
      ],
    ],
    action:
      "Share an example of detailed notes with the customer for feedback.",
    quote:
      "The summary is helpful, but it’s usually the little examples I’m looking for.",
    time: "12:06",
    speaker: "Sam",
  },
  {
    id: "idea",
    label: "A passing thought",
    title: "An idea from the walk home",
    date: "Yesterday, 5:15 pm",
    duration: "06:32",
    intro:
      "A voice memo about creating more space for ideas to develop. Try a weekly writing hour: no agenda, no presentation, just time to think something through.",
    sections: [
      [
        "Let an idea breathe",
        "An early thought does not need a polished pitch. A small amount of uninterrupted writing time could help the team work out what they actually think.",
      ],
      [
        "Start with an experiment",
        "Ask whether a shared writing hour would be useful. The day and time are still open; decide with the team before adding anything to the calendar.",
      ],
    ],
    action: "Ask the team if they would try a weekly writing hour.",
    quote:
      "Maybe the best thing we can do for an idea is give it a little more time.",
    time: "02:18",
    speaker: "You",
  },
];
const faq = [
  [
    "Does a bot join my call?",
    "No. Trilsy captures your microphone and application audio on your Mac. Use it for online calls, in-person conversations, or an existing recording. Get the appropriate permission before recording.",
  ],
  [
    "How private is it?",
    "Transcription and note generation run locally. The app stores your recordings, transcripts, and notes on your Mac and does not upload them. The first model download needs an internet connection. Local files use your Mac’s disk protection; Trilsy does not add separate encryption.",
  ],
  [
    "Can I use it today?",
    "The Mac app is in development and is not available to download yet. Explore the interactive examples on this page to see the experience we’re building. We’re starting with Apple silicon Macs running macOS 15 or later.",
  ],
  [
    "Is Trilsy free?",
    "We’re building a useful free app powered by local models, with optional paid capabilities later. No paid plan or subscription is available yet.",
  ],
  [
    "Will there be an iPhone app?",
    "Yes, that is the plan. We are starting with Mac and getting the recording-to-notes experience right first. There is no iPhone release date yet.",
  ],
];
const bars = [
  9, 18, 12, 25, 17, 31, 22, 14, 27, 36, 23, 15, 30, 19, 11, 24, 34, 16, 27, 13,
  20, 29, 18, 10, 24, 32, 22, 16,
];
const container = "mx-auto w-full max-w-[1240px] px-6 md:px-12";

function Waveform({
  active = false,
  compact = false,
}: {
  active?: boolean;
  compact?: boolean;
}) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "flex h-10 items-center justify-center gap-[2px] sm:gap-[3px]",
        compact && "h-6 gap-[2px]",
      )}
    >
      {bars.slice(0, compact ? 16 : 28).map((h, i) => (
        <span
          key={i}
          className={cn(
            "w-[2px] rounded-full bg-current sm:w-[3px]",
            active && "motion-safe:animate-meter",
          )}
          style={{
            height: compact ? h * 0.6 : h,
            animationDelay: `${i * -0.137}s`,
            animationDuration: `${0.6 + (i % 5) * 0.18}s`,
          }}
        />
      ))}
    </div>
  );
}

function PreviewDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <div className="mb-3 flex size-14 items-center justify-center rounded-2xl border bg-secondary text-primary">
          <Mark className="size-9" />
        </div>
        <DialogHeader>
          <DialogTitle>A little more time. A better first note.</DialogTitle>
          <DialogDescription>
            Trilsy for Mac is in development. We’re getting recording and
            detailed notes ready for everyday use.
          </DialogDescription>
        </DialogHeader>
        <div className="mt-2 flex flex-col gap-5">
          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary">Apple silicon</Badge>
            <Badge variant="secondary">macOS 15+</Badge>
          </div>
          <p className="text-sm leading-7 text-muted-foreground">
            There’s no public app download or release date yet. The interactive
            examples on this page give you a feel for the experience we’re
            building.
          </p>
          <Button
            size="lg"
            render={
              <a href="#experience" onClick={() => onOpenChange(false)} />
            }
          >
            Explore the experience
            <ArrowRight data-icon="inline-end" />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function NotesDemo() {
  const [sampleID, setSampleID] = useState("conversation");
  const [tab, setTab] = useState("notes");
  const [running, setRunning] = useState(false);
  const [step, setStep] = useState(0);
  const [exported, setExported] = useState(false);
  const sample = samples.find((s) => s.id === sampleID) ?? samples[0];
  useEffect(() => {
    if (!running) return;
    const id = setTimeout(() => {
      if (step >= 2) setRunning(false);
      else setStep(step + 1);
    }, 950);
    return () => clearTimeout(id);
  }, [running, step]);
  function run() {
    setStep(0);
    setRunning(true);
    setTab("notes");
  }
  function exportNote() {
    const content = `# ${sample.title}\n\n${sample.intro}\n\n${sample.sections.map(([t, p]) => `## ${t}\n\n${p}`).join("\n\n")}\n\n## Follow-up\n\n${sample.action}\n\nIllustrative sample from Trilsy.\n`;
    const url = URL.createObjectURL(
      new Blob([content], { type: "text/markdown" }),
    );
    const a = document.createElement("a");
    a.href = url;
    a.download = "trilsy-sample.md";
    a.click();
    setExported(true);
    setTimeout(() => setExported(false), 2500);
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
  return (
    <section
      id="experience"
      className={cn(container, "scroll-mt-20 pt-24 pb-24 md:pt-32 md:pb-36")}
    >
      <div className="mb-10 flex flex-col justify-between gap-8 md:flex-row md:items-end">
        <div>
          <p className="mb-5 flex items-center gap-3 text-sm text-primary">
            Made for the way you think
          </p>
          <h2 className="text-[clamp(2.6rem,4.5vw,4rem)] leading-[1.05] font-medium tracking-[-.05em]">
            All the details.
            <br />
            <span className="text-primary">None of the busywork.</span>
          </h2>
        </div>
        <p className="max-w-70 text-sm leading-7 text-muted-foreground">
          An overview for the big picture.
          <br />
          Detailed notes for everything else.
          <br />
          Try an example below.
        </p>
      </div>
      <div className="mb-5 flex flex-wrap items-center justify-between gap-4">
        <ToggleGroup
          value={[sampleID]}
          onValueChange={(v) => {
            if (v[0]) {
              setSampleID(v[0]);
              setTab("notes");
              setRunning(false);
              setStep(0);
            }
          }}
          aria-label="Example conversation"
          className="flex-wrap"
          variant="line"
          size="default"
        >
          {samples.map((s) => (
            <ToggleGroupItem value={s.id} key={s.id}>
              {s.label}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
        <span className="text-xs text-muted-foreground">
          Interactive preview · example content
        </span>
      </div>
      <div className="overflow-hidden rounded-xl border border-input bg-card shadow-[0_25px_80px_-30px_#28406630]">
        <div className="flex h-12 items-center justify-between border-b px-5">
          <div className="flex gap-1.5" aria-hidden="true">
            <span className="size-2.5 rounded-full bg-destructive/80" />
            <span className="size-2.5 rounded-full bg-primary/80" />
            <span className="size-2.5 rounded-full bg-muted-foreground/50" />
          </div>
          <span className="text-[11px] text-muted-foreground">
            {sample.title}
          </span>
          <LockKeyhole className="size-3 text-muted-foreground" />
        </div>
        <div className="grid md:grid-cols-[190px_1fr] lg:grid-cols-[210px_1fr]">
          <aside className="hidden flex-col gap-7 border-r bg-secondary/50 p-5 md:flex">
            <div className="flex items-center gap-2 text-lg font-semibold tracking-tight">
              <Mark className="size-6 text-primary" />
              trilsy
            </div>
            <div className="flex flex-col gap-2 text-xs">
              <span className="mb-2 text-[10px] tracking-widest text-muted-foreground uppercase">
                Your library
              </span>
              {samples.map((s) => (
                <button
                  key={s.id}
                  onClick={() => {
                    setSampleID(s.id);
                    setRunning(false);
                    setTab("notes");
                  }}
                  className={cn(
                    "flex items-start gap-2 rounded-lg px-3 py-3 text-left transition-colors hover:bg-muted",
                    s.id === sampleID
                      ? "bg-secondary text-foreground"
                      : "text-muted-foreground",
                  )}
                >
                  <FileText className="mt-0.5 size-3.5 shrink-0" />
                  <span className="leading-4">
                    {s.title}
                    <span className="mt-1 block text-[10px] text-muted-foreground">
                      {s.duration} · Audio note
                    </span>
                  </span>
                </button>
              ))}
            </div>
            <div className="mt-auto flex items-center gap-2 pt-8 text-[10px] text-muted-foreground">
              <span className="size-1.5 rounded-full bg-primary" />
              Saved on this Mac
            </div>
          </aside>
          <div className="min-w-0">
            <div className="flex items-center justify-between gap-3 border-b px-5 py-3 md:px-8">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <FileText className="size-3.5" />
                Your notes
                <ChevronRight className="size-3" />
                <span className="hidden sm:inline">{sample.date}</span>
              </div>
              <Button size="sm" variant="ghost" onClick={exportNote}>
                {exported ? (
                  <Check data-icon="inline-start" />
                ) : (
                  <Download data-icon="inline-start" />
                )}
                {exported ? "Downloaded" : "Export sample"}
              </Button>
            </div>
            <div className="grid min-h-[490px] lg:grid-cols-[1fr_200px]">
              <article className="min-w-0 p-6 md:p-8">
                <div className="mb-6">
                  <span className="text-[11px] text-muted-foreground">
                    {sample.duration} · Microphone + app audio
                  </span>
                  <h3 className="mt-3 text-2xl font-medium tracking-tight md:text-[28px]">
                    {sample.title}
                  </h3>
                </div>
                <Tabs value={tab} onValueChange={(v) => setTab(String(v))}>
                  <TabsList variant="line">
                    <TabsTrigger value="notes">
                      <Sparkles data-icon="inline-start" />
                      Detailed notes
                    </TabsTrigger>
                    <TabsTrigger value="transcript">
                      <Waves data-icon="inline-start" />
                      Transcript
                    </TabsTrigger>
                  </TabsList>
                  <TabsContent value="notes">
                    <motion.div
                      key={sampleID + step}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4 }}
                      className="flex flex-col gap-5 pt-5"
                    >
                      {running ? (
                        <div
                          className="flex min-h-65 flex-col items-center justify-center gap-5 text-muted-foreground"
                          role="status"
                        >
                          <Mark className="size-10 text-primary" />
                          <span>
                            {
                              [
                                "Listening to the example…",
                                "Finding the key ideas…",
                                "Organizing the details…",
                              ][step]
                            }
                          </span>
                          <Waveform active />
                        </div>
                      ) : (
                        <>
                          <p className="text-[13px] leading-6 text-muted-foreground">
                            {sample.intro}
                          </p>
                          {sample.sections.map(([title, body], i) => (
                            <div key={title}>
                              <h4 className="mb-2 text-[13px] font-medium">
                                <span className="mr-2 text-primary/70">
                                  {String(i + 1).padStart(2, "0")}
                                </span>
                                {title}
                              </h4>
                              <p className="text-[13px] leading-[1.85] text-muted-foreground">
                                {body}
                              </p>
                            </div>
                          ))}
                          <div className="flex items-start gap-2 rounded-lg border border-primary/15 bg-primary/5 p-3">
                            <CheckCheck className="mt-0.5 size-4 shrink-0 text-primary" />
                            <p className="text-xs leading-5">{sample.action}</p>
                          </div>
                        </>
                      )}
                    </motion.div>
                  </TabsContent>
                  <TabsContent value="transcript">
                    <div className="flex flex-col gap-6 pt-7">
                      <p className="text-xs text-muted-foreground">
                        Illustrative excerpt · no audio is played in this demo.
                      </p>
                      {[
                        ["00:12", sample.intro],
                        [sample.time, sample.quote],
                        ["End", sample.action],
                      ].map(([time, text]) => (
                        <div
                          key={time}
                          className="flex gap-4 text-xs leading-6"
                        >
                          <span className="font-mono text-primary">{time}</span>
                          <p className="text-muted-foreground">{text}</p>
                        </div>
                      ))}
                    </div>
                  </TabsContent>
                </Tabs>
              </article>
              <aside className="hidden flex-col gap-5 border-l bg-sky/30 p-5 lg:flex">
                <span className="text-[10px] tracking-widest text-muted-foreground uppercase">
                  Worth remembering
                </span>
                <span className="text-4xl text-primary">“</span>
                <blockquote className="-mt-6 text-sm leading-7">
                  {sample.quote}
                </blockquote>
                <span className="text-xs text-muted-foreground">
                  {sample.speaker}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setTab("transcript")}
                >
                  {sample.time}
                  <ArrowUpRight data-icon="inline-end" />
                </Button>
                <div className="mt-auto flex items-center gap-2 text-[10px] text-muted-foreground">
                  <LockKeyhole className="size-3" />
                  Only on your Mac
                </div>
              </aside>
            </div>
          </div>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-3 border-t bg-secondary/50 px-5 py-3">
          <div className="flex items-center gap-3 text-muted-foreground">
            <Waveform compact active={running} />
            <span className="text-[10px]">
              {running ? "Demo running" : "A small glimpse of Trilsy"}
            </span>
          </div>
          <Button variant="ghost" size="sm" onClick={run} disabled={running}>
            <RotateCcw data-icon="inline-start" />
            Replay the transformation
          </Button>
        </div>
      </div>
    </section>
  );
}

function PrivateFiles() {
  const [selected, setSelected] = useState(0);
  const files = [
    "A good conversation",
    "The details that matter",
    "An idea worth keeping",
  ];
  return (
    <motion.div
      whileHover={{ y: -5, rotate: -1 }}
      transition={{ type: "spring", stiffness: 140, damping: 20 }}
      className="rounded-xl border border-white/50 bg-card p-5 text-foreground shadow-[0_30px_90px_#08256355] md:p-7"
    >
      <div className="flex items-center justify-between border-b pb-5">
        <span className="flex items-center gap-2 text-sm font-medium">
          <FolderClosed className="size-4 text-primary" />
          Your Mac
        </span>
        <LockKeyhole className="size-4 text-primary" />
      </div>
      <p className="mt-6 mb-3 text-xs text-muted-foreground">YOURS TO KEEP</p>
      <div className="flex flex-col gap-1">
        {files.map((name, i) => (
          <button
            key={name}
            onClick={() => setSelected(i)}
            aria-pressed={selected === i}
            className={cn(
              "group flex items-center gap-3 rounded-md px-3 py-3 text-left text-sm transition-colors",
              selected === i ? "bg-secondary" : "hover:bg-secondary/50",
            )}
          >
            <FileText className="size-5 text-primary transition-transform group-hover:-rotate-6" />
            <span>
              {name}
              <span className="ml-0.5 text-muted-foreground">.md</span>
            </span>
            {selected === i && (
              <motion.span
                layoutId="file-selected"
                className="ml-auto text-primary"
              >
                <Check className="size-4" />
              </motion.span>
            )}
          </button>
        ))}
      </div>
      <AnimatePresence mode="wait">
        <motion.div
          key={selected}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.2 }}
          className="mt-5 border-t pt-5 text-sm leading-6 text-muted-foreground"
        >
          {
            [
              "Saved locally. Ready whenever you are.",
              "The context and examples, alongside the overview.",
              "Take your notes anywhere with a Markdown export.",
            ][selected]
          }
        </motion.div>
      </AnimatePresence>
      <p className="mt-4 text-[10px] text-muted-foreground/70">
        Illustration of local storage
      </p>
    </motion.div>
  );
}

export function Site() {
  const [preview, setPreview] = useState(false);
  const [privacy, setPrivacy] = useState(false);
  const [playing, setPlaying] = useState(true);
  return (
    <MotionConfig reducedMotion={playing ? "user" : "always"}>
      <a
        href="#main"
        className="fixed top-3 left-3 z-50 -translate-y-24 rounded-md bg-primary px-4 py-3 text-primary-foreground focus:translate-y-0"
      >
        Skip to content
      </a>
      <header className="bg-sky" id="top">
        <div className="mx-auto flex h-24 max-w-[1300px] items-center justify-between gap-5 px-6 md:px-12">
          <a
            href="#top"
            aria-label="Trilsy home"
            className="group flex items-center gap-2.5 text-[31px] font-semibold tracking-[-.06em]"
          >
            <Mark className="size-9 text-primary transition-transform duration-500 group-hover:-rotate-12" />
            trilsy
          </a>
          <nav
            aria-label="Main navigation"
            className="hidden items-center gap-9 text-sm md:flex"
          >
            {[
              ["The experience", "#experience"],
              ["Your privacy", "#privacy"],
              ["Questions", "#questions"],
            ].map(([label, href]) => (
              <a
                key={href}
                href={href}
                className="group relative py-2 text-foreground/75 transition-colors hover:text-primary"
              >
                {label}
                <span className="absolute right-0 bottom-0 left-0 h-px origin-left scale-x-0 bg-primary transition-transform duration-300 group-hover:scale-x-100" />
              </a>
            ))}
          </nav>
          <Button variant="outline" onClick={() => setPreview(true)}>
            Coming to Mac
            <ArrowUpRight data-icon="inline-end" />
          </Button>
        </div>
      </header>
      <main id="main">
        <Hero
          playing={playing}
          setPlaying={setPlaying}
          onRelease={() => setPreview(true)}
        />
        <section id="trust" className="border-y bg-card">
          <div className={cn(container, "py-9 md:py-11")}>
            <p className="mb-7 text-center text-sm text-muted-foreground">
              Your conversations stay yours. Here’s how.
            </p>
            <div className="grid grid-cols-2 gap-x-7 gap-y-8 md:grid-cols-4">
              {[
                {
                  icon: Cpu,
                  title: "On-device AI",
                  text: "Processed on your Mac",
                },
                {
                  icon: UserRoundCheck,
                  title: "No meeting bot",
                  text: "Just you and your people",
                },
                {
                  icon: LockKeyhole,
                  title: "No account needed",
                  text: "Private from the start",
                },
                {
                  icon: FolderClosed,
                  title: "Your files. Your control.",
                  text: "Keep, edit, export",
                },
              ].map(({ icon: Icon, title, text }, i) => (
                <Reveal key={title} delay={i * 0.06}>
                  <motion.div
                    whileHover={{ y: -3 }}
                    className="flex items-start gap-3 md:justify-center"
                  >
                    <Icon className="mt-1 size-6 shrink-0 stroke-[1.4] text-primary" />
                    <div>
                      <h2 className="text-sm font-medium lg:text-[15px]">
                        {title}
                      </h2>
                      <p className="mt-1 text-xs leading-5 text-muted-foreground">
                        {text}
                      </p>
                    </div>
                  </motion.div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
        <NotesDemo />
        <section
          id="privacy"
          className="overflow-hidden bg-primary py-20 text-primary-foreground md:py-28"
        >
          <div
            className={cn(
              container,
              "grid items-center gap-14 md:grid-cols-2 md:gap-24",
            )}
          >
            <Reveal>
              <LockKeyhole className="mb-8 size-9 stroke-[1.3]" />
              <h2 className="text-[clamp(3rem,5vw,5rem)] leading-[1.01] font-medium tracking-[-.055em]">
                A good listener.
                <br />A great
                <br />
                <span className="text-white/65">secret keeper.</span>
              </h2>
              <p className="mt-7 max-w-90 text-base leading-7 text-white/80">
                Your audio, your transcript, your notes. Trilsy keeps them on
                your Mac. The thinking happens there, too.
              </p>
              <Button
                variant="white"
                onClick={() => setPrivacy(true)}
                className="mt-7"
              >
                A closer look at privacy
                <ArrowUpRight data-icon="inline-end" />
              </Button>
              <p className="mt-5 max-w-80 text-xs leading-5 text-white/65">
                Models download on first use. Your recordings stay local.
              </p>
            </Reveal>
            <Reveal delay={0.15}>
              <PrivateFiles />
            </Reveal>
          </div>
        </section>
        <section className={cn(container, "py-24 md:py-32")}>
          <Reveal className="mb-14 flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <h2 className="text-[clamp(2.6rem,4.5vw,4rem)] leading-[1.05] font-medium tracking-[-.05em]">
              For the big ideas.
              <br />
              <span className="text-primary">And the in-between.</span>
            </h2>
            <p className="max-w-70 text-base leading-7 text-muted-foreground">
              Meetings, interviews, classes, passing thoughts. The moments are
              different. Being present matters in all of them.
            </p>
          </Reveal>
          <div className="grid gap-10 border-t pt-10 md:grid-cols-3 md:gap-12">
            {[
              {
                n: "01",
                icon: Mic,
                title: "Listen a little closer.",
                body: "Capture your microphone and app audio. Follow the conversation, ask the next question, forget the frantic typing.",
              },
              {
                n: "02",
                icon: TextQuote,
                title: "Keep the whole story.",
                body: "An overview when you need the gist. Detailed notes with the context, examples, and reasoning when you need more.",
              },
              {
                n: "03",
                icon: ArrowUpRight,
                title: "Make it yours.",
                body: "Search, edit, and export. Your notes belong wherever you do your best thinking.",
              },
            ].map(({ n, icon: Icon, title, body }, i) => (
              <Reveal key={n} delay={i * 0.08}>
                <motion.article whileHover={{ y: -5 }} className="group">
                  <div className="mb-7 flex items-center justify-between">
                    <Icon className="size-7 stroke-[1.4] text-primary transition-transform duration-500 group-hover:-rotate-12" />
                    <span className="font-mono text-xs text-muted-foreground">
                      {n}
                    </span>
                  </div>
                  <h3 className="mb-3 text-xl font-medium tracking-tight">
                    {title}
                  </h3>
                  <p className="text-sm leading-7 text-muted-foreground">
                    {body}
                  </p>
                </motion.article>
              </Reveal>
            ))}
          </div>
        </section>
        <section id="questions" className="border-y bg-card py-20 md:py-24">
          <div
            className={cn(
              container,
              "grid gap-10 md:grid-cols-[.8fr_1.2fr] md:gap-24",
            )}
          >
            <Reveal>
              <h2 className="text-5xl font-medium tracking-[-.05em]">
                Good questions.
              </h2>
              <p className="mt-5 max-w-60 text-sm leading-6 text-muted-foreground">
                A few things you might be wondering.
              </p>
            </Reveal>
            <Reveal delay={0.08}>
              <Accordion>
                {faq.map(([q, a]) => (
                  <AccordionItem key={q} value={q}>
                    <AccordionTrigger>{q}</AccordionTrigger>
                    <AccordionContent>{a}</AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </Reveal>
          </div>
        </section>
        <section className="overflow-hidden bg-sky pt-20 pb-8 md:pt-28">
          <div className={container}>
            <Reveal className="flex flex-col items-start justify-between gap-8 md:flex-row md:items-center">
              <h2 className="text-[clamp(3rem,6vw,5rem)] leading-[1.03] font-medium tracking-[-.06em]">
                More eye contact.
                <br />
                <span className="text-primary">Less keyboard.</span>
              </h2>
              <Button size="lg" render={<a href="#experience" />}>
                See what stays
                <ArrowRight data-icon="inline-end" />
              </Button>
            </Reveal>
            <div className="mt-20 flex items-center justify-between border-b border-foreground/15 pb-5 text-sm">
              <span className="text-muted-foreground">
                Made for Mac. Made for the moment.
              </span>
              <a href="#top" className="group flex items-center gap-2">
                Back to top
                <ArrowUpRight className="size-4 transition-transform group-hover:-translate-y-1" />
              </a>
            </div>
            <a
              href="#top"
              aria-label="Trilsy home"
              className="group flex items-center gap-4 py-6 text-[clamp(6rem,22vw,20rem)] leading-[.9] font-semibold tracking-[-.07em] text-primary md:gap-8"
            >
              <Mark className="size-[.7em] shrink-0 transition-transform duration-700 group-hover:-rotate-6" />
              trilsy
              <span className="ml-auto self-start pt-4 text-2xl font-normal tracking-normal md:text-4xl">
                ↗
              </span>
            </a>
            <footer className="mt-5 flex flex-wrap items-center justify-between gap-5 border-t border-foreground/15 pt-6 text-xs text-muted-foreground">
              <span>© {new Date().getFullYear()} Trilsy</span>
              <div className="flex items-center gap-6">
                <button
                  onClick={() => setPrivacy(true)}
                  className="hover:text-primary"
                >
                  Privacy
                </button>
                <button
                  onClick={() => setPreview(true)}
                  className="hover:text-primary"
                >
                  Release status
                </button>
                <button
                  onClick={() => setPlaying(!playing)}
                  aria-pressed={!playing}
                  className="flex items-center gap-2 hover:text-primary"
                >
                  {playing ? (
                    <Pause className="size-3" />
                  ) : (
                    <Play className="size-3" />
                  )}
                  Ambient motion {playing ? "on" : "off"}
                </button>
              </div>
            </footer>
          </div>
        </section>
      </main>
      <PreviewDialog open={preview} onOpenChange={setPreview} />
      <Dialog open={privacy} onOpenChange={setPrivacy}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Your words stay yours.</DialogTitle>
            <DialogDescription>
              Privacy in the app we’re building
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-5 text-sm leading-7 text-muted-foreground">
            <p>
              Trilsy processes audio with local speech and language models.
              Audio, transcripts, and notes are saved on your Mac. The app has
              no recording-upload endpoint, account system, or analytics.
            </p>
            <Separator />
            <p>
              Initial model downloads contact Hugging Face. Local files use your
              Mac’s disk protection; Trilsy does not add separate file
              encryption. You control anything you export.
            </p>
            <p>
              This site runs on Vercel, which may retain technical request logs.
              It has no advertising trackers or analytics. Product examples are
              illustrative.
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </MotionConfig>
  );
}
