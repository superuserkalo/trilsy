# Loop mode: the orchestrator

One session runs the whole redesign. It is started with `./scripts/redesign --loop`, runs under `/loop`, and spawns one worker per phase or ticket: the `design` or `logic` subagent from `.claude/agents/`, on the model its lane calls for. I talk only to the orchestrator. Workers reach me through it.

`00-master.md` still holds every rule about the work itself. This file only says how the work is routed.

## The orchestrator

You route, relay and check. You do none of the phase work yourself: no research, design, copy or code, and no answering a worker's question on my behalf.

One step of the loop:

1. Run `./scripts/redesign -n`. It prints the target, lane, model, effort and prompt of the next session. If it says the redesign is complete, tell me and end the loop.
2. Spawn the worker: the Agent tool with `subagent_type` set to the lane and the `prompt` line, word for word, followed by `You are a worker in loop mode: read docs/redesign-brief/orchestrator.md, "Workers".` Pass `model` only when it differs from the lane's own (Sonnet for design, Opus for logic), and `effort` only when it differs from that model's default (high on Sonnet, medium on Opus). One worker at a time, a fresh one per target.
3. Wait for it. You are re-invoked when the worker finishes its turn, so do not poll; schedule one long fallback wakeup.
4. Act on the block that ends the worker's report:
   - `QUESTION FOR OWNER`: put it to me as the worker wrote it, one topic, its options with the recommendation first, and its previews shown (open the image files, or serve and open the prototype). Send my answer to the same worker with SendMessage so it continues with its context intact. Never answer for me, and never pick a default the worker did not mark as minor.
   - `HANDOFF`: spawn the other lane's subagent with the piece as written, then send its report back to the worker with SendMessage. For the hero bake-off in B5, spawn `design` twice from the one identical prompt, once as defined and once with `model: opus` and `effort: medium`, and show me both as A and B.
   - `GATE`: show me what the phase produced and what I am asked to approve. When I approve, send that to the worker so it records the gate in STATE.md and finishes. If I ask for changes, send those instead.
   - `DONE`: run `./scripts/redesign -n` again and check that the target moved on. Tell me in two or three lines what was produced and what runs next, then go to step 1.
5. Halt and report, without spawning again, when: a worker ends with none of the four blocks; a target is still the next session after its worker said `DONE`; a worker fails twice on the same target; or I say stop.

If I say a design result is not good enough after one round of fixes, respawn that target with `model: opus` and `effort: medium` instead of raising the effort.

When the loop halts or ends, finish as "Ending a session" in the master describes: the next-session prompt and the launch command, so I can pick the work up by hand.

## Workers

You were spawned by the orchestrator to do one whole phase or ticket. Everything in `00-master.md` applies to you, with these differences:

- You cannot reach me and you cannot spawn subagents. When you need either, end your turn with one of the blocks below. The orchestrator continues you with the answer, and your context is kept.
- Co-design still means one topic at a time. Ask a question the moment the brief gives the decision to me; do not collect them, and do not guess one to keep moving.
- On 2026-10-15 the owner said: "I dont want to decide or review anything go". From then on, do not end with QUESTION FOR OWNER for design or copy choices. Take the option you would recommend, build it, and list it under "Defaults taken" in your report and in STATE.md. A GATE is treated as approved on the recommended option. This does not cover: deploying to production, inventing assets the owner makes (logo, photographs), or making claims the master's product facts don't support. Leave those as `TODO: confirm` and keep going.
- Other projects on this machine run their own dev servers. Start yours on a free port and stop only it, by port (`lsof -ti:<port> | xargs kill`). Never `pkill` or `killall` by process name.
- Previews are files. Write each option where the orchestrator can show it (an image, or a prototype under `docs/redesign/prototypes/` with the command that serves it) and give the path.

End every turn with exactly one of these, as the last thing in your report:

```
QUESTION FOR OWNER
Topic: <one topic>
Options: <2 to 4, recommendation first, each with its preview path>
Defaults taken: <minor choices you made yourself, or "none">
```

```
HANDOFF
Lane: <design or logic>
Piece: <the full prompt for the other lane, with the files it needs>
Return: <what you need back>
```

```
GATE
Produced: <files and what each holds>
To approve: <each decision the phase file's gate gives to me>
```

```
DONE
<the output of ./scripts/redesign -n, after STATE.md, the ledger and the Next session line are updated>
```

`DONE` replaces step 3 of "Ending a session": the orchestrator carries the next prompt, not you. Send `GATE` before `DONE` whenever the phase file has a gate.
