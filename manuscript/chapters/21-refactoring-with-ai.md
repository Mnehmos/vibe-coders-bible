# Chapter 21 - Refactoring With AI

Part: V - AI-Assisted Development Workflows

## Thesis

AI-assisted refactoring has a blast radius proportional to the diff size. Refactors must be reviewed for behavioral change, not just syntactic change.

## Key Line

The safer the test harness, the more aggressive the refactor can be.

## What Refactoring Is And Is Not

A refactor preserves observable behavior while changing internal structure. That definition is precise and the precision matters.

A change that modifies behavior is not a refactor. It is a feature, a bug fix, or a bug introduction wearing a refactor's label. The distinction is not semantic - it determines what verification is required. Behavioral changes need acceptance criteria. Refactors need behavioral equivalence.

The model does not track this boundary on its own. Ask it to refactor a function and it will produce cleaner code. It will also, silently, make choices: rename variables to follow a different convention, change a default value to match a pattern it learned, alter a guard clause to what seems more correct, handle an edge case differently than the original. Each choice looks like an improvement. Each choice may change what the code does.

AI-assisted refactoring is not dangerous because the model is careless. It is dangerous because the model optimizes for clean code, and clean code is not the same as equivalent code.

## The AI's Refactoring Problem

The model generates code that looks refactored. The problem is invisible without testing.

When a person manually refactors, they make explicit, tracked decisions. They rename a variable and know exactly why. They extract a function and know what it contains. The changes are incremental and intentional. The person's mental model updates with each change.

When the model refactors, it transforms the entire function in one generation pass. The output is the result of thousands of small decisions made in parallel, none of them explicitly tracked. The result looks clean. The behavioral delta from the original is not surfaced anywhere.

This is not a reason to avoid AI-assisted refactoring. It is a reason to verify it systematically. The model is fast and good at structural cleanup. The verification step that checks for behavioral equivalence is the human's job.

## The Behavior-Preserving Constraint

Before any refactor, enumerate the observable behaviors the code must preserve.

"Observable behaviors" means: what does this code return for given inputs, what side effects does it produce, what exceptions does it raise and when, what does it do when inputs are at boundary values. Write these down. Write them as tests if they are not already tests.

The list does not have to be exhaustive. It has to be honest. List the behaviors you know about and the edge cases that have historically mattered. The refactor is only complete when all of those behaviors still hold.

This list also defines the scope of verification. A refactor of a pure utility function with well-defined inputs and outputs is verifiable with unit tests. A refactor of a system integration point requires integration tests. The required verification level is a function of the observable behaviors, not of the code's appearance.

## Test Coverage As Prerequisite

You cannot safely refactor code that has no tests. This is not a guideline. It is a structural constraint.

The refactor will produce a green CI run, but the CI cannot tell you whether behavior changed in untested cases. Green tests are evidence of correctness for the tested cases. They say nothing about the rest. A model-generated refactor on untested code gives you cleaner-looking code with an unknown behavioral delta. That is a liability dressed as progress.

The path forward is not to skip the tests and hope. Add tests first. Focus on the observable behaviors that matter most: the happy path, the known edge cases, and any behavior that has produced a bug in the past. These tests define the behavioral contract. Then run the refactor against the tests.

If adding tests before refactoring reveals that the existing code's behavior is not what you assumed, that is not a problem with the process. That is the process finding a latent bug before the refactor hides it deeper.

## Scope Discipline

A refactor that touches 500 lines is not a refactor. It is a rewrite.

Rewrites lose behavioral context. When every function is touched, every variable is renamed, and every control flow path is restructured, the connection between the new code and the known behaviors of the old code is severed. The tests that pass on the new code prove the new code works. They do not prove it is equivalent to the old code, because no one has read both closely enough to confirm the mapping.

Break large refactors into small, independently verifiable steps. Each step has one objective: rename these variables, extract this function, eliminate this duplication, move this module boundary. Each step is verified before the next begins. The test suite must pass at every intermediate point.

The constraint is operational: any intermediate state must be releasable. If a refactor requires a multi-day intermediate state that cannot be shipped, the scope is too large. Break it further.

## Reviewing For Behavioral Change

When reviewing a refactor diff, the question is not "does this look cleaner?" The question is "does this do the same thing?"

The places behavioral changes hide in refactored code are consistent:

**Renamed variables.** A variable renamed from `timeout_ms` to `timeout` may now be used in a context where the unit is assumed. The rename was cosmetic. The bug is semantic.

**Changed defaults.** A function parameter that previously defaulted to `false` now defaults to `true` because the model followed a different pattern. Callers that did not pass the argument now get different behavior.

