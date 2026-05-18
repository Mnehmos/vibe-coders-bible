# Chapter 27 - Clio: Civic Intelligence As Rendered State

Part: VI - Case Studies From The Mnehmos Ecosystem

## Lesson

Public explanation should be compiled from validated source and entity state, not trusted as raw narration.

## Key Line

Narration explains the civic state; it does not create the civic state.

## The Stakes Are Different Here

Most software gets the trust model wrong quietly. A misconfigured permission here, an unvalidated input there. The failure is invisible until it is not, and when it becomes visible, the cost is usually bounded.

Civic applications do not have that buffer.

A system that explains public affairs - geopolitical events, resource flows, infrastructure, policy decisions - is making claims about the world that people will use to make decisions. Those claims have a truth value. They can be wrong. When they are wrong and authoritative-looking, the cost is not a broken feature. The cost is misinformation with a confident interface.

Clio is a civic intelligence application built with that stakes profile in mind. Its architecture is designed around a single organizing principle: the database is the intelligence, the renderer is the body.

The model does not narrate into existence. The model narrates from what the database says is true.

## What Clio Is

Clio is a MapLibre globe backed by a SQLite-WASM entity registry, with an OpenAI narration layer, text-to-speech output, and an FFmpeg export worker for packaged content delivery.

The globe renders civic reality. Countries, maritime boundaries, infrastructure corridors, resource routes, and geopolitical actors are entities in the SQLite registry. What appears on the globe is what the registry contains. The registry is the ground truth.

The narration layer interprets what the registry contains. The model receives the current state of the relevant entities, the user's query or session context, and the production event log - and it produces explanation. That explanation is grounded in registry state. It does not produce registry state.

This is not a technical distinction that architects make for elegance. It is the design decision that prevents the narration from becoming a vector for hallucinated geography.

## The Stagehand Protocol

The model's narration is not free text. It is structured narration with embedded commands.

Stagehand is Clio's inline command system. The model emits narrative prose that contains visual directives woven into the text, in a defined format:

```
The strait represents one of the most consequential chokepoints in global oil transit. [map.highlight entity="strait:hormuz"] Over forty million barrels pass through this corridor daily, making unimpeded access a condition of global energy stability. [map.zoom level=6 center="strait:hormuz"]
```

The narration reads as natural language. The embedded Stagehand commands drive the globe. The renderer parses the stream, extracts the commands, executes them against the globe state, and presents the visual alongside the spoken narration.

This achieves several things simultaneously.

The model controls the presentation experience through language, which is what models do well. The renderer executes commands against a validated state, which is what deterministic systems do well. And the separation between "what the model says" and "what the globe shows" is enforced by the architecture rather than by convention.

The model cannot move the globe to a location that does not exist in the entity registry. The command executes; the registry either finds the entity or it does not. Hallucinated geography cannot survive the lookup.

## The ProductionRun Event Model

Clio separates events into two streams that never mix.

Private events are generated during a session's working process: agent tokens as they stream, tool call payloads, intermediate model reasoning, source retrieval results. These are logged for debugging and audit. They never enter the world model.

Public events are what the session produces after validation: confirmed civic claims, sourced assertions, Stagehand commands that executed against verified entity state. Only public events promote into the world model.

The boundary between these streams is the point where "the model said this" becomes "the system asserts this." That transition requires a check. The ProductionRun event model makes that check structural rather than optional.

A civic claim that has not crossed the public boundary does not exist from the world model's perspective. It may be in the session log. It may have been reviewed. But it has not been promoted, and unpromoted claims do not affect what the globe renders or what future sessions treat as established fact.

This prevents a failure mode that is common in AI-assisted content systems: the model asserts something, the system logs it, future context includes the log, and the assertion quietly becomes background fact without ever being verified. Clio's event model makes that accumulation impossible by design.

## The Trust Tier Model

Not all information in the registry has the same provenance. Clio makes that explicit with five trust tiers.

