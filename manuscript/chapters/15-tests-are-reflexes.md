# Chapter 15 - Tests Are Reflexes

Part: IV - The Propose / Validate / Commit Loop

## Thesis

A test is a commitment about behavior. In AI-assisted development, tests are also the only reflexes that fire when the model re-introduces a bug the team already fixed.

## Key Line

Every bug fixed without a test is a lesson the next agent can forget.

## What A Test Commits To

A test makes a claim.

It says: given this input, this function produces this output. Given this request, this endpoint returns this response. Given this state, this component renders this way. The claim is precise, machine-executable, and permanent. If the claim is violated, the test fails. The failure is a signal.

This is a commitment in the same sense that a git commit is a commitment. The developer who writes a test is declaring: this is what correct behavior looks like for this case. The test enforces that declaration against every future change.

That is why tests are not documentation and not optional. They are executable specifications. When the model modifies code, the tests run. The model does not know whether its changes are correct - it generates plausible output. The tests know. The tests fire.

In AI-assisted development, this matters more than it does in purely human development. A human developer who wrote code two weeks ago has contextual memory of it. They notice when a change breaks something subtle. A model that generates a refactor has no such memory. It produces plausible output. The tests are the only reliable check that the plausible output is also correct output.

## The Test-First Discipline

Write the test before the implementation.

This is not new advice. In AI-assisted development, it is operationally critical for a specific reason: if you ask the model to write both the test and the implementation at the same time, the test will be written to fit the implementation. The model generates coherent output. Coherent output means the test validates the implementation the model just wrote, not the behavior the developer intended.

The test-first discipline breaks this coupling.

Ask the model to write a test for the intended behavior before writing any code. The test should describe what the function or endpoint must do, using the vocabulary of the requirement, not the vocabulary of any implementation. Then verify that the test fails. No implementation exists yet - the test must fail. A test that passes on empty code is not testing the behavior. It is testing nothing.

The sequence:

1. Write the test for the intended behavior (model can draft, human must verify)
2. Run the test - it should fail (red)
3. Write the implementation (model drafts, human reviews)
4. Run the test - it should pass (green)
5. Refactor if needed, keeping the test green

Step 2 is the one teams skip. Verifying that a new test fails before the implementation exists is the only way to confirm that the test would actually catch a missing or wrong implementation. A test that is never red has never been proven to catch anything.

## Why AI-Generated Tests Fail

The specific failure mode in AI-assisted testing: the model writes tests that pass against the code it just generated, but test the wrong thing.

This is not the model malfunctioning. It is the model doing what it does - generating coherent, internally consistent output. If the model generates a function and then generates tests for that function in the same session, the tests will reflect the model's understanding of what the function does. If the function's behavior is subtly wrong, the tests will be subtly wrong in exactly the same way.

There are three categories of this failure:

**Tests that mock away the bug.** The test mocks the dependency that contains the faulty behavior. The mock returns the expected value. The production code uses the real dependency that returns the wrong value. The test passes. The bug ships.

**Tests that validate mechanics, not behavior.** The test checks that a specific function was called with a specific argument, not that the observable output is correct. The implementation is refactored to call a different function. The mechanic-test fails. The behavior-test would have continued to pass - but it was never written.

**Tests that are tautologies.** The test asserts that the return value equals the function's return value. This always passes. It tests that the language can assign a variable, not that the function is correct.

Each of these is a test that cannot fail for any real bug. A test that cannot fail is not a test. It is a false signal of coverage.

## Verifying Test Quality

The verification step for a test is to try to break it.

After the model generates a test, the developer must confirm that the test is real. The fastest method: delete or comment out the implementation. Run the test. If the test passes on empty code, the test tests nothing. Restore the implementation.

The second method: introduce a known bug into the implementation. Change a conditional, flip a boolean, return the wrong value. Run the test. If the test does not fail, the test does not catch that category of bug. This tells the developer what the test does and does not cover.

These verification steps take minutes. They prevent weeks of debugging bugs that a test claimed to cover.

A question to ask when reviewing any AI-generated test: if I shipped this test with a deliberately wrong implementation, would the test fail? If the answer is uncertain, the test needs revision before it is committed.

## Unit And Integration Tests In AI Workflows

Unit tests and integration tests catch different categories of failure. Both are required in AI-assisted development.

Unit tests catch logic errors in individual functions. When the model generates a function that handles an edge case incorrectly, the unit test for that edge case fails. Unit tests are fast, targeted, and easy to attribute to specific code. They are the first reflex.

Unit tests cannot catch boundary failures. A function that is logically correct but called incorrectly, or that produces output formatted wrong for its consumer, passes unit tests. The logic is correct. The integration is broken.

Integration tests catch this. An integration test exercises multiple components together and verifies that the output at the boundary is correct. When the model generates code that integrates two components, the integration test checks the actual output - not the mocked output, not the unit-level output.

The failure mode AI-assisted development introduces is components that are individually correct and collectively wrong. The model generates each component in isolation. Each passes its unit tests. But the model's assumption about how they connect is incorrect. Integration tests catch this at the boundary before it reaches production.

A practical rule: every interface between components that the model generates should have at least one integration test that exercises the interface end to end. Not a mock. An actual call with actual data flowing through.

## Regression Tests As Memory

A regression test is a promise that a specific bug will never return undetected.

