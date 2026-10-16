# Reference teardown (Phase A, session 01a)

Captured 2026-10-13 in Chrome through the DevTools MCP. Every product has four captures in `refs/`: first viewport and first scroll, at 1440x900 and at 390x844. File pattern: `refs/<product>-<width>-1-first.jpeg` and `refs/<product>-<width>-2-scroll.jpeg`. Page copy is saved verbatim in `refs/text/<product>.json`. Cookie banners were dismissed before capture where one covered the hero.

Motion notes here come from the captures and the page DOM (video, canvas and Lottie elements). The full scroll and motion study is `01b`.

## Products

### Wispr Flow Notetaker (north star) — wisprflow.ai/notetaker

Captures: `refs/wisprflow-notetaker-*`

- **H1:** "Meeting notes that get the details right." The last three words are set in italic serif.
- **Subhead:** none. The line under the button is "Available on Mac and Windows".
- **Primary CTA:** "Get started for free" (hero), "Download for free" (header).
- **Hero visual:** an illustration of the product working, built in HTML. A three-line live transcript with colored speaker chips (Mark, Alix, Hailey) types itself out, and a tilted card shows the action item it produced: "Post Ramp reminder in event channel".
- **Trust strip:** no strip. A single testimonial on a dark band follows the hero directly: Steven Bartlett, "Host of The Diary of a CEO, Spotify's #2 global podcast".
- **Section order:** hero, testimonial band, long pinned scroll section ("Wispr Notetaker captures the hard-to-spell words and easy-to-miss details.", then "So you can answer the questions, write the follow-up, and keep things moving."), three facts ("Fits into your workflow. Doesn't change it."), import from competitors ("Switch without losing a thing."), teams, testimonials, FAQ ("You might be wondering."), closing CTA, footer.
- **Motion:** transcript typing in the hero shows what the product does before any explanation. In the scroll section, chat bubbles are scattered around the heading with the hard words highlighted (Siobhan, carte blanche, Asana, Miro), which is the claim itself, acted out. One canvas and one Lottie element on the page.
- **After 5 seconds:** it writes meeting notes from what people say and is more accurate than the others. A stranger does not yet know whether a bot joins.
- **Against our rules:** an eyebrow ("WISPR FLOW NOTETAKER") sits above the H1.

### Wispr Flow — wisprflow.ai

Captures: `refs/wisprflow-*`

- **H1:** "Don't type, just speak."
- **Subhead:** "The voice-to-text AI that turns speech into clear, polished writing in every app."
- **Primary CTA:** "Download for free", with "Available on Mac, Windows, iPhone, and Android" beneath.
- **Hero visual:** illustration. A ribbon of messy dictated text runs into a waveform pill and comes out as clean text.
- **Trust strip:** logo row "USED BY PROFESSIONALS AT", directly under the hero.
- **Section order:** announcement bar, hero, logos, "4x faster than typing" (45 wpm keyboard against 220 wpm Flow), how it works, features, privacy ("Your voice stays yours."), testimonials, FAQ ("Good questions."), closing CTA ("You have a way with words. Now, two.").
- **Motion:** the ribbon animates continuously and shows the before and after of one sentence. Two Lottie elements, one canvas.
- **After 5 seconds:** you talk and it types clean text, in any app.
- **Against our rules:** eyebrow above the H1, plus an announcement bar above the header.

### Superwhisper (north star) — superwhisper.com

Captures: `refs/superwhisper-*`

