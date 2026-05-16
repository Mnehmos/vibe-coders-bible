# Codex Context Dump — The Vibe Coder’s Bible

**Owner:** Mnehmos  
**Institutional line:** Mnehmos, from The Mnemosyne Research Institute, presents  
**Project title:** The Vibe Coder’s Bible  
**Subtitle:** A Trust-but-Verify Field Manual for Hierarchy-of-Controls AI-Assisted Software Development  
**Target repo:** `Mnehmos/vibe-coders-bible`  
**Intended visibility:** Public  
**Primary artifact:** Markdown book / field manual / reference guide  
**Suggested license:** CC BY 4.0 for prose and documentation. MIT only for reusable code/templates if included.

---

## 0. Mission

Build the initial public repository for **The Vibe Coder’s Bible**, a serious field manual for AI-assisted software development.

This is not another list of prompts. It is a doctrine and operating manual for builders using AI coding agents, copilots, Codex-like agents, Cursor, Claude Code, Roo, Kilo, Copilot, Replit, Lovable, and future autonomous software tools.

The book teaches the missing discipline:

> Trust AI to propose.  
> Verify before commit.  
> Design systems where hallucination can exist, but cannot silently become truth.

The guide should speak to both:
1. New builders who can now make software before they fully understand software engineering.
2. Experienced developers who need a rigorous vocabulary for supervising AI-assisted work.

Tone: direct, practical, sharp, non-academic when possible, but serious enough for engineers.

Avoid process/self-referential language such as:
- “this revision”
- “the audit strengthens the paper”
- “in this version”
- “we added”
- “as discussed above”
- “the GitHub analysis shows”

Write as if the work already stands on its own.

---

## 1. Core Philosophy

### 1.1 Attention to Detail Was Always a Labor Constraint

Software engineering has always rewarded detail. Tests, documentation, schemas, diagrams, migration plans, threat models, review checklists, reproductions, rollback plans, and issue hygiene are not “extras.” They are the work that makes systems survivable.

Teams skip these things because they are expensive.

AI changes the labor economics.

> Attention to detail was always a labor constraint.  
> AI does not make detail unnecessary.  
> AI makes detail affordable.

AI-assisted software development should not mean less discipline. It should mean discipline becomes cheap enough to apply everywhere.

### 1.2 AI Solves Problems Made Easier by Labor Input

Many software problems are not conceptually impossible. They are labor-heavy.

Examples:
- Writing broad tests.
- Updating stale docs.
- Creating diagrams.
- Maintaining issue trackers.
- Producing rollback plans.
- Generating fixtures.
- Writing negative test cases.
- Searching large codebases.
- Explaining architecture to the next contributor.
- Refactoring repetitive patterns.
- Producing migration checklists.
- Drafting security threat models.

AI collapses the cost of these labor-heavy tasks. That does not eliminate the need for judgment. It moves judgment to the center.

> Vibe coding lowers the cost of generation.  
> It does not lower the cost of responsibility.

### 1.3 The New Bottleneck Is Judgment

When generation becomes cheap, review becomes the bottleneck. The important question is no longer “Can code be produced?” The important question is:

> What is allowed to become real?

The guide should return to this distinction constantly:
- The model may generate.
- The system must verify.
- The human owns intent and responsibility.
- Git records the change.
- Tests and schemas protect the boundary.
- Deployment gates decide what reaches users.

---

## 2. Core Doctrine

### 2.1 The Failure Is Letting Hallucination Commit

The strongest thesis sentence:

> The failure is not that the model hallucinates. The failure is letting hallucination commit.

Distinguish two failure levels:

```text
Generation-level hallucination:
  The model emits something false, broken, speculative, unsafe, or unsupported.

Commit-level hallucination:
  The system accepts that false, broken, speculative, unsafe, or unsupported output as state.
```

The architecture should attack commit-level hallucination.

### 2.2 Trust, But Verify

The correct stance toward AI is not worship, panic, or refusal. It is controlled delegation.

> Trust AI to propose.  
> Verify before commit.

AI is useful because it proposes quickly. It is dangerous when proposal becomes authority.

The guide should define “commit” broadly:
- Git commit.
- Database mutation.
- Production deployment.
- Published content.
- User-visible output.
- Documentation claim.
- Security assumption.
- API contract.
- Stored memory.
- Generated media artifact.

### 2.3 Mixed Model Output

An LLM response is not one thing. It is a mixed stream.

It may contain:
- Explanation.
- Code.
- Shell commands.
- Tool calls.
- JSON.
- Citations.
- Claims.
- Guesses.
- Plans.
- Tests.
- UI copy.
- Database migrations.
- Security advice.
- Public-facing prose.
- Hidden assumptions.
- Poison from retrieved context.

