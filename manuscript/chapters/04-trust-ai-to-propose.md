# Chapter 4 - Trust AI To Propose

Part: II - Trust, But Verify

## Thesis

The correct relationship to AI is not distrust, worship, or micromanagement. It is controlled delegation.

## Key Line

The model is allowed to be creative before the gate. It is not allowed to be authoritative after the gate.

## The Three Failure Modes

Most teams working with AI settle into one of three wrong postures. They look different on the surface. They all produce bad outcomes.

The first is over-rigidity. The team treats AI output as inherently suspect. Every suggestion is dismissed or requires such heavy scrutiny that the speed advantage vanishes. Engineers re-implement what the model proposed from scratch because they cannot bring themselves to trust a single generated line. This is not rigor. It is a failure to understand what generated output is for. You do not need to trust a proposal to use it. You need to verify it.

The second is recklessness. The team treats AI output as the answer. Proposals go straight to commits. Generated code ships without meaningful review. Generated claims become facts. Generated tests become the proof. The speed is real. The damage accumulates invisibly until something breaks in a way no one can explain, because no one understood the code before it became state.

The third is micromanagement. The human tries to control each word the model produces, crafting prompts so constraining that the model cannot meaningfully contribute. Iteration happens at the sentence level. The model never gets room to explore. The leverage collapses to zero because the human is now doing the thinking and using the model as a slow keyboard.

All three postures fail for the same reason: they misunderstand the role.

The model is not an employee to be distrusted. It is not an oracle to be believed. It is not a puppet to be directed one keypress at a time.

The model is a proposer.

## Controlled Delegation

Controlled delegation is the correct posture.

It is not a philosophy. It is a structure. The structure has three parts: the human owns intent, the model generates proposals, the system verifies.

The human owns intent. That means the human decides what problem is being solved, what constraints apply, what success looks like, and what failure would cost. These things cannot be delegated. The model does not know your users. It does not know your production environment. It does not know the implicit contracts between your services. It does not know which data is sensitive, which behavior is load-bearing, or which edge case bit you last quarter. Intent lives with the person who has context and accountability.

The model generates proposals. That is the full scope of the model's job. It proposes implementations. It proposes tests. It proposes migration steps. It proposes schema definitions. It proposes fixes. It may generate excellent proposals. It may generate wrong ones. It generates them regardless, because generation is what it does. The quality of a proposal has nothing to do with the confidence of its delivery.

The system verifies. This is not the human reading the output carefully and nodding. Verification is structural. Tests run. Schemas validate. Lint passes. Contract tests execute. Review checklists are applied. Type checking confirms. The system imposes a gate that does not move based on how convincing the proposal looked.

Controlled delegation is useful because it assigns each job to the thing that can actually do it. Humans are good at intent. Models are good at generation. Systems are good at verification. Using a human as a verification system is slow and error-prone. Using a model as an intent owner is reckless. Using a system as an intent owner is incoherent.

## Before The Gate And After The Gate

The key line has a specific meaning.

Before the gate, the model can be creative. That means the model can try things. It can propose an approach you did not consider. It can generate an implementation that differs from what you described. It can explore five variants before settling on one. It can suggest a refactor that was not in scope. It can draft an alternative you would not have reached on your own. This is the value of generative AI. The model is not constrained to reproduce what you already knew. It can produce things you would not have produced.

This creative freedom is only valuable because a gate exists.

After the gate, the model is not authoritative. Its proposal does not decide what is correct. The gate decides. The tests either pass or they do not. The schema either validates or it does not. The lint either clears or it does not. The diff review either approves or it does not. The migration either runs clean on staging or it does not.

The gate is not an opinion about the model's output. It is a structural requirement that a proposal must satisfy before it becomes state.

This separation is why the posture works. The model can be creative because the gate catches errors. The gate can be trusted because it does not care how confident the proposal looked. The human can stay focused on intent because they are not responsible for catching every mistake in the output - the system is.

The worst pattern is removing the gate because the output looks good. Looking good is the model's permanent state. It looks good when it is correct. It looks equally good when it is subtly wrong in a way that will cost three hours at 11pm six weeks from now.

## The Repo As Shared Context

The repo is not where code lives. It is the operating context that makes controlled delegation possible.

