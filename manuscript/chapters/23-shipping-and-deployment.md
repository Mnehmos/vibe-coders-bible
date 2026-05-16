# Chapter 23 - Shipping And Deployment

Part: V - AI-Assisted Development Workflows

## Thesis

Deployment is a commit boundary with users on the other side.

## Key line

Do not let the agent deploy what the system cannot roll back.

## Chapter job

Apply trust-but-verify controls to releases, environments, migrations, and observability.

## Main beats

- CI/CD.
- Staging.
- Environment variables.
- Secrets.
- Rollbacks.
- Migrations.
- Observability.
- Smoke tests.
- Release notes.
- Post-deploy checks.

## Practical artifact

Deliverable: `RELEASE_CHECKLIST.md`

Minimum release evidence:

- Build passed.
- Tests passed.
- Migration dry run complete.
- Rollback path named.
- Smoke test defined.
- Logs and metrics checked.
- Release note drafted.

## Draft notes

Connect deployment to elimination controls: production access should be unavailable to routine generation.