- **H1 (visual):** "Just speak. Write faster." The page's real `<h1>` element is "Adaptability", 3,900px down.
- **Subhead:** "Turn your voice into polished text. Works in Slack, Gmail and any other site or app." It sits under the buttons, in low-contrast text.
- **Primary CTA:** "Download for Mac" and "Download for Windows" side by side; "App Store" and "Google Play" at 390px.
- **Hero visual:** abstract and photographic. A face in profile and the edge of a laptop over a sky-blue gradient, rendered on a canvas. No product UI in the first viewport. At 390px the first viewport is the gradient and the text only.
- **Trust strip:** "Used by those who move fast", about 3,400px down, after the demo.
- **Section order:** hero, scroll-driven demo ("Ready to see how it works? Play Demo") with mock Slack, Notes and code windows, logos, tone modes, feature grid ("What's inside"), custom modes, mobile, testimonials, pricing, tutorials, FAQ, footer.
- **Motion:** after the first scroll the hero gradient has become a framed stage for the demo (`superwhisper-1440-2-scroll`). It sets mood more than it explains.
- **After 5 seconds:** speak instead of typing, on Mac or Windows. The mood is clear; the mechanics are not until the demo.
- **Worth noting:** one feature card in the grid contains "Lorem ipsum dolor sit amet".

### Granola — granola.ai

Captures: `refs/granola-*`

- **H1:** "The AI notepad for back-to-back meetings"
- **Subhead:** "Notes, actions and memory. Without a meeting bot."
- **Primary CTA:** "Download for free", with "Available for macOS, Windows, iOS, Android" beneath.
- **Hero visual:** real-looking UI. A Mac note window titled "Q3 GTM sync" with rough typed notes, a "Transcribing" pill and a two-person video call tile, over collaged paper textures.
- **Trust strip:** in the second viewport, three facts with hand-drawn icons: "Uses your computer audio, so doesn't invite a bot", "Private by default, easy to share if you choose", "Works with Zoom, Google Meet, Teams and every other meeting app." A logo row ("Trusted by teams we admire") follows.
- **Section order:** hero, "Effortless notes, enhanced instantly." with the three facts, logos, before / in / after the meeting, chat ("Perfect meeting memory"), testimonials, "Works everywhere you do, how you do" (five items), MCP, pricing teaser ("Unlimited meeting notes for free"), footer.
- **Motion:** the hero note keeps typing; on scroll the same window shows "Enhancing notes" (`granola-1440-2-scroll`), and the page text holds the structured notes that replace the rough lines. One continuous object carries the story across two viewports.
- **After 5 seconds:** a notepad on your computer that turns meetings into notes, and no bot joins.
- **Against our rules:** a "New" pill sits above the H1.

### Otter — otter.ai

Captures: `refs/otter-*`

- **H1:** "Your AI notetaker is now also your Conversational Knowledge Engine"
- **Subhead:** "Otter transcribes every meeting, turning it into searchable knowledge that powers your workflow."
- **Primary CTA:** "Start for free", secondary "Schedule demo".
- **Hero visual:** video of a staged video-call grid with an Otter tile and floating Zoom, Google Meet and Teams chips.
- **Trust strip:** a rotating testimonial inside the hero (Tim Draper), then a logo row at the bottom of the first viewport.
- **Section order:** hero, logos, feature list ("Like having your own executive assistant"), use-case tabs ("Whatever you do, Otter works for you": Sales, Education, Media, Recruiting, SDR), capture options, enterprise, MCP, testimonials, integrations, footer.
- **Motion:** eleven video elements on the page; the hero is one of them.
- **After 5 seconds:** an AI notetaker for meetings. The second half of the headline does not land.

### Fireflies — fireflies.ai

Captures: `refs/fireflies-*`

- **H1:** "The #1 AI Assistant For Your Meetings"
- **Subhead:** "Transcribe, summarize, search, and analyze all your team conversations."
- **Primary CTA:** "Get Started", secondary "Request Demo".
- **Hero visual:** real UI. A cropped app screenshot rises from the bottom edge over a dark starfield.
- **Trust strip:** a pill under the buttons ("Rated 4.8 / 5", "GDPR, SOC2, More"), then "USED ACROSS 1 MILLION+ COMPANIES".
- **Section order:** promo bar, hero, logos, then ten feature sections in Title Case, most an H2 over a grid of cards, then integrations, security, footer. Page height is about 16,000px.
- **Motion:** nothing moves in the captures; one video element far down the page.
- **After 5 seconds:** a meeting assistant that transcribes and summarizes. Nothing sets it apart.

### Jamie — meetjamie.ai

