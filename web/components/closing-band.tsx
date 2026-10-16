import { Reveal } from "@/components/reveal";
import { Button } from "@/components/ui/button";
import { site } from "@/lib/site";

// Home, after the questions (copy deck section 6, heading option 1). One job: the
// way out. The heading, the one button and the helper sit in light text on the
// quiet left of one photograph; the photograph is static.
//
// TODO: image. `closing-band.jpg` (21:9, 3600 by 1543) and the 4:5 phone crop
// (at least 1200 by 1500) are owed by the owner; the request is in
// docs/redesign/STATE.md. Until they arrive the box below holds the exact final
// ratio on the --dusk stand-in, a plain colour field with no visible label, so
// nothing shifts when the files land. To swap:
// replace <PhotoBox /> with two next/image fills (`sm:hidden` for the 4:5 crop,
// `hidden sm:block` for the 21:9), both `object-cover`, `sizes="100vw"`, and
// alt text "Someone walking out of a lit hall into the dusk, bag on shoulder".
function PhotoBox() {
  return (
    <div aria-hidden className="absolute inset-0 bg-dusk" />
  );
}

export function ClosingBand() {
  return (
    <section
      aria-labelledby="closing-heading"
      className="relative isolate aspect-[4/5] w-full overflow-hidden bg-dusk text-dusk-foreground sm:aspect-[21/9]"
    >
      <PhotoBox />
      {/* The text keeps to the photograph's quiet left: 45% from sm up (the
          container's left edge plus 26rem stays inside it at 1024 and wider),
          the lower left on the phone, where the subject is in the right half. */}
      <div className="relative mx-auto flex h-full max-w-6xl items-end px-6 pb-8 sm:items-center sm:pb-0">
        <Reveal className="flex max-w-[15rem] flex-col items-start gap-5 sm:max-w-[min(26rem,calc(45vw-3rem))] sm:gap-6">
          <h2
            id="closing-heading"
            className="text-4xl leading-[1.05] font-semibold tracking-[-0.015em] text-balance sm:text-[28px] md:text-4xl lg:text-[56px]"
          >
            Walk out with the notes.
          </h2>
          <div className="flex flex-col items-start gap-3">
            <Button
              size="lg"
              nativeButton={false}
              render={<a href={site.github} target="_blank" rel="noopener noreferrer" />}
            >
              View on GitHub
            </Button>
            <p className="text-sm text-dusk-foreground/85">Free, on your Mac, no account.</p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
