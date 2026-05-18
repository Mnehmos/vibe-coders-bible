# Chapter 36 - The Agent Handoff Protocol

Part: VIII - The Field Manual

## Thesis

The model has no memory between sessions. When a session ends, everything in the context window is gone. The handoff file is the only briefing the next agent gets.

## Key Line

Write the handoff as if the next agent has never heard of this project.

---

## The Memory Problem

The context window is not memory. It is a working surface with a size limit. When the session ends, it ends completely. The next session - whether that is five minutes later or five days later, a different agent or the same developer - starts blank.

This is not a bug. It is the architecture. The failure mode is treating the context window as if it were persistent.

Projects that skip handoff documentation are not saving time. They are burning it on re-discovery. Every session starts with reconstruction: reading recent commits to remember what changed, re-reading files to understand current state, re-discovering why a decision was made by tracing through code that does not explain itself. This work is expensive and invisible. It does not ship features. It restores context that should have been written down.

The handoff file eliminates re-discovery.

## What The Handoff File Contains

A handoff file has seven components. Each one answers a question the next agent will ask.

| Component | Question it answers |
|---|---|
| Current state | What is the repo condition right now? |
| What was done | What changed during this session? |
| Why decisions were made | What reasoning produced each choice? |
| Deferred work | What was identified but not started? |
| Open questions | What needs resolution before proceeding? |
| Known blockers | What is actively preventing progress? |
| The next step | What is the single first action to take? |

A handoff file that answers all seven questions is complete. One that skips the "why" answers six.

## Writing The Current State Section

Current state is the most urgent section. The next agent needs it before anything else.

It contains four fields: the active branch, the hash and message of the last commit, the test status at the end of the session, and a one-line description of what the codebase can do right now. "Tests pass. Feature X is wired but not styled. Feature Y is broken and skipped." That is a current state.

Be specific about broken things. "Some tests are failing" is not a current state. "Three tests in `auth.spec.ts` fail because the mock for `verifyToken` was not updated after the signature change in commit `3a7f2c1`" is a current state.

## Writing The Decision Log

Every non-obvious decision made during the session belongs in the decision log.

A decision is non-obvious when: it chose one approach over another, it deferred something that could have been done now, it accepted a known limitation, or it changed the project's direction in any way.

The format is simple. What was the decision, what were the alternatives, and what was the constraint or reasoning that produced the choice. Three sentences maximum per decision.

Do not log routine implementation details. Log the fork in the road.

The "why" is the most frequently omitted field and the most expensive to recover. Code shows what was chosen. It rarely shows why another approach was rejected. The decision log fills that gap.

## Writing The Next Step

The next step section contains exactly one action.

Not a list of possibilities. Not a summary of the backlog. One concrete action the next agent should take first.

It is specific enough that a developer who has never seen this project can execute it. "Run the tests" is not specific. "Run `npm test -- --testPathPattern=auth` and check whether `verifyToken` mock failure is resolved by the stub in `tests/mocks/auth.ts`" is specific.

Specificity matters because the next session starts blank. The next agent reads the handoff first. If the next step requires interpretation, the agent will interpret it - and the interpretation may be wrong. Remove the ambiguity in the handoff.

## Handoff Anti-Patterns

Four patterns make a handoff file useless.

**The vague summary.** "Was working on the auth feature." This tells the next agent nothing they cannot get from `git log`. A handoff that summarizes without specifying wastes the time of everyone who reads it.

**The redirect.** "See the chat logs" or "check Slack." The next agent cannot see the chat logs. That is the entire reason for writing a handoff. Never reference an artifact the next agent cannot access.

**The false status.** "Everything is fine." This triggers distrust immediately. "Everything is fine" means "I did not check." If tests pass, say the tests pass and name which suite. If something is broken, name it.

**The missing why.** Logging what was done without logging why it was done forces the next agent to re-derive the reasoning from the code. Code takes ten seconds to change. The reasoning that justified a specific implementation takes considerably longer to reconstruct.

## Where The File Lives

The handoff file lives at `.agent/handoff.md` in the repo root. It is checked in. It is part of the commit that closes the session.

This is the critical constraint: the handoff file must be committed. A handoff file that lives only on the local filesystem does not survive machine changes, collaborator onboarding, or CI agents. Committed handoffs are versionable, diffable, and accessible to any agent or developer with repo access.

One file per project. The file is overwritten each session, not appended. Git provides the full history of previous handoffs via `git log -p .agent/handoff.md`. The current file is always the current state.

## The CLAUDE.md Update Trigger

CLAUDE.md is the project's standing instructions - the constraints, architecture, and workflow the agent reads at the start of every session. The handoff file is the session-specific state.

When a session changes a project constraint - a new dependency, a changed architecture decision, a new tool added to the workflow, a pattern that was adopted or rejected - CLAUDE.md must be updated. The handoff file records what changed and why. The next session reads CLAUDE.md first to understand the updated standing instructions, then reads the handoff to understand the current state.

If CLAUDE.md is stale, agents will contradict it. If the handoff does not note that CLAUDE.md was updated, the next agent may not know to re-read it. Both gaps produce drift.

## Synch MCP And The Handoff File

Synch MCP provides infrastructure for agent coordination: persistent active context, a filing cabinet with indexed file summaries, a spatial map, a lock manager, and a structured handoff protocol. These components persist state that would otherwise live only in the context window.

