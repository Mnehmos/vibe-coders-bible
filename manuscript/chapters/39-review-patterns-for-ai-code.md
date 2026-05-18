# Chapter 39 - Review Patterns For AI Code

Part: VIII - The Field Manual

## Thesis

AI-generated code fails at plausibility boundaries, not complexity boundaries. Review patterns for AI code target those boundaries -- not the surface coherence the model optimizes for.

## Key Line

Review the system, not the prose.

## Why AI Code Needs Different Review

Human code fails where humans get things wrong: complex algorithms, edge cases they did not think of, interfaces they misunderstood.

AI code fails differently. The implementation is often fluent and well-structured. The function names are good. The comments are clear. The failure is in a place the model did not know was wrong: a deprecated API, a version assumption, a state that is almost always true but sometimes is not. The failure is masked by the confidence of the surrounding code.

A reviewer applying human-code review instincts to AI code will miss these failures. The review asks "is this clear and correct-looking?" The plausibility trap (Ch 31) answers yes, and the bug reaches production.

AI-code review asks: "what would make this wrong while still looking right?" That question requires a different set of lenses.

## Read The Code Before The Explanation

The model often explains what it generated before or alongside the code itself.

The explanation is correct. The explanation describes what the code does. The code has a bug.

The explanation creates a mental model in the reader. The mental model filters the code reading. The bug is in a line where the explanation said the code would be right, so the reviewer's attention skips over it.

Read the code before reading the explanation. Form an independent understanding of what the code does. Then read the explanation. If the explanation matches your reading, the review is coherent. If they diverge, the divergence is where the problem lives.

## The Two-Pass Review

**Pass one -- behavior:** What does this code do? Not what does the model say it does. What does the code actually do when run? Trace the execution path for the main case, then for the empty input, then for the error case.

If you cannot trace the execution for the error case, that is a finding. The error handling is not reviewable.

**Pass two -- failure modes:** For each section of the diff, ask: what would make this wrong while still looking correct? Then name the test that would catch each failure mode. If no test exists for a named failure mode, either add the test or accept the risk and document it.

## Observable Markers Review

When the session used the Observable Markers pattern (Ch 38), the review is guided by the markers themselves.

Every `VCB-MARKER` comment names what was changed and what to test. Every colored UI border marks a new element. The review lane for markers:

1. Find every marker in the diff.
2. For each marker: verify the described change is present and correct.
3. Run or watch the demo with the markers visible. The reviewer sees exactly what the session touched.
4. When satisfied, ask the agent to sweep all markers. Verify the sweep is complete.
5. The clean version is what goes to review.

**Worked example.** A demo recording shows a login flow with a yellow-bordered form component and the console output `[VCB-MARKER] New login form rendered`. The reviewer knows: this form is the change. Everything else in the flow was already passing. The review focuses exclusively on the new form. Adjacent flows do not need re-review. When the form passes, the border is removed and the console log is deleted in a single targeted sweep.

This pattern transforms "review the entire PR" into "review the marked changes." The diff may touch five files. The markers show that only two sections represent new behavior. The other three are plumbing changes that the existing tests cover.

## The Lane Structure

Different types of changes carry different risk profiles. Review each lane separately.

| Lane | The question | What AI gets wrong here |
| --- | --- | --- |
| Diff scope | Does every changed file belong to the stated task? | AI touches adjacent code, adds unrequested refactors |
| Test quality | Would each test fail before the fix and pass after? | AI generates tests that mirror the implementation, not the requirement |
| Security | Did any capability expand, even slightly? | AI adds permissions or opens surfaces it was not asked to touch |
| Version assumptions | Does this code work with the installed library version? | AI describes APIs from its training cutoff, not the installed version |
| State assumptions | Does this code assume state that is not always true? | AI assumes authentication, open connections, or cached values |
| Error paths | Are the error handlers reachable and correct? | AI adds error handling that looks complete but handles wrong conditions |
| Dependencies | Was any new package added and is it justified? | AI adds convenience libraries without weighing the dependency cost |
| Migration | If this touches data, is the migration reversible? | AI generates one-way migrations without rollback paths |

Do not run all lanes on every PR. Match lanes to risk. A CSS change needs Diff scope and maybe UX. A database migration needs all of them.

