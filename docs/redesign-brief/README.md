# How to run this

These files live in `docs/redesign-brief/`. The standing design rules are in the root `CLAUDE.md`, which every session loads on its own. Start a **fresh Claude Code session per phase**, from the repo root, with the launcher:

```sh
./scripts/redesign 01a
```

The launcher picks the model for the session (Sonnet 5.5 for design work, Opus 5.5 at medium effort for logic work; the rule is under Lanes in `00-master.md`) and hands it the prompt. After the first session, run `./scripts/redesign` with no argument: it reads the `Next session:` line the previous session wrote in `/docs/redesign/STATE.md`. Name a phase (`01b`, `02`, `03`, `04`, `05`) or a ticket file to start a specific one, and add `-n` to see the model and prompt without launching. If a design session on Sonnet falls short, rerun it on Opus with `./scripts/redesign --opus <target>` instead of raising the effort.

Phase D runs as one session per section: its first session writes the tickets, and each later session builds one. Each session ends by telling you what the next `./scripts/redesign` will start. Each session reads STATE.md, which the previous phase wrote, so nothing is lost between sessions.

Before Phase A: nothing required. During Phase B you will get a few one-click questions (hero, logo, integrations, copy). Phase C can be skipped in practice if you are happy with no shader. When a session needs a photograph it stops and sends you an image request; the look it asks for is `image-style-reference.jpg`.
