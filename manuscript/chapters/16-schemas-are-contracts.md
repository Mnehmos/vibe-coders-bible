# Chapter 16 - Schemas Are Contracts

Part: IV - The Propose / Validate / Commit Loop

## Thesis

The more model output becomes machine-actionable, the more schemas matter.

## Key line

A schema is a boundary the model cannot argue with.

## Chapter job

Make schemas feel practical, not ceremonial. A schema is how a system rejects malformed intent before it becomes state.

## Main beats

- JSON Schema.
- Zod.
- TypeScript types.
- OpenAPI.
- Database schemas.
- Event schemas.
- Patch schemas.
- Tool schemas.
- Schema drift.

## Case hooks

- Clio Stagehand commands.
- Semantic Video Studio state packs.
- Trace MCP schema mismatch detection.
- RPG-MCP action routing.

## Practical artifact

Add a "schema boundary checklist":

- What is the source of truth?
- What output crosses the boundary?
- What fields are required?
- What values are enumerated?
- What is rejected?
- Where is validation run?

## Draft notes

This chapter should connect directly to mixed model output and safer tools.
