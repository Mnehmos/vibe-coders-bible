# Chapter 7 - Prompting Is PPE

Part: III - The Hierarchy Of AI Controls

## Thesis

Prompting matters, but prompting is a low-level control. Real safety comes from removing hazards, limiting capabilities, and designing systems that reject invalid operations.

## Key line

A better prompt is not a substitute for a safer system.

## Chapter job

Map industrial hierarchy-of-controls thinking onto AI-assisted development and explain why prompts are the last layer, not the main defense.

## Control map

| Industrial safety control | AI development equivalent |
| --- | --- |
| Elimination | Remove access to secrets, production, and destructive commands |
| Substitution | Replace raw access with typed tools |
| Engineering controls | Tests, schemas, CI, sandboxes, permissions |
| Administrative controls | Policies, checklists, PR rules |
| PPE | Prompt instructions, caution, manual vigilance |

## Main beats

- Why prompt instructions are easy to ignore accidentally.
- Why attention fails under speed.
- Why system design beats repeated warnings.
- How to move a risk up the hierarchy.

## Practical artifact

Add a "prompt-to-control translator" worksheet:

| Prompt warning | Stronger control |
| --- | --- |
| Do not edit secrets | Remove secrets from context |
| Do not invent APIs | Add type and contract checks |
| Ask before deleting | Remove delete capability or require approval |

## Draft notes

This chapter should not dismiss prompting. It should put prompting in the correct place.