**Modified guard clauses.** A guard clause that previously returned early on `null` now returns early on `null or undefined`. The behavior change is almost always harmless. In the one case where it matters, it is invisible.

**Altered error handling.** An exception that was previously propagated is now caught and logged. The caller that was handling the exception now never sees it. The error is silently swallowed.

Each of these categories deserves explicit attention in every refactor review. Spend more time on them than on the structural changes the refactor was supposed to make. The structural changes are the easy part. These are where the bugs live.

## The Rewrite Anti-Pattern

Chapter 30 names this: the 500-line diff where every function was renamed and every variable was reorganized. Tests still pass. No one can find the three behavioral bugs.

This is the over-scoped refactor with insufficient verification. It is produced when the model is asked to "clean up this module" or "refactor this to be more readable" without scope constraints. The model does exactly what was asked. The result looks good. The behavioral delta is buried in the diff noise.

The protection is the combination of scope discipline and test coverage. If the diff is large, the scope was wrong. If the tests do not cover the changed behaviors, the verification cannot find the bugs. Both failures compound.

When a refactor diff arrives that is larger than expected, do not review it as written. Ask for it to be split. The split is not bureaucratic overhead - it is the mechanism that makes verification possible.

## Practical Artifact - Refactoring Gate Checklist

| Gate | Action | What It Protects |
| --- | --- | --- |
| Tests exist | Verify test coverage for code being refactored; write missing tests first | Ensures behavioral equivalence can be checked |
| Behaviors enumerated | List observable behaviors the code must preserve | Defines the scope of required verification |
| Scope bounded | Define which files and functions are in scope; document it | Prevents the refactor from becoming a rewrite |
| Steps sized | Break the refactor into independently-verifiable steps | Keeps blast radius manageable |
| Suite passes at each step | Run tests after each intermediate step | Catches regressions immediately |
| Diff reviewed for behavioral change | Explicitly check renamed variables, changed defaults, modified guards, and altered error handling | Finds behavioral changes hiding in structural noise |
| Full suite passes at completion | Run the complete test suite on the final state | Proves equivalence across all tested behaviors |
| Diff size reviewed | If the diff is unexpectedly large, split before merging | Prevents unverifiable rewrites from landing |

**Refactor risk by change type:**

| Change type | Minimum required control |
| --- | --- |
| Rename variable or function | Type checker passes; tests pass |
| Extract function | Focused unit tests on the extracted behavior |
| Change module boundary | Integration tests covering the boundary |
| Change data shape | Schema validation and migration checks |
| Rewrite section | Full behavioral specification and equivalence verification |

---

## Export

Copy this block into your CLAUDE.md, agent instructions, or project checklist.

**Key line**
> The safer the test harness, the more aggressive the refactor can be.

**Agent YAML**
```yaml
vcb_chapter: 21
title: "Refactoring With AI"
key_line: "The safer the test harness, the more aggressive the refactor can be."
thesis: "AI-assisted refactoring has a blast radius proportional to the diff size. Refactors must be reviewed for behavioral change, not just syntactic change."
checklist:
 - item: "Write tests before starting any refactor on untested code"
 protects: "Ensures behavioral equivalence can be verified"
 - item: "Enumerate observable behaviors the refactor must preserve"
 protects: "Defines what verification must cover"
 - item: "Document scope; reject changes outside it"
 protects: "Prevents refactors from becoming rewrites"
 - item: "Break into small, independently-verifiable steps"
 protects: "Keeps blast radius manageable per step"
 - item: "Run the full suite at each intermediate step"
 protects: "Catches regressions before they compound"
 - item: "Explicitly review renamed variables, changed defaults, modified guards, and altered error handling"
 protects: "Finds behavioral changes hiding in structural noise"
 - item: "If the diff is unexpectedly large, split before merging"
 protects: "Prevents unverifiable rewrites from landing"
```

**Portable checklist**
- [ ] Do tests exist for the code being refactored? - *proves behavioral equivalence can be checked*
- [ ] Are the observable behaviors the code must preserve written down? - *defines required verification scope*
- [ ] Is the refactor scope documented as a file and function list? - *prevents scope expansion*
- [ ] Is the refactor broken into steps that each pass the test suite? - *keeps blast radius manageable*
- [ ] Have renamed variables, changed defaults, modified guard clauses, and altered error handling been reviewed explicitly? - *finds behavioral changes hiding in structural noise*
- [ ] Does the full test suite pass on the final state? - *proves equivalence across tested behaviors*
- [ ] If the diff is larger than expected, has it been split? - *prevents unverifiable rewrites from landing*