Serious AI systems route these outputs into different trust lanes.

| Output Type | Risk | Correct Destination |
|---|---:|---|
| Explanation | Medium | Human review |
| Code diff | High | Tests, lint, typecheck, review |
| Shell command | High | Sandbox, allowlist, approval |
| Database migration | High | Backup, dry run, rollback plan |
| Citation/source claim | High | Source validation |
| Structured JSON | Medium | Schema validation |
| Tool call | High | Capability boundary |
| UI copy | Medium | Product/human review |
| Public analysis | High | Citation/provenance review |

Key line:

> Mixed output must be routed. Treating the whole answer as equally trustworthy is the original sin of vibe coding.

### 2.4 Hierarchy of Controls for AI-Assisted Development

Prompting is useful, but prompting is not the top of the safety stack.

Map industrial safety controls into AI-assisted software development:

| Safety Control | AI-Assisted Development Equivalent |
|---|---|
| Elimination | Remove access to secrets, production databases, destructive commands, broad filesystem writes |
| Substitution | Replace raw access with typed tools, task runners, safe APIs, dry-run commands |
| Engineering Controls | Tests, schemas, type systems, CI, sandboxes, branch protection, permissions |
| Administrative Controls | PR templates, checklists, review policy, issue discipline, release process |
| PPE | Prompt instructions, “be careful,” manual vigilance, style preferences |

Key line:

> Prompting is PPE. Useful, but last-line defense. Real safety lives higher in the hierarchy.

---

## 3. Book Identity

### Cover Text

```text
Mnehmos
from The Mnemosyne Research Institute

presents

THE VIBE CODER’S BIBLE

Trust AI to Propose. Verify Before Commit.

A Hierarchy-of-Controls Field Manual
for AI-Assisted Software Development
```

### Back-Cover Style Summary

Vibe coding is real. It gives nontraditional builders leverage that used to require entire teams. But fast generation without verification creates slop, security failures, fake confidence, fragile systems, and silent corruption.

The Vibe Coder’s Bible teaches a safer discipline: use AI aggressively before the gate, then use tests, schemas, sandboxes, permissions, Git, CI, review, and provenance to decide what becomes real.

AI does not replace care. AI makes care scalable.

---

## 4. Proposed Repository Structure

Create a Markdown-first repo.

```text
vibe-coders-bible/
  README.md
  LICENSE
  AGENTS.md
  PROJECT_CONTEXT.md
  docs/
    00-preface.md
    01-vibe-coding-is-real.md
    02-attention-to-detail-was-always-a-labor-constraint.md
    03-the-new-bottleneck-is-judgment.md
    04-trust-ai-to-propose.md
    05-verify-before-commit.md
    06-mixed-model-output.md
    07-prompting-is-ppe.md
    08-elimination-remove-the-footguns.md
    09-substitution-safer-tools.md
    10-engineering-controls.md
    11-administrative-controls.md
    12-the-core-loop.md
    13-the-repo-is-the-memory.md
    14-tests-are-reflexes.md
    15-schemas-are-contracts.md
    16-git-is-the-time-machine.md
    17-starting-a-project.md
    18-building-a-feature.md
    19-fixing-a-bug.md
    20-refactoring-with-ai.md
    21-documentation-as-a-build-artifact.md
    22-shipping-and-deployment.md
    23-case-studies.md
    24-failure-modes.md
    25-field-manual.md
    26-conclusion.md
  templates/
    ai-project-brief.md
    agent-handoff.md
    safety-checklist.md
    hierarchy-of-controls-checklist.md
    pr-checklist.md
    bug-report.md
    feature-brief.md
    release-checklist.md
    security-review.md
  examples/
    minimal-trust-but-verify-workflow.md
    hierarchy-of-controls-mapping.md
    mixed-model-output-routing.md
  .github/
    ISSUE_TEMPLATE/
      chapter-draft.md
      template-request.md
      correction.md
    pull_request_template.md
```

Do not add a heavy build system yet. Keep it Markdown-first unless explicitly requested.

---

## 5. README Requirements

The README should be polished and public-facing.

Suggested README sections:

1. Title and subtitle.
2. One-paragraph mission.
3. Core doctrine.
4. Who the guide is for.
5. What makes it different from prompt guides.
6. The hierarchy-of-controls table.
7. The propose/validate/commit loop.
8. Book outline.
9. Templates included.
10. Case studies.
11. Contribution guidelines.
12. License.

README opening draft:

```markdown
# The Vibe Coder’s Bible

**A Trust-but-Verify Field Manual for Hierarchy-of-Controls AI-Assisted Software Development**

Presented by **Mnehmos**, from **The Mnemosyne Research Institute**.

Vibe coding lowers the cost of generation. It does not lower the cost of responsibility.

This guide teaches a practical discipline for AI-assisted development: let models propose aggressively, then use tests, schemas, sandboxes, permissions, code review, CI, Git, and provenance to decide what becomes real.

> Trust AI to propose. Verify before commit.
```

---

## 6. Full Book Outline

### Front Matter

- Title page.
- Opening manifesto: “The Failure Is Letting Hallucination Commit.”
- Who this book is for.
- How to read this book.

### Part I — The New Discipline

#### Chapter 1 — Vibe Coding Is Real
Natural language is becoming a software interface. Vibe coding is not fake. It is a shift in labor economics.

#### Chapter 2 — Attention to Detail Was Always a Labor Constraint
Tests, docs, schemas, diagrams, threat models, and review artifacts were always valuable. AI makes them affordable.

#### Chapter 3 — The New Bottleneck Is Judgment
Cheap generation creates a review crisis. The scarce resource is deciding what deserves to become real.

### Part II — Trust, But Verify

#### Chapter 4 — Trust AI to Propose
AI is a proposer, not an authority.

#### Chapter 5 — Verify Before Commit
Commit means any persistent or public state transition.

#### Chapter 6 — Mixed Model Output
LLM output must be split into lanes: prose, code, commands, claims, migrations, citations, tool calls, and public text.

### Part III — The Hierarchy of AI Controls

#### Chapter 7 — Prompting Is PPE
Prompting matters, but it is not the main safety system.

#### Chapter 8 — Elimination: Remove the Foot-Guns
Remove AI access to secrets, production systems, destructive commands, and overbroad permissions.

#### Chapter 9 — Substitution: Give the AI Safer Tools
Replace raw shell/database/file power with typed, scoped, dry-run-friendly tools.

#### Chapter 10 — Engineering Controls: Make Invalid Work Fail Automatically
Tests, schemas, type systems, CI, sandboxes, permissions, branch protection, reproducible builds.

#### Chapter 11 — Administrative Controls: Process Still Matters
Issues, checklists, PRs, release notes, review policy, ADRs, handoffs.

#### Chapter 12 — PPE: Prompting, Style, and Human Attention
Good prompts help, but they cannot enforce behavior.

### Part IV — The Propose / Validate / Commit Loop

#### Chapter 13 — The Core Loop
Intent → proposal → structured artifact → validation → commit → trace.

#### Chapter 14 — The Repo Is the Memory
AI conversations evaporate. Repos persist.

#### Chapter 15 — Tests Are Reflexes
Every bug fixed without a test is a lesson the agent can forget.

#### Chapter 16 — Schemas Are Contracts
A schema is a boundary the model cannot argue with.

#### Chapter 17 — Git Is the Time Machine
AI accelerates change. Version control becomes more important, not less.

### Part V — AI-Assisted Development Workflows

#### Chapter 18 — Starting a Project
Brief, architecture, initial tests, README, repo structure.

#### Chapter 19 — Building a Feature
Issue → acceptance criteria → tests → implementation → review → PR.

#### Chapter 20 — Fixing a Bug
Reproduction first. Failing test second. Patch third.

#### Chapter 21 — Refactoring with AI
Golden tests and small diffs make aggressive refactors survivable.

#### Chapter 22 — Documentation as a Build Artifact
Docs are how the next human or agent survives the build.

#### Chapter 23 — Shipping and Deployment
CI/CD, staging, secrets, migrations, rollbacks, smoke tests, release notes.

### Part VI — Case Studies from the Mnehmos Ecosystem

#### Chapter 24 — ProveCalc: The LLM Never Computes
The model proposes calculations; SymPy/Pint/unit gates verify.

#### Chapter 25 — RPG-MCP: The Model Narrates, the Engine Rules
The model narrates; deterministic game state owns HP, dice, inventory, spells, and consequences.

#### Chapter 26 — LLM-Chess: Benchmark and Broadcast Machine
The model proposes moves, reasoning, commentary, and annotations. Chess legality, Stockfish, event logs, benchmark records, and exports turn mixed output into validated data and content.

#### Chapter 27 — Clio: Civic Intelligence as Rendered State
The model proposes narration and Stagehand commands. Entity/source/runtime validation decides what reaches the public globe.

#### Chapter 28 — Semantic Video Studio: State First, Pixels Second
Prompt → production brief → state pack → validation → Blender render → provenance manifest.

