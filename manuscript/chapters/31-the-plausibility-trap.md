# Chapter 31 - The Plausibility Trap

Part: VII - Failure Modes

## Thesis

The most dangerous AI output is not obviously bad. It is almost right. It is fluent, structured, and coherent. It reads like the work of someone who understood the problem. The failure is invisible until the system is running in conditions the model did not anticipate.

## Key Line

Plausible is not the same as true.

## Why Almost Right Is Worse Than Obviously Wrong

Obviously wrong output is caught immediately.

The model returns a Python syntax error in a JavaScript file. It uses a function that does not exist in the imported library. It references a variable that is clearly out of scope. The reviewer catches it in thirty seconds.

Almost right output survives review.

The function exists in the library — but in a different major version. The variable name is correct — but it shadows a different variable with a different meaning. The logic is right for the case that was described — but silently wrong for the case that was not. The SQL query returns rows — but not the rows the caller expected, because the join condition is subtly off.

Almost right output has enough surface coherence to pass a casual review. It fails when the edge case hits, when the load increases, when the input takes a shape the model did not see in its training data.

The plausibility trap is the gap between "looks correct" and "is correct." It is the space where unverified AI output lives.

## Imaginary APIs

The model hallucinates function names that sound right.

`fs.readAll()` instead of `fs.readFile()`. `str.toSnakeCase()` instead of a utility that has to be imported. `response.getJson()` instead of `response.json()`. The hallucinated name follows the naming conventions of the library. It fits syntactically. It is the function a well-designed library would have.

It does not exist.

The error surfaces at runtime, not at review. A static analysis tool that checks against the actual type definitions would catch it. The reviewer who skimmed the code because the rest looked fine did not.

Imaginary APIs are plausible because the model learned naming patterns. The pattern is right. The specific name is invented.

## Version Drift

The model's knowledge has a cutoff. Libraries change.

The model suggests an approach using an API that was deprecated two major versions ago. The approach is correct for version 3. The project is on version 5. The suggested method exists but behaves differently. Or it does not exist at all.

The suggested configuration key was renamed. The import path changed. The callback was replaced by a promise. The CLI flag was removed.

Version drift is plausible because the old API was real. The model is not hallucinating — it is describing something that existed. The problem is temporal, not factual.

Checking generated code against the installed version of a dependency is not optional. The model cannot know which version is running.

## Confident Summaries

The model summarizes a diff, a document, or a conversation.

The summary is fluent and well-organized. It hits the key points. It reads like a careful human summary. The reader accepts it because summaries from careful humans usually are accurate.

The model omitted the exception. It paraphrased the condition in a way that changes its meaning. It described the conclusion without capturing the constraint that makes the conclusion conditional. It left out the risk that was mentioned once in a subordinate clause.

Confident summaries are plausible because the model is good at summary. The failure is not in fluency but in selective omission and paraphrase-as-distortion. The model does not know which details are load-bearing. It optimizes for readable synthesis, not for preserving the constraints that matter.

Never substitute a summary for the source when the constraint matters.

## Misread Errors

The model reads an error message and explains what caused it.

The explanation is authoritative. It names a root cause. It proposes a fix. The fix addresses the named cause. The named cause is wrong.

The error was a symptom of a different underlying issue. The model saw the error string, matched it to a common pattern in its training data, and produced the explanation that fits the common pattern. The actual error is less common.

The fix is applied. The error message changes or disappears. A different symptom appears. Or the fix introduces a new problem. Or the actual issue persists in a harder-to-detect form.

Misread errors are plausible because the error message often does match common patterns. The model is usually right. When it is wrong, the confident explanation is harder to question than the original error.

## Partial Fixes

The model fixes the test case that was provided.

The fix is correct for the input in the test. It fails for the input that was not tested. The model addressed the symptom that was visible — the specific failing assertion — not the underlying logic failure that produces the failure.

Partial fixes are plausible because the failing test now passes. Green tests feel like evidence of correctness. They are evidence that the specific tested behavior is currently correct. They say nothing about the behavior that was not tested.

A partial fix that closes the issue without fixing the bug is worse than no fix. The issue is closed. The bug is still there. The next person will find it in production.

## Hidden State Assumptions

The model writes code that assumes a state that is not always true.

The function assumes the user is authenticated. The query assumes the database connection is open. The parser assumes the input is well-formed. The cache lookup assumes the key exists. None of these assumptions are checked.

The assumptions are almost always true in the context where the code was demonstrated. They are not always true in the context where the code will run.

Hidden state assumptions are plausible because they are often true. They become bugs when they are not.

## Polished Explanations Masking Wrong Code

The model explains what the code does before presenting the code.

The explanation is clear. It builds intuition. It describes the approach correctly. The reader now has a model of what the code should do. The code is presented. The code has a bug.

The reader's mental model, built from the correct explanation, filters the reading of the code. The bug is in a place where the explanation said the code would be right. The reviewer's attention skips over it because they are pattern-matching against the explanation, not reading the code.

The explanation is not wrong. The code is wrong. The explanation created a lens that made the code harder to read correctly.

When reviewing AI-generated code, read the code before reading the explanation.

## Training The Review Muscle

The plausibility trap cannot be avoided by reading more carefully. Plausible output was designed — accidentally, by the structure of generation — to pass casual reading.

The defense is a review habit that forces engagement with failure modes, not just surface coherence.

For any AI-generated change: before accepting it, ask what ways it could be wrong while still looking correct. Then name the validator that would catch each one.

This is not paranoia. It is the same discipline a senior engineer applies when reviewing a junior's PR. The senior does not assume malice or incompetence. They assume the confident, plausible change may have a blind spot. They look for the blind spot before merging.

The model is not a junior engineer. It is a senior engineer who has never run the code in production and does not know the constraints the production system has learned the hard way.

## Practical Artifact — Plausibility Trap Review

Run this before accepting any AI-generated change that will cross a commit boundary.

**Step 1.** List three ways this change could be wrong while still looking correct.

Write them down. Do not just think them. Writing forces specificity.

Examples to prompt thinking:
- What version assumptions does this make?
- What state assumptions does this make?
- What input shapes was this not written for?
- What edge case is not covered by the visible tests?
- What does the confident explanation distract from?

**Step 2.** Name the validator that would catch each failure mode.

| Failure mode | Validator | Status |
| --- | --- | --- |
| (e.g. Uses deprecated API from v3) | (e.g. TypeScript + @types/libname at installed version) | Run / Not run |
| (e.g. Assumes user is authenticated) | (e.g. Auth middleware test with unauthenticated request) | Run / Not run |
| (e.g. Correct for the described case, wrong for empty input) | (e.g. Test with empty input fixture) | Run / Not run |

**Step 3.** Run the validators that have not been run.

If no validator exists for a failure mode, decide: is the risk acceptable, or should a validator be written before the change is accepted?

The review prompt is not a checklist. It is a forcing function for asking "what would have to be true for this to be wrong" before the commit rather than after the incident.
