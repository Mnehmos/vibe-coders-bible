# Chapter 22 - Documentation As A Build Artifact

Part: V - AI-Assisted Development Workflows

## Thesis

AI-generated documentation is a draft with a specific failure signature: fluent, confident, and wrong in ways that take weeks to discover.

## Key Line

Docs that lie are worse than no docs, because they replace the silence that forces investigation with the confidence that prevents it.

## Docs That Lie

The classic failure looks like this. The agent reads the codebase and produces a README. The README describes how to install the project, what the main commands do, and what the API returns. Every sentence is grammatically correct. Several are wrong.

The installation command references a script that was renamed three weeks ago. The API response shape omits a field added in the last sprint. The default timeout is listed as 30 seconds; it is 10. The developer who wrote the README is not lying. The agent produced it from the code as it existed when the training data was cut, or from the code as it existed at the start of the session, not as it exists now.

Docs that lie cost more than no docs. No docs forces the reader to look at the code. Docs that lie send the reader down a path that dead-ends in a confusing error and no explanation.

## Docs As Code

Documentation belongs in the repository that contains the code it describes. This is not a preference. It is an engineering control.

When docs live outside the repo - in a wiki, a Notion database, a Google Doc - they are not reviewed in pull requests. They are not updated when the code changes. They are not versioned alongside the interfaces they describe. They drift immediately and silently.

When docs live in the repo, a PR that changes a function signature can include a diff to the docs that describe that signature. The reviewer can see both. The merge check can enforce that docs-relevant changes include doc updates. The changelog can be generated from commits. The docs are participants in the build, not bystanders.

Agent-readable docs serve a second function beyond human readers: they give the next session context. A `CLAUDE.md` file in the repo root, a docblock on a function, an OpenAPI spec - these are inputs the agent reads at the start of the next session. Docs that are accurate give the agent accurate context. Docs that lie give the agent confident wrong context.

## The Verification Requirement

Every claim in AI-generated documentation requires verification against current behavior.

This is not a suggestion. "Run this command" - run it. "This function returns an object with the following fields" - call the function and check the return value. "The default value is X" - read the source or check the runtime. "Available since version 2.1" - check the git log.

AI-generated docs are wrong in specific, predictable patterns:

| Error type | Why it happens |
| --- | --- |
| Wrong default values | Model uses training-distribution defaults, not project-configured values |
| Renamed or removed commands | Model reads old signatures; CLI has changed since |
| Stale error messages | Error strings change without announcement |
| Missing new fields | Model generates from the shape it saw, not the shape that exists now |
| Wrong version numbers | Model does not track project versioning |

The verification requirement is not an argument against generating docs with AI. Generation is fast; verification is necessary. The combination is faster than writing docs from scratch and more accurate than publishing generation without review.

## Living Documentation

Living documentation is documentation derived automatically from the authoritative source.

A function docblock generated from the function signature cannot describe a parameter the function does not have. An OpenAPI spec generated from TypeScript types cannot describe a response shape that the types do not define. A CLI reference generated from the CLI's `--help` output cannot list a command that no longer exists.

Living documentation is harder to get wrong because it has a source that checks it. When the source changes, the doc changes or the generation fails. Either outcome is acceptable. What is not acceptable is docs that describe behavior that has not been the behavior for six months.

The tools for living documentation are practical. JSDoc generates API references. `typedoc` generates TypeScript documentation. `openapi-generator` generates client libraries and spec pages from annotated types. The CLI help flag is the authoritative source for usage instructions. Doctest patterns run the examples in the docs as tests.

Not all documentation can be living documentation. Architecture decisions, setup rationale, and conceptual explanations require human authorship. Living documentation handles the mechanical descriptions. Human authorship handles the explanations that require judgment.

## What AI Gets Wrong In Docs

Knowing the failure modes prevents specific failures.

Default values are the most common error. The model learns from repositories where the default timeout is 30 seconds, the default port is 3000, the default log level is `info`. If this project sets a 10-second timeout in a config file, the agent does not know that unless it reads that config file in the current session. Verify every default value against the config the project actually runs.

Command flags are the second most common error. The agent generates documentation based on the flag syntax it has seen. If the project renamed `--verbose` to `--log-level verbose` in a recent refactor, the agent generates docs for `--verbose`. Run every documented command to confirm it works.

