# PROJECT_CONTEXT.md

Durable context for humans and AI agents.

## Mission

Build a serious field manual for AI-assisted software development. The book should speak to new builders, experienced engineers, and team leads who need a practical operating model for agentic development.

This is not a prompt collection. It is a doctrine and workflow manual for controlled AI-assisted software work.

## Core philosophy

Software engineering has always rewarded detail. Tests, documentation, schemas, diagrams, migration plans, threat models, review checklists, reproductions, rollback plans, and issue hygiene are not extras. They are the work that makes systems survivable.

Teams skip these things because they are expensive.

AI changes the labor economics.

> Attention to detail was always a labor constraint.
> AI does not make detail unnecessary.
> AI makes detail affordable.

## Core doctrine

- Trust AI to propose.
- Verify before commit.
- Design systems where hallucination can exist, but cannot silently become truth.
- Prompting is PPE.
- Real safety lives higher in the hierarchy of controls.

## Definition of commit

Commit means any persistent or public state transition:

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

## Target audience

- New builders who can now make software before they fully understand software engineering.
- Experienced developers who need a rigorous vocabulary for supervising AI-assisted work.
- Team leads and founders managing AI-assisted teams and tools.

## Voice

Use:

- Clear, direct paragraphs.
- Strong thesis sentences.
- Concrete examples.
- Tables where they clarify.
- Copy-paste templates.
- Short manifestos at chapter openings.
- Practical checklists.

Avoid:

- Corporate SaaS tone.
- Fake citations.
- Overpromising safety.
- Generic AI filler.
- Self-reference to revisions or process.
- Sneering at vibe coders.

## Canonical files

- `README.md`: public landing page.
- `AGENTS.md`: instructions for future agents.
- `manuscript/MANIFEST.md`: canonical book order.
- `manuscript/chapters/`: chapter scaffolds.
- `templates/`: reusable field manual artifacts.
- `examples/`: concrete workflow examples.
- `publishing/`: release plan for PDF, DOCX, ebook, and audiobook.
- `references/`: raw source references used to shape the book; not canonical manuscript source.
