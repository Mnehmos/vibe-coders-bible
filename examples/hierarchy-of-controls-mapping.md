# Hierarchy Of Controls Mapping

Use this mapping when converting "be careful" advice into stronger repo controls.

| Failure mode | Weak control | Stronger control |
| --- | --- | --- |
| Agent edits unrelated files | "Stay in scope" prompt | Path allow-list, small branch, PR checklist scope review |
| Agent invents config keys | Manual review | Schema validation and config tests |
| Agent updates snapshots blindly | Reviewer attention | Snapshot review policy and focused visual checks |
| Agent weakens tests | "Do not remove assertions" prompt | Test diff review, mutation checks where useful |
| Agent runs destructive command | Warning in instructions | Dry-run default, confirmation gate, restricted tool wrapper |
| Agent misses generated files | Reminder in PR | CI generated-file check |
| Agent changes public API accidentally | Reviewer attention | Contract tests and type-level compatibility checks |
| Agent relies on stale docs | Manual correction | Versioned docs with examples validated by tests |

## Example: bug fix

Failure mode: the agent fixes the visible bug but breaks an edge case.

Controls:

- Eliminate: remove the ambiguous branch if it is no longer needed.
- Substitute: use a shared parser instead of duplicated conditional logic.
- Engineer: add a regression test for the edge case.
- Administer: require the PR checklist to name reproduction steps.
- PPE: review the diff.

## Example: tool action

Failure mode: the agent runs a broad command that changes generated files across the repo.

Controls:

- Eliminate: remove write access to generated directories from the task.
- Substitute: provide a narrow script for the intended generation.
- Engineer: add a generated-file consistency check in CI.
- Administer: require generated file changes to be called out in PRs.
- PPE: inspect the generated diff.
