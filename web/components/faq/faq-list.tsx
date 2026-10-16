import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import type { Faq } from "@/lib/faq";

// An answer's `backtick` spans are file paths; everything else is plain text.
function Answer({ text }: { text: string }) {
  return (
    <p>
      {text.split("`").map((part, i) =>
        i % 2 ? (
          <code key={i} className="rounded bg-muted px-1.5 py-0.5 font-mono text-[0.88em] break-words">
            {part}
          </code>
        ) : (
          part
        ),
      )}
    </p>
  );
}

// Closed answers stay in the HTML (keepMounted) so crawlers, assistants and the
// browser's find-in-page can read them; hiddenUntilFound opens a row on a match.
// The accordion both the home section and /faq show. One row open at a time; the
// first starts open so the page reads as answers, not as a column of closed doors.
// `level`: the questions' heading level, one below the section's heading.
export function FaqList({ items, level = 3 }: { items: Faq[]; level?: 2 | 3 }) {
  return (
    <Accordion defaultValue={[items[0].id]} keepMounted hiddenUntilFound>
      {items.map(({ id, question, answer }) => (
        <AccordionItem key={id} value={id} variant="faq">
          <AccordionTrigger variant="faq" level={level}>
            {question}
          </AccordionTrigger>
          <AccordionContent variant="faq">
            <Answer text={answer} />
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
