# Chapter 30 - AI Slop Is Uncontrolled Commit

Part: VII - Failure Modes

## Thesis

Slop is not a quality judgment about the model. It is a structural failure of the workflow. Slop is what happens when AI-generated output crosses the commit boundary without earning the trust that commit implies.

## Key Line

AI slop is what happens when generation crosses the commit boundary without earning trust.

## Defining The Term Without Contempt

"Slop" is a term that can carry contempt. It does not have to.

The contempt version sneers at the generator — at the new builder who does not know what they accepted, at the AI for producing fluent nonsense, at the person who shipped something they did not fully understand.

That version of the word is not useful here.

The structural version is more useful. Slop is a commit failure. It is output that bypassed the verification that would have caught its problems before they became state. It is generation without ownership.

The term is worth keeping because it names a real category that other words miss. "Technical debt" is too neutral — slop is specifically the debt created by AI-generated output that was accepted uncritically. "Bad code" is too general — slop has a specific shape that comes from the properties of generation without verification.

Understanding that shape is more valuable than assigning blame.

## The Shape Of Slop

Slop has recognizable patterns.

**Wrong code that runs.** The output executes without error. The types check. The tests pass — because the tests were also generated and test the wrong thing. The code handles the case that was described. It does not handle the adjacent case that was not. The bug will surface in production, not in review.

**Tests that test nothing.** The test file exists. The coverage number is high. The tests assert that a function returns what it was called with, that a mock returns what the mock was told to return, that a class can be instantiated. None of the tests would fail for any bug that actually matters. The test suite is a confidence indicator, not a safety net.

**Docs that lie.** The README describes the interface as it was when the model read the code. The code has since changed. The README has not. The setup instructions reference a command that no longer exists. The API example uses a parameter that was renamed. The documentation is worse than no documentation because it directs readers toward the wrong thing with official-looking confidence.

**Fake citations.** The report includes references. The references look real — plausible journal names, reasonable author patterns, formats that match academic style. The sources do not exist. Or they exist but do not say what the report claims. The hallucination is not in the argument but in the evidence, which is harder to catch.

**Overbroad abstractions.** The model generalized. It saw two similar functions and produced a generic framework that handles both. The framework has seven parameters and three required type arguments. It solves a problem that did not need solving. The two functions were fine. The framework is now a dependency.

**Security theater.** The code validates input. It checks that the string is not empty, that the number is positive, that the object has the required field. It does not check that the string is not an injection payload, that the number is within a sane range, that the field contains a value the application can actually process. The validation exists. It does not protect anything.

**Refactors that rewrite everything.** The diff is five hundred lines. The behavior is supposed to be the same. The tests still pass. No one can tell where the behavioral changes are because every function was renamed and every variable was reorganized. The refactor introduced three bugs. They will be found eventually.

## The Common Element

Every pattern above shares a structure.

Generation happened. The output looked complete and correct. The commit boundary was crossed. The verification that would have caught the failure did not run, or ran on the wrong thing, or was itself generated without verification.

The failure is not that the model produced something wrong. Models produce wrong things. That is expected.

The failure is that the wrong thing became state without being caught.

## The Ownership Gap

Slop is not just bad output. It is output with an ownership gap.

When a person writes code, they understand it. They may be wrong about whether it is correct, but they have a model of what it does. They can explain it. They can debug it. They can own the decision to ship it.

When a person generates code and accepts it without understanding it, the ownership gap opens. The code exists in the repo. No one fully understands it. No one can explain why it is structured as it is. No one is confident about what it does in edge cases. The person who accepted it cannot debug it without regenerating it.

An ownership gap is a liability. It means the system contains behavior that no person can maintain, explain, or responsibly modify.

That liability compounds. The next engineer builds on the code they do not understand. The next model generates against it. The gap grows.

## The Verification That Was Skipped

For every slop pattern, there is a verification that was skipped or that ran on the wrong thing.

Wrong code that runs: the test that would fail for the actual bug was not written.

Tests that test nothing: the tests were reviewed for existence, not for whether they would catch failures.

Docs that lie: the docs were not compared against the current command, API, or behavior.

Fake citations: the sources were not retrieved and checked.

Overbroad abstractions: the need for generalization was not established before the abstraction was accepted.

Security theater: the validation was not tested against actual attack inputs.

Refactors that rewrite everything: the diff was not reviewed for behavioral change.

The pattern is consistent. Slop is produced when verification is skipped, deferred, or delegated to a process that cannot actually verify the thing that matters.

## Slop Is Not A Beginner Problem

It is tempting to treat slop as a beginner failure mode.

That is wrong.

Experienced engineers produce slop when they are under pressure, when the model output looks convincing, when the review surface is too large, when the tests are green and time is short.

The model that generates plausible, fluent, structurally correct output is harder to review than the model that generates obviously broken output. Confident nonsense is more dangerous than uncertain correctness.

Slop is a workflow failure. The workflow is the line of defense. Inexperienced builders need better workflows. So do experienced ones working at speed.

## Practical Artifact — Slop Detector

Run this before accepting AI-generated output. The questions do not require expert judgment — they require paying attention.

| Question | What it catches |
| --- | --- |
| Is the output specific to this repo, or could it have been generated for any similar project? | Generic output that ignores actual constraints |
| Can every factual claim in the output be verified against a source I can name? | Hallucinated facts, fake citations |
| If this is a test, would it fail before the fix and pass after? | Tests that test nothing |
| If this is documentation, does it match the current command, API, or behavior? | Stale or invented documentation |
| If this is an abstraction, was the need for generalization established before I accepted it? | Premature or unnecessary abstraction |
| If this touches security boundaries, has it been tested against actual invalid inputs? | Security theater |
| Do I understand what this code does well enough to debug it at 2am? | Ownership gap |
| Is someone explicitly accountable for accepting this output? | Diffuse responsibility |

A "no" on any question is a reason to pause before committing. It does not mean the output is wrong. It means the verification has not run yet.

The commit boundary exists to stop wrong things from becoming state.

Run the detector before crossing it.
