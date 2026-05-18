# Chapter 40 - Definition Of Done For AI-Assisted Work

Part: VIII - The Field Manual

## Thesis

Done is not a feeling. It is a state the system can verify. For AI-assisted work, done means the change is built, verified, documented, understood, and recoverable -- in that order.

## Key Line

Done means owned, tested, understood, and recoverable. Not just passing.

## Why "Tests Pass" Is Not Done

The test suite passing is necessary. It is not sufficient.

A test suite that tests the wrong thing passes on wrong code. Documentation that describes the old behavior passes no test but misleads the next person. A change no one can explain may be correct -- but it cannot be maintained or debugged when it is not.

"Done" in AI-assisted development requires more than green CI because the failure modes of AI generation go beyond the failure modes of human coding. Plausible-but-wrong output (Ch 31) passes review. Tests that test the wrong thing (Ch 15) pass CI. Documentation drafted by a model may be accurate for the code as of one hour ago and incorrect for the code as it exists now.

Done requires a standard that covers all of these.

## The Five Conditions

### 1. Built

The code builds without errors. All imports resolve. The type check passes. No syntax errors, no unresolved references, no compilation failures.

This is the floor. If the code does not build, nothing else matters.

### 2. Tested

The new behavior is covered by tests that would fail without it.

Two parts to this condition. First: tests exist for the new behavior. Second: those tests would fail against an empty or incorrect implementation -- they are not tautologies (Ch 15).

Negative cases are tested where they matter: validation logic, authentication, data processing, error handling. The test that only covers the happy path is a partial test.

If the change fixes a bug, a regression test is committed alongside the fix. The regression test fails on the unfixed code and passes on the fixed code.

### 3. Documented

Any change that affects a public interface, a CLI command, a configuration option, or a developer-facing behavior has updated documentation.

The documentation reflects the current behavior, not the behavior as of the previous version. Setup instructions have been run. API examples have been executed. Default values have been verified against the running code.

If the model drafted the documentation, the documentation has been verified by a human against the actual current behavior.

### 4. Understood

The person committing the change can explain: what it does, why it is structured the way it is, and what would happen if the change were reverted.

This is the ownership requirement. A change that is committed without being understood is committed with an ownership gap (Ch 30). The ownership gap compounds: the next person builds on code they do not understand either.

"I ran the tests and they pass" is not understanding. Understanding is: "This function does X because Y, and the test at line 42 would catch it if that changed."

If the change cannot be explained, it is not done. Ask the model to explain it. Verify the explanation against the code. If the explanation and the code diverge, the change needs more review.

### 5. Recoverable

If this change causes a problem, there is a path to undo it.

For code changes on a branch: the rollback is a git revert or a branch deletion. The path exists.

For database migrations: the migration is reversible. The down migration has been tested.

For deployments: the rollback procedure is documented. The previous version is tagged. The procedure has been tested -- at minimum, in staging.

For feature flags: the flag can be turned off without a deploy. The state of the system with the flag off is understood.

A change that cannot be undone is not done. It is a commitment with no exit.

## The Observable Markers Condition

For sessions that used the Observable Markers pattern (Ch 38): the markers have been removed.

No `VCB-MARKER` comment remains in the committed code. No test borders, no overlay labels, no prototype console logs. The markers served their purpose during the Validate stage. They must not cross the commit boundary.

Done includes: the sweep was run, the sweep was verified, the clean version was reviewed.

## The Handoff Condition

If the session is ending -- whether or not the work is complete -- the handoff file has been written and committed.

If the work is complete: the handoff documents what was built and what comes next.

If the work is not complete: the handoff documents what was done, what remains, why it was stopped here, and the next step.

The session can end without the work being done. The session cannot end without the handoff being written.

## The Definition Of Done Checklist

Apply this before any commit that claims a unit of work is complete.

