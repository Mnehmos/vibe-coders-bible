# Chapter 10 - Engineering Controls: Make Invalid Work Fail Automatically

Part: III - The Hierarchy Of AI Controls

## Thesis

Tests, schemas, type systems, linters, CI, and reducers are not bureaucracy. They are reflexes.

## Key line

A reflex is a validation step that fires before the system has to think.

## Chapter job

Show how engineered controls make wrong work fail without requiring perfect human attention.

## Main beats

- Unit tests.
- Integration tests.
- Type checks.
- Schema validation.
- Contract tests.
- Snapshot tests.
- Golden files.
- Sandboxed execution.
- Branch protection.
- Required reviews.
- Reproducible builds.

## Practical artifact

Add an "engineering controls inventory":

| Control | What it catches | Where it runs | Is it required? |
| --- | --- | --- | --- |
| Typecheck | Interface drift | Local and CI | Yes/no |
| Unit tests | Logic regressions | Local and CI | Yes/no |
| Schema validation | Invalid model output | Runtime and tests | Yes/no |
| Lint | Style and simple errors | Local and CI | Yes/no |

## Draft notes

Tie this back to labor economics. AI makes these controls cheaper to create and maintain, so teams should raise the floor.
