# State-First Architecture Roles

State-first AI systems relocate authority outside the model.

## Role map

| Role | Function | Example |
| --- | --- | --- |
| Generator | Proposes candidates | Code diff, chess move, narration, equation, render patch |
| State substrate | Remembers durable truth | Repo, board state, worksheet graph, scene graph, source registry |
| Validator | Tests proposed transitions | Tests, schemas, unit gates, legality checks, source binding |
| Reducer | Commits accepted transitions deterministically | Game reducer, database migration runner, state patch applier |
| Renderer/exporter | Displays committed state | UI, MP4, captions, source cards, PDF, PGN, CSV |
| Trace | Preserves accepted and rejected paths | Event log, audit trail, benchmark record, handoff |

## Minimal loop

```text
LLM proposes
State remembers
Validator constrains
Reducer commits
Renderer performs
Trace preserves
```

## Design question

For any AI-assisted workflow, ask:

- What is the state substrate?
- What output is only a proposal?
- What validator guards the transition?
- What reducer owns the commit?
- What renderer displays committed state?
- What trace lets the failure be replayed?
