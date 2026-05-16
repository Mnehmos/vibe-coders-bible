# Chapter 26 - LLM-Chess: Benchmark And Broadcast Machine

Part: VI - Case Studies From The Mnehmos Ecosystem

## Lesson

Model output can become a game, a benchmark dataset, and public content at once.

## Key line

LLM-Chess turns mixed model output into typed artifacts: moves, reasoning, commentary, benchmarks, and replayable media.

## Chapter job

Use chess to show mixed output routing. A model response can include a legal move, illegal move, reasoning, commentary, benchmark signal, and content layer. Each piece needs a destination.

## Patterns

- Chess legality as validator.
- Stockfish as oracle.
- Event log as provenance.
- Commentary as content layer.
- PGN, CSV, JSON, and ZIP exports.
- Attack channels for adversarial testing.
- Broadcast artifacts from validated state.

## Control mapping

| Output | Validator or destination |
| --- | --- |
| Move | Chess engine legality |
| Move quality | Stockfish or benchmark oracle |
| Reasoning | Human review and dataset metadata |
| Commentary | Content lane |
| Match result | Event log and replay |

## Draft notes

This chapter should reinforce Chapter 6. Mixed output becomes useful when typed.
