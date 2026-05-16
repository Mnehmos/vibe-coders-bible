# Chapter 25 - RPG-MCP: The Model Narrates, The Engine Rules

Part: VI - Case Studies From The Mnehmos Ecosystem

## Lesson

Creativity improves when the world state is external.

## Key line

The model narrates the world. The engine decides what is true.

## Chapter job

Show how games clarify AI control design. The model can improvise atmosphere, dialogue, and presentation, while the rules engine owns state transitions.

## Patterns

- Dice owned by engine.
- HP, inventory, and spells persisted.
- Rules as commit boundary.
- Narration as rendering layer.
- Action routing through typed commands.
- State trace for handoff.

## Control mapping

| Risk | Control |
| --- | --- |
| Model invents inventory | Persisted state |
| Model fudges dice | Engine-owned randomness |
| Model breaks rules | Rule validator |
| Story contradicts state | Narration generated from state |

## Draft notes

Use this case to make "state substrate" accessible and memorable.
