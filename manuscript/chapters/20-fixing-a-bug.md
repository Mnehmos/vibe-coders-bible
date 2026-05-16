# Chapter 20 - Fixing A Bug

Part: V - AI-Assisted Development Workflows

## Thesis

Bug fixing with AI should begin with reproduction, not patch generation.

## Key line

Never let the agent fix a bug it cannot reproduce.

## Chapter job

Teach a bug workflow that turns failures into durable tests and traceable fixes.

## Main beats

- Reproduction.
- Minimal failing test.
- Root-cause hypothesis.
- Patch.
- Regression test.
- Changelog note.
- Handoff.

## Practical artifact

Deliverable: `BUG_REPRO.md`

Bug loop:

1. Capture observed behavior.
2. Reproduce locally or in a controlled environment.
3. Write the failing test or fixture.
4. Patch the smallest cause.
5. Verify the failure is gone.
6. Keep the regression test.

## Draft notes

Call out the common AI failure: patching around an error message without understanding the cause.
