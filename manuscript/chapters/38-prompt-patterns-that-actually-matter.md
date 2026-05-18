# Chapter 38 - Prompt Patterns That Actually Matter

Part: VIII - The Field Manual

## Thesis

Most prompt engineering advice optimizes the wrong variable. The patterns that matter are the ones that produce artifacts the system can verify -- not the ones that make the model sound more confident.

## Key Line

Prompts matter when they produce artifacts the system can verify.

## Why Most Prompt Advice Is PPE Theater

The model does not respond to encouragement.

"Think step by step" changes the output format. "You are a senior engineer" shifts the register. "Be careful and double-check" adds verbosity. None of these change whether the output is correct. They change how the output feels to read.

Patterns that constrain the output space are different. They limit what the model can generate in ways that make specific failures impossible or immediately visible. These patterns work because they connect generation to verification, not because they motivate the model.

Every pattern below produces an artifact. The artifact has a validator. If the validator does not exist, the pattern is missing its other half.

## Pattern 1 -- Plan Before Patch

Ask the model to describe the approach before writing any code.

"Before implementing, describe: which files will change, what each change is, and what could go wrong."

The output is a plan. The plan is reviewable in seconds. If the plan is wrong -- wrong files, wrong approach, wrong scope -- the correction happens before the code is written.

The plan also surfaces assumptions. "This assumes the user is already authenticated" is a sentence in a plan. In code, it is an invisible state assumption (Ch 31). In the plan, it is catchable.

## Pattern 2 -- Test Before Implementation

Ask for the test before the code.

"Write the test for the intended behavior. Do not write the implementation yet. The test should fail if run against an empty implementation."

The test is the specification. The model cannot generate a test that passes on no implementation without writing a tautology. When the test fails, it fails for the right reason. When the implementation passes the test, the specification is met.

This pattern forces the model to express the acceptance criterion before generating the mechanism. That is the test-first discipline from Ch 15, applied as a prompt pattern.

## Pattern 3 -- Negative Fixtures

Ask for test cases that should fail, not just cases that should succeed.

"Generate five input cases that this function should reject or handle as errors. Then generate the test assertions for those cases."

The model naturally generates the happy path. Negative fixtures force it to reason about the boundary conditions -- empty input, malformed data, out-of-range values, concurrent modification. These are the cases that break systems in production.

Negative fixtures are especially valuable for security-touching code. What should the validator reject? What should the authentication middleware block? The model generates a threat model as a set of failing test cases.

## Pattern 4 -- Explain Diff Risk

After generating a change, ask for its risk profile before committing.

"Given this diff, what could go wrong? What tests would catch each failure? Which failures would not be caught by the existing tests?"

The output is a risk summary. It is reviewable. It produces a gap list: failures that the test suite does not currently cover. The gap list is actionable -- either add the missing tests, or explicitly accept the uncovered risk and document it.

This pattern uses the model's generation capability against itself. The same model that generated the change can also reason about the change's failure modes. That reasoning is faster than a human working through the same question from scratch.

## Pattern 5 -- Observable Markers

Ask the model to insert visible markers into prototype code so that human reviewers can identify what changed during a demo or playtest.

"Add code markers to every change you make in this session. For UI changes, add a visible test badge (colored border, console log, or overlay label). For logic changes, add a comment marker `// VCB-MARKER: [what was changed]`. I will tell you when to remove them."

**Worked example.** A prototype adds a new user authentication flow. The session produces three changes: a new login form component, a modified API route, and updated session handling. Without markers, a reviewer watching a demo recording sees a working flow and must read the diff to understand what is new. With markers:

- The login form has a yellow border: `style={{ outline: '3px solid #f59e0b' }}` and a console log: `console.log('[VCB-MARKER] New login form rendered')`
- The API route has a comment: `// VCB-MARKER: Added rate limiting -- test with 10 rapid requests`
- The session handler has a comment: `// VCB-MARKER: Changed token expiry from 24h to 1h`

During the playtest, the yellow border is visible in the screen recording. The reviewer knows exactly which UI element is new. The console log confirms when it renders. The comments tell the next agent what to verify and what to remove.

When the behavior passes validation, the agent sweeps the markers in one targeted pass: "Remove all VCB-MARKER comments and test style overrides. List each removal before making it."

The markers serve the Propose stage. Their removal closes the Validate stage. The clean commit is the Commit stage.

**Why this works.** The marker pattern makes AI-generated changes visible to humans who were not in the session. A video of a demo with no markers shows behavior. A video with markers shows exactly which behavior came from this session's changes. That distinction is the difference between "it works" and "I verified what we built."

## Pattern 6 -- Rollback Plan

