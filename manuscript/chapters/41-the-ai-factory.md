# Chapter 41 - The AI Factory

Part: IX - The Production System

## Thesis

The vibe coding session is the forge -- chaotic, creative, fast. The AI factory is the refinery -- typed, audited, reproducible, boring. The product only exists after both have run.

## Key Line

The session can be messy. The factory must be clean.

## The Distinction That Changes Everything

Most teams treat the vibe coding session as the product.

They finish the session. The feature works on the machine. The prototype does what it was supposed to do. They ship it.

This is the mistake.

The session is a raw build event. It is the forge. The forge's job is to produce a workable shape from raw material. The forge is supposed to be hot, imprecise, and fast. A forge that is slow and careful is not a forge. It is a factory pretending to be a forge.

The AI factory is the system that takes the forge's output and turns it into something shippable. The factory is the refinery. It is supposed to be typed, audited, reproducible, and boring. A factory that is creative and improvised is not a factory. It is a forge pretending to be a factory.

These two things have different jobs. Confusing them is how teams produce output that feels like product and fails like prototype.

## What The Session Produces

A vibe coding session produces a raw artifact. The raw artifact includes:

- Working code (on this machine, in this environment, with these dependencies)
- Notes and decisions captured in chat (which will not survive the session)
- Failed attempts that illuminated constraints
- Prompts that established context (which the next session will not have)
- Tests that cover the cases the session thought of
- Rough documentation drafted from the code as it existed during generation
- Implied architecture that exists in the developer's head and nowhere else
- Hidden assumptions about state, environment, and inputs
- "It works" energy that is not the same as "it is correct"

The raw artifact is valuable. It proves the concept. It demonstrates the approach. It contains working logic.

It is not a product. It is the input to the factory.

## The Seven Factory Stages

The factory transforms raw session output into a shippable product through seven sequential stages. Each stage is boring by design. Boring means reliable.

### Stage 1 -- Extract

Capture everything the session produced before it is lost.

The model's context window closes when the session ends. Everything discussed, decided, and discarded in that session disappears. The extract stage captures what was built:

- Commit the working code with a meaningful message (not "wip" or "progress")
- Save session notes as a handoff file (Ch 36)
- List every decision made and why
- Record what was tried and failed, and why it failed
- Identify the assumptions that are baked into the current implementation

Extract before the session ends. Once the context closes, the reasoning behind the choices is gone. The code remains. The why does not.

### Stage 2 -- Normalize

Turn the raw build history into structured artifacts that can be maintained.

The normalize stage converts:

- Chat decisions into ADRs (Architecture Decision Records)
- Working code into typed, linted, consistently structured modules
- Rough notes into a coherent spec or README section
- Implicit architecture into an explicit diagram or description
- Hidden assumptions into documented constraints in CLAUDE.md

The normalize stage is where the forge's imprecision is corrected. A variable named `temp2` becomes `parsedUserRecord`. A function that does three things becomes three functions. An implicit dependency becomes an explicit import with a clear interface.

The model can assist with normalization. It can draft the ADR from the decision log. It can rename variables and restructure functions. Every normalized artifact must be verified by a human who understands what it is supposed to do.

### Stage 3 -- Validate

Run every engineering control and confirm the output is correct.

The validate stage is where the reflexes fire (Ch 10):

- Unit tests pass
- Integration tests pass
- Type check passes with no new errors
- Schema validation passes at every boundary
- Lint passes with no new violations
- CI pipeline passes end-to-end

The validate stage also includes human review -- not to check whether the code looks good, but to run the review patterns from Ch 39: the two-pass review, the failure-mode check, the version assumption check.

If observable markers were used during the session (Ch 38), the validate stage is where they serve their purpose. The reviewer watches the demo with markers visible. When the behavior passes, the markers are swept.

The validate stage produces a clean bill of health. Everything that was supposed to run has run. Everything that was supposed to pass has passed.

### Stage 4 -- Harden

Add the infrastructure that makes the code production-ready.

The forge produces a feature. The harden stage adds:

- Error handling for the inputs the session did not test
- Configuration for environments the session did not run in
- Logging that is useful when something goes wrong
- Monitoring hooks for the metrics that matter
- Deploy scripts and environment configuration
- Rollback paths for every state change

The harden stage does not add features. It makes the existing feature survivable in the real world.

The model can assist with hardening. It can propose error handling for the cases that were not tested. It can write the logging statements. It can generate the deploy configuration from a description of the environment. Each hardening artifact must be reviewed: does this handle the right error, or does it handle the error the model thought was most common?

### Stage 5 -- Package

Generate the artifacts that make the work presentable and usable.

The package stage produces:

- README and setup instructions (verified against the current command set)
- API documentation (verified against the current interface)
- Demo scripts that can be followed without prior knowledge
- Changelog entry for the release
- Screenshots and visual documentation
- Install instructions tested from a clean environment

The package stage makes the work visible to people who were not in the session. A feature that cannot be understood from its documentation is not yet packaged. A library that cannot be installed from its README is not yet packaged.

The model can draft every artifact in the package stage. Every draft must be verified: run the install instructions from scratch, execute the demo script, check that the API examples match the current API.

### Stage 6 -- Publish

Commit the packaged artifact to production.

The publish stage is the final commit. It is gated by the definition of done (Ch 40): built, tested, documented, understood, and recoverable.

