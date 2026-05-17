# Chapter 28 - Semantic Video Studio: State First, Pixels Second

Part: VI - Case Studies From The Mnehmos Ecosystem

## Thesis

Generated media has the same problem as generated code: a pixel sequence produced by a prompt is not editable, reproducible, or auditable. The fix is the same — make state the primary artifact, and treat the rendered output as a compiled downstream product.

## Key Line

Pixels are output. State is the product.

## The Generated Media Problem

A prompt produces a video.

The video looks right. Maybe it looks excellent. The problem arrives the moment anyone needs to change it.

Change the lighting in the third scene. Move the camera ten degrees left. Replace the background asset. Adjust the pacing of the fourth beat. Remove the object that appears in frame two.

With prompt-only media, none of these edits have a clean path. The prompt does not remember what it produced. Regenerating it may produce something completely different. There is no partial edit — only full regeneration. Full regeneration destroys intent that was not captured anywhere.

This is not a rendering problem. It is a state problem.

The video is not the product. The prompt that generated it is not the product. A structured description of what the video should contain — the scene, the assets, the timeline, the render settings — is the product. The video is what happens when you compile that description.

Semantic Video Studio is built on that premise.

## The Four-Plane State Pack

The studio represents every scene as a state pack with four distinct planes.

**Scene graph** (`scene_graph.json`): Object IDs, transforms, cameras, lights, and environment parameters. Every element in the 3D world has a stable identifier and a documented spatial position. The camera knows where it is. The lights know their intensities. The objects know their transforms.

**Asset manifest** (`asset_manifest.json`): Reusable typed assets with interfaces, capabilities, and anchors. An asset is not just a file path. It has a defined interface — the anchors where other assets connect to it, the capabilities it exposes, the type contract it satisfies. This makes assets composable and replaceable without breaking the scene.

**Timeline** (`timeline.json`): Typed beats and actions over object IDs, camera IDs, and light IDs. The timeline does not reference pixel positions. It references stable identifiers from the scene graph. A camera move is described as a transition between named camera states, not as raw keyframe data.

**Render plan** (`render_plan.json`): Engine, resolution, FPS, sample count, output path, and render settings. The render plan is the translation between the semantic description of the scene and the specific parameters a renderer needs to produce pixels.

A render is a deterministic function of these four planes plus renderer code and schemas. That makes the resulting MP4 reproducible, partially regenerable, and auditable.

## Why Four Planes

The separation is not arbitrary.

Scene graph and asset manifest are spatial state. They describe what exists and where.

Timeline is temporal state. It describes what changes and when.

Render plan is compilation parameters. It describes how the semantic state becomes pixels.

Keeping these planes separate means each can be edited without touching the others.

Adjusting the lighting means editing the scene graph, not regenerating the timeline. Changing the pacing means editing the timeline, not touching the assets. Swapping a material means updating the asset manifest, not rewriting the render plan.

This is the same principle as separating source code from compiled output. You do not edit the binary to change the program. You edit the source and recompile.

## The Basics Gate

Before a render runs, the state pack passes through a basics gate.

The gate checks structural integrity. Are all object IDs in the timeline present in the scene graph? Do all asset references in the manifest point to registered assets? Are all required fields in the render plan populated? Do the timeline beats reference valid timestamps?

A broken state pack does not reach the renderer. The gate catches contradictions before they become broken renders, wasted compute, or corrupted output files.

This is the same pattern as schema validation for API responses or type checking for function arguments. Invalid input is rejected at the boundary, not discovered after the work is done.

## Partial Regeneration

Full regeneration is the nuclear option.

It destroys any intent that was not captured in the prompt. If the creative decisions that produced the first version were good, full regeneration may not reproduce them. The model does not know what made the first output right.

Semantic Video Studio supports partial regeneration because state is structured.

A section of the timeline can be regenerated without touching the rest. A specific asset can be replaced and re-validated without rewriting the scene graph. A lighting configuration can be updated without altering the timeline beats.

Partial regeneration is possible because the state pack is composed of separable planes with stable references. There are no implicit dependencies that break when one plane changes. The references are explicit, the types are defined, and the schemas enforce that replacements satisfy the same interface.

## Provenance Manifests

Every render operation produces a provenance manifest.

The manifest records: which version of each state plane was used, which assets were resolved and from which source, which renderer version was invoked, the timestamp of the render, and a hash of the inputs.

This answers the question that AI-assisted workflows often cannot answer: what exactly produced this output, and can we reproduce it?

A video that cannot be reproduced is not an asset. It is an artifact of a specific model invocation at a specific time. Provenance manifests convert generated media from unreproducible artifacts into versioned, auditable outputs.

## State First As A General Principle

Semantic Video Studio is a media system. The principle extends beyond media.

Any AI-assisted workflow that produces output by generation needs to answer the same questions:

- What is the state that produced this output?
- Can the output be partially modified without full regeneration?
- Can the output be reproduced from the state?
- What changed between version one and version two?
- Who accepted this state, and when?

These questions are not answerable when the output is the primary artifact.

They are answerable when the state is the primary artifact and the output is compiled from it.

This is the same insight as "the repo is the memory" from Chapter 14. The repo does not store the running process. It stores the state from which the running process can be reproduced. Generated media that cannot be reproduced from a durable state record is not a managed asset. It is a prompt result that happened once.

## Control Mapping

| Risk | Control |
| --- | --- |
| Prompt-only media cannot be edited | Four-plane state pack with stable IDs |
| Broken render from invalid state | Basics gate validates before render |
| Drift between versions | Provenance manifest with input hashes |
| Full regeneration destroys intent | Partial regeneration from separable planes |
| Asset substitution breaks scene | Typed asset interfaces with anchor contracts |
| Output not reproducible | Deterministic render from versioned state planes |

## What This Teaches

Semantic Video Studio brings the book's core pattern into a domain where it is least obvious: generated media.

The pattern is always the same.

Let the model generate. Generate is cheap.

But do not let the generation be the artifact. Make the state the artifact. Make the generation compile from the state. Make the compilation gated. Make the state versioned and auditable.

Pixels produced by a prompt and committed without a state record are like code generated by a model and merged without review. They may be correct. They cannot be owned.

State first means the model proposes a structured description. The system validates it. The renderer compiles it. The manifest records it. The output can be trusted because the path from state to output is documented and reproducible.

Pixels are output.

State is the product.

## Practical Artifact — Generated Media State Audit

| Question | What it protects |
| --- | --- |
| Is the output reproducible from a stored state record? | Prevents one-time-only generation |
| Are elements addressable by stable IDs rather than pixel positions? | Enables partial regeneration |
| Does a validation gate run before the render? | Catches broken state before wasted compute |
| Is there a provenance manifest linking inputs to output? | Enables audit and version comparison |
| Can a single plane be edited without touching the others? | Supports surgical edits without full regeneration |
| Are asset interfaces typed so substitutions can be validated? | Prevents asset swaps from breaking scenes |
| Does the render plan separate semantic intent from renderer parameters? | Makes renderer swaps possible without state changes |

Use this audit when building any AI-assisted workflow that produces media, documents, configurations, or other compiled artifacts. If the answer to most questions is no, the output is ungovernable.
