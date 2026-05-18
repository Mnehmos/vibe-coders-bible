# Chapter 14 - The Repo Is The Memory

Part: IV - The Propose / Validate / Commit Loop

## Thesis

The model has no memory between sessions. The repository does. Every decision that matters must be committed, or it is gone.

## Key Line

If the next agent needs to know it, put it in the repo.

## Model Memory Is Session-Scoped

When an agent session ends, the model's context window closes.

The next session starts blank. The model does not remember the architectural discussion from Tuesday. It does not remember why the team chose Zod over Joi, why the database schema uses soft deletes, or why the authentication module was refactored last sprint. It knows nothing that was not written to the repository before the session ended.

This is not a limitation that will be fixed by better models. It is a structural property of how AI-assisted development works. A model with a longer context window still has a session that ends. A model with memory features still requires that memories be seeded from somewhere. The repository is the canonical source.

The practical consequence is simple: anything decided in a chat session and not committed to the repo does not exist as a project decision. It exists as a conversation artifact that will be lost when the session ends or the logs expire.

Decisions made in chat are not decisions. Decisions committed to the repo are decisions.

## What The Repo Holds

The repository holds the project's durable state. That includes more than source code.

Source code is the most obvious artifact. Every function, class, module, and configuration file that defines how the system behaves lives in the repo. The model reads this on every session. It is the foundation.

Tests are memory. A passing test suite is a machine-readable record of what the system is supposed to do and what bugs have already been found. A test for a bug that was fixed three months ago is the only guarantee that the same bug does not return silently when the model refactors the relevant function. Chapter 15 covers this in depth.

Commit messages are memory. A commit message that explains why the change was made - not just what it contains - is readable by the next session when it runs `git log`. A commit message that says "fix auth bug" tells the next model nothing. A commit message that says "require explicit session expiry on all auth tokens because implicit expiry was allowing token reuse across device changes" gives the next model a constraint it can reason about.

PR descriptions are memory. They survive the merge and become part of the project's documented history. A PR description that explains the trade-offs considered, the approach taken, and the alternatives rejected is durable context for the next session that touches the same code.

Architecture Decision Records are memory. They capture decisions that are not obvious from the code - why this library and not that one, why this schema shape, why this constraint. Without ADRs, teams relitigate settled questions. With ADRs, the model can read the decision and its rationale before proposing an alternative.

CLAUDE.md and agent context files are memory. They are covered in the next section.

The repo also holds things the model cannot infer from code alone: issue links in commit messages, references to external constraints, comments that explain why code does something unexpected. Every one of these is context the next session needs and cannot reconstruct from the diff alone.

## CLAUDE.md As Persistent Context

CLAUDE.md is the file that tells the next agent what this project is.

Not the file that explains the code - the code does that. CLAUDE.md tells the agent what constraints apply, what conventions have been established, what decisions have been made, what tools are in scope, and what behavior is expected. It is the onboarding document for any model that opens this repository.

Without CLAUDE.md, every session starts from scratch. The model reads the code and infers a model of the project. That inferred model is frequently wrong in specific ways: it misses undocumented conventions, it proposes approaches the team has already rejected, it uses patterns that conflict with established architecture. CLAUDE.md prevents this by providing explicit context that would otherwise require multiple back-and-forth prompts to establish.

A useful CLAUDE.md covers:

- What this project is and what it does, in one paragraph
- The technology stack and the versions that matter
- The conventions the model must follow - naming, file structure, error handling patterns
- The decisions that have been made and must not be relitigated without explicit authorization
- The tests that must pass before any change is committed
- The scope limits - what files or modules the model should not modify without explicit instruction
- Links to ADRs, the issue tracker, and any external dependencies that affect behavior

CLAUDE.md is a living document. It is updated when decisions change. When a new constraint is established in a session, it is committed to CLAUDE.md before the session ends. The update is the act of making the decision durable.

A CLAUDE.md that is out of date is worse than no CLAUDE.md. An outdated context file tells the model things that are no longer true. Update it or the model will act on stale context.

## Commit Messages As Memory

Commit messages are the git log, and the git log is a document the model reads.

When a new session starts on a codebase with a clean, well-written git log, the model can reconstruct the project's evolution. It can see what changed, when, and why. It can identify the constraints that drove past decisions. It can avoid proposing changes that were already tried and reverted.

When the git log is a sequence of "fix bug," "update files," "changes," and "WIP," the model has nothing to work with. It cannot reconstruct anything from that history. The log is noise.

The rule for commit messages in AI-assisted development: write the message for the model that will read it next session, not for yourself in the moment. Write why, not what. The diff already shows what. The message must explain the constraint, the bug that was found, the requirement that was met, or the trade-off that was accepted.

A commit message format that works:

```
[type]: [short description]

[Why this change was made - the constraint, bug, or requirement]
[What was considered and rejected, if the decision was non-obvious]
[What the next session should know about this change]
```

The three-line body is not overhead. It is the memory artifact. The developer who wrote the change holds this context in their head at commit time. The message is the act of writing it down before it evaporates.

## PR Descriptions As Memory

A pull request description is the narrative of a set of changes.

It explains the intent - what the PR is trying to accomplish. It explains the approach - how the changes accomplish that intent. It explains the trade-offs - what was sacrificed and why. It explains what was not changed and why.

PR descriptions survive the merge. Unlike branch names, which are often deleted after merge, PR descriptions live in the repository's pull request history indefinitely. A developer or model reviewing a decision three months later can find the PR that introduced the relevant code, read the description, and understand the reasoning that no longer appears in the code itself.

The test for a good PR description: could a new team member who was not in the session understand what was decided and why? If not, the description is incomplete.

