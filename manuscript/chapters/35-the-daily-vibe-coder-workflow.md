# Chapter 35 - The Daily Vibe-Coder Workflow

Part: VIII - The Field Manual

## Thesis

A daily workflow for AI-assisted development is a discipline system, not a productivity system. The discipline prevents accumulation of unverified output. The velocity is a consequence.

## Key Line

Velocity comes from repeating a small disciplined loop, not from trusting a large unreviewed leap.

## Start The Day

Five minutes. No exceptions.

**Step 1: Clean the tree.**
Run `git status`. If the working tree is not clean, resolve it before starting. Unverified changes from yesterday do not carry forward. Either commit them after proper validation or discard them. Starting a session on a dirty tree means the first generation has an ambiguous base.

**Step 2: Pull latest main.**
Run `git pull origin main` on your working branch, or rebase onto main. Work that diverges from main for more than one day accumulates merge friction. Start each day current.

**Step 3: Pick scope.**
Read the open issue list. Pick one issue. Two at most, only if they are tightly coupled. Write the scope in one sentence before opening the chat window: "Today I am implementing X, touching Y files, done when Z tests pass." This sentence is the session boundary. Everything outside it is out of scope for today.

**Step 4: Load context.**
Read CLAUDE.md. Read `.agent/handoff.md` if it exists. These two files contain everything the agent needs to start the session correctly. If they are stale or incomplete, update them now, before generating anything. Starting a session with stale context produces output calibrated to the wrong constraints.

## The Session Protocol

The session is the Propose-Validate-Commit loop from Chapter 13, applied continuously.

**Keep proposals small.** One function, one endpoint, one migration, one behavior. A proposal that touches eight files is a project, not a proposal. Split it. The review surface for eight files is too large for thorough verification.

**Validate before moving on.** Do not generate the next section of code before the previous section has passed automated controls and human review. Accumulated unvalidated output is the primary failure mode in AI-assisted development. Each generation waits for its predecessor to be validated and committed.

**Commit at each validated step.** Not at the end of the day. At the end of each verified unit. "Add input validation to the user creation endpoint" is a commit. "Implement entire user management system" is a session's worth of output that compresses five decisions into one diff. Compress destroys reviewability.

**When context grows too large:** If the model starts forgetting constraints established at the start of the session — generating code that violates the primary constraint in CLAUDE.md, omitting patterns it correctly applied an hour ago — the context window has saturated. Stop. Write the handoff file. Start a fresh session with the handoff as the opening context.

**Review the diff, not the confidence.** The model never expresses uncertainty through tone. A hallucinated function signature is delivered with the same confidence as a correct one. Review the diff line by line. The confidence of the output is not evidence of its correctness.

**Keep the inner loop short.** If a proposal requires more than three rounds of revision, the prompt was underspecified. Stop revising the output. Revise the prompt. Write the constraint into the prompt that the output keeps violating.

## When To Cut The Session Short

Cut the session short when any of the following occur:

| Signal | Action |
| --- | --- |
| The diff touches more files than can be reviewed in one sitting | Stop generating. Review and commit what is verifiable. |
| The model contradicts a constraint established in CLAUDE.md | Stop. Check if CLAUDE.md is loaded in context. Restart if not. |
| Three consecutive generations require major revision | Stop generating. Rewrite the prompt. |
| Automated controls start failing in ways that are hard to diagnose | Stop. Do not generate more on top of a failing baseline. |
| It is end of day and output is not committed | Stop generating. Validate what exists. Commit or discard. |

Stopping early is not failure. It is the loop enforcing itself.

## Close The Session

Ten minutes. Do this before closing the editor.

**Step 1: No loose ends.**
Run `git status`. If there are staged or unstaged changes, they must be committed or discarded before the session closes. Do not leave unvalidated work in the working tree. Work left uncommitted overnight is work that will be validated tomorrow under different conditions with degraded memory of why it was written.

**Step 2: Run the full test suite.**
If not already run during the session, run it now. Do not rely on the partial test runs from earlier in the session. The test suite at close-of-session is the authoritative verification.

**Step 3: Write the handoff file.**
Open `.agent/handoff.md` and fill it out. The handoff requires: current state (branch, last commit, test status), what was done, why decisions were made, deferred work, open questions, and one specific next step. See Chapter 36 for the complete template.

