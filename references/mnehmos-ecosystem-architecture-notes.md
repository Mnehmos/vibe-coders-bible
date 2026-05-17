# Mnehmos Ecosystem Architecture Notes

Source: GitHub CLI research on Mnehmos public repositories. Use these as grounding for Part VI case study chapters. Not canonical manuscript — verify against live repos before finalizing.

---

## ProveCalc — "The LLM Never Computes"

**Repo**: `provecalc-releases`

**Core separation**: LLMs handle interpretation, explanation, and setup. The deterministic computation engine owns all numerical results. No arithmetic result comes from model output — all are rule-checked.

**Architecture**: Desktop engineering calculation app. Model proposes calculation structure; engine validates and executes the math.

**Key design principle**: Hallucination can exist in the proposal lane. It cannot exist in the answer lane.

---

## RPG-MCP — "The Model Narrates, The Engine Rules"

**Repo**: `mnehmos.rpg.mcp`

**Scale**: 195 tools consolidated to 32 action-based tools (85% token overhead reduction). 1,889 passing tests validating D&D 5e rules.

**Tool categories**:
- 28 unified action tools (combat, inventory, quests, NPCs, world management)
- 4 meta-tools for discovery and events

**Key directories**:
- `src/schema` — Zod validation (the contract layer)
- `src/engine` — rules enforcement (what the model cannot override)
- `src/storage` — SQLite persistence (state that outlives the context window)

**Core pattern**: LLMs propose via tool calls. The engine validates, executes, and returns deterministic outcomes. The model narrates from returned state — it does not invent state.

**What the model cannot do**: change HP without the engine, roll dice, modify inventory outside the tool, or break rules by describing a different outcome.

---

## LLM-Chess — "Benchmark and Broadcast Machine"

**Repo**: `LLM-Chess`

**Architecture**: Real-time LLM vs LLM chess arena with tournament system.

**Player types**: Stockfish (classical engine), Oracle (perfect lookup), Replay, Human, LLM (via provider factory)

**LLM client factory**: Supports OpenRouter, OpenAI, Ollama, Codex — model identity is abstracted from game logic.

**Key pattern**: Event-driven reducer with immutable game state snapshots. Every move is an event. State is never mutated in place.

**Key directories**:
- `src/engine` — game loop (owns rules, legality)
- `src/llm` — provider clients (isolated, interchangeable)
- `src/benchmark` — data pipeline (Elo, leaderboard, PGN export)

**What it measures**: Model move quality, error rate, time-to-move, consistency across game phases. Produces structured benchmark artifacts, not subjective assessments.

---

## Clio — "Civic Intelligence as Rendered State"

**Repo**: `clio` (develop branch)

**Core thesis**: The database is the intelligence. The renderer is the body.

**Stagehand Protocol**: Inline-command system embedding visual directives in narration text. Example: `[map.highlight entity="strait:hormuz"]`. The model emits narrative with embedded structured commands; the renderer executes the commands.

**ProductionRun Event Model**: Separates private events (agent tokens, tool calls) from public events (validated claims, sources, Stagehand effects). Only public events enter the world model.

**Trust model** (five layers):
1. Gold Master — authoritative reference data
2. Verified Import — reviewed external data
3. Project Overlay — project-specific context
4. User Assumption — session-scoped user input
5. Session Draft — unverified, ephemeral

**Key invariant**: Public users cannot reshape the shared world model. Promotion from lower trust tiers requires explicit review.

**Stack**: MapLibre globe, SQLite-WASM registry, OpenAI chat/TTS, FFmpeg export worker.

---

## Trace MCP — "Schema Tracing and Mismatch Detection"

**Repo**: `mnehmos.trace.mcp`

**Purpose**: Prevents schema mismatches between data producers and consumers before they cause runtime failures.

**How it works**: Extracts schemas from MCP tools, OpenAPI specs, TypeScript, tRPC, REST, GraphQL. Traces consumer code to detect property access patterns. Compares consumer expectations against actual producer responses.

**Coverage**: 1,047 tests across 16 suites — pattern matching, REST, HTTP clients, GraphQL, Python AST, Go, gRPC/Protobuf.

**Why it matters for the book**: Schema contracts are the verification layer between the model's proposed output and what the system accepts. Trace MCP makes implicit contracts explicit and testable.

---

## IndexFoundry — "Deterministic Vector Index Factory"

**Repo**: `mnehmos.index-foundry.mcp`

**Two workflows**:
1. **Run-Based Pipeline**: Raw → Extracted → Normalized → Indexed → Served. Fine-grained control over each stage.
2. **Project-Based Workflow**: Self-contained deployable RAG apps with MCP server, Dockerfile, Railway config.

**Key property**: All operations produce manifests, hashes, and logs. Every step is auditable. Pinned extractors (pdfminer, cheerio) ensure determinism across runs.

**Why it matters**: The indexing process is not magic. It is a pipeline with defined stages, each producing a traceable artifact. The model queries the index; it does not own the index.

---

## Synch MCP — "Global Memory Bank for Agents"

**Repo**: `mnehmos.synch.mcp`

**Purpose**: Persistent context synchronization across AI agent sessions and projects.

**Components**:
- **Active Context**: Per-project working state snapshots
- **Filing Cabinet**: File indexing with summaries for fast retrieval
- **Spatial Map**: "PC as Rooms" folder navigation metaphor
- **Memory Search**: Cross-indexed content discovery
- **Lock Manager**: Prevents concurrent agent writes to shared state
- **Handoff Protocol**: Agent-to-agent context transfer with defined format

**Why it matters**: Demonstrates that agent memory must be externalized, structured, and owned by a system — not kept in the model's context window.

---

## Cross-Cutting Patterns

All six projects share:

- **TypeScript + Zod schemas**: The contract layer is always explicit and machine-checked.
- **SQLite persistence**: State lives in a database, not in conversation history.
- **Comprehensive test suites**: The engine's rules are verified by tests, not by model behavior.
- **Clear separation of roles**: The model proposes, narrates, queries, or explains. A deterministic system owns state, rules, computation, and validation.
- **Audit trails**: Every meaningful state transition is logged and traceable.

These are not coincidental patterns. They are the same doctrine applied to different domains. The book should treat them as evidence, not illustration.
