# Chapter 19 - Building A Feature

Part: V - AI-Assisted Development Workflows

## Thesis

A feature built with AI is a proposal that earns the right to merge through validation. The model proposes. The tests decide.

## Key Line

Do not ask the agent to build a feature until the feature has a shape.

## Feature Spec Before Code

The agent generates against its training distribution unless you give it something more specific.

Without a spec, "add user authentication" produces generic JWT middleware with hardcoded expiry values, a session table that contradicts your existing schema, and error messages that do not match the rest of the application. The agent did not misunderstand. It built the most common version of what you described.

A spec takes fifteen minutes to write. It defines scope, inputs, outputs, and the test that will prove correctness. Write it as a short document or a GitHub issue before opening a model prompt. The spec does not need to be formal. It needs to be specific enough that a wrong implementation is obviously wrong.

The format that works: what user need does this address, what data goes in, what comes out, what changes in the system, and what test proves it is correct. That is the entire spec.

## TDD With AI

Write the test before asking for the implementation.

Ask the model to write the test first. Describe the intended behavior and the expected inputs and outputs. The model will produce a test. Before using it, run it against no implementation - it must fail. A test that passes before any implementation is testing nothing.

A failing test is a precise specification. It tells the model exactly what "done" means. Implementation is then a matter of making that specific test pass, not of writing code that looks like it should work.

When the test passes, the feature is done. Not when the agent says it is done. Not when the code looks reasonable. When the test passes.

This sequence also catches a common failure: the model writes a test that mocks away the actual behavior being tested. If the test passes before the implementation exists, the mock replaced the real thing and the test is worthless. Catching this before writing any implementation code is far cheaper than catching it in production.

## The Review Loop

Review generated code in small increments. A function at a time, not a file at a time, not a PR at a time.

The review surface per increment determines how much can go wrong between looks. A ten-line function has a bounded blast radius. A five-hundred-line file does not. The agent can generate plausible-looking changes across many files faster than a human can read them.

The prompt discipline that supports this: ask the model for one function, review it, ask for the next. This feels slower. It is not. The time spent reviewing a 500-line diff for the bugs that are actually there exceeds the time lost by working in smaller steps.

When reviewing each increment, read the code before reading the model's explanation of it. The explanation is persuasive. It creates a mental model that filters what you see in the code. A readable explanation of a wrong function will make the wrong function harder to catch. Read the code first. Form your own read. Then compare to the explanation.

## When To Ask vs. When To Run

The model can reason about expected behavior. It cannot tell you about actual behavior.

Use the model for design questions: what approach handles this edge case, what are the tradeoffs between these two implementations, what could go wrong with this approach. The model's answers are useful input to a decision.

Use running code for all questions about what the code actually does. "Will this handle a null input?" is a question to answer with a test, not with a model explanation. The model will tell you what it intended. The runtime will tell you what happens.

The clearest version of this rule: if the answer matters enough to act on, run it. If it is context for a decision you are making, ask the model. Never substitute a model explanation for a test when the test is cheap to write.

## Scope Discipline

The feature ticket defines scope. The agent does not.

AI-assisted scope creep is particularly dangerous because the agent generates plausible-looking changes across unrelated files without flagging them as out of scope. A request to add a sort parameter to an API endpoint can produce changes to the database schema, the ORM model, the admin panel, the API serializer, the test fixtures, and the caching layer - all in one diff, all looking reasonable, all changing things you did not ask to change.

Before running any agent prompt for a feature, write down what files are in scope. After the agent generates output, check every changed file against that list. Any file that appears in the diff but was not in the scope list gets scrutinized first: is this change required, or did the agent follow a pattern into territory that was not requested?

Stop the agent when it starts touching out-of-scope code. Ask for a revised approach that stays inside the boundary. Do not accept a large diff because most of it looks right.

## Acceptance Criteria

A feature is done when the acceptance criteria in the spec are met. Not when the code is written. Not when the tests pass.

The tests should encode the acceptance criteria. If the acceptance criteria cannot be expressed as tests, the criteria are underspecified. "The user should be able to log in" becomes: the endpoint returns a valid session token for correct credentials, returns a 401 for incorrect credentials, returns a 400 for malformed input, and rate-limits after five failed attempts. Each of those is a test. All four pass, or the feature is not done.

Handoff happens when the acceptance criteria are provably met. Provably means a test ran, not that the agent said so.

## Practical Artifact - Feature Build Checklist

Run in order. Each gate must pass before the next step begins.

| Gate | Action | What It Protects |
| --- | --- | --- |
| Spec exists | Write issue or SPEC.md with inputs, outputs, scope, and acceptance criteria | Prevents building the wrong thing |
| Scope documented | List files that are in scope for this feature | Catches scope creep in the diff |
| Test written | Ask model to write the test; confirm it fails with no implementation | Proves the test is real |
| Prompt bounded | Agent prompt references the spec explicitly | Keeps generation on target |
| Diff scoped | Every changed file is on the scope list or has a written justification | Catches unintended changes |
| Tests pass | Run the full test suite, not only the new test | Catches regressions |
| Acceptance criteria met | Each acceptance criterion has a passing test | Proves the feature is done |
| PR references spec | PR description links to the spec and lists passing tests | Creates traceable history |

---

## Export

Copy this block into your CLAUDE.md, agent instructions, or project checklist.

**Key line**
> Do not ask the agent to build a feature until the feature has a shape.

**Agent YAML**
```yaml
vcb_chapter: 19
title: "Building A Feature"
key_line: "Do not ask the agent to build a feature until the feature has a shape."
thesis: "A feature built with AI is a proposal that earns the right to merge through validation. The model proposes. The tests decide."
checklist:
 - item: "Write the spec before writing any prompt"
 protects: "Prevents building the wrong thing"
 - item: "Document which files are in scope"
 protects: "Catches scope creep in generated diffs"
 - item: "Write the test first; verify it fails"
 protects: "Ensures the test is real and specific"
 - item: "Review one function at a time, not one file at a time"
 protects: "Keeps review surface manageable"
 - item: "Run code to verify behavior; ask the model to reason about design"
 protects: "Prevents model explanation from substituting for a test"
 - item: "Check every changed file against the scope list"
 protects: "Catches unasked-for changes across the codebase"
 - item: "Every acceptance criterion has a passing test before handoff"
 protects: "Proves the feature is done, not just written"
```

**Portable checklist**
- [ ] Is there a written spec with inputs, outputs, and acceptance criteria? - *prevents building the wrong thing*
- [ ] Is the scope documented as a file list? - *catches scope creep*
- [ ] Does the test fail before any implementation exists? - *proves the test is real*
- [ ] Is every changed file on the scope list? - *catches unintended changes*
- [ ] Does the full test suite pass, not only the new test? - *catches regressions*
- [ ] Does every acceptance criterion have a passing test? - *proves the feature is complete*
- [ ] Does the PR reference the spec? - *creates traceable history*
