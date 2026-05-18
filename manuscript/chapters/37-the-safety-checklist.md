# Chapter 37 - The Safety Checklist

Part: VIII - The Field Manual

## Thesis

A safety checklist organized by the hierarchy of controls asks the right questions in the right order. Strongest controls first. Human attention last.

## Key Line

Start with hazards removed. End with attention deployed. Never reverse that order.

## What The Checklist Is For

A safety checklist is not a compliance form. It is a structured forcing function that surfaces the most common failure modes before they become production incidents.

The hierarchy of controls determines the order. Elimination and substitution questions come first because they prevent entire classes of failure. Engineering controls come next because they run automatically. Administrative controls confirm process ran. PPE questions are last because human attention is the most expensive and least reliable defense.

Answering the checklist honestly takes five minutes. An incident review takes five hours.

## How To Use It

Three contexts call for the checklist: pre-commit (before crossing the commit boundary), pre-merge (before the PR is approved), and pre-deploy (before production).

Not every question applies at every stage. The column headers indicate where each question is required.

If any answer is "no" or "unknown," pause. Do not proceed past that control level without either satisfying the question or explicitly accepting the risk. Accepted risk must be documented.

## The Checklist

### Elimination - Have Dangerous Capabilities Been Removed?

| Question | Pre-commit | Pre-merge | Pre-deploy |
| --- | --- | --- | --- |
| Does this change give the agent access to any system it did not previously have access to? | Required | Required | Required |
| Are there credentials, secrets, or tokens in the diff? | Required | Required | Required |
| Does the agent's scope now include production databases, payment systems, or user data it did not before? | - | Required | Required |
| Have unnecessary permissions been removed from any tool, API, or service? | - | Required | Required |

### Substitution - Are The Safer Alternatives In Use?

| Question | Pre-commit | Pre-merge | Pre-deploy |
| --- | --- | --- | --- |
| Are staging environments used instead of production for agent experiments? | Required | Required | - |
| Are schema-validated tool interfaces used instead of raw string outputs? | Required | Required | - |
| Is the agent operating on a branch, not main? | Required | Required | - |

### Engineering Controls - Did The Automated Guards Fire?

| Question | Pre-commit | Pre-merge | Pre-deploy |
| --- | --- | --- | --- |
| Do all unit tests pass? | Required | Required | Required |
| Do integration tests pass? | - | Required | Required |
| Does the type check pass with no errors? | Required | Required | Required |
| Does schema validation pass at all relevant boundaries? | Required | Required | Required |
| Does the CI pipeline pass end-to-end? | - | Required | Required |
| Are there no new lint errors? | Required | Required | - |
| If this touches a database, does the migration run cleanly and reversibly? | - | Required | Required |

### Administrative Controls - Did The Process Run?

| Question | Pre-commit | Pre-merge | Pre-deploy |
| --- | --- | --- | --- |
| Is there a linked issue that defines the scope of this change? | Required | Required | - |
| Is the PR template complete with controls listed? | - | Required | - |
| Has an agent handoff file been written if the session is ending? | Required | - | - |
| Is there an ADR for any significant architectural decision made in this session? | - | Required | - |
| Is the CLAUDE.md updated if project constraints changed? | Required | Required | - |
| Is there a named on-call person for this deployment? | - | - | Required |
| Is the rollback procedure documented and tested? | - | Required | Required |

### PPE - Was Human Attention Applied Correctly?

| Question | Pre-commit | Pre-merge | Pre-deploy |
| --- | --- | --- | --- |
| Has every generated file been read, not just summarized? | Required | Required | - |
| Has the diff been reviewed for behavioral change, not just syntactic change? | Required | Required | - |
| Can the reviewer explain what this code does and why it is structured this way? | - | Required | - |
| Has the plausibility trap review been run (Ch 31)? | Required | Required | - |
| Is there a person who explicitly accepts ownership of this change? | Required | Required | Required |

## When To Override

The checklist can be overridden. Overrides must be documented.

Document: which question was overridden, what the risk is, who accepted the risk, and what the monitoring plan is if the risk materializes.

An undocumented override is not an override. It is a skip.

## The Incident Review Addendum

After a production incident caused by an AI-generated change, run this addendum:

| Question | Answer |
| --- | --- |
| Which checklist item, if answered honestly, would have flagged the failure? | |
| Was that item present on the checklist that was run? | |
| If present: why was the answer recorded as acceptable? | |
| If absent: should it be added to the standard checklist? | |
| What change to the checklist or process prevents recurrence? | |

The goal of the addendum is not blame. It is checklist improvement. The checklist should get better every time the system fails.

## Practical Artifact - The Pre-Commit Minimum

For teams that cannot run the full checklist on every commit, this is the minimum:

```
- [ ] No secrets in the diff
- [ ] Agent ran on a branch, not main
- [ ] All tests pass
- [ ] Type check passes
- [ ] I have read every generated file, not just the summary
- [ ] I can explain what this code does
- [ ] There is a linked issue for this change
```

If any box is unchecked, do not commit. Fix the gap first.

---

## Export

Copy this block into your CLAUDE.md, agent instructions, or project checklist.

**Key line**
> Start with hazards removed. End with attention deployed. Never reverse that order.

**Agent YAML**
```yaml
vcb_chapter: 37
title: "The Safety Checklist"
key_line: "Start with hazards removed. End with attention deployed. Never reverse that order."
thesis: "A safety checklist organized by the hierarchy of controls asks the right questions in the right order. Strongest controls first. Human attention last."
checklist:
 - item: "Are there secrets or credentials in the diff?"
 protects: "against credential exposure in committed code"
 - item: "Does the agent operate on a branch, not main?"
 protects: "against unreviewed changes reaching the truth branch"
 - item: "Do all tests pass and does the type check succeed?"
 protects: "against logic errors and interface drift in generated code"
 - item: "Has every generated file been read, not just summarized?"
 protects: "against plausible-but-wrong output passing review"
 - item: "Is there a person who explicitly owns this change?"
 protects: "against diffuse responsibility and unowned failures"
 - item: "Is the rollback procedure documented and tested?"
 protects: "against unrecoverable production deployments"
```

**Portable checklist**
- [ ] No secrets in the diff - *protects against credential exposure*
- [ ] Agent ran on a branch, not main - *protects against unreviewed changes on main*
- [ ] All tests pass, type check passes - *protects against logic errors and interface drift*
- [ ] CI pipeline passes end-to-end - *protects against control gaps between local and CI*
- [ ] Every generated file has been read, not summarized - *protects against plausible-but-wrong output*
- [ ] Reviewer can explain what the code does - *protects against ownership gap*
- [ ] Linked issue defines scope - *protects against undocumented scope creep*
- [ ] Rollback procedure documented and tested - *protects against unrecoverable deployments*
- [ ] Named person accepts ownership - *protects against diffuse responsibility*
