# 14: Use cases, index and Lectures

Status: done
Lane: design
Blocked by: 02

**Section:** `/use-cases` index and the first use-case page, Lectures, which sets the page shape for 15 and 16.

**What to build:** the index lists all twelve pages, each name with its lead. The Lectures page: H1 "Lecture notes you can search", the lead, the situation sentence, a notes example in a lecture setting (real-looking content, no "example" label, no checkbox glyphs), two questions, the View on GitHub button, and the line to `/students`. Its own anchor id, title, meta description and breadcrumb-ready structure.

- The notes example and the two questions are not in the copy deck yet: write them here, true to the product facts in `00-master.md`, and list them for the owner to review.
- The page shows a behavior of the product that the other pages will not repeat (for lectures: search before the exam).
- Mobbin: 3 use-case page references to `docs/redesign/refs/use-cases/`.

**Approved copy:** `docs/redesign/02-copy-deck.md` section 7 (table and learning-page line).
**Behavior spec:** none.

**Images needed from the owner:** none.

- [x] Index lists twelve pages
- [x] Lectures page complete; new copy listed for review
- [x] Layout at 1440 and 390
- [x] Typecheck and build pass

## Answer

Design lane, Sonnet 5.5, loop mode, 2026-10-15.

- **The index.** `web/app/use-cases/page.tsx` (Server Component): pale blue band with the H1 "Calls, lectures and interviews. Start with yours." (second sentence in the hero's `Marker`), then on paper one flat list of the twelve, each a ruled row (name, lead, Hugeicons arrow) linking to `/use-cases/<slug>`, in the copy deck's order, names and leads word for word from `lib/site.ts`. Each row carries the page's slug as its anchor id (`/use-cases#lectures`). No groups, no cards. Nine of the twelve links 404 until tickets 15 and 16 (Lectures exists now).
- **The shared page shape (for 15 and 16).** `web/components/use-cases/use-case-page.tsx` (Server Component) takes a `UseCase`, `figures`, a `behavior` sentence, a `visual` and two `Faq`s: pale blue band with a breadcrumb (shadcn `Breadcrumb`: Trilsy, Use cases, page; `aria-current` on the last), the H1 (last `marker` words in the marker), the lead, View on GitHub and one or two pack characters cropped by the band's rule; then paper rows under dotted rules: the situation sentence as the H2 beside one sentence and the window, "Good questions." with the two questions (`FaqList`), and, for `learning` pages only, the Students line with its `TODO: confirm` chip. Everything below the hero is paper so the last row never touches the blue footer. The section carries `id={slug}`. Each page is a folder under `web/app/use-cases/<slug>/page.tsx` that sets its own metadata and passes its own window. `lib/site.ts` now holds each page's `h1`, `situation`, `description` and `learning` flag for all twelve (copy deck section 7, word for word) and a flat `useCases` list, so tickets 15 and 16 only write their windows, `behavior` sentence and questions.
- **Lectures.** `web/app/use-cases/lectures/page.tsx` and `components/use-cases/lectures-demo.tsx` (client). H1 "Lecture notes you can search" (marker on "you can search"), the approved lead and situation sentence, View on GitHub, two students from the pack (`07-sage-curls`, `11-blue-headscarf`; not the two on `/students`). The window shows the behavior no other page repeats, search before the exam: the word "elasticity" is typed into the search field, the recording list narrows to the two lectures that mention it (rows close over 400ms on `ease-trilsy`, the list keeps its height so nothing shifts), the first match opens on its notes (600ms fade). It is also the notes example: plain Markdown, an overview on top, three sections, one `[00:06:40]` timestamp as text, no checkbox glyphs, no "example" label. Plays once when the window is 40% in view, about 2.8s; under reduced motion the finished state is shown at once (read from the code, not run live). On a phone the list holds three recordings, not five, so the stacked window is not mostly blank.
- **Metadata.** Lectures: description is the deck's, title is new copy ("Lecture notes you can search: record lectures on your Mac"), canonical `/use-cases/lectures`. Index: new title and description. No price or discount figure in either. No JSON-LD added: the breadcrumb markup is ready (nav, ordered list, `aria-current`); a `BreadcrumbList` is logic-lane work for ticket 18 or phase E, and `components/json-ld.tsx` can carry it.
- **Mobbin.** Two queries; three kept in `docs/redesign/refs/use-cases/` (Heron AI, Notion, Evernote) with what each informed. Grid-of-cards use-case pages (Glide, Retool, Mural) were left out.
- **Checked.** Chrome at 1440 by 900, 1024 and 390 by 844 (dev server on port 3147, then the production build; stopped): `docs/redesign/prototypes/d14-use-cases-1440.png`, `d14-lectures-1440.png`, `d14-lectures-1024.png`, `d14-lectures-390.png`. No horizontal overflow at 1024, 1440 or 390. The animation was sampled every 200ms: the window's height is constant (536px at 1440, 781px at 390) through typing, filtering and opening. Console: two preload warnings for `/students` figures from the header's prefetch, none from these pages. Typecheck and build pass; both routes prerender static. Not run: Safari, Firefox, reduced motion live.

### New copy for the owner to review

Not in the copy deck, written here and true to the product facts:

1. Index H1: "Calls, lectures and interviews. Start with yours."
2. Index title and description: "Trilsy use cases: sales calls, lectures, interviews and more on your Mac" / "Twelve ways to use Trilsy, from sales calls and team meetings to lectures, research interviews and podcasts. Each one ends in a transcript and notes saved on your Mac."
3. Lectures title: "Lecture notes you can search: record lectures on your Mac".
4. Lectures sentence under the situation heading: "Search looks through the title, the transcript and the notes of every recording, so the lecture where your professor used a word comes back with the rest."
5. Lectures question 1: "Can I record an online lecture as well as one in the room?" Answer: "Yes. In a room Trilsy uses your microphone. For a lecture that plays on your Mac, turn on your Mac's sound, a switch that is off until you turn it on and needs macOS's Screen & System Audio Recording permission. Record both together if you want your own voice too."
6. Lectures question 2: "Can I rely on the notes for an exam?" Answer: "Read them against the audio first. A language model on your Mac writes the notes and it can be wrong. Every line of the transcript has a timestamp that plays the audio from that point, so you can check a claim in a few seconds." (An alternative second question, "Do I need permission to record a lecture?", would repeat FAQ 1's consent line.)
7. The notes example (illustration, invented content): "Microeconomics, lecture 6", overview plus the sections Price elasticity of demand, What makes demand inelastic and Revenue and elasticity; the recording list: lectures 8, 6 and 3 (and, from 768px up, Modern History lecture 5 and Statistics 110 lecture 7), with dates in September and October 2026.

Defaults taken: the index is one flat ruled list (the owner dropped groups); the breadcrumb starts at "Trilsy"; the Students line is a link row like `/students`; the questions band is on paper, not pale blue, so a page without the Students line does not end blue against the blue footer.
