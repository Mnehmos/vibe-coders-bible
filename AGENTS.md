# AGENTS.md

Instructions for AI agents working in this repository.

## Project identity

This repository contains The Vibe Coder's Bible, a Markdown-first book and field manual by Mnehmos from The Mnemosyne Research Institute.

The core doctrine:

- Trust AI to propose.
- Verify before commit.
- Design systems where hallucination can exist, but cannot silently become truth.

The spine:

> Attention to detail was always a labor constraint.
> AI does not make detail unnecessary.
> AI makes detail affordable.

## Operating rules

- Treat every generated change as a proposal until verified.
- Keep changes scoped to the requested task.
- Preserve the public-facing tone: direct, practical, sharp, serious, and welcoming to builders.
- Do not sneer at vibe coders.
- Do not worship AI.
- Do not invent citations or research.
- Avoid self-referential process language such as "this revision," "this audit," "we added," or "as discussed above."
- Avoid generic "AI is transforming everything" filler.

## Admin Work Protocol

Administrative work is part of the safety system. No meaningful AI-assisted work begins without context, and no meaningful work ends without trace.

Before editing, read:

- `README.md`
- `AGENTS.md`
- `PROJECT_CONTEXT.md`
- `CONTRIBUTING.md`
- The current issue or request.
- Relevant issue comments.
- Relevant PR comments.
- Recent commits touching affected files.
- Current branch, status, and diff.

After editing, report:

- What changed.
- Why it changed.
- Files touched.
- Checks run and results.
- Risks remaining.
- Docs updated.
- Follow-up issues needed.

For non-trivial work, simulate these roles:

1. Project Historian: reads history, comments, issues, PRs, and prior decisions.
2. Issue Steward: scopes work and defines acceptance criteria.
3. QA Gatekeeper: defines and records verification.
4. Documentation Steward: keeps docs/templates aligned.
5. Evidence Clerk: checks public claims against repo evidence.
6. Human Reviewer: final judgment layer.

The human reviewer approves evidence, not confidence.

## Source layout

- `manuscript/` is the canonical book source.
- `manuscript/MANIFEST.md` defines the build and reading order.
- `templates/` contains copy-paste field manual artifacts.
- `examples/` contains concrete workflow examples.
- `publishing/` contains release planning for PDF, DOCX, ebook, and audiobook.
- `references/` contains source references; use them for context, not as canonical manuscript files.

## Editing guidance

- Keep chapters aligned with `manuscript/MANIFEST.md`.
- Each chapter scaffold should include a thesis, key line, chapter job, main beats, and practical artifact.
- Put reusable checklists and prompts in `templates/`.
- Put examples in `examples/`.
- Prefer Markdown-first changes.
- Do not add a heavy build system unless explicitly requested.

## Validation

Before reporting completion, run:

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File scripts\check-manifest.ps1
```

Also run a text hygiene scan when practical:

```powershell
rg --pcre2 "[^\x00-\x7F]" --hidden -n -g "!/.git/**" -g "!references/**" .
```

If a command cannot be run, say why.

## Handoff

Report:

- Files changed.
- Commands run.
- Tests or checks passed.
- Risks and assumptions.
- Remaining work.
