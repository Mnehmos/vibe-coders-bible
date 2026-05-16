# The Vibe Coder's Bible

**A Trust-but-Verify Field Manual for Hierarchy-of-Controls AI-Assisted Software Development**

Presented by **Mnehmos**, from **The Mnemosyne Research Institute**.

Vibe coding lowers the cost of generation. It does not lower the cost of responsibility.

This guide teaches a practical discipline for AI-assisted development: let models propose aggressively, then use tests, schemas, sandboxes, permissions, code review, CI, Git, and provenance to decide what becomes real.

> Attention to detail was always a labor constraint.
> AI does not make detail unnecessary.
> AI makes detail affordable.

> Trust AI to propose. Verify before commit.

## Book Thesis

Software engineering has always rewarded attention to detail, but detail is expensive. Good tests, clear documentation, structured handoffs, defensive design, code review, diagrams, reproducible builds, typed contracts, migration plans, threat models, and audit trails all take labor.

Traditional teams skip these things not because they are worthless, but because they are costly.

AI changes that equation.

AI makes it cheap to generate tests, docs, schemas, diagrams, checklists, scaffolds, issue maps, migration plans, and alternative implementations. But cheap generation creates a new danger: the system can now produce more code than the human can safely inspect.

The answer is not to abandon AI. The answer is to move from vibes-only generation to trust-but-verify architecture.

> Trust AI to propose.
> Verify before commit.
> Design systems where hallucination can exist, but cannot silently become truth.

## Core Doctrine

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

## Who This Is For

- New builders who can now create software before they fully understand software engineering.
- Experienced developers who need a rigorous vocabulary for supervising AI-assisted work.
- Team leads and founders who need agentic development without AI slop.

## What Makes This Different

This is not a prompt guide. Prompts matter, but prompts are not the safety system.

The book treats AI-assisted development as a control-design problem. The question is not just "how do I get the model to produce code?" The question is "what is allowed to become real?"

## Hierarchy Of Controls

| Control | AI-assisted development equivalent |
| --- | --- |
| Elimination | Remove access to secrets, production databases, destructive commands, and broad filesystem writes |
| Substitution | Replace raw access with typed tools, task runners, safe APIs, and dry-run commands |
| Engineering controls | Tests, schemas, type systems, CI, sandboxes, branch protection, permissions |
| Administrative controls | PR templates, checklists, review policy, issue discipline, release process |
| PPE | Prompt instructions, "be careful," manual vigilance, style preferences |

## Propose / Validate / Commit

```text
Intent
  -> Proposal
  -> Structured artifact
  -> Validation
  -> Commit
  -> Trace
```

Generation-level hallucination is when the model emits something false. Commit-level hallucination is when the system accepts that false output as state.

The architecture attacks commit-level hallucination.

## Manuscript

The canonical book source lives in [manuscript/](manuscript/).

- [Front matter](manuscript/front-matter/)
- [Chapters](manuscript/chapters/)
- [Conclusion](manuscript/back-matter/conclusion-from-vibes-to-discipline.md)
- [Appendices](manuscript/appendices/)
- [Publishing manifest](manuscript/MANIFEST.md)

## Release Formats

This repo is scaffolded for:

- PDF
- DOCX
- EPUB or other ebook package
- Audiobook narrated with OpenAI text-to-speech

See [publishing/README.md](publishing/README.md) and [publishing/audio/openai-tts-narration.md](publishing/audio/openai-tts-narration.md).

## Reusable Material

- [Templates](templates/)
- [Examples](examples/)
- [Starter issues](docs/starter-issues.md)
- [References](references/)

## Case Studies

The book uses Mnehmos ecosystem case studies to show the doctrine in practice:

- ProveCalc: the LLM never computes.
- RPG-MCP: the model narrates, the engine rules.
- LLM-Chess: mixed model output becomes typed artifacts.
- Clio: civic intelligence is rendered from validated state.
- Semantic Video Studio: state first, pixels second.
- ChatDB, Trace MCP, IndexFoundry, Synch MCP, and the multi-agent framework: reliability compounds in infrastructure.

## Contributing

Issues and PRs are welcome, especially concrete case studies of failures that escaped review and the controls that would have caught them.

Start with [CONTRIBUTING.md](CONTRIBUTING.md) and use the templates in `.github/ISSUE_TEMPLATE/`.

## License

Text, documentation, and templates are licensed under [CC BY 4.0](LICENSE). Future code examples or tooling may carry separate MIT license notices when appropriate.
