# Chapter 20 - Fixing A Bug

Part: V - AI-Assisted Development Workflows

## Thesis

A bug fix from an AI model must include a test that would have caught the bug before the fix. Without that test, the fix is a guess with temporary success.

## Key Line

Never let the agent fix a bug it cannot reproduce.

## Reproduce First

Before asking the model for anything, write a test that reproduces the bug.

The test should fail on the current code. If you cannot write a failing test, you do not understand the bug well enough to fix it. This is not a process gate - it is a diagnostic. The inability to write a failing test means the bug is not yet defined. A model prompt written against an undefined bug produces a plausible fix for the most common interpretation of the symptoms.

The reproduction test does not have to be elegant. It has to be specific: given this input in this state, the system does X when it should do Y. That sentence is the test. Write it as code.

Run the test on the current codebase without any fix applied. It must fail. If it passes, either the bug is not reproducible in the test environment or the test is wrong. Do not proceed to fix generation until the test fails for the right reason.

## The Plausibility Trap For Bugs

The model reads an error message, recognizes a pattern from its training data, and produces the explanation that fits the most common cause.

The explanation is authoritative. It names a root cause. It proposes a fix. The fix addresses the named cause. When the named cause is the actual cause, this is fast and correct. When the actual bug is less common - an interaction between two libraries, a race condition, a state assumption that fails only on specific input - the confident diagnosis is harder to question than the original error message.

The defense is the reproduction test. If the model's diagnosis is correct, applying its fix will make the reproduction test pass. If the reproduction test still fails after the fix, the diagnosis was wrong. The test does not care how authoritative the explanation sounded.

This is covered in depth in Chapter 31. The core rule here is: never accept a diagnosis. Accept a fix that makes the failing test pass.

## Root Cause vs. Symptom

A fix that addresses the symptom leaves the root cause in place.

Ask explicitly for root cause analysis before the fix. The prompt form that works: "What is the underlying reason this error occurs, not just how to suppress it?" This forces the model past the first-order answer - add a null check, catch the exception, return early - to the structural reason the null arrives, the exception is possible, or the early return is needed.

Symptom fixes produce cascading bugs. The null check hides the fact that the upstream function can return null when it should not. The exception catch hides the fact that the operation is being called in an invalid state. The early return hides the fact that the caller should not have reached that code path. Each fix creates a new constraint that future changes must silently respect.

One question to ask before accepting any fix: "If this fix is correct, why did the bug exist? What structural condition made the bug possible?" A fix that cannot answer this question is probably addressing a symptom.

## The Fix Plus Test Pattern

The sequence is fixed. Do not skip steps.

1. Write a failing test that reproduces the bug. Run it. Confirm it fails.
2. Ask the model to fix the bug, providing the reproduction test as context.
3. Apply the fix.
4. Run the reproduction test. It must pass.
5. Run the full test suite. No other test may break.
6. Commit. The test is part of the commit.

The test is not optional and it is not separate from the fix. A fix without its regression test is a promise that the bug is gone. A fix with its regression test is a proof that survives future changes.

Step 5 is non-negotiable. The model's fix will sometimes address the specific failing case by introducing a new failure elsewhere. A fix that breaks a different test is not a fix. Do not merge until the full suite is green.

## When The Fix Is Wrong

The test will tell you.

If the failing test still fails after applying the model's fix, the fix is wrong. This is the engineering control working exactly as designed. It prevents a confident but incorrect fix from reaching the commit boundary.

When this happens, do not ask the model to adjust the fix until you understand why the fix failed. Read the test output. Understand what the fix changed and why that change was not sufficient. Then provide that analysis back to the model as context for a second attempt.

The failure loop - fix applied, test still fails, analyze, retry - is not a sign of a broken process. It is a sign of a working one. The loop terminates when the test passes. Not when the model says it should.

## Post-Fix Review

After the fix is in and the tests pass, review the surrounding code.

One bug is often a symptom of a class of bugs. The null pointer in this function may be possible in three adjacent functions. The race condition in this handler may be possible in every handler that accesses the same resource. The incorrect assumption in this calculation may exist wherever the same formula appears.

The post-fix review is not a code audit. It is a targeted question: where else in this codebase could the same underlying condition exist? Spend ten minutes reading the code around the fixed location. Check for the same pattern. If you find it, fix it now while the context is loaded, or open a tracking issue immediately.

One more step: add a comment to the fix commit or PR explaining the root cause in a sentence. Not what the fix does - what the bug was. Future engineers working in this area will find it. It is the cheapest form of institutional memory.

## Practical Artifact - Bug Fix Checklist

| Gate | Action | What It Protects |
| --- | --- | --- |
| Reproduction test written | Write a test that fails on current code | Proves you understand the bug |
| Test fails before fix | Run the test; confirm it fails for the right reason | Prevents testing the wrong thing |
| Root cause documented | Write one sentence describing why the bug exists | Catches symptom-only fixes |
| Model fix applied | Apply the model's proposed fix | - |
| Reproduction test passes | Run the failing test; confirm it now passes | Proves the fix addresses the bug |
| Full suite passes | Run all tests; confirm no regressions | Prevents the fix from breaking other behavior |
| Test committed with fix | The regression test is in the same commit or PR | Creates permanent protection |
| Surrounding code reviewed | Check adjacent code for the same class of bug | Prevents sibling bugs from surviving |

---

## Export

Copy this block into your CLAUDE.md, agent instructions, or project checklist.

**Key line**
> Never let the agent fix a bug it cannot reproduce.

**Agent YAML**
```yaml
vcb_chapter: 20
title: "Fixing A Bug"
key_line: "Never let the agent fix a bug it cannot reproduce."
thesis: "A bug fix from an AI model must include a test that would have caught the bug before the fix. Without that test, the fix is a guess with temporary success."
checklist:
 - item: "Write a failing test before asking for a fix"
 protects: "Proves you understand the bug before generating a fix"
 - item: "Confirm the test fails before any fix is applied"
 protects: "Prevents testing the wrong condition"
 - item: "Ask for root cause, not symptom suppression"
 protects: "Prevents cascading bugs from hidden structural failures"
 - item: "Verify the reproduction test passes after the fix"
 protects: "Proves the fix addresses the actual bug"
 - item: "Run the full test suite after the fix"
 protects: "Catches regressions introduced by the fix"
 - item: "Commit the regression test with the fix"
 protects: "Creates permanent protection against the same bug"
 - item: "Review adjacent code for the same class of bug"
 protects: "Prevents sibling bugs from surviving in nearby code"
```

**Portable checklist**
- [ ] Is there a failing test that reproduces the bug? - *proves the bug is understood*
- [ ] Does the test fail before any fix is applied? - *prevents testing the wrong thing*
- [ ] Is the root cause documented, not just the symptom? - *catches structural gaps*
- [ ] Does the reproduction test pass after the fix? - *proves the fix works*
- [ ] Does the full test suite pass after the fix? - *catches regressions*
- [ ] Is the regression test committed with the fix? - *creates permanent protection*
- [ ] Has the surrounding code been reviewed for the same class of bug? - *prevents sibling bugs*
