# Chapter 34 - The AI Project Starter Kit

Part: VIII - The Field Manual

## Thesis

The safety infrastructure goes in before the first line of generated code. A blank repository with a chat window is not a starting condition. It is a hazard.

## Key Line

Do not start with a blank chat. Start with a repo that knows how to be helped.

## What The Starter Kit Installs

The starter kit installs the hierarchy of controls in order from strongest to weakest.

Elimination first: repository configuration that blocks dangerous defaults. Substitution second: recommended tools selected and documented, dangerous alternatives absent. Engineering controls third: automated tests, schemas, and CI that catch bad output before it crosses the commit boundary. Administrative controls fourth: CLAUDE.md, PR template, issue template, and ADR folder that give agents and humans shared expectations. Prompting guidance last: in the CLAUDE.md, not in a chat window.

This order matters. Controls installed early govern every agent interaction that follows. Controls written into a chat window on day thirty govern only that session.

The kit is scaffoldable in under an hour. It exists before the first feature prompt. The first commit message is: `chore: install AI safety infrastructure`. That commit makes explicit that the safety system was the first thing built.

## The Files And Their Purpose

| File | What it installs | Control layer |
| --- | --- | --- |
| `.github/workflows/ci.yml` | Tests and type check on every PR, blocks merge on failure | Engineering |
| `.github/PULL_REQUEST_TEMPLATE.md` | Forces documentation of controls run and rollback path | Administrative |
| `.github/ISSUE_TEMPLATE/bug_report.md` | Structures reproduction steps before work begins | Administrative |
| `.github/ISSUE_TEMPLATE/feature_request.md` | Structures acceptance criteria before work begins | Administrative |
| `CLAUDE.md` | Project overview, constraints, scope limits, verification command | Administrative |
| `schemas/` | Canonical location for data contracts | Engineering |
| `tests/smoke.test.js` | Proves the test infrastructure works | Engineering |
| `docs/decisions/000-adr-template.md` | ADR template for architecture decisions | Administrative |
| `.agent/handoff-template.md` | Session handoff template (see Ch 36) | Administrative |

## Practical Artifact — Starter Kit File Contents

Each file below is production-ready. Copy verbatim and fill in the project-specific fields.

---

### `.github/workflows/ci.yml`

```yaml
name: CI

on:
  pull_request:
    branches: [main]
  push:
    branches: [main]

jobs:
  verify:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Set up Node
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Type check
        run: npm run typecheck

      - name: Lint
        run: npm run lint

      - name: Test
        run: npm test

      - name: Build
        run: npm run build
```

Replace `npm` with `yarn`, `pnpm`, or the language-appropriate equivalents. Add steps for schema validation, migration dry run, or contract tests as the project grows.

---

### `.github/PULL_REQUEST_TEMPLATE.md`

```markdown
## What this PR does

<!-- One sentence. What behavior changes? -->

## Controls that ran

- [ ] Tests pass locally (`npm test`)
- [ ] Type check passes (`npm run typecheck`)
- [ ] Lint passes (`npm run lint`)
- [ ] CI is green on this branch

## Blast radius

<!-- What breaks if this PR has a defect?
     Who is affected? How quickly would we know? -->

## Rollback path

<!-- If this deploy needs to be reversed, how?
     Feature flag? Redeploy prior version? Migration reversal? -->

## Agent-generated content review

- [ ] I read the full diff, not just the summary
- [ ] Every AI-generated section was verified against current behavior
- [ ] No AI-generated credentials, secrets, or placeholder values remain
```

---

### `.github/ISSUE_TEMPLATE/bug_report.md`

```markdown
---
name: Bug Report
about: Something is not working correctly
labels: bug
---

## Observed behavior

<!-- What happened? Be specific. -->

## Expected behavior

<!-- What should have happened? -->

## Reproduction steps

1.
2.
3.

## Environment

- Version/commit:
- OS:
- Relevant config:

## Logs or error output

<!-- Paste the exact error message or stack trace here -->

## Have you reproduced this locally?

- [ ] Yes
- [ ] No — describe what you tried:
```

---

### `.github/ISSUE_TEMPLATE/feature_request.md`

```markdown
---
name: Feature Request
about: A new behavior to add to the system
labels: feature
---

## The problem this solves

<!-- What user or system need does this address? -->

## Proposed behavior

<!-- What should the system do? Be specific. -->

## Acceptance criteria

<!-- How will we know this is done?
     Write these as testable statements:
     - Given X, when Y, then Z -->
- [ ]
- [ ]
- [ ]

## Out of scope

<!-- What related things should this PR NOT do? -->

## Blast radius

<!-- What existing behavior could this affect? -->
```

---

### `CLAUDE.md`

