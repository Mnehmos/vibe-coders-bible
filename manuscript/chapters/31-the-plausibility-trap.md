# Chapter 31 - The Plausibility Trap

Part: VII - Failure Modes

## Thesis

The most dangerous AI output is not obviously bad. It is almost right.

## Key line

Plausible is not the same as true.

## Chapter job

Train the reader to distrust surface coherence when the evidence is weak.

## Main beats

- Imaginary APIs.
- Version drift.
- Confident summaries.
- Misread errors.
- Partial fixes.
- Hidden state assumptions.
- Silent data loss.
- Polished explanations masking wrong code.

## Practical artifact

Add a plausibility-trap review prompt:

```text
List three ways this change could be wrong while still looking correct.
Name the validator that would catch each one.
```

## Draft notes

Use concrete examples. The chapter should feel like a review muscle being trained.
