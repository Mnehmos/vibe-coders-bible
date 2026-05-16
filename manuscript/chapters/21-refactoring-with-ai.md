# Chapter 21 - Refactoring With AI

Part: V - AI-Assisted Development Workflows

## Thesis

AI can make refactoring cheaper, but only when the behavior is protected.

## Key line

The safer the test harness, the more aggressive the refactor can be.

## Chapter job

Separate safe refactoring from disguised rewriting.

## Main beats

- Refactor versus rewrite.
- Golden tests.
- Snapshot tests.
- Small steps.
- Semantic-preserving changes.
- Review risks.
- Dead code removal.
- Mechanical changes versus design changes.

## Practical artifact

Add a "refactor risk grid":

| Change type | Required control |
| --- | --- |
| Rename | Typecheck and tests |
| Extract function | Focused unit tests |
| Module boundary change | Integration tests |
| Data shape change | Schema and migration checks |
| Rewrite | Full design and validation plan |

## Draft notes

The chapter should encourage useful refactors while rejecting "rewrite everything" as the default.
