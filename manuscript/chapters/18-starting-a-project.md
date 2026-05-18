# Chapter 18 - Starting A Project

Part: V - The Workflows

## Thesis

Every control installed after the agent starts generating is harder to install than a control installed before. Front-load the discipline.

## Key Line

The first commit should be the safety system, not the feature.

## The Front-Loading Principle

Starting a project with AI is a front-loading exercise.

The controls - schemas, tests, CI, branch protection, CLAUDE.md - must be in place before the agent generates its first line of application code. Installing them afterward requires fighting against established patterns. The agent has already made assumptions. The codebase already has shape. Retrofitting tests onto code the agent generated without tests is harder than writing tests first. Retrofitting CI onto a repo that has been merging directly to main requires undoing habits the team already has.

The temptation is to generate first. The model is ready. The idea is exciting. The context window is full of good intentions. Start generating, see what appears, add controls later.

The consequence of generating first: a codebase with no tests, no schemas, no CI, and an agent that has already established patterns that are expensive to reverse. The agent generated what the model thought was right. The model's judgment is not the same as the project's requirements. By the time that divergence is visible, it is embedded.

Front-loading costs one session. Retrofitting costs many.

## The Correct Starting Order

There is a correct order. It is not the exciting order.

1. Define the problem in a ticket or issue. One sentence: what does this do. Two sentences: what it does not do.
2. Write CLAUDE.md. Give the agent its operating context before it operates.
3. Define schemas for the core data shapes. If you do not know what the data looks like, you do not know what you are building.
4. Set up CI with branch protection. The pipeline enforces that nothing merges unvalidated.
5. Write the first failing test. The test defines the first behavior. The agent's job is to make it pass.
6. Ask the agent to generate code.

Step six is where generation begins. Everything before it is the control infrastructure that makes generation safe. Skipping any step before step six is borrowing against future pain.

This order is not bureaucracy. It is the difference between a system designed to catch bad output and a system that will surface bad output only after it reaches production.

## Writing CLAUDE.md First

CLAUDE.md is the agent's context file. It lives at the root of the repository. Every agent session that opens the repository reads it.

A CLAUDE.md that is absent means the agent fills the gap with defaults and assumptions. Those defaults and assumptions are generic. They are not your project.

A CLAUDE.md for a new project contains five things.

**Project overview.** Two to three sentences. What this project does and who it serves. Not a mission statement. A factual description the agent can use to constrain its output.

**The primary constraint.** The one thing the agent must not violate. "This is a CLI tool. No server-side code." "This project uses SQLite. No external databases." "All output must validate against the schemas in `src/schemas/`." One constraint, stated plainly.

**The verification command.** The exact command that confirms the output is valid. `npm test`. `pytest`. `make check`. The agent knows to run this before proposing a commit. The CI system runs it on every PR. It is the same command everywhere.

**The scope limits.** Which directories the agent can modify. Which files are off-limits. "Only modify files in `src/`. Do not touch `config/`." Explicit scope prevents the agent from refactoring files it was not asked to touch.

**Decisions already made.** The choices that are not up for reconsideration. The language. The framework. The test library. The deployment target. Stating these prevents the agent from proposing alternatives at every session.

CLAUDE.md is not a prompt. It is not a wish list. It is a boundary document. It tells the agent what the project is, what it is not, and how to verify that work is done correctly.

## Schema Before Code

Define the core data schemas before asking for code.

The schema is the first spec. If you know what a `Task` looks like - `{ id, title, status, assignedTo, dueDate }` - write the Zod or Pydantic schema before writing the function that creates a task. The schema constrains the output. The agent generating a `createTask` function against a defined schema has a target. The agent generating a `createTask` function against a description has latitude.

Latitude produces inconsistency. A target produces precision.

The schema also becomes the first validator. Any output that fails to validate against the schema fails immediately. This is feedback without a test runner - the schema validator runs at the boundary.

For a new project, the minimum schema set is the core domain objects. In a task manager: Task, User, Project. In an e-commerce system: Product, Order, LineItem. These are the shapes that everything else builds on. Getting them right before generating the code that builds on them is cheaper than correcting the code after the shapes change.

## CI Before Features

Set up the CI pipeline before writing the first feature.

In GitHub Actions or any equivalent system, the setup takes one file: `.github/workflows/ci.yml`. The file runs the verification command on every push and every PR. Branch protection is enabled on main: PRs require CI to pass before merging. This takes thirty minutes to configure.

Those thirty minutes make a permanent difference.

