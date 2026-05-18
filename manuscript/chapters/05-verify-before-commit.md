# Chapter 5 - Verify Before Commit

Part: II - Trust, But Verify

## Thesis

Verification must happen before state changes, deployment, publication, or trust transfer.

## Key Line

Hallucination is inevitable. Silent commit is optional.

## Commit Is Bigger Than Git

When most developers hear "commit," they think of `git commit`.

That is too small.

A commit is any moment when output becomes accepted state. It is the point at which something generated, proposed, or asserted crosses from being a candidate into being real.

Git commit is one example. But the concept applies everywhere a system accepts input as truth.

Clicking "Apply migration" is a commit. Pressing "Publish" is a commit. Deploying to production is a commit. Inserting a row is a commit. Accepting an agent's tool call result is a commit. Adding a claim to a public document is a commit. Updating stored credentials is a commit. Signing off on a security assumption is a commit.

Every one of these moments has a before and an after. Before, the output is a proposal. After, it is state. The gap between before and after is where verification must happen. Not after. Not eventually. Before.

The failure to understand this is how AI slop enters systems that nobody intended to be sloppy.

## Generation-Level vs. Commit-Level Hallucination

There are two distinct problems here, and conflating them leads to both the wrong fears and the wrong solutions.

Generation-level hallucination is when the model emits something false. The model names an API that does not exist. It proposes a schema that conflicts with the actual database. It cites a paper that was never published. It writes a test that passes when it should fail. This is normal. It happens constantly. It is not the thing to be most afraid of.

Commit-level hallucination is when the system accepts something false as state.

The model can hallucinate freely in the proposal lane. That is acceptable. The model cannot hallucinate into the production database, the public knowledge base, the deployed codebase, or the trust model - not because hallucination stops there, but because those are the places where false state has real consequences that do not automatically reverse.

The distinction matters because the correct response to each is different.

Generation-level hallucination is managed by expecting it and designing systems that catch it before output crosses a commit boundary. You do not try to prevent the model from hallucinating. You prevent hallucinations from becoming state.

Commit-level hallucination is managed by enforcing verification gates that every proposal must pass before it is accepted as real.

The key line says it plainly: hallucination is inevitable. Silent commit is optional.

The hallucination you cannot prevent. The gate you can choose to build.

## The Code Commit

The most familiar commit. A model proposes a diff. The developer reads it. It looks right.

Silent commit: the developer adds the changes, sees no compilation errors, and pushes.

What it costs: the change introduces a subtle race condition that only appears under concurrent load. The bug lives in production for three weeks before anyone correlates it with the commit. Nobody knows what the original code was supposed to do, so the fix requires archaeology.

The verification gate: automated tests, type checking, and at minimum, a diff review that asks "what assumption did the model make that I have not verified?" A passing test suite does not guarantee correctness. It does mean the change has been subjected to something more rigorous than appearance.

## The Database Commit

A model proposes a migration. The developer reviews the SQL. It looks reasonable.

Silent commit: the migration runs against production without a backup, without a dry run, without a rollback plan.

What it costs: the migration drops a column that was referenced by an application query path the developer did not know about. Service degrades. The rollback requires restoring from the last backup. Four hours of data are gone.

The verification gate: dry run on a staging copy, explicit rollback plan, backup confirmation before running, and a check against all references to the columns being altered. The model can propose the migration. It cannot know every query path in the application. The developer must close that gap before the migration touches real data.

## The Public Content Commit

A model drafts a public-facing article, briefing, or announcement. It sounds authoritative and polished.

Silent commit: the content is published without checking whether the factual claims in it are true.

What it costs: the article states that a specific regulation took effect in a particular year. The year is wrong. The piece goes out to ten thousand readers. Corrections require public notice. Trust degrades.

The verification gate: every factual claim in public content needs a source. Not a citation the model invented - a source a human checked. Claims that cannot be sourced should be labeled as uncertain or removed. The polish of the prose is not evidence of the accuracy of the claims.

## The Production Deployment

A model proposes infrastructure changes or a new deployment configuration. The configuration looks clean.

Silent commit: the deployment goes to production without staging validation, without a rollback path, without a canary release.

What it costs: the configuration introduces an environment variable mismatch that causes the service to fail on cold start. The failure is not caught until traffic arrives. Recovery takes forty minutes and a late-night rollback.

The verification gate: staging environment runs first, metrics confirm baseline behavior, deployment is staged or canary before full rollout, and a named rollback procedure exists before the production deploy begins.

