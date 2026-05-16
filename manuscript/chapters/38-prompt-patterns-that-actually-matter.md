# Chapter 38 - Prompt Patterns That Actually Matter

Part: VIII - The Field Manual

## Thesis

The useful prompt patterns are the ones that connect model behavior to controls.

## Key line

Prompts matter when they produce artifacts the system can verify.

## Chapter job

Avoid becoming a prompt collection. Teach patterns tied to validation.

## Patterns

- Plan before patch.
- Test before implementation.
- Explain diff risk.
- Generate negative fixtures.
- Update docs from diff.
- Produce rollback plan.
- Identify assumptions.
- Ask for minimal change.
- Compare alternatives.
- Write handoff.

## Practical artifact

Add a prompt pattern table:

| Pattern | Produces | Validator |
| --- | --- | --- |
| Test before implementation | Test file | Fails before fix |
| Rollback plan | Release note | Operator review |
| Negative fixtures | Edge cases | Regression suite |
| Docs from diff | Documentation patch | Diff and behavior review |

## Draft notes

Every prompt pattern should point to an artifact.
