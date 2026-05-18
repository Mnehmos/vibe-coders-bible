# Chapter 42 - Stagehand: Narrated State Choreography

Part: X - The Presentation Layer

## Thesis

The next interface is not chat. It is narrated state: the model speaks, the system routes, the renderer moves, and the validator decides what becomes real.

## Key Line

Stagehand gives the model a director's baton, not root access.

## The Problem With "The Model Gave An Answer"

Every serious AI system eventually discovers the same thing: model output is not one thing.
[stage.highlight text="model output is not one thing"]

A chess model responding to a position produces a move, a strategic rationale, a broadcast line, a confidence signal, and sometimes an illegal action. These are different objects. Treating them as a single "answer" and routing them all to the same sink produces errors, corruptions, and failures.

The first serious fix for this is output routing — the insight from Chapter 6 that mixed model output must be split into trust lanes before anything is acted on. Code goes through a compiler. Facts go through a citation check. Commands go through a schema validator. Claims go through a review gate.
[stage.highlight.off text="model output is not one thing"]

Stagehand is what happens when output routing becomes visible, typed, and synchronized with human-perceivable presentation.
[stage.highlight text="output routing becomes visible, typed, and synchronized"]

## What Stagehand Is

Stagehand is a typed narration protocol for synchronizing speech, visuals, and validated state.
[stage.highlight.off text="output routing becomes visible, typed, and synchronized"]

The model writes a narration script. Inside the script, embedded commands direct the renderer:

```
The Strait of Hormuz is one of the most important chokepoints in global energy.
[map.highlight entity="strait:hormuz"]
Now zoom in and notice its proximity to Iran, Oman, and the shipping lanes.
[map.zoom entity="strait:hormuz" level=6]
```

The renderer parses the stream. It splits each fragment into lanes:

| Fragment | Lane | Validator |
| --- | --- | --- |
| Spoken sentence | Narration / TTS | Source review, tone review |
| `map.highlight` | Visual command | Command schema |
| `entity="strait:hormuz"` | Entity reference | SQLite entity registry lookup |
| Published claim | Public civic assertion | Source and provenance gate |

The spoken sentence goes to text-to-speech. The visual command goes to the renderer. The entity reference is validated against a live registry. The claim, if it makes it past the provenance gate, becomes a public artifact.

The model never writes directly to state. The model narrates state that already exists.
[stage.highlight text="The model never writes directly to state."]

## Proof 1 -- LLM-Chess: Routing Makes The Principle Undeniable
[stage.highlight.off text="The model never writes directly to state."]
[stage.focus para=14]

Chess is the cleanest teaching demo because it exposes the lie of "the model gave one answer."

A chess model responding to a position might produce:

```
I want to play Nf3 because it develops the knight and pressures the center.
[chess.move san="Nf3"]
[chess.highlight square="f3"]
[chess.arrow from="g1" to="f3"]
```

These are different objects. The move goes to the chess engine for legality checking. The reasoning goes to benchmark metadata. The highlight and arrow go to the broadcast layer. The commentary goes to TTS.

Chapter 26 established this directly: the proposed move needs legality checking, illegal moves must be caught before corrupting game state, reasoning is benchmark metadata, commentary is broadcast content, and highlights are visual output. Each fragment has a destination. Each destination has a gate.

The key line from LLM-Chess, stated as a Stagehand principle:

> Commentary is content. The board is state.
[stage.highlight text="Commentary is content. The board is state."]

The model can commentate brilliantly on a position. The chess engine still decides whether the move is legal. Stagehand makes this split explicit in the command stream rather than leaving it to the system to infer.
[stage.highlight.off text="Commentary is content. The board is state."]
[stage.focus.off]

## Proof 2 -- Clio: Civic Intelligence As Rendered State
[stage.focus para=20]

Clio is the canonical Stagehand system. Chapter 27 established its architecture: a MapLibre globe backed by a SQLite-WASM entity registry, with narration, TTS, and FFmpeg export. The registry is ground truth. The model narrates from what the database says is true.

The Stagehand command stream for a Clio episode:

