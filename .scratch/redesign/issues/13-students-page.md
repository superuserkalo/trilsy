# 13: Students page

Status: done
Lane: design
Blocked by: 02

**Section:** the `/students` page, the student offer.

**What to build:** H1 "Students get 50% off everything paid." and the body as approved, with links to the Lectures and the Talks, courses and webinars pages, and the View on GitHub button. Every offer figure `TODO: confirm`. Page title and description with its own SEO copy.

- Mobbin: 3 student or education-offer references to `docs/redesign/refs/students/`.

**Approved copy:** `docs/redesign/02-copy-deck.md` section 10.
**Behavior spec:** none.

**Images needed from the owner:** none.

- [x] Copy as approved, TODOs marked
- [x] Layout at 1440 and 390
- [x] Typecheck and build pass

## Answer

Design lane, Sonnet 5.5, loop mode, 2026-10-15.

- **The page.** `web/app/students/page.tsx` (Server Component, no client leaf, no motion beyond the link hover). A pale blue band with the H1 "Students get 50% off everything paid." (second half in the hero's `Marker`), the approved body, and the View on GitHub button, with two students from the owner's pack (`04-blue-wave`, `12-mustard-gesture`) cropped at the waist by the band's lower dotted rule, on the right at 1440 and under the text at 390. Below it, on paper, two ruled rows, one per approved sentence ("Lecture notes you can search before the exam: see Lectures." and "Study with the course videos you already watch: see Talks, courses and webinars."), each a link to `/use-cases/lectures` and `/use-cases/talks-courses-and-webinars` with a Hugeicons arrow. Copy is the deck's section 10 word for word.
- **Placeholders.** Two `TODO: confirm` chips (`components/pricing/todo.tsx`): after the H1 and after the verification sentence, covering the 50% and the verified student or school email.
- **Metadata.** New copy for review, no figure in either: title "Trilsy for students: free lecture notes on your Mac, and a student discount", description about recording a lecture, seminar or online course and searching the notes before the exam, "students get a discount on paid plans". Canonical `/students`. No page-level Open Graph, like `/pricing` and `/faq`.
- **Mobbin.** Two queries; three kept in `docs/redesign/refs/students/` (Wispr Flow, Figma, Farfetch) with what each informed. The three-tier education plan grids (Mural, Miro) were left out as repeated cards and plans Trilsy does not have.
- **Checked.** Chrome (dev server on port 3417, stopped) at 1440 by 900 and 390 by 844: `docs/redesign/prototypes/d13-students-1440.png`, `d13-students-390.png`; no horizontal overflow at 390, no console messages. Typecheck and build pass; `/students` prerenders static.
- **Defaults taken.** The figures are two of the pack's twelve, chosen for the raised hand (a question) and an open hand (explaining); alt text says what each does. The two links are full-width rows, not cards. No verification form or step list: the copy gives none and the method is `TODO: confirm`.
- **Open.** The two links 404 until ticket 14 and 16 build those pages. The student figures could be swapped for others from the pack without layout change.
