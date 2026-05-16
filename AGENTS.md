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
