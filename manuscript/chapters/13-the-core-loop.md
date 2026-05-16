# Chapter 13 - The Core Loop

Part: IV - The Propose / Validate / Commit Loop

## Thesis

Every safe AI-assisted workflow should follow the same shape.

## Key line

Intent becomes real only after validation crosses the commit boundary.

## Core loop

```text
Intent
  -> Proposal
  -> Structured artifact
  -> Validation
  -> Commit
  -> Trace
```

The state-first form makes the machinery explicit:

```text
LLM proposes
State remembers
Validator constrains
Reducer commits
Renderer performs
Trace preserves
```

## Chapter job

Make the loop domain-independent. Code, databases, APIs, content, video, and agent tools all need the same pattern.

## Domain map

| Domain | Proposal | Validator | Commit |
| --- | --- | --- | --- |
| Code | Diff | Tests, types, lint | Git merge |
| Database | Migration | Dry run, backup, schema check | Apply migration |
| API | Contract | Schema and client tests | Release endpoint |
| Content | Draft | Source and provenance review | Publish |
| Video | State pack | Schema and render gate | MP4 export |
| Agent tool | Tool call | Capability policy | Execute |

## System roles

| Role | Function | Failure if absent |
| --- | --- | --- |
| Generator | Produces candidate structures, explanations, commands, edits, or moves | No semantic compression or creative proposal engine |
| State substrate | Stores durable task or world truth | The model must remember everything inside context and drifts |
| Validator | Tests proposals against schemas, rules, sources, units, or proof obligations | Invalid output can become real |
| Reducer | Applies valid transitions deterministically | The same proposal may produce inconsistent consequences |
| Renderer/exporter | Turns committed state into UI, video, narration, PDFs, source cards, or data exports | Display can diverge from truth state |
| Trace | Records accepted and rejected transitions for replay and evaluation | Failures become anecdotes instead of data |

## Practical artifact

Add a one-page core loop checklist for any AI-assisted task.

## Draft notes

This chapter is the hinge between philosophy and field manual. Keep it crisp.
