# Chapter 8 - Elimination: Remove The Foot-Guns

Part: III - The Hierarchy Of AI Controls

## Thesis

The safest AI action is the one the AI cannot take.

## Key line

Remove the hazard before teaching the agent to tiptoe around it.

## Chapter job

Show that capability design is safety design. The chapter should give teams a concrete list of dangerous access patterns to remove first.

## Main beats

- No production credentials in agent context.
- No raw write access to production databases.
- No unreviewed shell with destructive permissions.
- No broad filesystem access unless needed.
- No secrets in prompts or logs.
- No autonomous deploys without gates.
- No unbounded memory writes.

## Practical artifact

Create a "remove these capabilities first" checklist:

- [ ] Production credentials unavailable to routine agents.
- [ ] Destructive commands require explicit approval.
- [ ] Secrets excluded from prompts, fixtures, and logs.
- [ ] Filesystem access scoped to project paths.
- [ ] Deployment path gated by CI and human authorization.
- [ ] Database writes go through migrations or typed tools.

## Draft notes

Keep this concrete. Beginners should know what to avoid. Professionals should see a policy they can operationalize.
