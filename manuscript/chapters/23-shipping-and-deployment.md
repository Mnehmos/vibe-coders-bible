# Chapter 23 - Shipping And Deployment

Part: V - AI-Assisted Development Workflows

## Thesis

A production deployment is a commit with a blast radius that extends to every user of the system. The controls that govern code commits apply here more strictly, not less.

## Key Line

Do not deploy what you cannot roll back.

## The Deploy As A Commit

Every deployment decision has the same structure as every code commit: a proposal, a set of validation gates, and a boundary crossing that becomes state.

The proposal is the release candidate. The validation gates are the release criteria: tests, rollback path, observability, migration dry run. The boundary crossing is the deploy. Once the deploy crosses into production, it is state. It is affecting users. Reversing it requires a rollback, not a redo.

The failure mode common in AI-assisted development is treating the deploy as an afterthought - the thing that happens after the code is merged, handled quickly because the hard work is done. The hard work is not done. The deploy is where the consequences arrive.

CI passing is necessary but not sufficient. A test suite that passes in a staging environment with synthetic data does not guarantee correct behavior in production with real load, real data shapes, and real edge cases. CI is one gate. It is not the whole gate sequence.

## Release Gates

Define release gates before the release cycle begins, not during it.

A release gate is a condition that must be true before a deploy proceeds. Gates are not negotiated under deadline pressure. They are defined in advance, checked mechanically, and either pass or do not pass.

Minimum release gates:

| Gate | What it checks | Failure action |
| --- | --- | --- |
| CI passes | Tests, types, lint on release commit | Block deploy |
| Rollback path named | A specific, tested procedure exists | Block deploy |
| On-call confirmed | A human is available to respond | Block deploy |
| Observability in place | Error rates, latency, key metrics visible | Block deploy |
| Migration dry run | Migration completes without error on staging data | Block deploy |
| Smoke test defined | Post-deploy check exists and is runnable | Block deploy |

A gate that is "usually" checked is not a gate. It is a recommendation. Gates are binary: pass or fail.

## Rollback Design

The rollback plan is a documented, tested procedure that exists before the deploy.

"We'll figure out how to roll back if something breaks" is not a rollback plan. It is a statement that rollback has not been designed. Designing rollback under incident pressure, when a production issue is actively affecting users and the team is operating on adrenaline, produces poor rollback procedures.

The rollback plan answers three questions:

1. What is the rollback trigger? (error rate above X%, latency above Y ms, key metric drops below Z)
2. What is the rollback procedure? (specific commands, specific flags, specific sequence)
3. Who executes the rollback? (named role, not "the team")

The rollback procedure must be tested before it is needed. A rollback that has never been executed is a rollback that may not work. Test rollback in staging. Confirm that the procedure returns the system to its prior state. Document the result.

Some changes are harder to roll back than others. A feature flag can be toggled off in seconds. A database migration that dropped a column cannot be reversed without a backup restore. Know which type of change is being deployed before the deploy starts.

## Observability As A Prerequisite

A silent failure is undetectable. Deploy to a system you can see.

Before deploying to production, the following must be visible: error rate for the affected services, latency at the relevant percentiles (p50, p95, p99), and the key business metric the feature is expected to affect. If the deploy breaks something, the symptom shows up in one of these signals first.

Define what a healthy deploy looks like before deploying. Error rate below 0.1%. Latency within 20ms of baseline. The key business metric within 5% of its rolling average. These numbers are specific to the system. Choose them in advance. When the deploy completes, watch the signals for the first 15 minutes. If the signals stay in the healthy range, the deploy is holding. If they move outside it, the rollback trigger has been met.

Observability configured after a deploy catches failures late. Observability configured before a deploy catches failures when they are still small.

## Database Migrations

Database migrations are the highest-risk deployment artifact. They require separate treatment.

A code deploy that goes wrong can be reversed by deploying the previous version. A database migration that drops a column, renames a table, or changes a constraint creates a state change that the code rollback cannot reverse. The database does not roll back with the code.

Migration discipline:

1. Migrations must be backwards-compatible. New columns are nullable or have defaults. Old columns are removed in a separate, later migration after all code that reads them has been removed.
2. Migrations run before the code deploy, not simultaneously. The old code must be able to run against the new schema. The new schema must not break the old code.
3. Migrations are tested against production-sized data in staging. A migration that completes in 200ms on a 10,000-row test table may lock a 50-million-row production table for four minutes.
4. Every migration has a documented reversal procedure. If the reversal is "restore from backup," that is the documented answer. Write it down before the migration runs.

