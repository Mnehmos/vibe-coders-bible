# Chapter 33 - The Over-Automation Trap

Part: VII - Failure Modes

## Thesis

Autonomy should be earned by gates.

## Key line

The agent earns autonomy by passing controls, not by sounding confident.

## Chapter job

Give teams a way to decide when to keep human approval, allow auto-commit, allow auto-merge, or allow auto-deploy.

## Main beats

- When to keep human approval.
- When to allow auto-commit.
- When to allow auto-merge.
- When to allow auto-deploy.
- Confidence based on test strength, not model confidence.
- Autonomy by domain and blast radius.
- Rollback and audit requirements.

## Practical artifact

Add an autonomy ladder:

| Level | Agent may | Required controls |
| --- | --- | --- |
| 0 | Suggest only | Human review |
| 1 | Edit branch | Tests and diff review |
| 2 | Open PR | CI and PR template |
| 3 | Auto-merge low-risk changes | Strong tests and ownership rules |
| 4 | Deploy | Release gates, rollback, observability |

## Draft notes

This chapter should be firm. Autonomy is not a vibe; it is an earned permission.