#### Chapter 29 — Trace MCP, IndexFoundry, Synch MCP, and the Agentic Nervous System
Reliability compounds through infrastructure: schema mismatch detection, reproducible RAG, durable memory, and central/somatic/autonomic/reflex architecture.

### Part VII — Failure Modes

#### Chapter 30 — AI Slop Is Uncontrolled Commit
Slop is not merely bad output. It is output that bypassed taste, validation, and ownership.

#### Chapter 31 — The Plausibility Trap
The most dangerous output is almost right.

#### Chapter 32 — Context Poisoning and Prompt Injection
Retrieved content, docs, tool output, and memory can become attack surfaces.

#### Chapter 33 — The Over-Automation Trap
Autonomy must be earned by gates.

### Part VIII — The Field Manual

#### Chapter 34 — The AI Project Starter Kit
Copy-paste repo starter files.

#### Chapter 35 — The Daily Vibe-Coder Workflow
A practical daily loop from issue to commit.

#### Chapter 36 — The Agent Handoff Protocol
What changed, why, tests, risks, next steps, and what not to touch.

#### Chapter 37 — The Safety Checklist
Mapped to the hierarchy of controls.

#### Chapter 38 — Prompt Patterns That Actually Matter
Prompt patterns tied to verification and control, not magic wording.

#### Chapter 39 — Review Patterns for AI Code
Review the diff, tests, security, dependencies, migrations, and runtime behavior.

#### Chapter 40 — Definition of Done for AI-Assisted Work
Builds, tests, docs, no secrets, rollback, logs, human understanding, handoff.

### Conclusion — From Vibes to Discipline

Core closing:

> AI does not replace care.  
> AI makes care scalable.  
>  
> Trust the model to propose.  
> Trust the system to verify.  
> Trust the trace to remember.

---

## 7. Case Study Notes

Use these as concise summaries. Do not overclaim. Present them as examples of the doctrine.

### ProveCalc
- Engineering calculation platform.
- LLM proposes worksheet edits/calculations.
- Deterministic stack verifies with SymPy/Pint/unit constraints.
- Doctrine: the LLM never owns computation authority.

### RPG-MCP
- D&D-style rules-enforced backend.
- LLM narrates and proposes actions.
- Engine owns dice, HP, initiative, spells, inventory, and consequences.
- Doctrine: imagination is allowed before the gate; game state commits after rules validation.

### LLM-Chess
- LLM benchmarker and content generator.
- Supports LLM-vs-LLM games, tournaments, Stockfish opponents/oracles, commentary, TTS, exports.
- Mixed model output becomes: move proposals, reasoning, commentary, event logs, benchmark records, PGN/CSV/JSON/ZIP artifacts.
- Doctrine: chess legality and Stockfish act as validators/oracles; commentary is public rendering.

### Clio
- Rendered civic intelligence globe.
- LLM proposes narration and Stagehand commands.
- Entity/source/runtime validation decides what becomes public show event.
- Doctrine: public explanation should be compiled from validated state, not raw model output.

### Semantic Video Studio
- State-first video pipeline.
- Four-plane state pack: scene graph, asset manifest, timeline, render plan.
- Blender render is a downstream artifact.
- Provenance manifests and basics gate enforce reproducibility.
- Doctrine: pixels are output; state is product.

### Trace MCP
- Static schema mismatch analyzer.
- Detects producer/consumer schema drift.
- Doctrine: engineering controls should catch mismatch before runtime failure.

### IndexFoundry
- Deterministic RAG/index factory.
- Connect → extract → normalize → index → serve.
- Doctrine: RAG should be reproducible infrastructure, not a pile of embeddings.

### Synch MCP
- Persistent memory and agent coordination.
- Cross-session memory, file locks, bug tracking, handoffs.
- Doctrine: repos and state systems should remember what chat cannot.

---

## 8. Writing Style

Use:
- Clear, direct paragraphs.
- Strong thesis sentences.
- Concrete examples.
- Tables where they clarify.
- Copy-paste templates.
- Short manifestos at chapter openings.
- Practical checklists.

Avoid:
- Generic “AI is transforming everything” filler.
- Corporate SaaS tone.
- Excessive bullets without explanation.
- Self-reference to revisions or process.
- Pretending the guide is already complete.
- Fake citations or invented research.
- Overpromising safety.

Voice target:
- Builder manifesto + engineering field manual.
- Sharp but not reckless.
- Welcoming to beginners, credible to professionals.
- No sneering at “vibe coders.”
- No worship of AI.

Important user preference:
Avoid the default ChatGPT cadence where paragraphs repeatedly use “this is X, this is Y, and this is Z.” Keep the voice urgent, precise, and grounded.

