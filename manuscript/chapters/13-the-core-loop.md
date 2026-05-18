# Chapter 13 - The Core Loop

Part: IV - The Propose / Validate / Commit Loop

## Thesis

The vibe-coding workflow has exactly one shape: Propose, Validate, Commit. Every session is an iteration of that loop. Every failure in AI-assisted development traces back to a skipped step.

## Key Line

Intent becomes real only after it crosses the commit boundary.

## The Three Phases

The loop has three phases and no shortcuts.

**Propose.** The model generates a candidate output - code, schema, migration, documentation, test, plan. The proposal is cheap. It costs tokens and time, not judgment. A model that produces a wrong proposal has not caused harm. It has produced a proposal that will not survive validation.

**Validate.** Automated controls fire first. Tests run. The type checker runs. The linter runs. Schema validators run. What passes automated controls then reaches human review. The human is not reading raw model output. The human is reviewing output that has already survived the machine checks. Judgment lives in validation, not in the proposal.

**Commit.** The verified output crosses the boundary and becomes state. A commit is not a checkpoint. It is an explicit act of ownership. The developer who commits is saying: "I accept this output as correct." That statement has weight. It should feel like weight.

The loop does not end. After a commit, the next feature, bug, or refactor starts a new iteration. The loop is the workflow.

## Propose

The proposal phase is the only phase where the model operates without constraint on output.

That is not a flaw. It is the point. The model generates broadly because broad generation is cheap to produce and cheap to filter. A model that generates three candidate implementations allows a developer to pick the best one. A model that generates one cautious implementation has already made a judgment call the developer did not authorize.

Proposals are not decisions. A file full of model-generated code sitting in a branch is not a software change. It is a collection of proposals waiting for validation. Treat them that way.

The failure mode in the proposal phase is not bad output. It is treating proposals as decisions. A developer who reads model output, nods approvingly, and commits without running tests has confused Propose with Commit. The loop collapsed.

Keep proposals small. A proposal that covers one function, one endpoint, one migration, or one behavior unit is verifiable. A proposal that covers thirty files is a project, not a proposal.

## Validate

Validation has two layers. Both are required.

The first layer is automated. Tests, type checks, schema validation, lint rules - every engineering control defined in Chapter 10 belongs here. These controls fire before a human reads a line of the diff. They do not get tired. They do not grant exceptions because the deadline is close. They fire, and they either pass or fail.

The second layer is human review. The human reviews what passed automated controls. This is the correct framing. The human is not a backup to automation. The human is a second filter that runs on output automation already approved. That sequence matters. A human reviewing output that has already passed tests, types, and schema validation is doing higher-order work: checking intent, checking architecture, checking whether the code does what the commit message claims.

These two layers are not interchangeable. Running human review without automated controls first means the human is doing automation's job on top of their own. Running automated controls without human review means intent is never checked. Both are required.

The output of a successful validation is permission to commit. Not confidence, not certainty - permission. The controls passed. The human is satisfied. The output may proceed.

## Commit

The commit is not a save point. It is a statement.

When a developer runs `git commit`, they are declaring that the staged changes are correct, verified, and ready to become part of the project's permanent record. That is a strong claim. It should be made deliberately.

Commit discipline in AI-assisted development is specific. The commit message explains why this change was made, not just what the diff contains. The message is written for the model that will read `git log` in the next session and need to understand the constraint that produced the decision.

Small commits are easier to verify, easier to revert, and easier to understand. A commit that covers one logical change allows a future reader to understand one decision. A commit that covers a session's worth of output requires reconstructing the session from the diff.

The commit is also the point at which the developer accepts liability. Not legal liability. Professional liability. If the change breaks production, the commit author owns the investigation. That ownership is why the commit must follow validation, not precede it.

## The Inner Loop

Inside every Propose-Validate-Commit cycle, a tighter loop runs.

The developer reads the proposal. They find something wrong. They prompt the model to revise. The model revises. They read again. They accept or revise again. This is the inner loop: Propose -> Review -> Revise -> Accept.

The inner loop is where most of the work happens. The outer loop defines the boundary - what counts as done. The inner loop is where output improves before it reaches the boundary.

Inner loop hygiene: keep the inner loop short. A proposal that requires ten rounds of revision before it is acceptable is a signal that the initial prompt was underspecified. Revising the prompt costs one round. Revising the output ten times costs ten rounds. Spend the investment at the beginning, not throughout.

The inner loop does not substitute for the outer loop. A proposal that has been revised until the developer is satisfied has still only passed the human review layer of the inner loop. It has not passed automated controls. The outer loop's validation layer still applies.

## Loop Hygiene