## The Behavioral Equivalence Test for Refactors

A refactor must preserve observable behavior. That is its definition.

When reviewing a refactor diff, the question is not "is this cleaner?" The question is "does this do the same thing?"

Specific things to check:
- Renamed variables: does the new name have the same type and semantics as the old?
- Changed default values: does the caller chain expect the old default?
- Modified guard clauses: does the new guard reject the same inputs as the old?
- Altered error handling: does the new handler propagate the same error types to callers?
- Restructured control flow: does every path through the new code exist in the old code?

If any of these is unclear from reading the diff, run the old and new versions against the same test suite and compare. If the test suites are not sufficient to surface the difference, the refactor is not yet reviewable.

## What CI Cannot Catch

CI runs the test suite. The test suite catches what it covers.

CI cannot catch:
- Failure modes that no test exercises
- State assumptions that are almost always true in the test environment
- Version drift between what the model generated and what the installed library actually does
- Behavioral changes that happen to produce the same output for all tested inputs
- Observable markers that were supposed to be removed before merge

Human review covers the gaps CI leaves open. The review lanes above are organized around these gaps.

## The Sign-Off Question

Before approving any AI-generated change, answer this question aloud: "If this change causes a production incident, can I explain what happened and why the change was approved?"

If the answer is no, the review is not complete. Something in the change is not understood.

This is not a gatekeeping exercise. It is the ownership test from Ch 30. The reviewer who cannot explain a change cannot own the decision to ship it. The change may be correct -- but correctness that is not understood is not owned.

## Practical Artifact -- Review Lane Checklist

| Lane | Required for | Question |
| --- | --- | --- |
| Diff scope | All changes | Does every changed file belong to this task? |
| Test quality | All changes | Would each test fail before this change and pass after? |
| Observable markers | Sessions using markers | Were all VCB-MARKER annotations removed before review? |
| Security | Any auth, data, or capability change | Did capabilities expand? Did any boundary open? |
| Version assumptions | Any library usage | Does the generated code match the installed library version? |
| State assumptions | Any function with external dependencies | What state does this assume? Is that state always true? |
| Error paths | Any error handling | Are error handlers reachable and do they handle the right conditions? |
| Dependencies | Any new package | Is this package necessary? What is its maintenance status? |
| Migration | Any schema or data change | Is this reversible? Has it been tested on production-sized data? |
| Sign-off | All changes | Can you explain what happened and why you approved it if it fails? |

---

## Export

Copy this block into your CLAUDE.md, agent instructions, or project checklist.

**Key line**
> Review the system, not the prose.

**Agent YAML**
```yaml
vcb_chapter: 39
title: "Review Patterns For AI Code"
key_line: "Review the system, not the prose."
thesis: "AI-generated code fails at plausibility boundaries. Review must target those boundaries, not the surface coherence the model optimizes for."
checklist:
  - item: "Read the code before reading the model's explanation"
    protects: "against explanation-guided review that misses bugs in coherent code"
  - item: "Run the two-pass review: behavior first, then failure modes"
    protects: "against reviews that assess clarity without testing correctness"
  - item: "Verify observable markers were swept before merge"
    protects: "against prototype markers reaching production code"
  - item: "Check version assumptions against installed library versions"
    protects: "against deprecated API usage that passes review but fails at runtime"
  - item: "For refactors: verify behavioral equivalence, not just syntactic change"
    protects: "against refactors that introduce behavioral bugs under clean-looking diffs"
  - item: "Answer the sign-off question before approving"
    protects: "against approving changes that are not understood and therefore not owned"
```

**Portable checklist**
- [ ] Code read before explanation? -- *protects against explanation-filtered review*
- [ ] Behavior traced for main case, empty input, and error case? -- *protects against untested paths*
- [ ] Observable markers swept before this review? -- *protects against prototype artifacts in production*
- [ ] Version assumptions checked against installed library? -- *protects against training-cutoff drift*
- [ ] State assumptions named and verified? -- *protects against almost-always-true failures*
- [ ] For refactors: does every changed guard, default, and error handler match the original? -- *protects against invisible behavioral change*
- [ ] Can you explain this change if it causes an incident? -- *protects against unowned approvals*
