# Chapter 11 - Administrative Controls: Process Still Matters

Part: III - The Hierarchy Of AI Controls

## Thesis

Checklists, PR templates, and branch conventions cannot replace engineering controls. They can ensure that engineering controls are consistently invoked.

## Key Line

Process is not the safety system. Process is how humans remember to use the safety system.

## What Administrative Controls Are

Administrative controls sit above PPE and below engineering controls in the hierarchy.

They are the workflows, conventions, templates, and records that coordinate human behavior on a team. They do not stop a bad commit automatically. They create the conditions under which a human is likely to notice it before it ships.

That distinction matters. An engineering control fires regardless of whether anyone remembers to invoke it. An administrative control depends on the team following it. When the team is tired, rushed, or new, administrative controls erode. Engineering controls do not.

This is why administrative controls are not a substitute for engineering controls. They are a way to invoke them reliably.

The chapter is organized around the controls that matter most in AI-assisted development, where session outputs are voluminous and the gap between "looks done" and "is done" is large.

## Issue-First Development

Every change starts with an issue. Not with a prompt to an agent.

Issue-first development is the administrative control that creates scope before work begins. An issue names what is being changed, why it is being changed, and what done looks like. An agent session that starts from a well-formed issue is a session that has a defined boundary.

Without an issue, the prompt defines the boundary. Prompts drift. Agents explore. A session that starts as "fix the login bug" can become "refactor the authentication module" through a series of individually reasonable steps. Each step was a response to what the previous step revealed. None of them were decided as deliberate changes.

Issue-first development prevents this. The issue is the scope. Work outside the issue is out of scope. When an agent proposes a change that is not in the issue, the developer has a clear basis to say no.

The issue also creates the audit trail. A commit linked to an issue is a commit that can be traced to a decision. A commit with only a prompt in its history is a commit whose rationale exists only in a session log that may not be preserved.

The administrative habit: do not start an agent session without a linked issue. Do not close the issue until the change is reviewed, tested, and merged.

## PR Templates That Ask The Right Questions

A pull request template is an administrative control that intercepts the commit boundary.

The template appears when a developer opens a PR. It forces a structured moment of reflection before the code is proposed for review. For AI-assisted work, the template's job is specific: it forces the developer to state what controls ran.

A PR template that asks only "describe your change" is weak. It allows a developer to write a description without confirming that tests were run, schemas were validated, or the diff was read. A PR template that asks "what tests were added or modified?" forces the developer to confront the question.

The template cannot force honest answers. That is its limitation as an administrative control. A developer who writes "N/A" to avoid thinking is not stopped by the template. But the template makes the evasion visible to reviewers.

The right template asks:

- What issue does this close?
- What controls ran? (CI pass, schema valid, type check clean)
- What was the AI's role? (generated, drafted, reviewed, none)
- What did you manually verify that automation could not check?
- What is the rollback path if this breaks?

These are not bureaucratic questions. They are the questions a thoughtful reviewer would ask anyway. The template makes them mandatory.

## Agent Handoff Files

An agent session ends. The next session starts cold.

Without a handoff file, the next session has only the repository state. It does not know what decisions were made, what alternatives were rejected, what the open questions are, or what the session found but did not resolve. The new session reconstructs this from context, which means it reconstructs it imperfectly.

An agent handoff file is a lightweight document written at the end of a session that carries this information forward. It is not a design document. It is a state snapshot.

A handoff file covers:

- **What was done.** The specific changes made in this session, linked to the issue.
- **What was decided.** The approach chosen and the alternatives considered.
- **What was deferred.** Work that was identified but not done, with a reason.
- **Open questions.** Things that need human judgment before the next session continues.
- **The next step.** One specific action the next session should start with.

The handoff file is checked into the repository, usually in a `scratch/` or `.agent/` directory, and linked in the issue. When the next session starts, the developer reads it before starting a new prompt.

This is an administrative control, not a technical one. It depends on the developer writing it and reading it. The value is that when it is followed, the next session does not re-solve problems the previous session already solved.