The model cannot be a useful proposer if it does not understand what it is proposing into. A proposal that ignores the existing schema is useless. A proposal that assumes a library the project does not have is broken. A proposal that conflicts with an existing contract creates debt. A proposal that violates the team's naming conventions is just a draft.

The repo holds the shared context. The file structure, the tests, the schemas, the types, the lockfile, the config, the existing patterns - all of it describes what the current system is and what constraints any proposal must respect.

This is why the prompt matters but the context matters more. A poorly-worded prompt into a well-loaded context often produces a usable proposal. A well-worded prompt into an empty context produces something generic that does not fit.

Loading the model with the right context - the relevant file, the schema it must match, the tests it must pass, the interface it must implement - is the act of giving the proposer the operating constraints they need. It moves the proposal from generic to situated.

The tests, schemas, and tools in the repo are not just verification infrastructure. They are the specification the model proposes against. They make proposals checkable. They turn "does this look right?" into "does this pass?"

## Why The Crude Positions Fail

"Never trust AI" sounds disciplined. It is not. It refuses to engage with the actual structure of the problem. The question is not whether to trust the model. The question is what verification is required before a proposal becomes state. A team that trusts the gate can accept proposals freely, because the gate will catch what the proposal got wrong. A team that refuses proposals because they came from a model is not being careful - it is being inefficient without a corresponding safety benefit.

"Just ship it" sounds fast. It is not fast for long. Silent errors accumulate. Technical debt that nobody understands is not fast to fix. A system that grew by accepting proposals without verification is a system that nobody can safely change, because the map of what the code actually does does not exist. The speed at the start is borrowed from the reliability at the end.

Micromanagement sounds thorough. It is just expensive. If the human is directing every word of the output, the human is doing the work and using the model as a slow editor. The leverage model requires trust that the system will catch errors, not trust that you can prevent them by staying in the loop at every step.

## What Controlled Delegation Looks Like

A developer identifies a goal: add pagination to the user list endpoint.

They open the model with context: the current route handler, the schema, the existing test file, the API contract.

They write a structured prompt:

- Goal: add cursor-based pagination to GET /users.
- Scope: route handler, query builder, response schema.
- Out of scope: authentication, caching, frontend.
- Constraints: must match the existing response envelope; existing tests must continue to pass.
- Validation command: `npm test -- users.test.ts`.
- Expected handoff: updated handler, schema, and passing tests.

The model proposes an implementation. The developer does not scan it for obvious errors and ship. They run the tests. They read the diff for scope creep. They check that the schema was updated. They verify the edge case: what happens when there are no more results?

If the tests pass and the diff is clean, they commit.

If the tests fail, they know immediately and in what way. They do not need to reconstruct what the model intended.

That is controlled delegation. The model did the generation. The human owned the intent. The system provided the verification. Everyone did their job.

## Practical Artifact

Use this prompt template when delegating to a model. Fill in every field before you send the prompt. Fields left blank are places where the system can fail.

```text
Goal:
 [One sentence: what should exist or behave differently after this task]

Scope:
 [List the specific files, modules, or behaviors this task touches]

Out of scope:
 [List what must not change - existing interfaces, unrelated features, other modules]

Constraints:
 [List non-negotiable requirements: schema compatibility, API contract, security boundary, etc.]

Validation command:
 [The exact command that will confirm success: test runner, type checker, linter, schema validator]

Expected handoff:
 [What the model should produce: updated file(s), passing tests, schema change, summary of decisions made]
```

**Example - filled out:**

```text
Goal:
 Add cursor-based pagination to GET /users so clients can page through results
 without offset drift.

Scope:
 src/routes/users.ts, src/schemas/user.schema.ts, tests/users.test.ts

Out of scope:
 Authentication logic, frontend components, caching layer, other routes.

Constraints:
 Response envelope must stay compatible with existing clients: { data: [], meta: { next_cursor } }.
 All existing passing tests must continue to pass.
 No new dependencies without approval.

Validation command:
 npm test -- users.test.ts && npx tsc --noEmit

Expected handoff:
 Updated route handler with cursor logic, updated schema with next_cursor field,
 at least two new test cases (mid-page and last-page), and a one-paragraph summary
 of the cursor strategy chosen.
```

The template is not a ritual. It is the minimum specification required to make a proposal checkable. A proposal without a validation command is an opinion. A proposal with one is an experiment.
