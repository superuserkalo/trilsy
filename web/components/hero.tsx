"use client";
import { useEffect, useState } from "react";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  useSpring,
} from "motion/react";
import {
  ArrowDown,
  ArrowRight,
  Check,
  FileText,
  LockKeyhole,
  Mic,
  Pause,
  Play,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Ambient } from "./ambient";
import { Mark } from "./mark";
import { cn } from "@/lib/utils";

export function Reveal({
  children,
  className,
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const reduced = useReducedMotion();
  return (
    <motion.div
      initial={{ opacity: 0, y: reduced ? 0 : 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
const heights = [
  12, 20, 8, 30, 17, 26, 37, 18, 10, 27, 32, 19, 36, 13, 21, 30, 16, 9, 25, 37,
  18, 29, 13, 21,
];
const phrase =
  "Let’s keep the ideas, the context, and the little details that make it all make sense.".split(
    " ",
  );

export function Hero({
  playing,
  setPlaying,
  onRelease,
}: {
  playing: boolean;
  setPlaying: (v: boolean) => void;
  onRelease: () => void;
}) {
  const reduced = useReducedMotion();
  const [beat, setBeat] = useState(5);
  const rotateX = useSpring(0, { stiffness: 100, damping: 22 });
  const rotateY = useSpring(0, { stiffness: 100, damping: 22 });
  const active = playing && !reduced;
  useEffect(() => {
    if (!active) return;
    const id = setInterval(() => {
      if (!document.hidden) setBeat((b) => (b + 1) % 12);
    }, 750);
    return () => clearInterval(id);
  }, [active]);
  const saved = beat >= 6;
  return (
    <section className="relative overflow-hidden bg-sky">
      <div className="mx-auto grid max-w-[1300px] items-center gap-2 px-6 pt-14 pb-12 md:px-12 md:pt-12 md:pb-16 lg:min-h-[740px] lg:grid-cols-[.95fr_1.05fr] lg:gap-0">
        <div className="relative z-10 pb-8 md:pb-12">
          <motion.h1
            initial={{ opacity: 0, y: reduced ? 0 : 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-[600px] text-[clamp(3.8rem,7.8vw,7.6rem)] leading-[.96] font-medium tracking-[-.068em]"
          >
            Be here.
            <br />
            We’ll take
            <br />
            <span className="text-primary">the notes.</span>
          </motion.h1>
          <motion.div
            initial={{ opacity: 0, y: reduced ? 0 : 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.16, duration: 0.7 }}
          >
            <p className="mt-8 max-w-[360px] text-[17px] leading-7 text-foreground/75 md:text-lg">
              Your conversations, beautifully kept.
              <br />A private AI notetaker that stays on your Mac.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-5">
              <Button size="lg" render={<a href="#experience" />}>
                <Play data-icon="inline-start" />
                See Trilsy in action
                <ArrowRight data-icon="inline-end" />
              </Button>
            </div>
            <button
              onClick={onRelease}
              className="group mt-5 flex items-center gap-2 text-[13px] text-foreground/65 transition-colors hover:text-primary"
            >
              <span className="size-1.5 bg-primary" />
              Coming to Mac{" "}
              <span className="transition-transform group-hover:translate-x-1">
                ↗
              </span>
            </button>
          </motion.div>
        </div>
        <div
          className="relative -mx-6 h-[510px] [perspective:1200px] md:h-[610px] lg:-ml-12 lg:-mr-12 lg:h-[650px]"
          onPointerMove={(e) => {
            if (!active) return;
            const r = e.currentTarget.getBoundingClientRect();
            rotateX.set((0.5 - (e.clientY - r.top) / r.height) * 7);
            rotateY.set(((e.clientX - r.left) / r.width - 0.5) * 9);
          }}
          onPointerLeave={() => {
            rotateX.set(0);
            rotateY.set(0);
          }}
        >
          <Ambient playing={playing} />
          <motion.div
            style={{ rotateX, rotateY }}
            className="absolute inset-0 [transform-style:preserve-3d]"
          >
            <motion.div
              animate={
                active
                  ? { y: [0, -9, 0], rotate: [-6, -4, -6] }
                  : { y: 0, rotate: -5 }
              }
              transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
              className="absolute top-[6%] left-[9%] w-[250px] rounded-xl border border-white/80 bg-white/80 p-5 shadow-[0_16px_45px_-12px_#456aaa35] backdrop-blur-xl lg:left-[13%] lg:w-[275px]"
            >
              <div className="mb-3 flex items-center gap-2 text-[11px] font-medium tracking-wide text-muted-foreground">
                <Mic className="size-3.5 text-accent" />A CONVERSATION WORTH
                KEEPING
              </div>
              <p className="text-[16px] leading-[1.55] font-medium tracking-[-.02em]">
                “
                {phrase.map((w, i) => (
                  <span
                    key={i}
                    className={cn(
                      "transition-colors duration-500",
                      i <= beat * 2 ? "text-foreground" : "text-foreground/30",
                    )}
                  >
                    {w}{" "}
                  </span>
                ))}
                ”
              </p>
            </motion.div>
            <motion.div
              animate={
                active
                  ? { y: [0, 9, 0], rotate: [5, 3, 5] }
                  : { y: 0, rotate: 4 }
              }
              transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
              className="absolute right-[6%] bottom-[14%] w-[245px] rounded-xl border border-white bg-card p-5 shadow-[0_24px_65px_-20px_#24479355] lg:right-[3%] lg:w-[290px] lg:p-6"
            >
              <div className="flex items-center justify-between">
                <Mark className="size-6 text-primary" />
                <AnimatePresence mode="wait">
                  <motion.span
                    key={saved ? "saved" : "writing"}
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    className="flex items-center gap-1.5 text-xs text-primary"
                  >
                    {saved ? (
                      <>
                        <Check className="size-3.5" />
                        Saved on your Mac
                      </>
                    ) : (
                      <>Making a little sense…</>
                    )}
                  </motion.span>
                </AnimatePresence>
              </div>
              <h2 className="mt-5 text-xl leading-tight font-medium tracking-[-.035em]">
                The good bits,
                <br />
                all in one place.
              </h2>
              <div className="mt-5 flex flex-col gap-3">
                {[
                  "The bigger picture",
                  "The details that matter",
                  "A clear next step",
                ].map((text, i) => (
                  <motion.div
                    key={text}
                    animate={{
                      opacity: beat >= i + 3 ? 1 : 0.3,
                      x: !reduced && beat < i + 3 ? 6 : 0,
                    }}
                    transition={{ duration: 0.4 }}
                    className="flex items-center gap-2.5 text-xs"
                  >
                    <span className="flex size-4 items-center justify-center rounded-sm bg-primary/10 text-primary">
                      <Check className="size-3" />
                    </span>
                    {text}
                  </motion.div>
                ))}
              </div>
              <div className="mt-5 border-t pt-3 text-[10px] text-muted-foreground">
                No bot. No upload. Just your notes.
              </div>
            </motion.div>
          </motion.div>
          <div className="absolute bottom-[2%] left-[6%] flex items-center gap-4 rounded-xl bg-ink px-4 py-3 text-white shadow-[0_12px_30px_#17346a33] lg:bottom-[6%] lg:left-[3%] lg:gap-5 lg:px-5">
            <span className="relative flex size-2">
              <span
                className={cn(
                  "absolute inline-flex size-full rounded-full bg-accent/60",
                  active && "animate-ping",
                )}
              />
              <span className="relative size-2 rounded-full bg-accent" />
            </span>
            <div aria-hidden="true" className="flex h-9 items-center gap-[3px]">
              {heights.map((h, i) => (
                <span
                  key={i}
                  className={cn(
                    "w-[2px] rounded-full bg-white",
                    active && "motion-safe:animate-meter",
                  )}
                  style={{
                    height: h,
                    animationDelay: `${i * -0.16}s`,
                    animationDuration: `${0.7 + (i % 4) * 0.16}s`,
                  }}
                />
              ))}
            </div>
            <div className="min-w-11 text-xs">
              <span className="font-mono tabular-nums">
                00:{String(beat).padStart(2, "0")}
              </span>
              <span className="mt-0.5 block text-[9px] text-white/60">
                Sample
              </span>
            </div>
            <Button
              variant="glass"
              size="icon"
                aria-label={playing ? "Pause ambient animations" : "Play ambient animations"}
              aria-pressed={!playing}
              onClick={() => setPlaying(!playing)}
            >
              {playing ? <Pause /> : <Play />}
            </Button>
          </div>
          <p className="absolute -bottom-5 right-[8%] flex items-center gap-1.5 text-[10px] text-foreground/50">
            <FileText className="size-3" />
            Illustrative preview
          </p>
        </div>
      </div>
      <div className="mx-auto flex max-w-[1300px] items-center justify-between px-6 pb-6 text-xs text-foreground/60 md:px-12">
        <span className="flex items-center gap-2">
          <LockKeyhole className="size-3.5" />A little more present. A lot less
          typing.
        </span>
        <a
          href="#trust"
          aria-label="Discover Trilsy"
          className="group flex items-center gap-2"
        >
          Keep going
          <ArrowDown className="size-4 transition-transform group-hover:translate-y-1" />
        </a>
      </div>
    </section>
  );
}
