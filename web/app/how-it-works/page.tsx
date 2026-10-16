import type { Metadata } from "next";
import { pageMetadata } from "@/lib/metadata";
import { Marker } from "@/components/hero/marker";
import { Block, Text } from "@/components/how-it-works/block";
import { FilesDemo } from "@/components/how-it-works/files-demo";
import { LibraryDemo } from "@/components/how-it-works/library-demo";
import { NotesDemo } from "@/components/how-it-works/notes-demo";
import { SourcesDemo } from "@/components/how-it-works/sources-demo";
import { TranscriptDemo } from "@/components/how-it-works/transcript-demo";
import { Button } from "@/components/ui/button";
import { Band } from "@/components/ui/surface";
import { site } from "@/lib/site";

// Title and description are new copy for review (not in the copy deck). Neither
// carries a price, a discount or a claim about anything unbuilt.
export const metadata: Metadata = pageMetadata({
  title: "How Trilsy works: what it records, where it lives and how the notes are made",
  description:
    "What Trilsy records, where the files are kept on your Mac, how the transcript and the notes are made, what you can do with them and what your Mac needs.",
  path: "/how-it-works",
});

// Copy: docs/redesign/02-copy-deck.md section 8, word for word. A backtick span is a file path.
export default function HowItWorksPage() {
  return (
    <main id="main">
      <Band tone="field" rules="bottom" aria-labelledby="how-heading">
        <div className="mx-auto max-w-6xl px-6 pt-14 pb-16 lg:pt-24 lg:pb-24">
          <h1
            id="how-heading"
            className="max-w-[14em] text-[40px] leading-[1.08] font-semibold tracking-[-0.015em] text-balance lg:text-6xl"
          >
            Press record. <Marker>Read the notes.</Marker>
          </h1>
        </div>
      </Band>

      <Block id="what-is-recorded" number={1} title="What is recorded." first visual={<SourcesDemo />}>
        <Text>
          Your microphone, your Mac’s sound or both. System sound is a switch, off until you turn it on, and needs macOS’s Screen &amp; System Audio Recording permission. Wear headphones when you record both. You can also import an audio or video file.
        </Text>
      </Block>

      <Block id="where-it-lives" number={2} title="Where it lives." visual={<FilesDemo />}>
        <Text>
          Audio is saved as short files in a folder on your Mac, `Library/Application Support/Trilsy/Recordings`. The transcript and notes are files next to it. Trilsy has no account and uploads nothing. Your Mac’s disk encryption protects them; Trilsy does not add its own.
        </Text>
      </Block>

      <Block id="the-transcript" number={3} title="How the transcript is made." visual={<TranscriptDemo />}>
        <Text>
          After you stop, Trilsy transcribes on your Mac with Whisper (the small model). Language is detected, or you pick one. You can add words it should know.
        </Text>
      </Block>

      <Block id="the-notes" number={4} title="How the notes are written." visual={<NotesDemo />}>
        <Text>
          A language model on your Mac writes detailed notes section by section, then puts a short overview on top. Check them against the audio; the model can be wrong, and a timestamp it writes into the notes is not a link.
        </Text>
      </Block>

      <Block id="what-you-can-do" number={5} title="What you can do with them." visual={<LibraryDemo />}>
        <Text>
          Edit the notes, the transcript and the title. Search your recordings by title, transcript and notes. Export Markdown (notes and transcript), text (transcript) or SRT subtitles (transcript).
        </Text>
      </Block>

      <Block id="what-you-need" number={6} title="What you need.">
        <Text>
          Apple silicon, macOS 15 or later, 16 GB of memory recommended. The two models download once from Hugging Face and take several GB; recordings are saved uncompressed, so they are large.
        </Text>
      </Block>

      <Block id="the-code" number={7} title="The code.">
        <div className="flex flex-col items-start gap-6">
          <Text>The source is on GitHub.</Text>
          <Button size="lg" nativeButton={false} render={<a href={site.github} target="_blank" rel="noopener noreferrer" />}>
            View on GitHub
          </Button>
        </div>
      </Block>
    </main>
  );
}
