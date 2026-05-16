# Chapter 9 - Substitution: Give The AI Safer Tools

Part: III - The Hierarchy Of AI Controls

## Thesis

Replace raw power with typed, narrow tools.

## Key line

Do not give the agent a chainsaw when a socket wrench will do.

## Chapter job

Explain safer substitution: the agent can still act, but through interfaces designed to constrain damage and expose intent.

## Substitution examples

| Unsafe access | Safer substitute |
| --- | --- |
| Raw SQL shell | Migration tool with dry run |
| Raw filesystem access | Project-scoped file tools |
| Raw shell | Task runner with allowlisted commands |
| Raw HTTP calls | Typed API client |
| Freeform JSON | Schema-validated patch |
| Direct UI mutation | Component props or state reducer |

## Main beats

- A narrow tool is not less powerful if it encodes the real job.
- Typed arguments beat prose instructions.
- Dry runs are design features.
- Idempotency is a safety property.
- Logs and traces make tool use reviewable.

## Practical artifact

Add a "tool substitution review" template for replacing one unsafe operation with one safer interface.

## Draft notes

This chapter should connect directly to schemas, tool calls, and agent frameworks later in the book.