An AI-generated migration script requires the same verification as any migration. Run it. Check the output. Confirm the schema change matches the intent. Do not apply it to production before staging.

## Feature Flags

The feature flag decouples shipping code from shipping behavior.

A feature behind a flag can be merged to main, deployed to production, and enabled for zero users. The code is in production. No user sees it. The flag controls visibility. When the feature is ready, the flag is toggled on - for one percent of users, then ten percent, then everyone. If the metrics show a problem at one percent, the flag is toggled off. The code stays in production. The behavior is gone.

Feature flags are not universally required. They are the correct tool when the feature has unknown production behavior, when rollback by redeployment is too slow, or when the release needs to be staged across user segments.

Feature flags have a cost. They add conditional code. They require a flag service or a config mechanism. They create stale flags that persist after the feature is fully released. Remove feature flags after the feature is fully enabled and stable. A codebase with fifty active feature flags is a codebase with fifty conditional code paths that must be understood and maintained.

## Practical Artifact - Shipping Checklist

This is not bureaucracy. It is the minimum set of questions that surface the most common deployment failures before they reach production.

Complete this checklist before every production deployment. A "no" answer blocks the deploy.

**Pre-deploy: code**
- [ ] CI passes on the release commit - *Catches regressions in tests and types*
- [ ] Diff has been reviewed by a human, not just CI - *Catches intent errors that tests do not cover*
- [ ] No uncommitted local changes are part of this deploy - *Catches accidental inclusions*

**Pre-deploy: rollback**
- [ ] Rollback procedure is documented and specifies exact commands - *Prevents improvised rollback under pressure*
- [ ] Rollback procedure has been tested in staging - *Confirms rollback actually works*
- [ ] Rollback trigger is defined (specific metric thresholds) - *Prevents delayed response to incidents*

**Pre-deploy: observability**
- [ ] Error rate dashboard is visible and shows baseline - *Enables immediate post-deploy comparison*
- [ ] Latency dashboard is visible and shows baseline - *Catches performance regressions*
- [ ] Key business metric is defined and visible - *Catches silent functional failures*
- [ ] Alert thresholds are set for post-deploy window - *Ensures failures surface without manual watching*

**Pre-deploy: migrations**
- [ ] Migration dry run completed on staging - *Prevents surprises from schema changes*
- [ ] Migration is backwards-compatible with current code - *Prevents deploy-order failures*
- [ ] Migration reversal procedure is documented - *Ensures recovery path exists*

**Post-deploy: verification**
- [ ] Smoke test has run and passed - *Confirms basic functionality in production*
- [ ] Error rate is within healthy range for 15 minutes post-deploy - *Confirms the deploy is stable*
- [ ] On-call is aware the deploy has completed - *Ensures someone is watching*

---

## Export

Copy this block into your CLAUDE.md, agent instructions, or project checklist.

**Key line**
> Do not deploy what you cannot roll back.

**Agent YAML**
```yaml
vcb_chapter: 23
title: "Shipping And Deployment"
key_line: "Do not deploy what you cannot roll back."
thesis: "A production deployment is a commit with a blast radius that extends to every user of the system. The controls that govern code commits apply here more strictly, not less."
checklist:
 - item: "Rollback procedure is documented with specific commands before the deploy starts."
 protects: "Improvised recovery under incident pressure"
 - item: "Migration dry run is complete on staging before production deploy."
 protects: "Schema changes that break production unexpectedly"
 - item: "Error rate and latency baselines are visible before deploy."
 protects: "Silent failures that are not caught until they are severe"
 - item: "Release gates are defined in advance, not negotiated at deploy time."
 protects: "Deadline pressure overriding safety controls"
 - item: "Feature flags decouple code ship from behavior ship for high-risk features."
 protects: "Production failures that require a full redeployment to reverse"
```

**Portable checklist**
- [ ] Is the rollback procedure documented with specific commands? - *Protects against improvised recovery under incident pressure*
- [ ] Has the migration dry run completed on staging data? - *Protects against schema changes that lock or break production*
- [ ] Are error rate and latency baselines visible before deploy? - *Protects against silent failures going undetected*
- [ ] Is there an on-call person confirmed available? - *Protects against incidents with no responder*
- [ ] Has the smoke test been defined and is it runnable post-deploy? - *Protects against deploys that break basic functionality undetected*