```
The Strait of Hormuz is not just a body of water. It is a pressure valve in the global energy system.
[map.focus entity="strait:hormuz"]
[map.highlight entity="shipping_lane:hormuz_main"]

Now trace the dependency outward.
[map.draw_route from="port:ras_tanura" to="strait:hormuz" to="region:indian_ocean"]
```

Two things cannot happen in this system:

The command cannot invent geography. If `strait:hormuz` is not in the entity registry, the command fails. The narration may describe the strait. The renderer cannot move the globe to a location that does not exist in the database.

The route cannot be published without source support. A route that is verified gets a provenance card. An unverified route stays in draft state. The public event log only receives what has crossed the validation boundary.

In civic intelligence, this matters beyond correctness. A false map, false border, or false geopolitical claim does not just mislead technically. In Clio's domain, civic claims have consequences. Stagehand's validation gates are not performance. They are the structural guarantee that narration explains civic state rather than creating it.

> Narration explains civic state. It does not create civic state.
[stage.highlight text="Narration explains civic state. It does not create civic state."]
[stage.highlight.off text="Narration explains civic state. It does not create civic state."]
[stage.focus.off]

## Proof 3 -- Semantic Video Studio: State First, Pixels Second
[stage.focus para=29]

Semantic Video Studio extends Stagehand from live presentation to generated media.

Chapter 28 established the four-plane state pack: `scene_graph.json`, `asset_manifest.json`, `timeline.json`, and `render_plan.json`. The MP4 is reproducible because it is compiled from those state planes, not generated in one pass. Pixels are output. State is the product.

Stagehand in SVS becomes a semantic editing language:

```
The greenhouse rises from the red dust like a sealed ecosystem trying to bargain with Mars.
[svs.camera target="greenhouse" move="slow_push_in" duration=4s]
[svs.highlight object="greenhouse_glass_shell"]
[svs.animate object="drone_01" action="orbit" radius=8 duration=6s]
```

Each command compiles into a state patch:

```
[svs.patch plane="timeline" op="add_action" object="drone_01" action="orbit"]
[svs.patch plane="scene_graph" op="set_camera" target="greenhouse"]
[svs.render profile="preview"]
```

The narration line describes what the viewer sees. The commands construct the state that produces what the viewer sees. The two are synchronized but separate. The narration is never the authoritative source. The state pack is.

This separation enables reproducibility. Given the same state pack and renderer, the video is identical. Given a different narration over the same state, the video changes -- but the state remains editable, auditable, and independently correct.

> Stagehand is the bridge from narration to editable cinematic state.
[stage.focus.off]

## The Command Language
[stage.highlight text="Commands are"]

Stagehand commands follow a consistent schema:

```
[namespace.action key="value" key2=value]
```

Commands are:

- **Typed**: every namespace and action must be declared in the command schema. Unknown commands fail at parse time, not at render time.
- **Validated**: entity references are checked against the registry before the command executes.
- **Idempotent**: running the same command stream twice produces the same state.
- **Auditable**: every command execution is logged with its inputs and output state.

The narration and command streams are separated at parse time. The TTS system receives narration. The renderer receives commands. Neither receives the other.
[stage.highlight.off text="Commands are"]

## Public vs. Private Events
[stage.highlight text="The model produces private events. The validator promotes events to public."]

A Stagehand session has two event logs: private and public.

The private log captures everything: draft narration, failed commands, rejected entity lookups, unverified claims, reasoning traces, retries. The private log is for the system's internal audit trail. It is not user-facing.

The public log captures only what has crossed the validation boundary: verified narration, executed visual commands, confirmed entity references, sourced claims, and completed render operations.

The model produces private events. The validator promotes events to public. The public log is the content that can be shared, published, cited, or exported.

This is the same distinction that appears throughout the book: the proposal is cheap; the commit is the meaningful act. In Stagehand, the private event is the proposal. The public event is the commit.
[stage.highlight.off text="The model produces private events. The validator promotes events to public."]

## The AI Factory And Stagehand

Chapter 41 described the AI factory pipeline: Extract, Normalize, Validate, Harden, Package, Publish, Observe.

Stagehand is the presentation layer of that pipeline.

The vibe coding session produces raw artifacts: code, notes, screenshots, TTS drafts, visual commands, prototype interactions. The factory processes those artifacts. Stagehand is how the validated, packaged artifacts are presented to an audience.

