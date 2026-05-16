# Mixed Model Output Routing

An LLM response is not one thing. It can contain prose, code, shell commands, JSON, citations, claims, tests, public text, hidden assumptions, and tool calls in the same answer.

Serious AI-assisted systems route those outputs into different trust lanes.

## Routing table

| Output type | Risk | Correct destination |
| --- | --- | --- |
| Explanation | Medium | Human review |
| Code diff | High | Tests, lint, typecheck, review |
| Shell command | High | Sandbox, allowlist, approval |
| Database migration | High | Backup, dry run, rollback plan |
| Citation or source claim | High | Source validation |
| Structured JSON | Medium | Schema validation |
| Tool call | High | Capability boundary |
| UI copy | Medium | Product and human review |
| Public analysis | High | Citation and provenance review |

## Example: coding agent answer

Model output:

```text
The bug happens because the token refresh endpoint returns 401.
Run this command to fix dependencies:
npm install auth-helper@latest
Here is the patch...
```

Routing:

- The explanation is a claim. Verify it against logs, tests, or code.
- The shell command is a dangerous action. Do not run it without dependency review.
- The patch is a proposal. Route it through tests, typecheck, and diff review.
- Any version claim needs source validation.

## Example: public content answer

Model output:

```text
The city passed the ordinance unanimously in 2024.
```

Routing:

- Treat the statement as an unsupported source claim.
- Find primary source evidence.
- Record provenance.
- Publish only after verification.

## Rule

Do not ask whether the answer is trustworthy. Ask which parts of the answer belong in which trust lane.