Before any deployment-touching change, ask for the rollback procedure.

"Given this change, describe the rollback procedure: what command or action would undo this if it causes a problem in production?"

If the model cannot produce a rollback procedure, the change does not have one. That is the answer you needed before deploying.

The rollback plan becomes part of the PR description. It is reviewed alongside the code. It is the deployment team's instructions if something goes wrong.

## Pattern 7 -- Minimal Change

State the smallest acceptable change before asking for the implementation.

"Make the minimal change necessary to satisfy this requirement. Do not refactor adjacent code. Do not rename variables that are not directly involved. If you see something that could be improved nearby, note it in a comment but do not change it."

Without this constraint, the model refactors what it touches. The refactoring is often reasonable but untested and outside the scope of the current change. The minimal-change constraint keeps the diff reviewable and the blast radius small.

## Pattern 8 -- Write Handoff

At the end of a session, ask the model to write the handoff file.

"Write the handoff file for this session in the format: current state, what was done, what was decided and why, what was deferred, open questions, next step."

The model has the session in its context. It can produce a complete handoff from that context faster and more completely than a human writing from memory after the session ends.

The human verifies the handoff against their own recollection. Discrepancies are flagged. The verified handoff is committed. The next session starts with a briefing instead of a blank slate.

## The Pattern Table

| Pattern | Produces | Validator | When to use |
| --- | --- | --- | --- |
| Plan before patch | Change plan with risk list | Human review | Before any multi-file change |
| Test before implementation | Failing test | Run the test suite | All feature implementations |
| Negative fixtures | Edge case tests | Regression suite | Security, validation, parsing |
| Explain diff risk | Risk summary and gap list | Human review + test suite | Before merging complex changes |
| Observable markers | Visible in-code markers | Human watching demo/playtest | All prototype and demo sessions |
| Rollback plan | Rollback procedure | Operator review | All deployment-touching changes |
| Minimal change | Scoped diff | Diff review | All sessions in production codebases |
| Write handoff | Agent handoff file | Human verification | Every session end |

## Practical Artifact -- Prompt Pattern Reference Card

Copy one of these patterns verbatim into your session to activate it.

```
PLAN BEFORE PATCH:
"Before writing any code, describe: which files will change, what each change is, and what could go wrong."

TEST BEFORE IMPLEMENTATION:
"Write the test for this behavior first. Do not implement yet. The test must fail against an empty implementation."

OBSERVABLE MARKERS:
"Add a VCB-MARKER comment to every change. For UI, add a visible yellow border. I will tell you when to remove them."

EXPLAIN DIFF RISK:
"Given this change, what could go wrong? What tests catch each failure? What failures are not currently tested?"

ROLLBACK PLAN:
"Describe the rollback procedure for this change before we proceed."

MINIMAL CHANGE:
"Make the smallest change that satisfies the requirement. Note but do not fix adjacent issues."

WRITE HANDOFF:
"Write the handoff file: current state, what was done, decisions and why, deferred work, open questions, next step."
```

---

## Export

Copy this block into your CLAUDE.md, agent instructions, or project checklist.

**Key line**
> Prompts matter when they produce artifacts the system can verify.

**Agent YAML**
```yaml
vcb_chapter: 38
title: "Prompt Patterns That Actually Matter"
key_line: "Prompts matter when they produce artifacts the system can verify."
thesis: "The prompt patterns that matter produce artifacts the system can verify, not artifacts that sound confident."
checklist:
  - item: "Ask for a plan before any multi-file change"
    protects: "against wrong-scope implementations that are expensive to reverse"
  - item: "Ask for the test before the implementation"
    protects: "against implementations without verifiable acceptance criteria"
  - item: "Ask for negative fixtures for any validation or security-touching code"
    protects: "against boundary conditions that break in production"
  - item: "Add observable markers to prototype changes, remove when validated"
    protects: "against invisible AI changes that cannot be reviewed in demos"
  - item: "Ask for a rollback plan before deployment-touching changes"
    protects: "against unrecoverable production deployments"
  - item: "Request a handoff file at the end of every session"
    protects: "against context loss between sessions"
```

**Portable checklist**
- [ ] Plan requested before multi-file changes? -- *protects against wrong-scope implementations*
- [ ] Test written before implementation? -- *protects against code without acceptance criteria*
- [ ] Negative fixtures generated for validation code? -- *protects against boundary failures in production*
- [ ] Observable markers added for demo/playtest review? -- *protects against invisible AI changes*
- [ ] Rollback plan written for deployment changes? -- *protects against unrecoverable deployments*
- [ ] Handoff file written at session end? -- *protects against context loss*