## The Documentation Commit

A model updates the README or API docs. The generated text matches what the model thinks the code does.

Silent commit: the docs are committed without checking whether they accurately describe current behavior.

What it costs: a new team member follows the documented setup steps and cannot get the service running. The steps describe a configuration that was changed six weeks ago. The developer who changed it did not update the docs. The new member spends half a day on a false start.

The verification gate: documentation claims must be checked against the actual code, the actual commands, and the actual behavior. If the README documents a command, run the command and confirm it works. If the API docs document a response shape, confirm the response shape against the current schema. Generated docs that have not been verified against behavior are not documentation. They are plausible fiction.

## The Security Assumption Commit

A model reviews an authentication flow and confirms it looks correct. The review seems thorough.

Silent commit: the security review is accepted as sufficient without independent verification of the assumptions the model made.

What it costs: the flow is vulnerable to a token replay attack the model did not consider because it was not in the prompt. The vulnerability is exploited three months later. The "security review" provides false confidence that makes the team less likely to investigate.

The verification gate: security assumptions must be validated by threat modeling, not by whether a review sounds thorough. What are the assets being protected? What are the trust boundaries? What capabilities does an attacker have? What is the failure mode if an assumption is wrong? The model can propose answers. Those answers are not verified until they have been tested against real threat scenarios.

## The Agent Trust Transfer

A model calls a tool and reports the result. The calling system accepts the report.

Silent commit: the result is added to application state without confirming that the tool call succeeded in the way the model claims.

What it costs: the model reports that a file was written. The file was not written because a permission error occurred and the model did not surface the failure correctly. The downstream task assumes the file exists. Silent failure propagates through the pipeline.

The verification gate: tool calls have receipts. The system does not accept a model's report that a tool call succeeded - it checks the side effect directly. If a file was supposed to be written, the file is checked. If an API call was supposed to update a record, the record is read back. Agent-to-agent trust transfer requires the same skepticism as human-to-system trust: verify the state, not the claim.

## Building To The Key Line

The model will hallucinate. This is not a limitation that better models will eliminate. It is a structural property of systems that generate probable continuations. Even a model that hallucinates less will hallucinate. Even a model that sounds more confident will sometimes be wrong with that same confidence.

You cannot prevent the generation.

You can build the gate.

Hallucination is inevitable. Silent commit is optional.

Every system that accepts AI output as state is making a choice about where the gate lives. The question is not whether to have a gate. The question is whether the gate is explicit and enforced, or implicit and skipped.

An explicit gate is a test that runs. A validation command that must pass. A dry run that must succeed. A source that must be checked. A reviewer who must be satisfied. A side effect that must be confirmed.

An implicit gate is a feeling that the output looked right.

Feelings do not catch generation-level hallucinations before they become commit-level ones.

## Practical Artifact

Use this Commit Boundary Map to identify where verification must happen in your workflow. Complete one row for each stage where AI-generated output becomes accepted state.

| Workflow stage | Commit type | What becomes state | Silent commit risk | Verification gate | Gate owner |
| --- | --- | --- | --- | --- | --- |
| AI proposes code diff | Code commit | Git history, deployed behavior | Bugs ship undetected | Tests, type check, lint, diff review | Developer |
| AI proposes DB migration | Database commit | Schema, stored data | Data loss, broken queries | Dry run, backup check, rollback plan | Developer + DBA |
| AI drafts public content | Content commit | Public knowledge, trust | False claims published | Source check, human editorial review | Editor/owner |
| AI generates deployment config | Deployment commit | Production environment | Outage, regression | Staging run, canary, rollback plan | DevOps/owner |
| AI updates documentation | Docs commit | Team knowledge, onboarding | False instructions | Behavioral verification against code | Doc owner |
| AI produces security review | Security commit | Trust model, threat posture | False confidence | Threat model validation, independent review | Security owner |
| Agent reports tool call result | Trust transfer | Application state | Silent pipeline failure | Side-effect confirmation, not just claim | System design |
| AI generates user-visible state | UI commit | User experience, user trust | Wrong information displayed | Data validation, acceptance test | Product owner |

**How to use this table:**

Fill in the "Gate owner" column for your team. If no name goes in that cell, the gate does not exist.

Add rows for every workflow stage where AI output becomes state in your system.

If a stage has no verification gate, that is a silent commit risk. Name the gate or name the risk explicitly.

The goal is not a full table. The goal is a system where every path from generation to state passes through something.