The handoff is written for the next agent, whether that is tomorrow's session or a collaborator who picks up the work. Write it as if they have never heard of this project.

**Step 4: Update CLAUDE.md if needed.**
If any project constraint changed — a new dependency, a changed pattern, a decision about what the agent should or should not do — update CLAUDE.md now. A CLAUDE.md that is stale for one session sends the next session's agent working against incorrect standing instructions.

**Step 5: Push the branch.**
Run `git push`. Remote-only code is inaccessible to CI, to collaborators, and to the next session if the local machine is unavailable. Push before closing.

## The Handoff File

The handoff file is the close-of-session commit. It is not optional.

A session that closes without a handoff file has left the next session to reconstruct context from git log and source code. Reconstruction is expensive and imprecise. The handoff file makes reconstruction unnecessary.

Write it in `.agent/handoff.md`. Commit it as the final commit of the session: `chore: session handoff - [date]`. See Chapter 36 for the complete template and guidance.

## Practical Artifact — Daily Workflow Checklist

### Start (5 minutes)

- [ ] `git status` shows a clean working tree — *Prevents building on an ambiguous base*
- [ ] Branch is current with main — *Prevents merge friction from accumulating*
- [ ] Scope is written in one sentence: "Today I am building X, touching Y files, done when Z" — *Prevents scope creep during the session*
- [ ] CLAUDE.md has been read — *Ensures agent operates on current constraints*
- [ ] `.agent/handoff.md` has been read if it exists — *Ensures continuity from the previous session*

### Session

- [ ] Each proposal is scoped to one logical change — *Prevents diffs too large to review*
- [ ] Automated controls run before the next generation starts — *Prevents accumulation of unvalidated output*
- [ ] Diff is reviewed line by line before commit — *Prevents plausible-but-wrong output crossing the commit boundary*
- [ ] Commit message explains why, not just what — *Preserves context for the next session*
- [ ] Session cut short if context window shows constraint drift — *Prevents degraded output from a saturated context*

### Close (10 minutes)

- [ ] `git status` shows a clean working tree — *Confirms no unvalidated changes remain*
- [ ] Full test suite passes — *Authoritative verification at session end*
- [ ] Handoff file written and committed — *Eliminates reconstruction cost for the next session*
- [ ] CLAUDE.md updated if any constraint changed — *Prevents next session operating on stale standing instructions*
- [ ] Branch pushed to remote — *Makes work accessible to CI and collaborators*

---

## Export

Copy this block into your CLAUDE.md, agent instructions, or project checklist.

**Key line**
> Velocity comes from repeating a small disciplined loop, not from trusting a large unreviewed leap.

**Agent YAML**
```yaml
vcb_chapter: 35
title: "The Daily Vibe-Coder Workflow"
key_line: "Velocity comes from repeating a small disciplined loop, not from trusting a large unreviewed leap."
thesis: "A daily workflow for AI-assisted development is a discipline system, not a productivity system. The discipline prevents accumulation of unverified output. The velocity is a consequence."
checklist:
  - item: "Session scope is written in one sentence before the first generation."
    protects: "Scope creep that produces unverifiable diffs"
  - item: "Each generation is validated and committed before the next begins."
    protects: "Accumulated unvalidated output that cannot be reviewed thoroughly"
  - item: "Session is cut short when the context shows constraint drift."
    protects: "Degraded output from a saturated context window"
  - item: "Handoff file is written and committed before the session closes."
    protects: "Context reconstruction cost for the next session"
  - item: "CLAUDE.md is updated before closing if any constraint changed."
    protects: "The next session operating on stale standing instructions"
```

**Portable checklist**
- [ ] Is the session scope written in one sentence before generating? — *Protects against scope creep*
- [ ] Is the working tree clean at the start and end of the session? — *Protects against building on an ambiguous or unvalidated base*
- [ ] Is the diff reviewed line by line before each commit? — *Protects against plausible-but-wrong output crossing the commit boundary*
- [ ] Is the handoff file written and committed before closing? — *Protects against reconstruction cost eating the next session*
- [ ] Is the full test suite passing at close of session? — *Protects against leaving a broken baseline for tomorrow*