```markdown
# Project: [Name]

## What this is

<!-- One paragraph. What does this system do? Who uses it?
     What problem does it solve? -->

## Primary constraint

<!-- The single most important rule for this codebase.
     Example: "All data mutations go through the service layer,
     never direct DB calls from routes."
     Example: "Every public function must have a unit test
     before it is committed." -->

## Verification command

Run this before every commit:

    npm test && npm run typecheck && npm run lint

## Architecture

<!-- Two to five sentences on the structure.
     What are the main layers? Where does data flow?
     What is the entry point? -->

## Do not touch

<!-- List files, directories, or patterns the agent must not modify.
     Example: "Do not modify anything in generated/ -- auto-generated."
     Example: "Do not edit migrations/ directly -- use the script." -->

## Scope limits

<!-- What is out of scope for agent work in this project?
     Example: "Do not generate database migrations. A human runs them."
     Example: "Do not modify deployment configs." -->

## Key files

<!-- Three to eight files that define how the system works. -->

| File | Purpose |
| --- | --- |
| `src/index.ts` | Application entry point |
| `src/schema.ts` | Core data types |
| `tests/smoke.test.js` | If this fails, the infrastructure is broken |

## Session start checklist

Before generating anything:
1. Read this file
2. Read `.agent/handoff.md` if it exists
3. Run `npm test` and confirm tests pass
4. Confirm the active branch with `git status`
```

---

### `tests/smoke.test.js`

```javascript
// smoke.test.js
// Verifies that the test infrastructure itself is working.
// If this test fails, the problem is the test runner, not the application.

describe('smoke', () => {
  it('test infrastructure is working', () => {
    expect(true).toBe(true);
  });

  it('project can be imported without crashing', () => {
    // Replace with the actual entry point when the project has one.
    // Example: const app = require('../src/index');
    // expect(app).toBeDefined();
    expect(1 + 1).toBe(2);
  });
});
```

---

### `docs/decisions/000-adr-template.md`

```markdown
# ADR 000: [Decision title]

**Date**: <!-- YYYY-MM-DD -->
**Status**: Proposed | Accepted | Deprecated | Superseded by ADR-NNN

## Context

<!-- What situation required a decision?
     What constraints existed? What were the forces at play? -->

## Decision

<!-- What was decided? State it as a directive.
     "We will use X." "We will not do Y." -->

## Alternatives considered

<!-- What other options were evaluated? Why were they rejected? -->

## Consequences

<!-- What becomes easier because of this decision?
     What becomes harder? -->

## Review trigger

<!-- Under what conditions should this decision be revisited?
     Example: "When the user count exceeds 100k."
     Example: "When we add a second service." -->
```

---

### `.agent/handoff-template.md`

See Chapter 36 for the complete handoff file template. Copy it to `.agent/handoff.md` at the end of every session and commit it.

## The First Commit

After scaffolding all files, make one commit:

```
git add .github/ CLAUDE.md schemas/ tests/ docs/ .agent/
git commit -m "chore: install AI safety infrastructure

Installs the hierarchy of controls before the first generated feature:
- CI workflow: tests, typecheck, lint, build on every PR
- PR template: requires controls checklist and rollback path
- Issue templates: bug report and feature request with acceptance criteria
- CLAUDE.md: project constraints and agent session protocol
- schemas/: canonical location for data contracts
- tests/smoke.test.js: confirms test infrastructure runs
- docs/decisions/: ADR template for architecture decisions
- .agent/handoff-template.md: session handoff protocol"
```

This commit is the first commit. The project's history begins with controls installed.

## Starter Kit Inventory

| Item | Status before first feature PR |
| --- | --- |
| CI workflow runs on every PR | Required |
| PR template includes controls checklist | Required |
| Issue templates exist for bugs and features | Required |
| CLAUDE.md has project name, constraint, and verification command | Required |
| `schemas/` directory exists | Required |
| Smoke test runs and passes | Required |
| ADR template exists in `docs/decisions/` | Required |
| `.agent/` directory with handoff template | Required |

A starter kit with all eight items present is complete. A project that starts without these items will add them later, one incident at a time, at higher cost.

---

## Export

Copy this block into your CLAUDE.md, agent instructions, or project checklist.

**Key line**
> Do not start with a blank chat. Start with a repo that knows how to be helped.

**Agent YAML**
```yaml
vcb_chapter: 34
title: "The AI Project Starter Kit"
key_line: "Do not start with a blank chat. Start with a repo that knows how to be helped."
thesis: "The safety infrastructure goes in before the first line of generated code. A blank repository with a chat window is not a starting condition. It is a hazard."
checklist:
  - item: "CI workflow is present and blocks PR merge on test or typecheck failure."
    protects: "Unvalidated output crossing the commit boundary"
  - item: "PR template requires listing which controls ran and what the rollback path is."
    protects: "PRs merged without evidence of validation"
  - item: "CLAUDE.md contains the project primary constraint and verification command."
    protects: "Agents operating without project-specific guardrails"
  - item: "Smoke test runs and passes before first feature is started."
    protects: "Test infrastructure failures disguised as application failures"
  - item: "ADR template exists before the first architecture decision is made."
    protects: "Architecture decisions that cannot be traced or revisited"
```

**Portable checklist**
- [ ] Does CI block merge on test or typecheck failure? — *Protects against unvalidated output merging automatically*
- [ ] Does the PR template require controls evidence and a rollback path? — *Protects against PRs merged with no verification record*
- [ ] Does CLAUDE.md specify what the agent must not touch? — *Protects against agents modifying generated or infra-controlled files*
- [ ] Does a smoke test exist and pass? — *Protects against test infrastructure failures going undetected*
- [ ] Is the first commit explicitly the safety infrastructure commit? — *Makes the control installation legible in the project history*
