# Chapter 28 - Semantic Video Studio: State First, Pixels Second

Part: VI - Case Studies From The Mnehmos Ecosystem

## Lesson

Generated media becomes editable when state is the primary artifact.

## Key line

Pixels are output. State is the product.

## Chapter job

Use Semantic Video Studio to show why generated media needs structured state, provenance, and render gates.

## Patterns

- Four-plane state pack.
- JSON schemas.
- Blender render as downstream artifact.
- Partial regeneration.
- Provenance manifests.
- Basics gate.
- Render output as compiled artifact.
- Semantic patches with base hashes.
- Asset import, normalization, validation, preview, and registration gate.

## Control mapping

| Risk | Control |
| --- | --- |
| Prompt-only media cannot be edited | State pack |
| Broken render | Basics gate |
| Drift between versions | Provenance manifest |
| Full regeneration destroys intent | Partial regeneration |

## Four-plane state

| Plane | Example file | Role |
| --- | --- | --- |
| Scene graph | `scene_graph.json` | Object IDs, transforms, cameras, lights, environment |
| Asset manifest | `asset_manifest.json` | Reusable typed assets with interfaces, capabilities, and anchors |
| Timeline | `timeline.json` | Typed beats and actions over object, camera, and light IDs |
| Render plan | `render_plan.json` | Engine, resolution, FPS, samples, output path, and render settings |

A render is a function of those planes plus renderer code and schemas. That makes the MP4 reproducible, partially regenerable, and auditable.

## Draft notes

This chapter should make the media analogy useful for software engineers: source state beats surface output.