PR descriptions are particularly valuable for AI-assisted work because the session that produced the changes contained reasoning that exists nowhere else. The model generated options. The developer chose one. The description is where that choice is explained.

## Architecture Decision Records As Memory

An ADR is one page that prevents one category of mistake from recurring.

Chapter 11 introduced ADRs as an administrative control. In the context of repo memory, ADRs are specifically the answer to the following failure mode: a model proposes an approach the team already evaluated and rejected, the team has no record of the rejection, the team spends a session exploring the rejected approach before arriving at the same conclusion, and the rejected approach is not recorded again.

This cycle can repeat indefinitely. ADRs break it.

An ADR records: the context that required a decision, the decision itself in plain language, the alternatives considered, and the consequences - what is easier, what is harder, what is accepted as a trade-off. It is indexed, version-controlled, and linked from the code it affects.

When a model proposes an approach that conflicts with an ADR, the developer has a concrete artifact to reference. "We considered this approach. ADR-007 explains why we rejected it. The constraint that drove that decision still applies." The session does not restart from zero.

ADRs belong in `docs/decisions/` in the repo. They are not optional documentation. In an AI-assisted project, they are a required part of the memory system.

## What Does Not Belong In The Repo

The repo holds committed state. It does not hold process artifacts.

Chat logs do not belong in the repo. A session transcript is not a decision record. It is a record of how the decision was reached, which is different and usually not useful to the next model. The decision itself belongs in an ADR or a commit message. The conversation that produced it is noise.

Unverified draft output does not belong in the repo. A directory of model-generated files that has not been reviewed, tested, or validated is a liability, not an asset. If the model generated five candidate implementations and one was chosen, the other four are discarded. They are not committed "for reference."

Personal notes from a session do not belong in the repo unless they are structured as handoff files or ADRs. A developer's scratch notes from a brainstorming session are not project state.

The test for whether something belongs in the repo: would the next agent benefit from reading it? Is it committed state that reflects a verified decision? If yes, commit it. If not, it belongs elsewhere or nowhere.

## The Danger Of Chat As Decision Space

Teams treat chat as a decision space. This is the failure mode.

"We discussed it in the session" is not a decision. "We committed it" is a decision.

A design decision made in a chat window that is not committed to the repo is invisible to the next session, invisible to new team members, and invisible to any future audit of why the system is shaped the way it is. The decision exists only in the memory of the people who were in that chat, which degrades over time.

The discipline is to end every session by asking: what was decided here that needs to be written down? Commit messages, PR descriptions, ADRs, CLAUDE.md updates, and issue closures are all acts of writing decisions down. Each one is a piece of memory that survives the session.

A team that consistently writes decisions into the repo builds a project that any future session can pick up and continue. A team that treats chat as the decision space builds a project whose rationale evaporates with each session.

## Practical Artifact - Repo Memory Audit

Run this audit on any AI-assisted project at the start of each sprint or quarter.

| Memory layer | Present? | Quality | Action if missing |
| --- | --- | --- | --- |
| CLAUDE.md (or equivalent) | Yes / No | Current / Stale | Create or update before next session |
| Commit messages explain why | Consistent / Inconsistent | - | Establish commit message convention; use template |
| PR descriptions explain intent and trade-offs | Consistent / Inconsistent | - | Add PR template; require description before review |
| ADRs exist for architectural decisions | Yes / No | Current / Stale | Write ADRs for the last three major decisions immediately |
| Tests document expected behavior, not just coverage | Yes / No | - | Audit test names; rename tests that describe mechanics, not behavior |
| Issue tracker is linked from commits | Yes / No | - | Adopt `Fixes #N` convention; enforce in branch protection |
| Agent handoff files exist for multi-session work | Yes / No | - | Establish `.agent/handoff.md` convention |

A project where every row is green has a repo that is its own memory. A project where most rows are red is a project where every session starts from scratch and the same decisions are made, forgotten, and remade.

---

## Export

Copy this block into your CLAUDE.md, agent instructions, or project checklist.

**Key line**
> If the next agent needs to know it, put it in the repo.

**Agent YAML**
```yaml
vcb_chapter: 14
title: "The Repo Is The Memory"
key_line: "If the next agent needs to know it, put it in the repo."
thesis: "The model has no memory between sessions. The repository does. Every decision that matters must be committed, or it is gone."
checklist:
 - item: "CLAUDE.md is current and covers constraints, conventions, and decided architecture."
 protects: "Sessions starting from stale or missing context"
 - item: "Commit messages explain why the change was made, not just what the diff contains."
 protects: "Context loss between sessions; repeated decision-making"
 - item: "PR descriptions explain intent, approach, and trade-offs."
 protects: "Rationale that exists only in the session that produced the change"
 - item: "ADRs exist for every architectural decision that is not obvious from the code."
 protects: "Teams relitigating settled questions; models proposing rejected approaches"
 - item: "No unverified draft output, chat logs, or personal notes are committed to the repo."
 protects: "Noise in the memory layer that degrades model context quality"
 - item: "Every decision made in chat is committed before the session ends."
 protects: "Decisions that evaporate when the session closes"
```

**Portable checklist**
- [ ] Is CLAUDE.md updated with any decisions made in this session? - *Protects against the next session starting from stale context*
- [ ] Does every commit message explain why, not just what? - *Protects against context loss that forces the next session to re-infer constraints*
- [ ] Is there a PR description that explains intent and trade-offs? - *Protects against rationale that exists only in the session transcript*
- [ ] Is there an ADR for any architectural decision accepted in this session? - *Protects against decision amnesia and model proposals of rejected approaches*
- [ ] Were all decisions made in chat committed before the session ended? - *Protects against the session closing with decisions that do not exist in the repo*
