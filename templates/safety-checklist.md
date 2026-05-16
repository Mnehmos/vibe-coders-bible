# AI-Assisted Change Safety Checklist

Use this checklist before committing or opening a PR for AI-assisted work.

## Scope

- [ ] The task had a clear goal.
- [ ] The changed files match the expected scope.
- [ ] Unrelated cleanup is not mixed with behavior changes.
- [ ] Generated files, lockfiles, and config changes are intentional.

## Verification

- [ ] I read the diff.
- [ ] I understand why each file changed.
- [ ] I reproduced the bug or target behavior when applicable.
- [ ] I ran the narrowest meaningful validation.
- [ ] I added or updated a regression test when appropriate.
- [ ] I checked that tests would fail for the old behavior when practical.

## Hierarchy of controls

- [ ] Can the failure mode be eliminated?
- [ ] Can a safer substitute be used?
- [ ] Can a guardrail enforce the rule?
- [ ] Can the process make evidence visible?
- [ ] Is human review being used as the last line instead of the only line?

## Handoff

- [ ] Commands and results are recorded.
- [ ] Known risks are named.
- [ ] Remaining uncertainty is visible to reviewers.
