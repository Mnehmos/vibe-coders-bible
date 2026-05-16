# AGENTS.md

Instructions for AI agents working in this repository.

## Operating model

- Treat every generated change as a proposal until verified.
- Keep changes scoped to the requested task.
- Prefer small diffs.
- Do not invent APIs, files, commands, or project facts.
- Read existing project instructions before editing.
- Leave a handoff when work is incomplete.

## Validation

Before reporting completion, run the relevant commands:

```sh
# Fill in project commands
```

If a command cannot be run, say why.

## Boundaries

Do not:

- Commit secrets.
- Run destructive commands without explicit approval.
- Change production configuration without review.
- Weaken tests to make a change pass.
- Mix unrelated cleanup with the requested change.

## Handoff

Report:

- Files changed.
- Commands run.
- Tests added or updated.
- Risks and assumptions.
- Remaining work.