The `.agent/handoff.md` file is the human-readable, git-committed complement. It works when no infrastructure is available. It works when Synch MCP is not deployed. It works for a solo developer resuming the next morning.

The two are not redundant. Synch MCP's active context is session-scoped and infrastructure-dependent. The handoff file in `.agent/` is permanent, versionable, and reads anywhere git reads.

Use both when Synch MCP is available. Use the handoff file when it is not.

---

## Practical Artifact - Handoff File Template

The following is the complete `.agent/handoff.md` template. Copy it verbatim. Fill every section before committing the close-of-session commit.

```markdown
# Agent Handoff

## Session Metadata

- **Date/Time**: <!-- e.g., 2026-05-17 14:32 UTC -->
- **Branch**: <!-- e.g., feature/auth-refactor -->
- **Last commit**: <!-- e.g., 3a7f2c1 - "refactor: extract verifyToken to auth module" -->
- **Test status**: <!-- e.g., 47 pass, 3 skip, 0 fail - or name any failures -->

---

## Current State

<!-- One paragraph. What is the codebase capable of right now?
 What is working? What is broken? What is in progress?
 Example: "Auth login flow works end-to-end. Token refresh is wired but
 not tested. The profile endpoint is stubbed and returns 501." -->

---

## What Was Done This Session

<!-- Bullet list. What changed? Be specific - file names, function names,
 commit hashes where useful.
 Example:
 - Extracted `verifyToken` from `auth.ts` into `auth/token.ts`
 - Updated mock in `tests/mocks/auth.ts` to match new signature
 - Added `refreshToken` route stub in `routes/auth.ts` (returns 501) -->

---

## Decision Log

<!-- One block per decision. Format: Decision -> Alternatives -> Reasoning.
 Example:
 Decision: Stubbed refreshToken rather than implementing it.
 Alternatives: Full implementation; skip entirely.
 Reasoning: The OAuth provider's refresh endpoint is behind a VPN that
 is not accessible in CI. Stub prevents test failures until access is
 resolved. -->

---

## Deferred Work

<!-- What was identified but not started? Why was it deferred?
 Example:
 - Token expiry handling: deferred - depends on refresh flow, which is
 blocked (see Blockers).
 - Rate limiting middleware: deferred - out of scope for this sprint. -->

---

## Open Questions

<!-- What needs a decision before work can proceed?
 Example:
 - Should token rotation be opt-in per user or mandatory?
 (Blocked on product decision - see issue #47.) -->

---

## Known Blockers

<!-- Specific technical or external blockers. Name them exactly.
 Example:
 - OAuth provider refresh endpoint not accessible outside VPN. Affects
 `refreshToken` implementation. Workaround: stub in place. -->

---

## The Next Step

<!-- Exactly one action. Specific enough to execute without asking questions.
 Example:
 Run `npm test -- --testPathPattern=token` to confirm the extracted
 `verifyToken` function passes its unit suite before building the
 refresh flow on top of it. -->

---

## CLAUDE.md Changes This Session

<!-- Did any project constraints change? List what was updated and why.
 If nothing changed: write "None."
 Example:
 - Added rule: all token operations must go through `auth/token.ts`.
 (Reason: prevents auth logic from scattering across routes.) -->
```

---

## Export

Copy this block into your CLAUDE.md, agent instructions, or project checklist.

**Key line**
> Write the handoff as if the next agent has never heard of this project.

**Agent YAML**
```yaml
vcb_chapter: 36
title: "The Agent Handoff Protocol"
key_line: "Write the handoff as if the next agent has never heard of this project."
thesis: "The model has no memory between sessions. When a session ends, everything in the context window is gone. The handoff file is the only briefing the next agent gets."
checklist:
 - item: "Does the handoff include branch, last commit hash, and test status?"
 protects: "Against starting work on a broken or ambiguous base"
 - item: "Is the current state section specific about what is broken?"
 protects: "Against false confidence in codebase health"
 - item: "Does the decision log record the why, not just the what?"
 protects: "Against re-deriving reasoning that was already resolved"
 - item: "Is deferred work explicitly named with a reason?"
 protects: "Against accidentally re-doing or permanently dropping scoped work"
 - item: "Is there exactly one next step, specific enough to execute without clarification?"
 protects: "Against session startup confusion and wrong-first-action waste"
 - item: "Is the handoff file committed as part of the close-of-session commit?"
 protects: "Against handoff loss on machine change, collaborator onboarding, or CI agents"
 - item: "Does the handoff note whether CLAUDE.md was updated this session?"
 protects: "Against the next session operating on stale standing instructions"
 - item: "Does the handoff reference only artifacts the next agent can access?"
 protects: "Against redirects to chat logs, Slack threads, or local-only files"
```

**Portable checklist**
- [ ] Branch, last commit hash, and test status recorded - *prevents starting on a broken base*
- [ ] Current state names broken things specifically - *prevents false confidence*
- [ ] Decision log includes the why behind each choice - *prevents re-deriving resolved reasoning*
- [ ] Deferred work is named with a reason for deferral - *prevents accidental drops*
- [ ] One next step, specific enough to execute without clarification - *prevents session startup confusion*
- [ ] Handoff file committed as part of close-of-session commit - *prevents loss on machine or collaborator change*
- [ ] CLAUDE.md update status noted - *prevents next session operating on stale instructions*
- [ ] No references to artifacts the next agent cannot access - *prevents dead-end redirects*