Version numbers are unreliable. The agent does not know what version the project is on unless told. Do not trust agent-generated version references without checking the package manifest.

Error messages change without announcement. The agent documents the error message it saw. If the error message was improved in a recent PR, the doc is wrong. Trigger the described error conditions and compare the actual message to the documented one.

## The Release Note

Release notes generated by summarizing commits are legitimate first drafts.

The commit history is a real artifact. "feat: add rate limiting to the auth endpoint," "fix: correct timeout calculation for background jobs," "chore: upgrade postgres driver to 15.x" - these commits contain real information. An agent that reads the commit log and produces a structured release note from it is doing useful work.

The release note draft still requires human verification. Confirm that each described change is accurate. Check that no breaking change was omitted. Check that dependency upgrades are listed with their version numbers. Confirm the migration instructions match the actual migration.

The release note has a specific additional verification requirement: it must be accurate from the reader's perspective, not just the author's. The author knows that "refactor auth token handling" means the token format changed and clients need to update. The reader does not. A release note that is technically accurate but omits the user-visible consequence of a change has failed its job.

## Agent Role In Documentation

The agent drafts. The human verifies and publishes.

This division is firm. The agent's role in documentation is to produce a first draft quickly, from the code it can read in the current session. The human's role is to verify every factual claim against current system behavior and to write the explanatory content that requires judgment.

When the agent is given doc-generation tasks, the prompt should specify what it can and cannot know. "Generate a function reference for each public function in `src/api/`" is a well-scoped documentation task. "Write complete documentation for the entire project" is not - it invites the agent to fill gaps with plausible-sounding guesses.

## Practical Artifact - Documentation Quality Checklist

Run this checklist on every AI-generated documentation section before publishing.

| Claim type | Verification action | Required |
| --- | --- | --- |
| Installation command | Run it in a clean environment | Yes |
| CLI flag or command | Run it and check output | Yes |
| Default value | Check source or runtime | Yes |
| API response shape | Call the endpoint and compare | Yes |
| Version number | Check package manifest or git tag | Yes |
| Error message | Trigger the error and compare | Yes |
| Architecture description | Have a second human read it | Recommended |
| Code example | Run the example | Yes |

**Docs from diff - prompt checklist:**

Before finalizing any documentation update generated after a code change, answer:

- [ ] What behavior changed? Is it described accurately? - *Prevents docs from describing removed behavior*
- [ ] What setup steps changed? Are they up to date? - *Prevents broken installation instructions*
- [ ] What commands changed? Are they runnable? - *Prevents docs with commands that no longer exist*
- [ ] What examples changed? Do they execute correctly? - *Prevents examples that fail on copy-paste*
- [ ] What claims need source verification? Have they been verified? - *Prevents fluent falsehoods crossing the publish boundary*

---

## Export

Copy this block into your CLAUDE.md, agent instructions, or project checklist.

**Key line**
> Docs that lie are worse than no docs, because they replace the silence that forces investigation with the confidence that prevents it.

**Agent YAML**
```yaml
vcb_chapter: 22
title: "Documentation As A Build Artifact"
key_line: "Docs that lie are worse than no docs, because they replace the silence that forces investigation with the confidence that prevents it."
thesis: "AI-generated documentation is a draft with a specific failure signature: fluent, confident, and wrong in ways that take weeks to discover."
checklist:
 - item: "Every installation command has been run in a clean environment."
 protects: "Broken onboarding instructions"
 - item: "Every CLI command in the docs has been executed and output verified."
 protects: "Renamed or removed command references"
 - item: "Every default value has been checked against the project config."
 protects: "Wrong defaults from training-distribution assumptions"
 - item: "Every code example executes correctly."
 protects: "Copy-paste examples that fail immediately"
 - item: "Documentation lives in the repo, not in an external wiki."
 protects: "Docs that drift from the code they describe"
```

**Portable checklist**
- [ ] Is documentation in the repository, reviewed in PRs? - *Protects against docs that drift undetected*
- [ ] Has every install command been run in a clean environment? - *Protects against broken onboarding*
- [ ] Has every default value been verified against source or runtime? - *Protects against training-distribution defaults replacing project-configured values*
- [ ] Has every code example been executed? - *Protects against copy-paste examples that fail*
- [ ] Has a human verified the release note against user-visible behavior, not just commit messages? - *Protects against technically accurate but operationally misleading release notes*