A book chapter (like the ones in this volume) passes through the factory and becomes:

- A narration script (the prose, cleaned and verified)
- A Stagehand command stream (visual cues, diagram animations, link highlights)
- A TTS audio track (narration, voice-synced to the command stream)
- A visual timeline (compiled by SVS or equivalent renderer)
- A published episode (exportable, shareable, citable)

The session is the forge. The factory is the refinery. Stagehand is the stage. The audience sees only the produced artifact, not the raw generation that created it.
[stage.highlight text="The session is the forge. The factory is the refinery. Stagehand is the stage."]
[stage.highlight.off text="The session is the forge. The factory is the refinery. Stagehand is the stage."]

## The One-Line Definition

> Stagehand is a typed narration protocol for synchronizing speech, visuals, and validated state.

Longer:

> Stagehand lets an LLM write a spoken script with embedded visual commands, while deterministic validators route those commands into safe renderers -- a chess board, a civic globe, a semantic video timeline -- without letting prose become truth.

The core invariant:

> The model narrates from state. The model does not write to state.
[stage.highlight text="The model narrates from state. The model does not write to state."]
[stage.highlight.off text="The model narrates from state. The model does not write to state."]

## Practical Artifact -- Stagehand Command Reference

### Core namespaces

| Namespace | Domain | Example |
| --- | --- | --- |
| `map.*` | Geographic / civic | `[map.highlight entity="strait:hormuz"]` |
| `chess.*` | Chess board and broadcast | `[chess.move san="Nf3"]` |
| `svs.*` | Semantic video scene | `[svs.camera target="greenhouse" move="push_in"]` |
| `stage.*` | Generic presentation | `[stage.highlight text="key phrase"]` |
| `doc.*` | Document / chapter highlight | `[doc.highlight section="The Autonomy Ladder"]` |

### Validation pipeline for every command

```
1. Parse command against schema → unknown commands fail here
2. Validate entity references against registry → unregistered entities fail here
3. Check authorization → commands outside agent scope fail here
4. Execute against renderer → render errors are logged, not surfaced to narration
5. Log to public event log → only on successful execution
```

### The split-lane rule

```
Model output stream
    |
    ├─ Narrative prose → TTS → audio track
    ├─ [commands] → schema validator → renderer
    ├─ Entity refs → registry → confirmed or rejected
    ├─ Claims → provenance gate → public log or draft
    └─ Errors / rejected commands → private audit log
```

The lanes never cross. Narration does not become command. Command does not become narration. Both become state only after their respective validators confirm them.

---

## Export

Copy this block into your CLAUDE.md, agent instructions, or project checklist.

**Key line**
> Stagehand gives the model a director's baton, not root access.

**Agent YAML**
```yaml
vcb_chapter: 42
title: "Stagehand: Narrated State Choreography"
key_line: "Stagehand gives the model a director's baton, not root access."
thesis: "The next interface is narrated state: the model speaks, the system routes, the renderer moves, and the validator decides what becomes real."
checklist:
  - item: "Is every command in the stream typed and schema-validated before execution?"
    protects: "against untyped commands reaching renderers with unvalidated inputs"
  - item: "Are entity references validated against a live registry before commands execute?"
    protects: "against narration that names things that do not exist in the ground-truth state"
  - item: "Does the model narrate FROM state rather than writing TO state?"
    protects: "against the model treating its narration as an authoritative source"
  - item: "Are private and public event logs kept separate?"
    protects: "against draft, rejected, or unverified events appearing in public output"
  - item: "Is the narration lane separated from the command lane at parse time?"
    protects: "against prose being treated as executable and commands being spoken as fact"
```

**Portable checklist**
- [ ] Commands are typed and schema-validated before execution -- *protects against unvalidated renderer inputs*
- [ ] Entity references checked against registry -- *protects against narrating nonexistent state*
- [ ] Model narrates from state, does not write to state -- *protects against prose-as-truth*
- [ ] Private events separated from public events -- *protects against unverified claims in public output*
- [ ] Narration and command lanes split at parse time -- *protects against command/prose confusion*