Captures: `refs/jamie-*`

- **H1:** "The meeting intelligence platform you can trust."
- **Subhead:** "Turn every meeting into knowledge you can act on. Walk in prepared, find anything from past meetings, and let Jamie automate all your post meeting workflows."
- **Primary CTA:** "Download", secondary "Book a demo".
- **Hero visual:** video poster of the real Mac app, a notes view titled "Payments Platform Deal Review", with a play button.
- **Trust strip:** three facts with icons inside the hero: "Data stays in the EU", "No bot joins your call", "ISO 27001 and GDPR". A logo row sits under the video.
- **Section order:** hero, logos, one stat ("5 hours saved per person every week") beside a stock photo, "No bot joins your calls. Be fully present.", five verbs (Prepare, Capture, Document, Chat, Integrate), workflows, MCP / Webhook / API, security, case studies, closing CTA ("Be fully present. Remember everything.").
- **Motion:** the hero video; nothing else moves in the captures.
- **After 5 seconds:** meeting notes software for serious firms, with no bot. The three facts do more than the headline.

### Fathom — fathom.ai

Captures: `refs/fathom-*`

- **H1:** "AI notetaking that is out of this world"
- **Subhead:** "Fathom summarizes your meetings so you can focus on the conversation. Now available bot-free."
- **Primary CTA:** "GET STARTED - FREE FOREVER"
- **Hero visual:** illustration plus UI fragments. Pill-shaped tiles hold an astronaut with a laptop, a capture-mode menu and an "Ask Fathom" prompt, over a starfield.
- **Trust strip:** a compliance line under the button ("SOC 2 Type II | GDPR | HIPAA Compliant | SSO / SCIM"), then a G2 rating and "Used at 300K+ companies" logos.
- **Section order:** acquisition bar, hero, logos, four tiles, teams / individuals toggle, Clarity / Momentum / Ease, stats, integrations, teams by function, closing CTA.
- **Motion:** sixteen canvas elements, which draw the starfield and the tiles.
- **After 5 seconds:** AI meeting notes, free. The space theme says nothing about meetings.

### MacWhisper — macwhisper.com

Captures: `refs/macwhisper-*`

- **H1:** "The all-in-one Mac app to transcribe it all." The word "transcribe" sits in a blue highlight.
- **Subhead:** none. The headline keeps going as one long sentence while the page scrolls (lectures, videos, podcasts, private files, online meetings, then dictation in any app).
- **Primary CTA:** "Buy now" (header and mobile hero); "Try for free" is a nav link.
- **Hero visual:** real UI. A MacBook frame showing the app with a speaker-labelled transcript, surrounded by faint file icons labelled Lecture, Interview, Podcast, Voice Memos, PhD.
- **Trust strip:** at 390px, "Featured by Apple" and "9to5Mac" sit above the H1. Not visible in the 1440px first viewport.
- **Section order:** hero, scrolling sentence, "Transcribe any file. Just drag and drop.", use tiles, privacy ("Built for privacy from the ground up"), features, AI models, testimonials, pricing.
- **Motion:** the laptop stays in place while the sentence scrolls past, and its screen changes to match the words, from a transcript to a code editor being dictated into (`macwhisper-1440-2-scroll`). The page's `<h1>` is split into one element per word.
- **After 5 seconds:** a Mac app that transcribes audio. The file icons tell you who it is for without a sentence.

### Char, formerly Hyprnote — char.com

Captures: `refs/char-*`

- **H1:** "AI notepad that gets things done."
- **Subhead:** none.
- **Primary CTA:** "Join private beta"
- **Hero visual:** a note window with a checklist and a handwritten annotation and arrow ("apple notes on steroids!"), over a halftone cloud image.
- **Trust strip:** "Backed by Y Combinator", above the H1.
- **Section order:** hero with four tabs (Catch up, Remember more, Get things done, Clear clutter), then a long essay ("Everyone is becoming a manager. Our tools haven't caught up.").
- **Motion:** four labelled tabs with a progress bar sit under the note window; the cycling itself was not captured.
- **After 5 seconds:** some kind of smart notes app. It is no longer clearly a meeting notetaker.
- **Why it is here:** hyprnote.com, the open-source local notetaker closest to Trilsy, now redirects to this. Its handwritten annotation is the one example in the set of a hand-drawn mark used on top of real UI.

