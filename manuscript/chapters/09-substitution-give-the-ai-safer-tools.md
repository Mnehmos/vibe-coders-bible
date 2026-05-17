# Chapter 9 - Substitution: Give The AI Safer Tools

Part: III - The Hierarchy Of AI Controls

## Thesis

Replace raw power with typed, narrow tools.

## Key Line

Do not give the agent a chainsaw when a socket wrench will do.

## The Substitution Principle

Elimination is not always available.

Sometimes the agent genuinely needs to touch the database. It needs to modify files. It needs to call an external service. It needs to run a build command. You cannot simply remove the capability without removing the usefulness.

Substitution is the answer. You do not take the capability away. You replace the dangerous form of the capability with a safer form that accomplishes the same real job.

A chainsaw and a socket wrench are both tools. One is appropriate for rough timber. The other is appropriate for fasteners. Handing someone a chainsaw because "it can do anything" is not more helpful — it is riskier, harder to control, and worse at the actual job.

When you give an agent raw database access, you give it a chainsaw. It can do anything to the database. When you give it a typed migration tool, you give it the socket wrench it actually needs: a focused instrument that can do the job correctly and cannot accidentally do the things it should not.

## Raw Database Access vs. Typed Migration Tools

Raw SQL shell access means the agent can run any query. SELECT. INSERT. UPDATE. DELETE. DROP. TRUNCATE. ALTER. Grant privileges. Revoke them.

None of those capabilities are the job. The job is usually: propose a schema change, draft the migration, apply it in the right order. That job does not require the ability to drop tables. It requires the ability to write a migration file.

**Unsafe:** Agent receives a psql connection string and can run arbitrary SQL interactively.

**Safer:** Agent has a migration tool that accepts `table`, `operation`, and `definition` fields. It writes a timestamped migration file to `db/migrations/`. Applying the migration is a separate step requiring human review and explicit execution.

The safer tool exposes intent. When the agent calls the migration tool, you can read the call and understand exactly what schema change is being proposed. When it runs arbitrary SQL, you can only audit a log after the fact.

## Raw Shell Access vs. Task Runners

A shell is not a tool. A shell is a capability surface that includes every tool installed on the machine.

Giving an agent shell access means giving it whatever the shell can reach: package managers, file operations, network tools, service controls, environment manipulation. The agent did not ask for all of that. You handed it to them because "the shell can do anything."

Anything is too much.

**Unsafe:** Agent is given a bash tool. It can install packages, modify files, trigger builds, kill services, and delete directories.

**Safer:** Agent is given a task runner that exposes named commands: `test`, `build`, `lint`, `format`, `start`. Each command runs a pre-defined script. The agent calls `build`, which runs `npm run build`. It cannot install packages. It cannot delete files. It cannot reach network tools.

The allowlist is not a restriction on the agent's intelligence. It is a description of the job. If the job is building and testing, the tools should be for building and testing.

## Broad File Writes vs. Scoped Editors

Filesystem access without scope is access to everything the filesystem contains.

Configuration files, secrets checked in accidentally, build artifacts, installed packages, the `.git` directory — everything is reachable. The agent working on a component does not need access to the deployment configuration. The agent refactoring a module does not need access to the environment file.

**Unsafe:** Agent has a file write tool with no path restrictions. It can write anywhere the process has permissions.

**Safer:** Agent has a file tool scoped to `src/` and `tests/`. Write attempts outside that scope return an explicit error. The error is not a prompt instruction — it is a structural rejection that logs the attempt.

Scoped access also makes the agent's behavior auditable. Every write lands in a known directory. A reviewer can look at the set of changed files and confirm nothing is outside scope. With broad access, that audit requires checking every changed path individually.

## Live API Calls vs. Sandbox Clients

Agents making outbound API calls during development are agents that can interact with live external systems.

This matters when the external system is stateful: a payment processor, an email service, a CRM, a messaging platform. A test that "accidentally" sends a real email is not a test. A migration that "accidentally" charges a customer is a production incident.

**Unsafe:** Agent is given the live SendGrid client configured with the production API key. It can send real emails to real addresses.

**Safer:** Agent is given a sandbox client that accepts the same interface but routes to a mock or test-mode endpoint. API key is a test-mode key scoped to no real consequences. Production client is not available during development sessions.

Dry-run mode is the minimum acceptable substitute when a full sandbox is unavailable. A dry-run flag tells the client to go through all the motions except the final commit or send. The agent can exercise the full code path without consequences.

Idempotency matters here too. Tools that can safely be called twice are safer to use in agent workflows where retries and replays are possible. If a tool does something irreversible on the first call, the agent's retry behavior becomes dangerous. If the tool is idempotent, retries are safe by design.

## Why Narrow Tools Expose Intent

There is a second benefit to substitution beyond safety: legibility.

When an agent calls `create_migration(table="users", operation="add_column", definition={"name": "deleted_at", "type": "timestamp", "nullable": true})`, the intent is readable. A reviewer can see exactly what schema change is being proposed, verify it is correct, and approve or reject it.

When an agent runs `ALTER TABLE users ADD COLUMN deleted_at TIMESTAMP;` in a raw SQL shell, the intent is also legible — but the surrounding context is not. Is this in a migration file? Will it be tracked? Was it applied to staging first? Is there a rollback? The raw query answers none of these questions.

Typed tools make intent structural. The tool's arguments are the intent. Logs of tool calls are an audit trail of what the agent decided, not just what it typed.

This is why substitution connects directly to agent observability. A system of typed tools is a system whose behavior can be reviewed, replayed, and reasoned about. A system of raw shell and SQL is a system whose behavior can only be read from logs after the fact.

## Practical Artifact - Tool Substitution Table

Use this table when deciding which tools to give an agent. For each unsafe access pattern, identify the safer substitute, what it constrains, and a concrete example.

| Unsafe access | Safer substitute | What it constrains | Example |
| --- | --- | --- | --- |
| Raw SQL shell | Typed migration tool with dry-run mode | Prevents ad-hoc DML; all changes are tracked migration files | `create_migration(table, operation, definition)` |
| Arbitrary bash shell | Task runner with named allowlisted commands | Prevents system-level access; only pre-defined scripts run | `run_task(name="test")` → executes `npm test` |
| Broad file write (any path) | Scoped file tool restricted to `src/` and `tests/` | Prevents config and dotfile mutations; all writes are auditable | `write_file(path="src/components/Card.tsx", content=...)` |
| Live third-party API client | Sandbox or test-mode client | Prevents real-world side effects; exercises same code path | Stripe test mode, SendGrid sandbox, mock HTTP server |
| Direct UI state mutation | Component prop or state reducer call | Prevents invisible side-channel state changes; changes are traceable | `dispatch({type: "SET_VISIBLE", payload: false})` |
| Raw HTTP requests | Typed API client with schema validation | Prevents invented endpoints; response is validated before use | Generated OpenAPI client; unknown method is a compile error |
| Freeform config edit | Schema-validated config patch | Prevents structurally invalid configuration; changes are diffable | Config tool validates against JSON Schema before writing |
| Arbitrary npm installs | Package manager wrapper with allowlisted packages | Prevents supply-chain additions; dependency changes are explicit | `add_dependency(name="zod")` → runs `npm install zod`, requires human confirm |
