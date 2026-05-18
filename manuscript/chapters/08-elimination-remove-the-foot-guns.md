# Chapter 8 - Elimination: Remove The Foot-Guns

Part: III - The Hierarchy Of AI Controls

## Thesis

The safest AI action is the one the AI cannot take.

## Key Line

Remove the hazard before teaching the agent to tiptoe around it.

## Capability Design Is Safety Design

When you give an agent a capability, you accept every failure mode that capability brings.

This is not a metaphor. If an agent can write arbitrary files, it can overwrite configuration files. If it can execute shell commands, it can delete directories. If it has production credentials, it can modify production data. If it can call the deployment script, it can ship broken code. These are not hypothetical risks. They are the natural consequences of capability.

The instinct in most teams is to manage these risks with instructions. "Be careful." "Ask first." "Do not touch that." Those instructions are prompts. They are PPE. And they fail under the conditions that matter most: speed, complexity, long sessions, and multi-step chains where the original caution has drifted out of view.

Elimination is different. Elimination removes the capability before the agent touches the system.

It does not teach the agent to tiptoe around the foot-gun. It removes the foot-gun from the room.

## No Production Credentials In Agent Context

This is the most important rule and the most commonly violated one.

An agent with production database credentials can query production. It can also insert, update, and delete production records. It can do this at the speed of a model completing a task, which is faster than a human reviewing a plan. It can do this on the wrong row when the WHERE clause is slightly off.

The risk is not that agents are malicious. The risk is that agents are confidently wrong.

**Before:** Agent receives DATABASE_URL pointing to production. Migration task runs. Agent interprets "remove deprecated columns" too broadly. Columns with live data are dropped.

**After:** Agent receives no production credentials at any point in development workflow. All schema changes are drafted as migration files and applied through a gated CI step that requires human approval on the production environment.

The credential never enters the agent's context. The failure mode does not exist.

## No Raw Destructive Shell Access

Shell access is the broadest capability you can give an agent.

A shell can delete files, kill processes, modify permissions, install software, change environment configuration, and initiate network connections. It can do all of this with a single command. An agent with unrestricted shell access has, functionally, root access to whatever the shell can reach.

**Before:** Agent is given a bash tool to help with build tasks. It is instructed not to delete anything important. During a cleanup task, it runs `rm -rf build/` in the wrong working directory.

**After:** Agent has access to a task runner that accepts only named commands from an allowlist: `build`, `test`, `lint`, `start`. Arbitrary shell commands are not possible through this interface. Cleanup is handled by a dedicated `clean` command that targets only the build output directory.

The allowlist is not an instruction to the agent. It is a structural limit on what the agent can emit.

## No Secrets In Prompts, Fixtures, Or Logs

Secrets in agent context are secrets exposed to logs, to the model provider, and to anyone who can read the prompt.

This matters in ways teams underestimate. A prompt containing an API key is a prompt that may be logged in observability tools, in model provider dashboards, in debug output, and in session recordings. A fixture containing a test credential is a credential that may be checked into source control. A log containing an authorization token is a token that may be stored in a log sink with different access controls than the secret store.

**Before:** Agent prompt includes `STRIPE_SECRET_KEY=sk_live_abc123` as context so it can "test" payment calls.

**After:** Agent never receives secret values. When payment functionality needs to be exercised in development, the agent is given a Stripe test-mode client with a sandbox key stored in a secret manager. The production key is never in any prompt or fixture.

This is not about trust in the model provider. It is about blast radius. A credential that was never in a prompt cannot be leaked through prompt logging.

## No Autonomous Deploys Without Gates

Deployment is irreversible on the timescale of a session.

An agent that can trigger deployment can ship broken code before anyone has reviewed it. It can deploy to the wrong environment. It can initiate a rollout that degrades production before the monitoring alert fires.

**Before:** Agent has access to a `deploy` function in its toolset so it can verify that the feature works end-to-end. During a feature build session, it calls deploy to "test" something.

**After:** The deploy function does not exist in the agent's toolset during development sessions. Deployment is a separate workflow triggered by a human action after CI passes and the PR is approved. The agent can propose the deploy command in a plan, but cannot execute it.

Gates are not bureaucracy. They are temporal firewalls between agent action and production consequence.

## No Broad Filesystem Write Access

An agent that can write anywhere can overwrite things that should not be overwritten.

Configuration files, lock files, generated build artifacts, environment overrides - these are not code, but they control behavior. An agent with broad filesystem access can modify them incidentally while working on a related task. The modification may be syntactically valid and silently wrong.

**Before:** Agent is given write access to the entire project directory. While updating a component, it also modifies `tsconfig.json` to resolve a type error. The change disables strict null checks project-wide.

**After:** Agent has write access scoped to `src/` and `tests/` only. Configuration files in the root are read-only to the agent. Structural configuration changes require a separate human-initiated step.

The scope is the control. The instruction "do not touch configuration files" is not.

## Why This Is Design, Not Restriction

Elimination is not about making agents less useful.

A scoped agent is often more useful because it is more predictable. A tool that can only do the job it was designed for makes its intent legible. When an agent calls a database migration tool, you know it is proposing a schema change. When an agent calls a shell with arbitrary commands, you know much less.

Narrow capability exposes intent. Broad capability hides it in a cloud of possibility.

The goal is not an agent that cannot do anything. The goal is an agent that can do exactly the things the team has decided it should do, through interfaces designed to make mistakes visible and recoverable.

Design the capability surface. Then prompt the intent.

## Practical Artifact - Remove These First Checklist

Before giving an agent access to a system, work through this list. Each item names a capability and the risk its removal prevents.

- [ ] **Production credentials are absent from agent context.** Removes: accidental modification of live data, credential exposure through prompt logging.
- [ ] **Destructive shell commands are not available through the agent tool interface.** Removes: irreversible file deletion, environment mutation, accidental system reconfiguration.
- [ ] **Secret values (API keys, tokens, passwords) do not appear in prompts, fixtures, or test data.** Removes: credential leakage through logs, prompt storage, and source control.
- [ ] **The deployment trigger is not in the agent's toolset during development sessions.** Removes: autonomous production deploys before review, wrong-environment deployments.
- [ ] **Filesystem write access is scoped to source and test directories only.** Removes: accidental configuration overwrite, lock file corruption, build artifact mutation.
- [ ] **Database access is provided through a migration tool or read-only replica, not a raw connection.** Removes: ad-hoc schema changes, live data mutation during development, untracked query execution.
- [ ] **Outbound network calls go through a typed client or sandbox environment, not raw HTTP.** Removes: calls to live third-party services during development, credential exposure in request logs.
- [ ] **Any operation labeled "irreversible" requires a two-step tool call: plan, then explicit confirm.** Removes: the gap between agent proposal and human review on high-consequence actions.
- [ ] **Agent session logs are reviewed for capability creep after new tasks are added.** Removes: gradual expansion of what the agent can reach without deliberate review.
- [ ] **The capability list is documented and treated as a design artifact, not a default.** Removes: implicit capability grants that no one decided to make.

Work through the list before the first session and after every time the agent's toolset changes. Capability drift is how elimination backslides.
