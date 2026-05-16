# Appendix C - Minimal Repo Setup

Use this structure for a project that wants to be agent-friendly from the start.

```text
project/
  README.md
  AGENTS.md
  PROJECT_CONTEXT.md
  docs/
    architecture.md
    decisions/
  tests/
  scripts/
  .github/
    ISSUE_TEMPLATE/
    pull_request_template.md
```

## Minimum files

- `README.md`: what this project is and how to run it.
- `AGENTS.md`: how agents should work in the repo.
- `PROJECT_CONTEXT.md`: durable context and constraints.
- `CONTRIBUTING.md`: contribution workflow.
- `.github/PULL_REQUEST_TEMPLATE.md`: validation evidence.
- `tests/`: executable memory.
- `scripts/`: repeatable project operations.

## Minimum commands

Every repo should name the commands for:

- Install.
- Format.
- Lint.
- Typecheck.
- Test.
- Build.
- Run locally.
