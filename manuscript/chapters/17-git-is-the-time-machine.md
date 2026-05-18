# Chapter 17 - Git Is The Time Machine

Part: IV - The Propose / Validate / Commit Loop

## Thesis

AI makes changes fast. Git makes them survivable.

## Key Line

Every AI session that modifies code should run on a branch, not main.

## The Branch Is The Safe Space

A branch is a safe experiment.

When an AI session begins, the first operation is creating a branch. The branch is where generation happens. The branch is where the bad ideas live before they are rejected. The branch is where the hallucinated refactor gets caught before it reaches the codebase anyone else depends on.

Main is the truth. A branch is a proposal.

This is the same doctrine that governs human feature development - and it matters more in AI-assisted work, not less. A human writing code for two hours is producing changes they understand. An agent producing changes for two hours may have drifted into patterns that look plausible and are wrong. The branch is where that drift is contained.

The branch workflow is: create branch, run AI session, review output, run tests and checks, merge if valid, delete if not. If the session produces unusable output, `git branch -D` removes it. The main branch never saw it. No cleanup required.

Branch-per-session or branch-per-feature both work. The minimum requirement is that main is never the active working branch during generation.

## Commit Granularity

Small, meaningful commits are auditable. Large batches are not.

A commit that says "implement feature X" hides every intermediate decision. The reviewer sees a diff of five hundred lines across twelve files. They cannot tell what the AI generated and what was corrected. They cannot tell which direction the implementation went before settling on the current approach. They cannot tell what was tried and reverted.

Small commits tell a story.

A series of commits - "add schema for UserProfile," "add failing test for createUser validation," "implement createUser to pass tests," "add edge case for duplicate email" - is auditable. Each commit is a checkpoint. Each checkpoint has a known-good state. Bisect works. Revert works. The reviewer can follow the sequence.

The goal is commits that pass tests at each step. In TDD, that means: red commit (failing test), green commit (passing implementation), refactor commit (improved structure, same green tests). This commit cycle is legible when an AI session generates it and legible when a human needs to understand it six months later.

One commit, one reason. That rule predates AI assistance. It is more valuable with it.

## Rollback Design

Every deployment has a corresponding git state. When the deployment fails, the rollback is a git operation.

This is not aspirational. It is a design requirement. If you cannot identify the exact commit that corresponds to the current production state, rollback becomes archaeology. Archaeology takes time that incidents do not provide.

The three git operations that matter for rollback are `git revert`, `git reset`, and `git bisect`.

`git revert` creates a new commit that undoes the changes of a previous commit. It preserves history. The broken commit stays in the log. The revert commit documents that the change was rolled back. Use this for production rollbacks where history integrity matters.

`git reset` moves the branch pointer backward. It rewrites history on the branch. Use this for local cleanup before a PR is merged - never on shared branches, never on main.

`git bisect` finds the commit that introduced a regression. In AI-assisted development, where multiple changes can happen quickly across multiple files, bisect is indispensable. You mark a known-good commit and a known-bad commit. Bisect binary-searches the history between them, checking out commits and asking you to test each one. The result is the exact commit where the behavior changed.

Bisect assumes small, testable commits. A test suite that can answer "does the bug exist in this state?" makes bisect fast. Without tests, bisect requires manual verification at each step and takes much longer.

## Tags As Release Anchors

Tag every release. A tag is an immutable pointer to a state.

When something breaks in production, the first question is: what changed since the last release? If releases are tagged, that question has a one-command answer: `git diff v1.4.2 v1.5.0`. The diff is the candidate list for the regression.

Tags are also the reference point for rollback. "Roll back to the last release" is a precise instruction when the release is tagged. It is an ambiguous instruction when it is not.

Tag format matters less than consistency. Semantic versioning (`v1.4.2`) is the standard. The tag should be signed in production environments where the integrity of the release state needs to be verifiable.

In AI-assisted development, the gap between "working" and "released" can compress. The model generates quickly. Releases happen more often. The value of tagging increases as the pace increases - each tag is a snapshot of a verified state, a point the team can return to without searching.