## The Branch Strategy

Branch naming is an administrative control that creates scope limits and audit trails.

A branch named `fix-login-timeout` carries meaning. It is scoped to a problem. A branch named `dev` or `main-copy-3` carries no information about what changed or why.

In AI-assisted development, branch naming serves a specific function: it limits the scope of an agent session to a defined problem. An agent working on `feature/user-notifications-456` has a named boundary. When it proposes changes to the payment module, the branch name is evidence that those changes are out of scope.

The convention that works:

```
type/short-description-issue-number
```

Examples:
- `fix/login-timeout-112`
- `feature/export-csv-98`
- `refactor/auth-module-77`
- `chore/update-dependencies-201`

The type prefix creates a classification. The issue number links the branch to its rationale. The description is human-readable at a glance in a branch list.

Branch protection rules are the engineering control that makes the naming convention enforced rather than advisory. Require that branches match a pattern. Require that they be deleted after merge. Require that they pass CI before merge is available. The naming convention is the administrative layer; the branch rules are the structural layer beneath it.

## Architecture Decision Records

An ADR documents why, not just what.

When the team decides to use Zod for schema validation instead of Joi, a comment in the code records the tool. An ADR records the decision: why Zod, what was considered, what constraints drove the choice, what was accepted as a trade-off, and when the decision should be revisited.

ADRs are administrative controls against decision amnesia. Without them, teams relitigate settled questions. An agent asked to "evaluate schema validation options" will produce a thorough analysis that, without an ADR, the team has no structural way to cross-reference against decisions already made. The agent does not know what was decided. The team does not remember. The analysis repeats work that was done eighteen months ago with different results.

ADRs are short. A useful ADR is one page:

- **Status.** Proposed, accepted, superseded.
- **Context.** The situation that required a decision.
- **Decision.** What was decided, stated plainly.
- **Consequences.** What this makes easier, what it makes harder, what is accepted as a trade-off.

ADRs live in the repository, in a `docs/decisions/` directory, numbered sequentially. They are linked from the code they affect. They are updated when the decision changes, with the old text preserved and a "superseded by" link added.

The administrative habit: when an agent proposes an architectural approach and the team accepts it, write the ADR before the session ends.

## When Process Becomes Theater

A PR template no one fills out is decoration.

The failure mode of administrative controls is adoption without enforcement. The team installs a PR template because a blog post recommended it. The template has eight questions. Developers copy the template, type "done" in every field, and submit the PR. Reviewers approve the PR without reading the answers. The template adds friction but no signal.

This is process theater. It looks like a safety practice. It produces no safety.

The test for whether an administrative control is real: would a violation be noticed, and would it block progress?

A PR with an unanswered "what controls ran?" question should be blocked by the reviewer until it is answered. If reviewers never block PRs for empty templates, the template is theater. If the team never asks whether the CI passed, the CI status on the PR is theater.

Administrative controls require enforcement to function. Enforcement requires that someone cares whether the control was followed and is willing to slow down work to uphold it. That willingness is a cultural control, which is why administrative controls are the weakest technical category. They are not as weak as PPE, but they degrade under pressure faster than engineering controls.

The remedy: keep the administrative controls short. A checklist with three questions that are always answered is stronger than a template with eight questions that are sometimes skipped. Reduce surface area to increase compliance.

## Practical Artifact - Administrative Controls Starter Set

These are copy-paste-ready templates. Adapt them; do not skip them.

---

**Issue Template** (`.github/ISSUE_TEMPLATE/change.md`)

```markdown
## What needs to change

[One sentence.]

## Why

[The problem or requirement driving this change.]

## Acceptance criteria

- [ ] [Specific, verifiable condition 1]
- [ ] [Specific, verifiable condition 2]
- [ ] [Specific, verifiable condition 3]

## Out of scope

[What this issue explicitly does not cover.]

## Notes

[Links, context, constraints the implementer needs.]
```

---

**PR Checklist** (`.github/pull_request_template.md`)

