# Hierarchy Of Controls Checklist

Use this checklist to move AI-assisted workflow safety above prompts and attention.

## 1. Elimination

- [ ] Secrets are unavailable to routine agents.
- [ ] Production credentials are unavailable to routine agents.
- [ ] Destructive commands are unavailable or gated.
- [ ] Broad filesystem writes are avoided.
- [ ] Raw production database writes are impossible from agent workflows.

## 2. Substitution

- [ ] Raw shell access is replaced with task runners where practical.
- [ ] Raw SQL access is replaced with migrations or typed data tools.
- [ ] Freeform JSON is replaced with schema-validated structures.
- [ ] Raw HTTP calls are replaced with typed clients.
- [ ] Destructive actions have dry-run modes.

## 3. Engineering Controls

- [ ] Tests cover the changed behavior.
- [ ] Typecheck or equivalent validation runs.
- [ ] Schemas validate machine-actionable output.
- [ ] CI blocks invalid states.
- [ ] Branch protection or review gates exist for risky changes.

## 4. Administrative Controls

- [ ] Issue or brief defines the task.
- [ ] PR checklist captures validation evidence.
- [ ] Handoff names risks and next steps.
- [ ] Release checklist covers rollback when relevant.
- [ ] Ownership of the commit is clear.

## 5. PPE

- [ ] Prompt names scope and constraints.
- [ ] Prompt asks before destructive actions.
- [ ] Human reviewed the diff.
- [ ] Human understands the accepted change.

## Rule

If the only control is "the prompt told the model to be careful," move the risk higher in the hierarchy.