## What Git Cannot Do

Git records what was committed. It cannot tell you what the AI intended.

A commit that says "fix bug in session handling" does not explain what the bug was, why the chosen fix is correct, what alternatives were considered, or what assumptions the fix depends on. That information lives in the commit message, the PR description, the linked issue, or the conversation that produced the change - none of which git stores automatically.

This is the human layer.

In AI-assisted development, the human layer is especially important because the agent does not automatically record its reasoning. A session that produces a hundred-line refactor does not produce a hundred-line explanation unless the engineer extracts it. That extraction is the commit message and PR description.

Good commit message practice in AI-assisted work: write the message before closing the session, while the reasoning is accessible. The message should answer: what was the problem, what was the decision, what assumptions does this rely on. The model can help draft this message from the conversation. The engineer must verify that the draft is accurate.

Commit messages are the human artifact that makes git history meaningful. Without them, the history is a sequence of diffs with no rationale - auditable in structure, opaque in intent.

## The Stash Is Not A Substitute

`git stash` holds in-progress work between context switches.

It is useful. It is not a commit. Stashed work has no message, no timestamp in the history, and no CI run attached to it. Stashing work and switching tasks is a context management tool, not a control.

The failure mode: stashing work, switching to a different AI session, forgetting the stash, and losing context on what the stashed work contained. Stashes do not self-document.

The discipline: anything worth keeping for more than a few minutes is worth committing to a branch, even with a `[WIP]` message. A WIP commit has history. A stash does not.

## Practical Artifact - Git Hygiene Checklist

Use this checklist at the start and end of every AI-assisted session.

| Question | What it protects |
| --- | --- |
| Is the session running on a branch, not main? | Prevents unreviewed output from reaching shared state |
| Does each commit have one reason? | Enables bisect, revert, and meaningful code review |
| Does the commit message explain the why, not just the what? | Preserves reasoning that git cannot infer |
| Do tests pass at each commit? | Maintains a sequence of known-good states |
| Is every production release tagged? | Enables fast rollback and regression diffing |
| Is the rollback procedure documented and practiced? | Ensures rollback is a git operation, not archaeology |
| Are stashes converted to WIP commits before long context switches? | Prevents stash loss and context collapse |
| Does the PR description link to the issue it closes? | Maintains traceability from problem to change |
| Is the branch deleted after merge? | Prevents branch accumulation and navigation confusion |
| Would bisect work on this history if a regression appeared? | Forces the discipline of small, testable commits |

---

## Export

Copy this block into your CLAUDE.md, agent instructions, or project checklist.

**Key line**
> Every AI session that modifies code should run on a branch, not main.

**Agent YAML**
```yaml
vcb_chapter: 17
title: "Git Is The Time Machine"
key_line: "Every AI session that modifies code should run on a branch, not main."
thesis: "AI makes changes fast. Git makes them survivable."
checklist:
 - item: "Create a branch before the AI session starts"
 protects: "Contains generated output until it is reviewed and validated"
 - item: "One commit, one reason"
 protects: "Enables bisect, targeted revert, and meaningful review"
 - item: "Write the commit message while the reasoning is accessible"
 protects: "Preserves the why before the session context closes"
 - item: "Tag every production release"
 protects: "Makes rollback a command, not an investigation"
 - item: "Run tests at each commit"
 protects: "Maintains a sequence of known-good states in the history"
```

**Portable checklist**
- [ ] Is the AI session running on a branch, not main? - *Prevents unreviewed output from reaching shared state*
- [ ] Does each commit have one clear reason with a message explaining why? - *Enables bisect and meaningful review*
- [ ] Do tests pass at each commit checkpoint? - *Maintains known-good states throughout the history*
- [ ] Is every production release tagged with a semantic version? - *Makes rollback a single command*
- [ ] Is the rollback procedure documented and tested before it is needed? - *Ensures rollback is a git operation, not archaeology*