Loop hygiene is the discipline of keeping iterations small enough to complete quickly.

A loop that takes days to complete one iteration has broken feedback. The proposal from Monday is validated on Thursday. By Thursday, the developer's memory of why the proposal was shaped that way has faded. The validation is slower and less sharp.

Aim for iterations that complete in hours. A session that produces a proposal in the morning and validates it before lunch has a tight loop. A session that produces a proposal Monday and validates it after the weekend review has a loose loop. Loose loops accumulate unvalidated output. Accumulated unvalidated output is technical risk.

The loop size discipline is:

| Loop duration | Risk level | Remedy |
| --- | --- | --- |
| Under 2 hours | Low | Normal operations |
| 2 - 8 hours | Medium | Review before the session ends |
| 8 - 24 hours | High | Do not start a new proposal until prior one is committed |
| Over 24 hours | Critical | Stop. Validate everything staged. Commit or discard. |

Unvalidated output left overnight is output that will be validated under different conditions than it was generated. Context has shifted. Memory has degraded. The validation will be weaker.

## When To Restart

Restart the session when accumulated unvalidated output exceeds what can be reviewed in a single sitting.

If a session has been running for five hours and the diff touches twelve files, the session has outrun the developer's capacity for thorough review. Committing that output is not closing the loop. It is abandoning the validation phase and calling it done.

The correct response is to stop generating. Review the accumulated diff. Identify what can be committed now - the work that is complete and verifiable. Commit that. Discard or stash what cannot be verified yet. Start the next session with a clean branch.

This feels slow. It is not. The alternative - committing large unreviewed diffs - produces bugs that cost orders of magnitude more time to diagnose than the review would have taken.

A session restart is not a failure. It is the loop enforcing its own discipline.

## Domain Map

The loop is domain-independent. Every AI-assisted change follows the same shape.

| Domain | Proposal | Validator | Commit |
| --- | --- | --- | --- |
| Code | Diff | Tests, types, lint, CI | Git merge |
| Database | Migration script | Dry run, schema check, backup | Apply migration |
| API | Contract or schema change | Contract tests, client checks | Release endpoint |
| Content | Draft | Source review, fact check | Publish |
| Agent tool call | Tool invocation | Capability policy, output schema | Execute |

The columns are always the same. The contents change by domain. The discipline is constant: nothing in the Commit column until the Validator column passes.

## Practical Artifact - Loop Health Check

Run this check at the end of every session, before closing the branch.

| Question | Green | Red |
| --- | --- | --- |
| Is every proposed change covered by at least one automated validation? | Yes | No - validation gap |
| Did CI pass on the current branch? | Yes | No - do not commit |
| Was the diff read line by line before the PR was opened? | Yes | No - review debt |
| Is the commit message written for the next session, not just for today? | Yes | No - memory gap |
| Does the PR cover one logical change? | Yes | No - split the PR |
| Is the branch up to date with main? | Yes | No - merge conflict risk |
| Is there a handoff note if the session continues tomorrow? | Yes | No - context loss |

A session with all green answers has closed the loop. A session with red answers has open loop items. Do not start the next proposal until the red items are resolved.

---

## Export

Copy this block into your CLAUDE.md, agent instructions, or project checklist.

**Key line**
> Intent becomes real only after it crosses the commit boundary.

**Agent YAML**
```yaml
vcb_chapter: 13
title: "The Core Loop"
key_line: "Intent becomes real only after it crosses the commit boundary."
thesis: "The vibe-coding workflow has exactly one shape: Propose, Validate, Commit. Every failure in AI-assisted development traces back to a skipped step."
checklist:
 - item: "Every proposal is scoped to one logical change."
 protects: "Diffs too large to review thoroughly"
 - item: "Automated controls run before human review, not after."
 protects: "Humans doing automation's job under attention pressure"
 - item: "Commit message explains why, not just what."
 protects: "Context loss between sessions"
 - item: "Session is restarted when accumulated output exceeds one sitting's review capacity."
 protects: "Large unreviewed diffs crossing the commit boundary"
 - item: "Loop health check passes before the session closes."
 protects: "Open loop items becoming the next session's technical debt"
```

**Portable checklist**
- [ ] Is this proposal scoped to one logical change? - *Protects against diffs too large for thorough review*
- [ ] Did automated controls run before human review started? - *Protects against attention substituting for engineering controls*
- [ ] Did a human read the diff line by line? - *Protects against plausible-but-wrong output crossing the commit boundary*
- [ ] Does the commit message explain why this change was made? - *Protects against context loss between sessions*
- [ ] Is the loop health check fully green? - *Protects against open validation gaps becoming technical debt*