The publish stage includes:

- Tagging the release with a semantic version
- Deploying to production through the CI/CD pipeline
- Enabling the feature flag for the target audience
- Posting the release notes
- Generating portfolio material and content from the completed work

The publish stage is not creative. It is procedural. The procedure is designed to be repeatable. If the publish procedure requires judgment, the judgment belongs in an earlier stage.

### Stage 7 -- Observe

Watch what happens after publish and feed it back into the next session.

The observe stage converts production behavior into structured input for the next forge run:

- Error rates and anomalies become bug reports with reproduction cases
- User feedback becomes feature requests with acceptance criteria
- Performance metrics become optimization targets with current baselines
- Support questions become documentation gaps
- Usage patterns become insights about which features matter

The observe stage closes the loop. The session that produces the next feature is better because the observe stage from the last feature surfaced the right problems.

Observable markers from Ch 38 have a place in the observe stage. When a feature is deployed with monitoring hooks, the logs from those hooks are the observe stage's input. A console event named `[VCB-MARKER] login-flow-rendered` becomes a production metric that tells you how often the new flow runs. Remove the label once the metric is promoted to a proper event name.

## The Division Of Labor

The session can be chaotic, creative, exploratory, half-verbal, messy, fast.

The factory must be typed, audited, reproducible, and boring.

This is the division of labor:

| Session (Forge) | Factory (Refinery) |
| --- | --- |
| Creative | Procedural |
| Context-dependent | Reproducible |
| Fast | Thorough |
| Human + model | System + model + human |
| Produces raw artifact | Produces shipped product |
| Can be messy | Must be clean |
| Closes when context closes | Runs until done is done |

Teams that try to run the factory inside the session produce output that is neither creative nor clean. Teams that try to run the session inside the factory produce output that is neither fast nor flexible.

Know which stage you are in. The session is over when you commit and start the factory. The factory is over when you publish and start observing.

## The Pipeline

Every vibe-coding output passes through the same pipeline:

```
Human intent
    |
Vibe coding session (Forge)
    |
Raw artifact: code, notes, decisions, assumptions
    |
AI factory (Refinery)
    |
  1. Extract   -- capture before context closes
  2. Normalize -- structure the raw output
  3. Validate  -- engineering controls fire
  4. Harden    -- production infrastructure added
  5. Package   -- documentation and presentation
  6. Publish   -- gate by definition of done
  7. Observe   -- feed findings into next session
    |
Shipped product
    |
Telemetry + feedback
    |
Next session
```

The pipeline is not optional for teams that ship. It is the difference between a working prototype and a maintained product.

The Propose / Validate / Commit loop (Ch 13) operates inside the factory. The factory is the larger loop that contains it.

## Practical Artifact -- Factory Stage Checklist

Use this to track where a work item is in the factory pipeline.

| Stage | Done when | AI role |
| --- | --- | --- |
| Extract | Handoff committed, decisions logged, assumptions documented | Draft handoff from session context |
| Normalize | Code typed, linted, consistently structured; architecture documented | Rename, restructure, draft ADRs |
| Validate | All controls pass; review lanes run; markers swept | Run validation, draft missing tests |
| Harden | Error handling, logging, configuration, rollback path | Propose error cases, draft config |
| Package | README verified, demo script runs, changelog written | Draft documentation artifacts |
| Publish | Tagged, deployed, feature flag set, released | Generate release notes and content |
| Observe | Metrics live, feedback captured, next session briefed | Categorize feedback into issue types |

---

## Export

Copy this block into your CLAUDE.md, agent instructions, or project checklist.

**Key line**
> The session can be messy. The factory must be clean.

**Agent YAML**
```yaml
vcb_chapter: 41
title: "The AI Factory"
key_line: "The session can be messy. The factory must be clean."
thesis: "The vibe coding session is the forge. The AI factory is the refinery. The product only exists after both have run."
checklist:
  - item: "Has the session's output been extracted before the context closed?"
    protects: "against losing decisions, assumptions, and reasoning with the session"
  - item: "Is the raw code normalized: typed, linted, structured, documented?"
    protects: "against prototype-grade code becoming production debt"
  - item: "Have all engineering controls run and passed?"
    protects: "against unvalidated output crossing the factory boundary"
  - item: "Has hardening been added: error handling, logging, rollback?"
    protects: "against features that work in demos and break in production"
  - item: "Is packaging complete: README verified, demo runs from scratch?"
    protects: "against features that cannot be used by anyone who was not in the session"
  - item: "Is the publish gate satisfied: built, tested, documented, understood, recoverable?"
    protects: "against shipping before the definition of done is met"
  - item: "Is observability in place to feed the next session?"
    protects: "against losing production feedback that should drive the next build"
```

**Portable checklist**
- [ ] Session output extracted before context closed -- *protects against lost decisions*
- [ ] Code normalized: typed, linted, structured -- *protects against prototype debt*
- [ ] All engineering controls passed -- *protects against unvalidated production code*
- [ ] Hardening added: errors, logs, config, rollback -- *protects against demo-only reliability*
- [ ] Packaging verified: README runs, demo executes -- *protects against unusable releases*
- [ ] Definition of done satisfied before publish -- *protects against premature shipping*
- [ ] Observability live: metrics, feedback loop active -- *protects against silent failures*
