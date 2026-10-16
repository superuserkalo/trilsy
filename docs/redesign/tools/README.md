# Capture tools (Phase A, session 01b)

The scripts behind the `behavior-*.md` specs (the three from 01b, plus Granola, 2026-10-15). They are kept so a built Trilsy section can be put through the same capture as the reference it was modelled on.

They are not part of the site and `web/` does not depend on them. They need Node 22 or later, Google Chrome, ImageMagick (`montage`), and Playwright installed somewhere outside the repo:

```sh
mkdir -p /tmp/trilsy-capture && cd /tmp/trilsy-capture
npm init -y && npm i playwright
cp /path/to/trilsy/docs/redesign/tools/*.mjs .
```

Output goes to `out/` in the directory you run them from.

| Script | What it does |
| --- | --- |
| `scrolllog.mjs <name> <url> <width> [stepPx]` | Scrolls the page in fixed steps and logs position, size, opacity, transform, filter and clip-path for every element that changes with scroll. Takes an early and a settled sample at each step and a coarser pass back up, so scroll-linked, time-based and once-only changes can be told apart. Also dumps GSAP ScrollTrigger records and CSS scroll-driven animations. |
| `analyze.mjs <dir> [yMin] [yMax] [pathRegex]` | Summarizes a log: where each element is pinned and over which scroll range each property changes. |
| `series.mjs <dir> <pathRegex> [yMin] [yMax] [every]` | Prints one element's position series from a log. |
| `frames.mjs <name> <url> <width> shots\|timed\|video ...` | Key-moment screenshots with a contact sheet, timed screenshots after arriving at a position, or a wheel-driven video with a time and scrollY log. Set `FRESH=1` to skip the warm-up scroll when capturing something that only plays once. |
| `probe.mjs <out.json> <url> <width> <startY\|sel:CSS> <length> <step> name=selector@prop ...` | Samples named values at fixed offsets from a start position. Run it on a reference and on our build with matching probe names. |
| `compare.mjs <reference.json> <ours.json> [tolerance] [skip]` | Largest difference per probe between two probe runs. |
| `pull.mjs <url> <width> <wrapperSel> <panelSel> [shotPrefix]` | At the bottom of the page, sends 24 wheel ticks and then rests, sampling the wrapper's translateY and which image in the panel is showing. Added for Granola's footer pull (2026-10-15). |

`scrolllog.mjs`, `frames.mjs` and `probe.mjs` remove consent banners (Usercentrics, iubenda) from the DOM after load, because iubenda's inline styles beat a hiding stylesheet and its banner dims every frame.

Example, the comparison behind the photo scroll prototype:

```sh
python3 -m http.server -d /path/to/trilsy/docs/redesign/prototypes 4173 &
node probe.mjs ref.json https://wisprflow.ai 1440 1291 6012 180 \
  'cardW=.flow_cards-wrap > .flow_220-wpm@w' 'photo=.flow-bg-layer > img.flow_visual@shown' 'rest=body@scroll'
node probe.mjs ours.json http://localhost:4173/photo-scroll.html 1440 'sel:[data-p="pin"]' 6012 180 \
  'cardW=[data-p="card"]@w' 'photo=.card .img@shown' 'rest=body@scroll'
node compare.mjs ref.json ours.json 12
```

Reference sites change. The selectors and scroll positions in the specs are as measured on 2026-10-13.