```
Built
- [ ] Code builds without errors
- [ ] Type check passes with no new errors
- [ ] No unresolved imports or references

Tested
- [ ] New behavior is covered by tests
- [ ] Those tests fail without the change
- [ ] Negative cases are tested where relevant
- [ ] Bug fixes include a regression test

Documented
- [ ] Public interface changes are reflected in docs
- [ ] Setup instructions verified by running them
- [ ] Model-drafted docs verified against current behavior

Understood
- [ ] I can explain what this code does
- [ ] I can explain why it is structured this way
- [ ] I can explain what would happen if it were reverted

Recoverable
- [ ] Rollback path is identified
- [ ] For migrations: down migration is tested
- [ ] For deploys: rollback procedure is documented

Clean
- [ ] Observable markers removed and sweep verified
- [ ] No secrets or credentials in the diff
- [ ] Handoff file written and committed
```

## Provisional Done

Not every unit of work can satisfy all five conditions before it must move.

In a prototype or spike: tests may be deferred. The decision to defer must be documented: which conditions were deferred, why, and what the plan is to satisfy them before the code goes to production.

Provisional done is explicit. It is not "we'll get to it later." It is: "tests are deferred, documented in issue #87, must be closed before merge to main."

Undocumented deferrals are not provisional done. They are ownership gaps with a green CI indicator.

## Closing The Loop

The definition of done is the final gate in the Propose -- Validate -- Commit loop (Ch 13).

The loop started with a proposal. The proposal was validated by controls, review, and the markers pattern. The definition of done is the structured check that the validation was complete before the commit crosses the boundary.

Done is not what the model declares. Done is what the system, the tests, and the reviewer confirm.

## Practical Artifact -- Definition Of Done Card

Post this where the team can see it. Review it before every commit.

| Condition | Check | Done when |
| --- | --- | --- |
| Built | Build and type check pass | No errors, no unresolved references |
| Tested | Tests cover new behavior, fail without it | Green and meaningful, not just green |
| Documented | Docs match current behavior | Verified by running, not by reading |
| Understood | Can explain what, why, and what-if-reverted | Not just "the tests pass" |
| Recoverable | Rollback path exists and is documented | Tested in staging for deploys |
| Clean | Markers removed, no secrets, handoff written | Sweep verified before merge |

---

## Export

Copy this block into your CLAUDE.md, agent instructions, or project checklist.

**Key line**
> Done means owned, tested, understood, and recoverable. Not just passing.

**Agent YAML**
```yaml
vcb_chapter: 40
title: "Definition Of Done For AI-Assisted Work"
key_line: "Done means owned, tested, understood, and recoverable. Not just passing."
thesis: "Done is a verifiable state, not a feeling. For AI-assisted work it requires five conditions: built, tested, documented, understood, and recoverable."
checklist:
  - item: "Code builds and type check passes"
    protects: "against syntax errors and broken imports reaching committed code"
  - item: "New behavior is covered by tests that fail without the change"
    protects: "against green CI that does not verify the actual new behavior"
  - item: "Docs verified against current behavior, not drafted and accepted"
    protects: "against AI-generated documentation that describes old or incorrect behavior"
  - item: "Reviewer can explain what the code does and why"
    protects: "against ownership gaps that make future bugs unmaintainable"
  - item: "Rollback path is documented and tested"
    protects: "against unrecoverable deployments and irreversible state changes"
  - item: "Observable markers swept and handoff file committed"
    protects: "against prototype artifacts in production and context loss between sessions"
```

**Portable checklist**
- [ ] Code builds, type check passes -- *protects against broken imports in committed code*
- [ ] Tests cover new behavior AND fail without it -- *protects against meaningless green CI*
- [ ] Negative cases tested where relevant -- *protects against happy-path-only coverage*
- [ ] Bug fixes include regression test -- *protects against recurrence of fixed bugs*
- [ ] Docs verified by running, not by reading -- *protects against stale AI-drafted documentation*
- [ ] Can explain what it does, why, and what-if-reverted -- *protects against unowned commits*
- [ ] Rollback path documented and tested -- *protects against unrecoverable deployments*
- [ ] Observable markers swept -- *protects against prototype markers in production*
- [ ] Handoff file committed -- *protects against context loss at session end*