## Mobbin section references

Sixteen sections from fifteen sites, saved in `refs/mobbin/`. Each was opened and looked at, not picked from metadata.

| Section | File | Site | What it informs |
| --- | --- | --- | --- |
| Hero | `hero-aqua.webp` | [Aqua](https://mobbin.com/sites/sections/03f083e3-7838-429b-8800-3d25fad9310b) | A voice product whose hero is one line and one "Download for Mac" button. Shows how little a Mac app hero needs. |
| Hero | `hero-notion-desktop.webp` | [Notion](https://mobbin.com/sites/sections/35ebbbe6-a636-4e4d-b1fc-fe494ff2b3f7) | Headline left, a real document window right, with believable meeting content (agenda, action items). |
| Hero | `hero-linear-download.webp` | [Linear](https://mobbin.com/sites/sections/39e1f8df-39a3-4325-8935-88323ceea029) | App icon, one button, and a compatibility line under it ("Compatible with Apple Silicon and Intel"). |
| Trust strip | `trust-square.webp` | [Square](https://mobbin.com/sites/sections/b6639492-77d4-4be2-9525-2eeb42d9f1e3) | Four plain facts with one icon each under a human heading ("A little peace of mind"). Facts, not logos. |
| Trust strip | `trust-wise.webp` | [Wise](https://mobbin.com/sites/sections/5392e7f2-b7f5-4cd6-a8b3-fa1837d0ba56) | Four one-line facts in a row with no heading at all. |
| How it works | `how-graza.webp` | [Graza](https://mobbin.com/sites/sections/ee5be1fd-0642-4808-8cf4-ef5c3234a18b) | Three numbered steps arranged around one hand-drawn illustration. Closest match to our hand-drawn tone. |
| How it works | `how-zipline.webp` | [Zipline](https://mobbin.com/sites/sections/7b0ca7a7-caf2-42a6-b315-53b86c8cd190) | Three illustrated panels, one sentence each, numbered 01 to 03. |
| How it works | `how-wise.webp` | [Wise](https://mobbin.com/sites/sections/5913d254-146e-49b6-bc26-caaee21e868e) | Three steps with small character illustrations and a heading that states the time it takes. |
| Use cases | `usecases-amplemarket.webp` | [Amplemarket](https://mobbin.com/sites/sections/85de217d-baba-4edb-8805-3d2a76f2244b) | Audience tabs where each tab is a line-drawn character. Direct precedent for characters carrying use cases. |
| Use cases | `usecases-reducto.webp` | [Reducto](https://mobbin.com/sites/sections/10341123-49d0-4872-826e-2e6d1aac32f8) | Tabs that swap one paragraph and one product mockup. |
| Use cases | `usecases-heron.webp` | [Heron AI](https://mobbin.com/sites/sections/7fb39024-7787-4326-9985-98fa69c6b46b) | An accordion of audiences beside one fixed image. Works at narrow widths without tabs. |
| FAQ | `faq-lovable.webp` | [Lovable](https://mobbin.com/sites/sections/50a7d07f-0f40-468d-b7c2-cc201106e412) | Plain accordion, first answer open, six questions. |
| FAQ | `faq-craft.webp` | [Craft](https://mobbin.com/sites/sections/2a7f5774-6456-4b1f-ac56-bc01e3ef9125) | Answers of one or two sentences, with a contact line under the list. |
| FAQ | `faq-zendesk.webp` | [Zendesk](https://mobbin.com/sites/sections/2e782044-f77a-4989-b191-1dead68e25ae) | Questions in the visitor's words ("How much does Zendesk cost?"). |
| Footer | `footer-function.webp` | [Function](https://mobbin.com/sites/sections/86b57046-171c-45b5-80e5-61e86bc6747c) | A footer held in one rounded card with three short link columns. |
| Footer | `footer-linktree.webp` | [Linktree](https://mobbin.com/sites/sections/16b0c54c-9d79-4801-9ea1-f2ceeb0bfe1e) | Link columns with the primary call to action repeated at the bottom. |

These are structure references. None of them is in our product category except Aqua.

## Patterns that recur

1. **The headline names the category in plain nouns, in eight words or fewer.** "Meeting notes that get the details right." (`wisprflow-notetaker-1440-1-first`), "The AI notepad for back-to-back meetings" (`granola-1440-1-first`), "The all-in-one Mac app to transcribe it all." (`macwhisper-1440-1-first`).
2. **The button is a download, and one quiet line under it lists platforms.** Wispr, Granola, Superwhisper. Mobbin: Linear.
3. **The hero visual is the product doing its job with believable content.** A transcript typing (Wispr), rough notes being enhanced (Granola), a labelled transcript in a Mac window (MacWhisper), a real notes view (Jamie). Nobody shows an empty state.
4. **Every bot-free product says "no bot" within the first two viewports.** Granola in the subhead, Jamie as a hero fact, Fathom in the subhead, Granola again as the first strip item (`granola-1440-2-scroll`).
5. **Three short true facts with icons beat a logo row for a new product.** Granola's hand-drawn trio (`granola-1440-2-scroll`), Jamie's hero trio (`jamie-1440-1-first`). Mobbin: Square, Wise.
6. **One object carries the story down the page.** Granola's note window persists from hero to second viewport and changes state. Wispr's transcript becomes the scroll section.
7. **Warm paper, serif display type and a hand-made mark read as human.** Wispr, Granola, Char. The dark, starry pages (Fireflies, Fathom) read as generic SaaS.
8. **"Works with everything" is phrased as a principle plus two or three examples.** "If words are being said, Notetaker captures them." (Wispr), "every other meeting app" (Granola).
9. **MCP has its own short section near the end.** Wispr, Granola, Jamie, Otter, Fireflies.
10. **The FAQ heading is human and the questions are the visitor's.** "You might be wondering." (Wispr), "Good questions." (Wispr home).

## Patterns to deliberately avoid

1. **Anything above the headline.** Eyebrows on both Wispr pages, the "New" pill on Granola, "Backed by Y Combinator" on Char, "Featured by Apple" on MacWhisper at 390px, promo bars on Fireflies, Fathom and Wispr home. Our rule: the headline stands alone.
2. **Rank claims and invented category names.** "The #1 AI Assistant For Your Meetings" (`fireflies-1440-1-first`), "Conversational Knowledge Engine" (`otter-1440-1-first`), "out of this world" (`fathom-1440-1-first`). Each could sit on any competitor's page.
3. **Backgrounds unrelated to audio or conversation.** Starfields on Fireflies and Fathom.
4. **A first viewport with no product in it.** Superwhisper at 1440px shows a face and a laptop edge; at 390px only a gradient (`superwhisper-390-1-first`). Beautiful, and it costs a stranger the first five seconds.
5. **Logo rows, star ratings, user counts and compliance badges.** Otter, Fireflies, Fathom, Jamie. Trilsy has none of these and must not imply any.
6. **The feature wall.** Fireflies stacks ten Title Case sections of identical card grids. One job per section rules this out.
7. **Placeholder content in mockups.** Superwhisper ships "Lorem ipsum dolor sit amet" in a feature card.
8. **A cookie dialog over the hero.** Granola's covered its own headline on first load. Trilsy has no analytics, so it needs none.
9. **A stock photograph of an executive.** Jamie (`jamie-1440-2-scroll`). Our photographs follow the fixed image style and the owner makes them.
10. **A headline element that is not the headline.** Superwhisper's `<h1>` is "Adaptability"; MacWhisper splits its `<h1>` into one element per word. Both hurt search and screen readers.
11. **Naming real people as proof.** Wispr and Granola lean on named CEOs. We have no testimonials and invent none.
