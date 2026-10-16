"use client";

import { useEffect, useRef } from "react";
import { Badge } from "@/components/ui/badge";
import { Window } from "@/components/ui/surface";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { useStoryClock, type Frame } from "./story-clock";
import {
  LINE_GAP,
  REC_SECONDS,
  T_DONE,
  T_END,
  T_LINES,
  T_NOTES,
  T_CREATE,
  T_STOP,
  T_TRANSCRIBE,
  beat,
  clamp,
  clockText,
  level,
  order,
  settings,
  stamp,
  type SettingKey,
} from "./story";

const BARS = 40;

/**
 * The Trilsy window as an illustration: Lecture, Meeting and Interview tabs,
 * the recording, then the transcript, then the notes. The storyboard paints it
 * through refs on every frame; React only renders when the setting changes.
 * On the phone it has one pane, and the notes replace the transcript.
 */
export function DemoWindow({ variant, className }: { variant: "desktop" | "phone"; className?: string }) {
  const { setting, select, register } = useStoryClock();
  const root = useRef<HTMLDivElement>(null);
  const r = {
    state: useRef<HTMLSpanElement>(null),
    underline: useRef<HTMLSpanElement>(null),
    body: useRef<HTMLDivElement>(null),
    timer: useRef<HTMLSpanElement>(null),
    stop: useRef<HTMLSpanElement>(null),
    rec: useRef<HTMLDivElement>(null),
    saved: useRef<HTMLDivElement>(null),
    create: useRef<HTMLSpanElement>(null),
    transcribing: useRef<HTMLDivElement>(null),
    progress: useRef<HTMLSpanElement>(null),
    done: useRef<HTMLDivElement>(null),
    transcriptHint: useRef<HTMLParagraphElement>(null),
    notesHint: useRef<HTMLParagraphElement>(null),
    notes: useRef<HTMLDivElement>(null),
    writing: useRef<HTMLDivElement>(null),
    transcriptPane: useRef<HTMLDivElement>(null),
    notesPane: useRef<HTMLDivElement>(null),
  };
  const bars = useRef<(HTMLElement | null)[]>([]);
  const lines = useRef<(HTMLElement | null)[]>([]);
  const blocks = useRef<(HTMLElement | null)[]>([]);
  const blockTops = useRef<{ key: string; tops: number[]; height: number } | null>(null);

  useEffect(() => {
    const onResize = () => (blockTops.current = null);
    window.addEventListener("resize", onResize);
    const unregister = register((f: Frame) => paint(f));
    return () => {
      unregister();
      window.removeEventListener("resize", onResize);
    };

    function paint({ t, setting: s, seam, manual, reduced }: Frame) {
      const el = root.current;
      if (!el || el.offsetParent === null) return; // the other breakpoint's copy is hidden
      const set = (ref: { current: HTMLElement | null }, fn: (n: HTMLElement) => void) => ref.current && fn(ref.current);

      // Title bar: the state, and how far this setting has played.
      set(r.state, (n) => {
        const label = t < T_STOP ? "Recording" : t >= T_TRANSCRIBE && t < T_LINES ? "Transcribing" : t >= T_NOTES && t < T_DONE ? "Writing notes" : "";
        if (n.dataset.label !== label) {
          n.dataset.label = label;
          n.lastChild!.textContent = label;
          n.dataset.recording = String(label === "Recording");
        }
      });
      set(r.underline, (n) => (n.style.width = `${manual ? 100 : clamp(t / (T_END - 0.6)) * 100}%`));
      set(r.body, (n) => (n.style.opacity = String(seam)));

      // The strip: timer, waveform and Stop & save; then the recorded length with Create notes
      // (transcription starts only when it is pressed); then Transcribing; then the recorded length.
      set(r.timer, (n) => (n.textContent = clockText(Math.min(REC_SECONDS, clamp(t / T_STOP) * REC_SECONDS))));
      const wt = Math.min(t, T_STOP);
      bars.current.forEach((b, i) => {
        if (b) b.style.height = `${3 + 25 * level(s, wt - (BARS - 1 - i) * 0.06)}px`;
      });
      set(r.stop, (n) => (n.style.transform = `scale(${t > T_STOP - 0.2 && t < T_STOP + 0.2 ? 0.96 : 1})`));
      const toSaved = beat(t, T_STOP, 0.3);
      const toTranscribing = beat(t, T_CREATE + 0.12, 0.3);
      const toDone = beat(t, T_LINES, 0.4);
      set(r.create, (n) => (n.style.transform = `scale(${t > T_CREATE - 0.15 && t < T_CREATE + 0.15 ? 0.96 : 1})`));
      set(r.rec, (n) => (n.style.opacity = String(1 - toSaved)));
      set(r.saved, (n) => (n.style.opacity = String(toSaved * (1 - toTranscribing))));
      set(r.transcribing, (n) => (n.style.opacity = String(toTranscribing * (1 - toDone))));
      set(r.done, (n) => (n.style.opacity = String(toDone)));
      set(r.progress, (n) => (n.style.width = `${clamp((t - T_TRANSCRIBE) / (T_LINES - T_TRANSCRIBE)) * 100}%`));
      set(r.transcriptHint, (n) => {
        n.style.opacity = String(1 - toTranscribing);
        n.hidden = t >= T_LINES;
      });

      // Transcript lines, uncovered at machine pace.
      lines.current.forEach((n, i) => {
        if (!n) return;
        const k = beat(t, T_LINES + i * LINE_GAP, 0.4);
        n.style.opacity = String(k);
        n.style.transform = reduced ? "" : `translateY(${(1 - k) * 4}px)`;
      });

      // Notes: laid out in full, uncovered by the travelling row, with a mustard pass per block.
      const notes = r.notes.current;
      if (notes) {
        if (!blockTops.current || blockTops.current.key !== s.key) {
          blockTops.current = {
            key: s.key,
            tops: blocks.current.map((b) => b?.offsetTop ?? 0),
            height: notes.offsetHeight || 200,
          };
        }
        const { tops, height } = blockTops.current;
        const raw = clamp((t - T_NOTES) / (T_DONE - T_NOTES));
        const k = raw * raw * (3 - 2 * raw);
        // Reduced motion: no travelling row. Each block fades in when the row would have
        // reached it, and the row waits, still, at the foot of the notes.
        notes.style.clipPath = reduced ? "none" : `inset(0 0 ${(1 - k) * 100}% 0)`;
        blocks.current.forEach((b, i) => {
          if (!b) return;
          const reach = T_NOTES + (T_DONE - T_NOTES) * ((tops[i] ?? 0) / height);
          b.style.opacity = reduced ? String(beat(t, reach, 0.4)) : "";
          const pass = reach + 0.15;
          const a = t > pass ? Math.max(0, 1 - (t - pass) / 0.6) : 0;
          b.style.backgroundColor = a ? `rgb(230 171 79 / ${0.45 * a})` : "";
        });
        set(r.writing, (n) => {
          n.style.opacity = String(t < T_NOTES ? 0 : t < T_DONE ? beat(t, T_NOTES, 0.4) : 1 - beat(t, T_DONE, 0.4));
          n.style.transform = `translateY(${(reduced ? 1 : k) * height}px)`;
        });
      }
      set(r.notesHint, (n) => (n.hidden = t >= T_NOTES));

      // Phone: one pane; the notes take over when Writing notes starts.
      if (variant === "phone") {
        const k = beat(t, T_NOTES, 0.4);
        set(r.notesPane, (n) => (n.style.opacity = String(k)));
        set(r.transcriptPane, (n) => (n.style.opacity = String(1 - k)));
      }
    }
    // The painter reads refs only, and `variant` never changes for a mounted window.
  }, [register]);

  const phone = variant === "phone";
  // Before the clock's first frame the window shows its first frame: recording, nothing transcribed.
  return (
    <Window ref={root} lift={phone ? "soft" : "hard"} radius="lg" className={cn("overflow-hidden text-[13px] leading-[1.4]", className)}>
      <Tabs value={setting.key} onValueChange={(v) => select(v as SettingKey)} className="gap-0">
        <div
          className={cn(
            "grid items-center border-b border-border bg-muted/60 px-3.5 py-2",
            phone ? "grid-cols-[1fr_auto]" : "grid-cols-[1fr_auto_1fr]",
          )}
        >
          {!phone && (
            <span className="flex gap-1.5" aria-hidden>
              <i className="size-[11px] rounded-full bg-mac-close" />
              <i className="size-[11px] rounded-full bg-mac-minimize" />
              <i className="size-[11px] rounded-full bg-mac-zoom" />
            </span>
          )}
          <TabsList variant="window" aria-label="Recording type">
            {order.map((k) => (
              <TabsTrigger key={k} value={k}>
                {settings[k].label}
                {k === setting.key && (
                  <span ref={r.underline} aria-hidden className="absolute bottom-0 left-0 h-0.5 w-0 bg-primary" />
                )}
              </TabsTrigger>
            ))}
          </TabsList>
          <span
            ref={r.state}
            data-label="Recording"
            data-recording="true"
            className="group/state flex items-center justify-self-end gap-1.5 text-xs font-semibold text-secondary tabular-nums data-[recording=true]:text-accent"
          >
            <i aria-hidden className="hidden size-2 rounded-full bg-recording group-data-[recording=true]/state:block" />
            <span>Recording</span>
          </span>
        </div>

        <TabsContent value={setting.key}>
          <div ref={r.body}>
            <div className="flex items-center gap-2 px-4 pt-2.5 pb-2">
              <strong className="mr-auto min-w-0 truncate font-display text-[15px] leading-tight font-semibold">{setting.title}</strong>
              <Badge variant="system">Microphone</Badge>
              <Badge variant={setting.system ? "system" : "off"}>System</Badge>
            </div>

            <div
              className={cn(
                "grid border-t border-border",
                phone ? "h-[214px] grid-cols-1 [grid-template-areas:'pane']" : "h-[264px] grid-cols-[1.1fr_1fr]",
              )}
            >
              <div ref={r.transcriptPane} className={cn("relative overflow-hidden px-4 py-3", phone && "[grid-area:pane]")}>
                <p className="mb-2 font-sans text-[10.5px] font-semibold tracking-[0.08em] text-muted-foreground uppercase">
                  Transcript
                </p>
                <div className="relative mb-2 h-[34px]">
                  <div ref={r.rec} className="absolute inset-0 flex items-center gap-2">
                    <span ref={r.timer} className="min-w-9 text-xs font-semibold text-accent tabular-nums">
                      00:00
                    </span>
                    <span aria-hidden className="flex h-[30px] min-w-0 flex-1 items-center justify-end gap-0.5 overflow-hidden">
                      {Array.from({ length: BARS }, (_, i) => (
                        <i
                          key={i}
                          ref={(n) => {
                            bars.current[i] = n;
                          }}
                          className="block h-1 w-[3px] shrink-0 rounded-full bg-terracotta"
                        />
                      ))}
                    </span>
                    <span ref={r.stop} className="rounded-md bg-ink px-2.5 py-1 text-[11.5px] font-semibold text-card">
                      Stop &amp; save
                    </span>
                  </div>
                  <div ref={r.saved} className="absolute inset-0 flex items-center gap-2 opacity-0">
                    <span className="text-[12.5px] text-muted-foreground">00:21 recorded</span>
                    <span
                      ref={r.create}
                      className="ml-auto rounded-md border-[1.5px] border-ink bg-primary px-2.5 py-px text-[11.5px] font-semibold text-ink"
                    >
                      Create notes
                    </span>
                  </div>
                  <div ref={r.transcribing} className="absolute inset-0 flex items-center gap-2 opacity-0">
                    <span className="text-[12.5px] font-semibold">Transcribing</span>
                    <span className="h-1 flex-1 overflow-hidden rounded-full bg-muted">
                      <span ref={r.progress} className="block h-full w-0 bg-secondary" />
                    </span>
                  </div>
                  <div ref={r.done} className="absolute inset-0 flex items-center opacity-0">
                    <span className="text-[12.5px] text-muted-foreground">00:21 recorded</span>
                  </div>
                </div>
                <p ref={r.transcriptHint} className="text-[12.5px] text-muted-foreground">
                  The transcript appears when you press Create notes.
                </p>
                <div>
                  {setting.lines.map((line, i) => (
                    <div
                      key={`${setting.key}-${i}`}
                      ref={(n) => {
                        lines.current[i] = n;
                      }}
                      className="mb-2 opacity-0"
                    >
                      <Badge variant={line.src === "System" ? "system" : "microphone"}>{line.src}</Badge>
                      <time className="ml-1.5 text-[11px] text-muted-foreground tabular-nums">{clockText(stamp(i))}</time>
                      <p className="mt-0.5">{line.text}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div
                ref={r.notesPane}
                className={cn(
                  "relative overflow-hidden px-4 py-3",
                  phone ? "bg-card opacity-0 [grid-area:pane]" : "border-l border-border bg-background/60",
                )}
              >
                <p className="mb-2 font-sans text-[10.5px] font-semibold tracking-[0.08em] text-muted-foreground uppercase">
                  Notes
                </p>
                <p ref={r.notesHint} className="text-[12.5px] text-muted-foreground">
                  Notes follow the transcript.
                </p>
                <div ref={r.notes} className="relative [clip-path:inset(0_0_100%_0)]">
                  {setting.notes.map((block, i) => (
                    <div
                      key={`${setting.key}-${block.h}`}
                      ref={(n) => {
                        blocks.current[i] = n;
                      }}
                      className="-ml-1 mb-2 rounded px-1"
                    >
                      <p className="mb-0.5 font-sans text-[12.5px] font-bold">{block.h}</p>
                      {block.p ? (
                        <p>{block.p}</p>
                      ) : (
                        <ul className="list-disc pl-4">
                          {block.li?.map((item) => (
                            <li key={item}>{item}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}
                </div>
                <div
                  ref={r.writing}
                  aria-hidden
                  className="absolute inset-x-3 top-9 flex h-[26px] items-center gap-2 rounded-full border-[1.5px] border-ink bg-card px-3 text-xs font-semibold opacity-0 shadow-[0_2px_0_var(--ink)]"
                >
                  <span className="flex gap-[3px]">
                    <i className="size-1 animate-blink rounded-full bg-ink" />
                    <i className="size-1 animate-blink rounded-full bg-ink [animation-delay:150ms]" />
                    <i className="size-1 animate-blink rounded-full bg-ink [animation-delay:300ms]" />
                  </span>
                  Writing notes
                </div>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </Window>
  );
}
