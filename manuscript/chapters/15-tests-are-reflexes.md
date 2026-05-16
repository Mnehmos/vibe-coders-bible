# Chapter 15 - Tests Are Reflexes

Part: IV - The Propose / Validate / Commit Loop

## Thesis

Tests are not only correctness checks. In AI-assisted development, tests are memory, contract, and safety rail.

## Key line

Every bug fixed without a test is a lesson the agent can forget.

## Chapter job

Reframe tests as reflexes that make verification affordable and repeatable.

## Main beats

- Regression tests.
- Negative fixtures.
- Golden tests.
- Smoke tests.
- The basics gate pattern from Semantic Video Studio.
- Test-first prompts.
- Writing tests after bug discovery.
- Coverage as institutional memory.

## Practical artifact

Add a "bug to regression test" worksheet:

1. Reproduce the bug.
2. Capture the failing condition.
3. Write the narrow test.
4. Confirm it fails before the fix.
5. Implement the patch.
6. Confirm the test passes.
7. Add the test to the normal validation path.

## Draft notes

Warn specifically about AI-generated tests that mock away the bug or pass before the fix.