---

## 9. Initial Codex Task

Use this as the first task prompt for Codex after the repo exists.

```text
You are working in the public repo `Mnehmos/vibe-coders-bible`.

Create the initial Markdown-first scaffold for The Vibe Coder’s Bible.

Goal:
Build a clean public repo for a field manual titled:

The Vibe Coder’s Bible
A Trust-but-Verify Field Manual for Hierarchy-of-Controls AI-Assisted Software Development

Presented by Mnehmos, from The Mnemosyne Research Institute.

Requirements:
1. Create README.md with the project mission, doctrine, book outline, hierarchy-of-controls table, propose/validate/commit loop, and contribution note.
2. Create AGENTS.md explaining how future AI agents should work in this repo.
3. Create PROJECT_CONTEXT.md summarizing the philosophy, target audience, tone, and key terms.
4. Create docs/ chapter stub files using the outline in this context dump.
5. Create templates/ with practical copy-paste templates:
   - ai-project-brief.md
   - agent-handoff.md
   - safety-checklist.md
   - hierarchy-of-controls-checklist.md
   - pr-checklist.md
   - bug-report.md
   - feature-brief.md
   - release-checklist.md
   - security-review.md
6. Create examples/ with:
   - minimal-trust-but-verify-workflow.md
   - hierarchy-of-controls-mapping.md
   - mixed-model-output-routing.md
7. Create .github pull request and issue templates.
8. Keep everything Markdown-first. Do not add a build system.
9. Do not use self-referential language like “this revision,” “this audit,” or “we added.”
10. Do not invent citations.
11. Make the repo useful immediately to both new AI-assisted builders and experienced engineers.

Acceptance criteria:
- All files are valid Markdown.
- README can stand alone as a public landing page.
- AGENTS.md gives future agents enough context to continue.
- Chapter stubs contain a thesis, key points, and at least one practical artifact idea.
- Templates are usable without editing the whole book.
- No generated file contains placeholder spam like “TODO: write content later” without a meaningful scaffold.
```

---

## 10. Suggested Initial Issues

After scaffold, create issues like:

1. Draft Chapter 1 — Vibe Coding Is Real
2. Draft Chapter 2 — Attention to Detail Was Always a Labor Constraint
3. Draft Chapter 6 — Mixed Model Output
4. Draft Chapter 7 — Prompting Is PPE
5. Draft Chapter 15 — Tests Are Reflexes
6. Draft Chapter 26 — LLM-Chess Case Study
7. Draft Chapter 27 — Clio Case Study
8. Draft Chapter 28 — Semantic Video Studio Case Study
9. Build template pack v1
10. Create landing-page version of README

---

## 11. Definition of Done for the Scaffold

The initial scaffold is done when:
- Repo opens with a strong README.
- A future Codex/Claude/Cursor agent can read AGENTS.md and continue without external chat history.
- The chapter outline is complete.
- Templates are useful immediately.
- The doctrine is clear:
  - AI proposes.
  - Systems verify.
  - Commits are controlled.
  - Prompting is PPE.
  - Detail is now affordable.
  - The repo is memory.
  - Tests are reflexes.
  - Schemas are contracts.
  - Git is the time machine.
  - The trace remembers.

---

## 12. One-Page Manifesto Draft

Use this in README or preface.

```markdown
# The Failure Is Letting Hallucination Commit

The model will hallucinate.

The junior developer will misunderstand.
The senior developer will miss something.
The build script will break.
The API will drift.
The documentation will rot.
The dependency will change.
The migration will surprise you.
The test you did not write will be the test you needed.

The goal is not perfect minds.
The goal is controlled commits.

Vibe coding is real because AI lowers the cost of generation.
But generation was never the whole cost of software.

The expensive parts were always detail:
tests, docs, diagrams, schemas, reviews, migrations, rollbacks, threat models, handoffs, and boring cleanup.

AI makes detail affordable.
That is the opportunity.

AI also makes bad work cheap.
That is the danger.

The professional form is not vibes-only.
The professional form is trust, but verify.

Trust AI to propose.
Verify before commit.

Design the repo so the next agent can understand it.
Design the tests so bad changes fail.
Design the schemas so invalid output cannot sneak through.
Design the tools so dangerous actions require gates.
Design the workflow so judgment happens before state changes.

Prompting helps.
Prompting is PPE.

Real safety lives higher:
remove hazards, substitute safer tools, add engineering controls, enforce process, and only then rely on human attention.

The future belongs to builders who can move fast without being easy to fool.
```

---

End of context dump.
