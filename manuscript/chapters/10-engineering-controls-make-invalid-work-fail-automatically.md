# Chapter 10 - Engineering Controls: Make Invalid Work Fail Automatically

Part: III - The Hierarchy Of AI Controls

## Thesis

Tests, schemas, type systems, linters, CI, and reducers are not bureaucracy. They are reflexes.

## Key Line

A reflex is a validation step that fires before the system has to think.

## What A Reflex Is

A reflex does not deliberate.

When a doctor taps your knee, your leg moves before you decide anything. That movement is the reflex. It does not wait for judgment. It does not depend on attention. It fires because the system is designed to fire it.

Engineering controls work the same way. A failing test does not ask whether you remembered to think about edge cases. It fails. A type error does not wait for a code review to notice the interface drift. It fails at compile time. A schema validator does not trust the model's confident JSON output. It checks it against the contract and rejects what does not match.

These controls do not get tired. They do not get distracted. They do not forget to run because the deadline is tomorrow. They fire every time the condition is met.

That is what makes them more reliable than any prompt instruction or human review process. They are not better humans. They are mechanisms that close the gap human attention leaves open.

## Tests Are Reflexes

A test that passes is not a guarantee. A test that fails is a signal that cannot be ignored.

The value of a test in AI-assisted development is specifically this: when the model generates code that looks correct and is not, the test fails before the code is committed. The model's confident output does not become a quiet regression. It becomes a loud failure.

This is why "tests as reflexes" is not a metaphor. The test fires automatically. It fires on every relevant change. It does not wait to be run manually. It does not depend on the developer remembering to check the behavior the test covers.

Unit tests are reflexes against logic errors. Integration tests are reflexes against component boundary failures. Regression tests are reflexes against problems that were fixed once and would return silently.

The model can draft all three. Chapter 2 established this. The economic argument is simple: if the test can be drafted cheaply by the model and reviewed by a person, the excuse for having no tests evaporates. Teams that skip tests because writing them is expensive are operating under a constraint that AI partially lifts.

Raise the floor. Write the reflex.

## Schema Validation Is A Boundary

A model that produces JSON output is a model that sometimes produces slightly wrong JSON.

Not wrong because it is malfunctioning. Wrong because the output is a continuation of the conversation, not a lookup against a contract. The model does not know that `status` must be one of `"pending"`, `"active"`, or `"closed"`. It knows the word "status" and the values it has seen in similar contexts. If the session drifted, it might output `"in_progress"` instead. The value is plausible. It will parse as JSON. It will pass unvalidated into the downstream system and cause a failure hours later, during processing, far from the point where the wrong value was produced.

Schema validation stops this at the boundary.

A JSON Schema, a Zod validator, a Pydantic model, a TypeSpec contract - each is a structural description of what valid output looks like. The model's output is measured against that description before it reaches any sink. If the output is invalid, the failure is immediate, localized, and legible. The field is wrong. The type is wrong. The value is not in the enumeration.

This is the engineering control equivalent of a type system for data that flows between components. It does not require trusting the model. It requires describing what valid looks like, and then checking.

Teams working with AI-generated output should treat schema validation as mandatory on every route where model output reaches a database, a UI, an API response, or an external service. Not optional. Not aspirational. Required.

## Type Systems Are Continuous Contract Checking

A type system is a reflex that runs on every save, every build, every CI run.

When an agent modifies a function signature, the type system immediately surfaces every call site that no longer matches. The engineer does not need to trace the callers. The compiler does. When a model generates code that calls a method that does not exist, the type error appears before the code ships. The invented method cannot hide behind a successful parse.

This is why typed languages and typed tool interfaces reduce AI-assisted development failures. The model generates plausible code. The type system checks plausible against real. The gap between them is the reflex's job.

Strict types are not pedantry. They are a continuous audit of whether the model's output matches the actual system.

In practice: use the strictest type settings the codebase can support. Turn on `strictNullChecks`. Enable exhaustive pattern matching. Use enumerations instead of raw strings where values are finite. Each strictness setting is a category of model hallucination that can no longer reach production silently.

