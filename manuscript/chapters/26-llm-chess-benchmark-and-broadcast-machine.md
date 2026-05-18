# Chapter 26 - LLM-Chess: Benchmark And Broadcast Machine

Part: VI - Case Studies From The Mnehmos Ecosystem

## Thesis

A chess engine is a perfect validator for model output. Every move is either legal or illegal. Every move can be compared against a perfect oracle. Every match is a structured event log that can become a replay, a broadcast, and a benchmark dataset. LLM-Chess turns mixed model output into typed artifacts, each routed to the appropriate lane.

## Key Line

Mixed output becomes useful when it is typed. Typed output can be routed. Routed output can be validated. Validated output can be published.

## What The Model Produces

When a language model plays chess, it does not produce one thing.

A single model response may contain:

- A proposed move in algebraic notation.
- Reasoning about why the move was chosen.
- Commentary about the position.
- An explanation of the opponent's likely response.
- Occasionally, a move that is not legal.

These are not equally trustworthy. They are not equally useful. They are not destined for the same place.

The proposed move needs a legality check.

The reasoning is metadata for the benchmark dataset.

The commentary is content for the broadcast layer.

The illegal move needs to be caught before it corrupts the game state.

The question is not whether to trust the model. The question is which part of the output goes to which lane.

## The Architecture

LLM-Chess runs real-time LLM versus LLM chess arenas and tournament gauntlets. The system supports five player types: Stockfish (the classical engine), Oracle (perfect move lookup), Replay (game replay from PGN), Human, and LLM (via a provider factory).

The LLM client factory abstracts model identity from game logic. OpenRouter, OpenAI, Ollama, and Codex are interchangeable. The game engine does not care which model is behind the player. It only cares about the move.

This separation is intentional. The game's rules do not change based on which model plays. The model is a move generator. The engine is the referee.

## The Event-Driven Game Loop

The core architecture uses an event-driven reducer pattern with immutable game state snapshots.

Every move is an event. Every event produces a new state snapshot. State is never mutated in place.

This means the full game is a log of events. The log is the game. Any state in the game can be reconstructed by replaying the log from the beginning. The match can be exported as PGN. The event log can become a benchmark dataset. The snapshots can drive the commentary layer.

The game does not end when the match ends. The event log persists and the match becomes a replayable artifact.

## The Validation Layer

The chess engine owns legality.

When the model proposes a move, the game engine checks it. An illegal move is caught before it changes state. The model cannot move a piece to an illegal square by describing it confidently. The rule checker does not read confidence. It reads the move.

Stockfish serves as the oracle for move quality. After each legal move, the system can query Stockfish for the centipawn evaluation. The delta between the model's chosen move and the Stockfish optimal move is a quality signal. These signals accumulate into the benchmark dataset.

This means the model is being measured during play, not just observed. Every game is simultaneously a match and a benchmark run.

## Routing The Mixed Output

| Output type | Destination | Validator |
| --- | --- | --- |
| Proposed move | Game engine | Legality checker |
| Move quality | Benchmark dataset | Stockfish evaluation |
| Move reasoning | Dataset metadata | Human review |
| Commentary | Broadcast content layer | Human review |
| Match result | Event log | Structural |
| Game record | PGN export | PGN format validation |

Each output type has a different trust profile and a different destination. The move goes to the engine. The reasoning goes to the dataset. The commentary goes to the broadcast. The result goes to the log.

Nothing is trusted because the model said it. Everything is trusted because its lane accepted it.

## The Benchmark Signal

LLM-Chess produces structured benchmark artifacts: Elo estimates, move accuracy distributions, error rates by game phase, time-to-move distributions, and consistency across opening, middlegame, and endgame.

These are not subjective assessments. They are measurements against a reference.

The model cannot claim to play well. The match record says whether it played well. The Stockfish delta is the measure. The centipawn loss is the number.

This is the same principle applied throughout this book. The model proposes. The system measures. The measurement becomes the record, not the model's description of its own performance.

## What This Teaches

LLM-Chess reinforces Chapter 6 with a concrete implementation.

The model emits mixed output. The system routes it. Each lane has a validator. Only validated output enters state or becomes published.

But it adds something: the benchmark layer.

Not all AI-assisted systems need a benchmark. But many would benefit from one. When a model drives a workflow, the quality of that driving can be measured. Move accuracy, error rate, consistency, and comparison against a reference are all expressible as structured metrics.

The question "is the model doing well?" should not always be answered by checking how confident the model sounded. It can be answered by comparing the model's output to a reference, measuring the delta, and accumulating the signal over time.

The chess arena makes this measurement automatic because the game produces natural evaluation opportunities. Most software domains have analogues. The test suite is a benchmark. The schema validator is a benchmark. The integration against a known-good reference is a benchmark.

The discipline is the same. Measure against a reference. Log the result. Let the signal accumulate.

## Practical Artifact - Output Routing Table Template

When a model produces mixed output in a workflow, map it before committing.

| Output type | Destination | Validator | Failure mode |
| --- | --- | --- | --- |
| Code | Review pipeline | Tests, type checker, linter | Unreviewed code enters main |
| Command | Dry-run or human approval | Scope check | Destructive command executes unchecked |
| Claim or citation | Fact-check or source link | Source verification | Hallucinated fact enters documentation |
| Structured data | Schema validator | JSON Schema, Zod | Malformed data enters a store |
| Narrative | Human review | Accuracy and tone check | Incorrect prose becomes public content |
| Configuration | Diff review | Staging test | Misconfiguration reaches production |

The routing table is not overhead. It is the answer to "what did this produce and where is it going?"

Fill it out for any workflow where the model produces more than one kind of output.
