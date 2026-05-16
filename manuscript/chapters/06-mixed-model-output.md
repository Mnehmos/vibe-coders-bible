# Chapter 6 - Mixed Model Output

Part: II - Trust, But Verify

## Thesis

An LLM response is not one thing. It is a mixed stream containing prose, commands, code, claims, plans, tool calls, guesses, citations, and sometimes poison. Serious systems separate those outputs into different trust lanes.

## Key line

Mixed output must be routed. Treating the whole answer as equally trustworthy is the original sin of vibe coding.

## Chapter job

Teach the reader to split a model response into output types and route each type through an appropriate control.

## Main beats

- Prose versus code.
- Proposed patch versus explanation.
- Command versus commentary.
- Source claim versus speculation.
- Testable assertion versus rhetorical filler.
- User-visible text versus machine-actionable instruction.
- Tool call versus request for permission.

## Trust-lane table

| Output type | Trust level | Destination |
| --- | --- | --- |
| Explanation | Low/medium | Human review |
| Code diff | Medium | Tests, lint, typecheck |
| Shell command | Dangerous | Sandbox or approval |
| Database migration | Dangerous | Dry run, backup, review |
| Citation or source claim | Dangerous | Source validation |
| UI copy | Medium | Human and product review |
| Structured JSON | Medium/high | Schema validation |
| Tool call | Dangerous | Capability boundary |
| Public analysis | Dangerous | Citation and provenance review |
| Rejected material | Untrusted | Private trace or error report |

## Escape rate

The central reliability metric for mixed output is mixed-output escape rate: how often invalid or unsupported model output reaches a public, persistent, or executable sink.

The desired value is not zero bad generation. The desired value is zero bad commits.

## Case hooks

- LLM-Chess: move proposals, reasoning, commentary, board annotations, benchmark metrics.
- Clio: narration, Stagehand commands, source cards, public show events.
- Semantic Video Studio: prompt, production brief, state pack, render output.

## Draft notes

This is a distinctive chapter. It should become one of the book's signature concepts.