| Tier | Name | Description |
| --- | --- | --- |
| 1 | Gold Master | Authoritative reference data. Verified, stable, high-confidence. |
| 2 | Verified Import | External data that has been reviewed and imported. |
| 3 | Project Overlay | Project-specific context added for a particular analysis. |
| 4 | User Assumption | Session-scoped input from the user, not independently verified. |
| 5 | Session Draft | Unverified, ephemeral. Does not persist beyond the session. |

The model knows what tier each entity occupies. When narrating, it can qualify claims by tier: "According to verified import data, the pipeline carries approximately..." versus "Working from the user's assumption that sanctions remain in effect..."

The tier model does two things. First, it preserves epistemic honesty inside the narration. The model does not flatten all information to the same confidence level. Second, it controls what can become permanent. Promotion from Tier 5 to higher tiers requires explicit review. A user cannot make a Session Draft permanent by asserting it strongly enough.

That second function is the trust model's real value. The review gate is not bureaucratic overhead. It is the mechanism that keeps unverified information from accumulating into the civic picture the system presents.

## Public Users Cannot Reshape The World Model

This is the central invariant of Clio's design.

A public user interacts with the system through the narration interface, the globe, and the query layer. They can ask questions. They can focus the session on specific entities, regions, or events. They can provide context that shapes how the model interprets their query.

They cannot directly modify the entity registry. They cannot promote information from Session Draft to a higher tier. They cannot cause the globe to display something that does not exist in the verified registry. They cannot inject civic claims that persist beyond their session.

The world model is not a user-facing editable surface. It is the product of a review process.

This distinction matters because the failure mode it prevents is not theoretical. Content systems that allow users to submit information that enters the shared model without review accumulate errors at the rate users introduce them. The initial submissions may be good-faith. Some will not be. And the good-faith submissions may still be wrong.

In a civic intelligence context, errors in the world model compound. A mislocated entity affects every session that queries it. A false route in the infrastructure graph propagates into every narration that cites that corridor. A claimed fact that was never verified becomes the background for future analysis.

The promotion gate is what prevents compounding. Clio makes promotion explicit, auditable, and gated by review. The civic picture stays clean because it is not left open to continuous deformation.

## What The Architecture Teaches

Clio is not a harder version of a standard AI application. It is a different category.

Standard AI applications ask: how do we make the model useful? Clio asks that question and adds a second: how do we make sure the model's output cannot corrupt the picture of reality the system presents?

The answers to the second question produce the architecture. The Stagehand protocol, because prose alone cannot be the interface to geographic state. The ProductionRun event boundary, because private session content cannot become public civic assertion by default. The trust tier model, because not all information has the same provenance and the system should know the difference. The promotion gate, because permanence requires review.

Each control exists because a specific failure mode exists. The failure modes are not hypothetical.

Models hallucinate. Users submit errors. Unreviewed content accumulates. Systems that do not build against these patterns will eventually exhibit them.

Clio builds against them structurally. The result is an application where the narration can be as rich and contextual as the model can produce - because the architecture ensures the narration is rendering state, not creating it.

## Practical Artifact - Civic AI Trust Design Checklist

Use this checklist when designing any AI system that makes claims about the world that users will act on.

| Control question | Risk it addresses |
| --- | --- |
| Does the model render from validated state, or can it produce state through narration? | Prevents hallucinated claims from entering the world model |
| Is there a hard boundary between private session events and public world state? | Prevents unreviewed content from accumulating as fact |
| Are trust tiers explicit and tracked per entity? | Prevents flattening of confidence levels across information sources |
| Is promotion from lower tiers to higher tiers gated by review? | Prevents user-submitted or model-generated content from becoming permanent without verification |
| Can a public user modify the shared world model? | Core invariant - the answer must be no |
| Are inline commands (like Stagehand) validated against entity registry before execution? | Prevents hallucinated geography from rendering on authoritative surfaces |
| Does the narration qualify claims by their source tier? | Preserves epistemic honesty in public-facing explanation |
| Is there an audit trail linking public events to their source evidence? | Enables review and correction of promoted claims |