```markdown
## Closes

Fixes #[issue number]

## What changed

[One paragraph. Be specific. Do not paste the commit message.]

## Controls that ran

- [ ] CI passes (all tests green, type check clean, lint clean)
- [ ] Schema validation passes on any new or modified data shapes
- [ ] Diff was read line by line by a human before this PR was opened
- [ ] No secrets, credentials, or personal data in the diff

## AI involvement

- [ ] AI generated the initial draft
- [ ] AI was used for review or refactoring
- [ ] No AI involvement

## Manual verification

[What did you check that automation cannot check? Be specific.]

## Rollback

[How is this reverted if it causes a problem in production?]
```

---

**Agent Handoff Template** (`.agent/handoff-YYYY-MM-DD.md`)

```markdown
# Session Handoff - [date]

## Issue

[Link]

## What was done

[Bullet list of specific changes made. Link to commits or files.]

## What was decided

[Key architectural or implementation decisions made in this session, and why.]

## What was deferred

[Work identified but not done. Why it was deferred.]

## Open questions

[Things that need human judgment before the next session continues.]

## Next step

[One specific action to start the next session with.]
```

---

**ADR Template** (`docs/decisions/NNN-short-title.md`)

```markdown
# ADR NNN - [Title]

**Status:** [Proposed | Accepted | Superseded by ADR NNN]
**Date:** [YYYY-MM-DD]

## Context

[The situation that required a decision. What was the constraint or requirement?]

## Decision

[What was decided, in plain language.]

## Alternatives considered

[What else was evaluated and why it was not chosen.]

## Consequences

**Easier:** [What this makes easier.]
**Harder:** [What this makes harder or more complex.]
**Accepted trade-offs:** [What the team knowingly accepted.]

## Review trigger

[Under what conditions should this decision be revisited?]
```

---

**Definition of Done** (project `CLAUDE.md` or wiki)

A change is done when all of the following are true:

- [ ] The issue acceptance criteria are met - each item is checkable, not a judgment call
- [ ] CI passes with no suppressions or overrides
- [ ] Schema validation passes on all modified data shapes
- [ ] The PR checklist is filled out with specific answers, not placeholders
- [ ] A human read the diff line by line
- [ ] The handoff file is written and committed if the session continues
- [ ] The issue is closed and linked to the merge commit

---

## Export

Copy this block into your CLAUDE.md, agent instructions, or project checklist.

**Key line**
> Process is not the safety system. Process is how humans remember to use the safety system.

**Agent YAML**
```yaml
vcb_chapter: 11
title: "Administrative Controls: Process Still Matters"
key_line: "Process is not the safety system. Process is how humans remember to use the safety system."
thesis: "Checklists, PR templates, and branch conventions cannot replace engineering controls. They can ensure that engineering controls are consistently invoked."
checklist:
 - item: "Every change starts with a linked issue that defines scope."
 protects: "Scope creep and undocumented rationale"
 - item: "PR template is filled with specific answers before review is requested."
 protects: "Unchecked AI output crossing the commit boundary"
 - item: "Agent handoff file is written before the session closes."
 protects: "Context loss and repeated decision-making across sessions"
 - item: "Branch name encodes type, description, and issue number."
 protects: "Audit trail and scope discipline"
 - item: "ADR is written when an architectural decision is accepted."
 protects: "Decision amnesia and relitigated choices"
 - item: "Definition of Done checklist is applied before every merge."
 protects: "Silent incomplete work reaching production"
```

**Portable checklist**
- [ ] Is there an issue for this change, with defined acceptance criteria? - *Protects against undocumented scope and missing rationale*
- [ ] Is the PR template filled with specific answers, not placeholders? - *Protects against unchecked output crossing the commit boundary*
- [ ] Did a human read the diff line by line before the PR was opened? - *Protects against confident but wrong AI output*
- [ ] Is there a handoff file if this session continues later? - *Protects against context loss between sessions*
- [ ] Is there an ADR for any architectural decision made in this session? - *Protects against decision amnesia*
- [ ] Does the Definition of Done checklist pass? - *Protects against "looks done" without being done*
