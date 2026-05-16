# Minimal Trust But Verify Workflow

This is the smallest useful loop for AI-assisted code changes.

## 1. Create a scoped branch

```sh
git switch -c fix/descriptive-branch-name
```

## 2. Give the agent a bounded task

Include:

- Goal.
- Files in scope.
- Files out of scope.
- Validation command.
- Handoff requirements.

## 3. Treat the patch as a proposal

Inspect what changed:

```sh
git diff --stat
git diff
```

Reject unrelated changes before validating.

## 4. Validate the claim

Run the narrowest meaningful check:

```sh
# Example only
npm test -- path/to/relevant.test.ts
```

If the change fixes a bug, prove the bug existed before the fix when practical.

## 5. Record the evidence

In the PR, include:

- What changed.
- What command ran.
- What passed.
- What was not checked.

## 6. Commit only the intended files

```sh
git status --short
git add path/to/intended-file
git commit -m "Fix descriptive behavior"
```

The commit should describe the project behavior, not the agent.