When a bug is found in production, it means a behavior the team considered correct was actually wrong. The fix corrects the behavior. The regression test locks in the correction.

The next time the model generates a refactor of the relevant code, it does not know about the bug. It was not in the session where the bug was fixed. The model's refactor is plausible. It may reintroduce the original behavior. The regression test fires. The refactor is stopped before it ships.

This is the memory function of tests in the clearest form. The test remembers a bug that the model cannot remember. The test makes the system's history of failures an active constraint on future changes.

The bug-to-regression workflow is fixed:

1. Reproduce the bug in a test environment
2. Write the narrowest test that fails exactly when the bug is present
3. Confirm the test fails before the fix is applied
4. Apply the fix
5. Confirm the test passes
6. Commit the test alongside the fix - never separately
7. Confirm CI includes the test in the standard run

Step 3 is the red step. It must not be skipped. A regression test that was written after the fix cannot be confirmed to actually test the bug. It tests the fix. These are not the same thing.

Step 6 is the memory step. The test and the fix belong together in the same commit. A future reader - human or model - can see what the fix was, read the test to understand the bug, and understand both from a single commit.

## The Model's Role

The model is useful in testing. It is not authoritative.

The model can draft test structure from a behavior description. "Write tests for a function that normalizes email addresses. It should lowercase, trim whitespace, and reject addresses without an @ symbol." The model will produce a reasonable starting point. The developer's job is to verify that the tests would actually fail for a function that does not normalize email addresses.

The model can identify test cases. "What edge cases should a test for this function cover?" The model will enumerate plausible edge cases. The developer's job is to select the ones that matter and add the ones the model missed.

The model cannot verify its own tests. A model that generates both a function and tests for it in the same session has not produced independently validated tests. The developer must run the tests against a wrong implementation to confirm they are real.

The model cannot know which tests are missing. It can only generate tests for what it knows about. The bugs that escaped to production did so because something was unknown or underspecified. The model does not know what it does not know. The developer does - or at least the developer has access to the bug tracker, the post-mortems, and the production logs that reveal what was unknown.

Use the model to draft tests faster. Use human judgment to verify that the tests are real.

## Practical Artifact - Test Quality Checklist

Apply this checklist to every batch of tests committed in an AI-assisted session.

| Question | What it protects |
| --- | --- |
| Does the test fail if the implementation is deleted? | Tests that pass on empty code |
| Does the test fail if a known bug is introduced into the implementation? | Tests that cannot catch the category of bug they claim to cover |
| Does the test assert observable output, not implementation mechanics? | Tests that break on refactor but not on behavior change |
| Was the test written before the implementation, or verified against a wrong implementation? | Tests generated after the fix that cannot confirm they test the bug |
| Does the test use real dependencies, or mocks that hide boundary failures? | Integration failures that unit tests cannot see |
| Is the test name a behavior description, not a mechanic description? | Tests whose failure message does not explain what behavior is broken |
| Is this regression test committed alongside the fix in the same commit? | Regression tests separated from their fix, making the connection unreadable |
| Does CI include this test in the standard run? | Tests that exist but do not fire on every commit |

The second column is the failure category the question is designed to catch. A "yes" answer means the test is protecting against that failure. A "no" answer means the failure category is open.

A test suite where every question gets "yes" is a test suite that earns its green status. A test suite where several questions get "no" has green status that means less than it appears.

---

## Export

Copy this block into your CLAUDE.md, agent instructions, or project checklist.

**Key line**
> Every bug fixed without a test is a lesson the next agent can forget.

**Agent YAML**
```yaml
vcb_chapter: 15
title: "Tests Are Reflexes"
key_line: "Every bug fixed without a test is a lesson the next agent can forget."
thesis: "A test is a commitment about behavior. In AI-assisted development, tests are also the only reflexes that fire when the model re-introduces a bug the team already fixed."
checklist:
 - item: "Test is written before the implementation, or verified against a wrong implementation."
 protects: "AI-generated tests that test the implementation instead of the behavior"
 - item: "Every new test is confirmed to fail before the correct implementation is applied."
 protects: "Tests that were never red and cannot be confirmed to catch real bugs"
 - item: "Integration tests cover every interface between components the model generated."
 protects: "Components that are individually correct and collectively broken"
 - item: "Regression test is committed in the same commit as the bug fix."
 protects: "Bugs that return silently when the model refactors the relevant code"
 - item: "AI-generated tests are verified against a deleted or wrong implementation."
 protects: "Tautological tests that always pass regardless of implementation correctness"
 - item: "Test names describe behavior, not mechanics."
 protects: "Failures that do not explain what behavior is broken"
```

**Portable checklist**
- [ ] Was the test written before the implementation, or verified against a wrong one? - *Protects against tests that confirm the implementation instead of the behavior*
- [ ] Does the test fail when the implementation is deleted? - *Protects against tests that pass on empty code and test nothing*
- [ ] Does the test fail when a known bug is introduced? - *Protects against tests that cannot catch the bugs they claim to cover*
- [ ] Is there an integration test for every AI-generated component interface? - *Protects against components that are individually correct and collectively broken*
- [ ] Is every regression test committed alongside the fix it was written for? - *Protects against bugs that return when the model refactors without context of the fix*
- [ ] Does CI include every new test in its standard run? - *Protects against tests that exist but do not fire automatically*
