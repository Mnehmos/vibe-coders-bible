# Chapter 25 - RPG-MCP: The Model Narrates, The Engine Rules

Part: VI - Case Studies From The Mnehmos Ecosystem

## Thesis

A tabletop RPG engine is an unusual place to learn software architecture. It is also a surprisingly clear one. The rules of the game create an unambiguous separation between what the model is allowed to decide and what the engine owns.

## Key Line

The model narrates the world. The engine decides what is true.

## Why Games Clarify The Design Problem

In a game, the rules are the product.

If the game's rules engine enforces that a character has twelve hit points and a sword swing does two-to-eight points of damage, those constraints have to be real. A model that narrates "the hero shrugs off the blow" when the hit points said zero is not being creative. It is breaking the game.

Games make the control design problem visible because the consequences of letting the model own state are immediate and obvious. A model that invents inventory items the player did not earn is cheating. A model that fudges dice rolls toward the heroic outcome is corrupting the game. A model that narrates a different world than the one the state describes is writing fiction, not running a game.

These are the same problems AI-assisted software development faces. The consequences are just less visible when the domain is code instead of dragons.

## The RPG-MCP Architecture

RPG-MCP is a reference implementation of the embodied agentic AI pattern built on Model Context Protocol.

The scale matters: 195 tools consolidated to 32 action-based tools. That 85% reduction in tool surface area is not an aesthetic choice. It is a token economy decision. Fewer, broader tools mean less overhead per action and more context available for the game itself.

The 32 tools organize into four categories:

- **Combat tools**: resolve attacks, apply damage, check conditions, advance initiative
- **Inventory and spell tools**: manage items, track spell slots, enforce resource limits
- **World tools**: persist locations, NPCs, quests, and world state
- **Meta-tools**: tool discovery and event subscriptions

Backing the tools: 1,889 passing tests validating D&D 5e rules. The tests are not commentary. They are the enforcement layer. If the engine accepts an action that should be illegal, a test should catch it.

## The State Substrate

The engine uses three layers:

**Zod schemas** (`src/schema`): Every tool call is validated against a typed schema before the engine processes it. The model cannot pass malformed input. The schema is the contract between the model's proposal and the engine's acceptance.

**Rules engine** (`src/engine`): The deterministic core. It decides whether an action is legal, what its effects are, and what state transitions follow. It does not ask the model. It applies the rules.

**SQLite persistence** (`src/storage`): State that outlives the context window. Character sheets, inventory, spell slots, quest progress, NPC relationships — these exist in a database, not in the conversation. When the model loses its context, the game does not lose its state.

## What The Model Can Do

The model handles everything that benefits from language.

- Narrating combat outcomes from the engine's resolved results.
- Writing NPC dialogue that reflects the character's faction, history, and disposition.
- Describing environments, atmosphere, and scene transitions.
- Suggesting player options in natural language.
- Interpreting ambiguous player intent and routing it to the correct tool.

The model is a rendering layer and an interpretation layer. It makes the deterministic game state legible and interesting.

## What The Model Cannot Do

The model cannot change state directly.

It cannot add an item to the player's inventory by describing it. It must call the inventory tool, which validates the call against the schema, which routes it through the engine, which applies the business rules, which writes to SQLite.

It cannot roll dice. It calls the dice tool. The engine owns the randomness.

It cannot heal a character by narrating recovery. It calls the HP tool. The engine applies the change.

It cannot break the rules by describing a different outcome. If the attack missed, the model narrates a miss. It does not have access to a different state.

The model's narration is generated from the state the engine returned. It does not produce a state and then describe it. It receives a state and then describes it.

## The Trust Boundary In Practice

A common failure mode in early AI game systems was letting the model hold state in its context window.

"You have a health potion" in the conversation is not the same as `health_potion: 1` in the inventory table.

When the conversation window fills and old messages are truncated, the potion disappears. When a new session starts, the potion is gone. When a second agent or client connects, the potion does not exist.

State in the conversation is ephemeral. State in the database is durable.

This is not a game-specific insight. Every AI-assisted application that lets the model "remember" things in conversation context instead of persisting them to a real store is making the same mistake. The game case just makes the failure obvious.

## The Narration-From-State Pattern

The most important design decision in RPG-MCP is the direction of generation.

The model does not produce a narrative and then reconcile it with state.

The engine produces state. The model generates narrative from that state.

The sequence is:
1. Player action arrives in natural language.
2. Model interprets intent and calls the appropriate tool.
3. Engine validates, executes, and returns the new state.
4. Model narrates the outcome using the returned state as ground truth.

If the attack roll was a fifteen and the enemy's armor class is fourteen, the engine resolves a hit. The model narrates a hit. If the roll was a twelve, the engine resolves a miss. The model narrates a miss.

The model never decides whether the hit landed. The engine does. The model describes what the engine decided.

## Control Mapping

| Risk | Control |
| --- | --- |
| Model invents inventory items | SQLite persistence; items only exist if the engine created them |
| Model fudges dice rolls | Engine owns all randomness; model calls a tool |
| Model breaks rules | Rule validator rejects illegal tool calls |
| Narration contradicts state | Narration is generated from engine-returned state |
| State lost on session end | SQLite survives context window limits |
| Model hallucinates NPC facts | NPC state is persisted; model reads from store |

## What This Teaches

Games are a laboratory for AI control design because the rules are explicit and the violations are visible.

The doctrine that emerges from RPG-MCP is not game-specific:

- **External state** beats context-window memory every time.
- **Schemas validate** what the model proposes before the engine acts.
- **The engine owns** the decision. The model owns the description.
- **Tests specify** the rules. The model cannot break a rule that a passing test enforces.
- **Narration follows state**; it does not precede it.

Software systems with real consequences need the same separations. The health points are different. The principle is the same.

## Practical Artifact — State Substrate Checklist

| Question | What it protects |
| --- | --- |
| Is state persisted in a real store, or held in conversation context? | Prevents state loss on session end or context truncation |
| Does the model call a tool to change state, or describe a change directly? | Prevents narration-as-mutation |
| Does the engine validate the tool call before executing it? | Prevents illegal state transitions |
| Are schemas defined for every tool call the model can make? | Prevents malformed input from reaching the engine |
| Does narration come from engine-returned state, not model invention? | Prevents state contradiction |
| Are the rules tested independently of model behavior? | Prevents rule drift as the model changes |
| Can the state be recovered without the conversation history? | Prevents chat-log dependency |

The state substrate checklist applies to any system where an AI agent takes actions with real consequences. The domain changes. The questions do not.
