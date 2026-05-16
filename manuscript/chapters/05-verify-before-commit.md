# Chapter 5 - Verify Before Commit

Part: II - Trust, But Verify

## Thesis

Verification must happen before state changes, deployment, publication, or trust transfer.

## Key line

Hallucination is inevitable. Silent commit is optional.

## Chapter job

Broaden "commit" beyond Git. A commit is any moment when false output becomes accepted state.

## Main beats

- Code commit.
- Database commit.
- Public content commit.
- Production deployment.
- User-visible state.
- Documentation claims.
- Security assumptions.
- Trust transfer between agents, humans, and systems.

## Core distinction

```text
Generation-level hallucination:
  The model emits something false.

Commit-level hallucination:
  The system accepts something false as state.
```

## Practical artifact

Add a "commit boundary map" that helps teams identify where verification must happen before state changes.

## Draft notes

This chapter should make the book feel bigger than code review. The idea applies to publishing, databases, deployments, and agent tool calls.
