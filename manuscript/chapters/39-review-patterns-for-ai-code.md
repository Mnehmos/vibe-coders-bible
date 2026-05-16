# Chapter 39 - Review Patterns For AI Code

Part: VIII - The Field Manual

## Thesis

AI-assisted code review should focus on system behavior, evidence, and risk, not the polish of the explanation.

## Key line

Review the system, not the prose.

## Chapter job

Give reviewers practical lenses for AI-generated diffs.

## Review lanes

- Diff review.
- Test review.
- Security review.
- Performance review.
- Dependency review.
- UX review.
- Data migration review.
- Documentation review.

## Practical artifact

Add a review lane checklist:

| Lane | Question |
| --- | --- |
| Diff | Does every file belong? |
| Test | Would this test fail before the fix? |
| Security | Did capabilities expand? |
| Performance | Did cost or latency change? |
| Dependency | Was a new package necessary? |
| UX | Does the behavior match the product intent? |
| Migration | Can this be rolled back? |

## Draft notes

This chapter should sharpen reviewer instincts without making review theatrical.