With CI in place, every branch the agent creates has its output validated automatically. The agent cannot merge unvalidated output. The pipeline is the enforcement mechanism - not a human reviewer reading every diff, but an automated check running the same command on every proposed change.

Without CI in place, the enforcement is human attention. Human attention is inconsistent. It degrades under time pressure. It skips steps when the output looks reasonable. An automated pipeline does not skip steps.

The CI configuration belongs in the first commit. Not the second commit. Not "once we have something to test." The first commit.

## The First Commit

The first commit is the control infrastructure.

It contains: CLAUDE.md, the schema definitions for core data shapes, the CI configuration file, the test runner configuration, and one failing test. No application code. No features. No implementation.

This commit installs the safety system.

The failing test is the starting gun for the agent. The agent's first task is to make that test pass. The CI pipeline confirms when it does. The schema validates the output shape. CLAUDE.md constrains the scope.

Every subsequent commit builds on a foundation that is already verified and controlled. The first commit is the hardest one to write because it requires knowing what you are building without building it yet. That difficulty is the point. The difficulty of writing the first commit is the same difficulty as designing the system. Resolving it before generation begins is cheaper than resolving it after.

## Briefing The Agent

At the start of every session, the agent needs four things: the problem, the constraints, the verification command, and the scope.

CLAUDE.md provides three of these permanently. The problem - what this specific session is solving - requires a session-specific briefing.

The briefing is short. One paragraph. What is the current task. What behavior should be added or changed. What the acceptance criterion is. Which files are in scope for this session.

If the agent does not receive this briefing, it will infer the task from the context. Inference is less precise than a stated problem. The agent will work toward something. Whether that something matches the intended task is a function of how clearly the context implies it.

State the problem explicitly. Do not make the agent infer it.

The acceptance criterion is the verification command applied to a specific outcome. "The session is complete when `npm test` passes and the new endpoint returns a 400 for missing required fields." That sentence gives the agent a finish line. Without a finish line, the agent continues generating until the context ends or wanders into adjacent problems it was not asked to solve.

## Practical Artifact - Project Start Checklist

Use this checklist before asking the agent to generate the first line of application code.

| Step | Action | What it installs |
| --- | --- | --- |
| 1 | Write the problem as a one-sentence issue | Shared understanding of scope |
| 2 | Write CLAUDE.md with overview, constraint, verification command, scope, and decisions | Agent operating context |
| 3 | Define core domain schemas | First spec and first validation layer |
| 4 | Create CI configuration file | Automated enforcement of verification |
| 5 | Enable branch protection requiring CI to pass | Prevents unvalidated merges to main |
| 6 | Write one failing test | Defined starting point for generation |
| 7 | Commit all of the above as the first commit | Installed safety system is the baseline |
| 8 | Brief the agent: problem, constraints, verification command, scope | Session-specific operating instructions |
| 9 | Ask the agent to make the failing test pass | Generation begins against defined constraints |

---

## Export

Copy this block into your CLAUDE.md, agent instructions, or project checklist.

**Key line**
> The first commit should be the safety system, not the feature.

**Agent YAML**
```yaml
vcb_chapter: 18
title: "Starting A Project"
key_line: "The first commit should be the safety system, not the feature."
thesis: "Every control installed after the agent starts generating is harder to install than a control installed before. Front-load the discipline."
checklist:
 - item: "Write CLAUDE.md before the first generation session"
 protects: "Prevents the agent from filling context gaps with generic assumptions"
 - item: "Define core domain schemas before writing application code"
 protects: "Gives the agent a precise target and a first validation layer"
 - item: "Set up CI and branch protection before the first feature"
 protects: "Makes automated enforcement the default, not the exception"
 - item: "Write a failing test as the starting gun for generation"
 protects: "Gives the agent a defined finish line with a verifiable criterion"
 - item: "Make the control infrastructure the first commit"
 protects: "Establishes a verified baseline before any application code exists"
```

**Portable checklist**
- [ ] Is CLAUDE.md written with overview, primary constraint, verification command, scope, and decisions? - *Prevents the agent from operating on generic assumptions*
- [ ] Are core domain schemas defined before application code is generated? - *Provides a precise target and first validation layer*
- [ ] Is CI configured and branch protection enabled on main? - *Ensures automated enforcement from the first PR*
- [ ] Is there a failing test the agent is being asked to make pass? - *Gives generation a defined start and finish*
- [ ] Is the control infrastructure committed before any feature work begins? - *Establishes a verified baseline*