## CI Is The Gatekeeper That Does Not Get Tired

A continuous integration pipeline is a gatekeeper.

It runs on every proposed change. It does not have good days and bad days. It does not let something through because it is 5pm on a Friday and the team is tired. It does not have a backlog of other things it is thinking about. It runs the suite, it checks the types, it validates the schema, and it reports the result.

CI is where all the other engineering controls compound. The unit tests run. The type check runs. The lint rules run. The contract tests run. The output is binary: this change passes every reflex the team has installed, or it does not.

This is why CI is the non-negotiable engineering control in AI-assisted development. An agent can produce many changes per session. Without CI, a human reviewer must hold all the engineering controls in their head simultaneously while reading a diff. With CI, the controls run before the human reads anything. The human is asked to review what passed, not to catch everything the controls would have caught.

Branch protection tied to CI is the policy form of this. The branch will not merge until the controls pass. Not "until someone tries to remember to run them." Until they pass.

## The Labor Economics Argument

Chapter 2 established that attention to detail was always a labor constraint.

Engineering controls are the output of that labor. Writing a test takes time. Setting up schema validation takes time. Configuring strict type settings takes time. Building a CI pipeline takes time.

AI changes the cost of several of these. The model can draft a test matrix from a description of the intended behavior. It can propose a JSON Schema from example outputs. It can write the first version of the contract test. It can produce the Zod validator from the TypeScript interface. It can configure the GitHub Actions workflow from a description of what should run.

The draft is not automatically correct. The team still needs to review, validate, and own the controls. But the cost of the first draft dropped. That matters because engineering controls that do not exist because they were expensive to create are gaps that stay open.

The argument is not "AI will write all your tests for you." The argument is: the excuse for having no tests, no schema validators, and no CI pipeline is weaker now. Use the leverage.

Every engineering control the team can draft cheaply and validate quickly is a reflex the system gains. Each reflex closes a gap that would otherwise require human attention on every commit.

Raise the floor. The model can help draft the controls. The team's job is to verify that the controls are true.

## Practical Artifact - Engineering Controls Inventory

Use this table to audit the engineering controls on an AI-assisted project. For each control, record what it catches, where it runs, whether it is required, and whether AI can help draft it.

| Control | What it catches | Where it runs | Required? | Can AI draft it? |
| --- | --- | --- | --- | --- |
| Unit tests | Logic errors and regressions in individual functions | Local and CI | Yes | Yes - from behavior description |
| Integration tests | Boundary failures between components or services | CI (and optionally local) | Yes | Yes - from interface descriptions |
| Type check (strict) | Interface drift, invented methods, null violations | Local (on save) and CI | Yes | Partially - AI can propose types, human verifies |
| Schema validation | Invalid model output before it reaches a sink | Runtime (at boundary) and tests | Yes | Yes - from example outputs or TypeScript types |
| Contract tests | API shape changes that would break callers | CI | Yes, if multi-service | Yes - from OpenAPI spec or interface definitions |
| Lint rules | Style violations, simple logic errors, forbidden patterns | Local and CI | Yes | Configuration only; AI can propose rule sets |
| Snapshot / golden file tests | Unexpected changes to stable output (HTML, JSON, SQL) | CI | Recommended | Yes - AI can generate initial snapshots |
| Branch protection + CI gate | Merges before controls pass | Repository platform | Yes | Not applicable - policy configuration |
| Regression tests | Recurrence of previously fixed bugs | CI | Yes | Yes - from bug report or reproduction steps |
| Reproducible build check | Build output differences between environments | CI | Recommended | Partially - AI can propose lockfile and env config |

For each row marked "Required?", treat an empty or disabled state as a gap. Prioritize filling required gaps before extending AI agent capability.

A system with no unit tests, no type checking, and no CI pipeline is a system where every AI-generated change must be caught by human review alone. That is a system running on PPE.

Reflexes do not tire. Install them first.
