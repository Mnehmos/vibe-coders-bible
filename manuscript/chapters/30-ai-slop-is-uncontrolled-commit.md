# Chapter 30 - AI Slop Is Uncontrolled Commit

Part: VII - Failure Modes

## Thesis

Slop is not merely bad output. Slop is output that bypassed taste, validation, and ownership.

## Key line

AI slop is what happens when generation crosses the commit boundary without earning trust.

## Chapter job

Define slop rigorously enough that experienced engineers and new builders can talk about it without contempt.

## Main beats

- Wrong code that runs.
- Tests that test nothing.
- Docs that lie.
- Fake citations.
- Overbroad abstractions.
- Security theater.
- Refactors that rewrite everything.
- Ownership gaps.

## Practical artifact

Add a "slop detector" checklist:

- Is the output specific to the repo?
- Can the claim be verified?
- Does the test prove anything?
- Does the abstraction remove real complexity?
- Does the documentation match behavior?
- Is someone accountable for accepting it?

## Draft notes

This chapter should preserve respect for beginners while refusing low standards.
