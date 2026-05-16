# Chapter 24 - ProveCalc: The LLM Never Computes

Part: VI - Case Studies From The Mnehmos Ecosystem

## Lesson

The model proposes calculations; deterministic math verifies.

## Key line

The model may explain the math, but the math engine owns the answer.

## Chapter job

Use ProveCalc as the cleanest example of proposal versus validation. The LLM is useful for interpretation, setup, and explanation, but computation crosses a deterministic boundary.

## Patterns

- SymPy and Pint as validators.
- Unit consistency.
- Assumption ledger.
- Audit trail.
- Accept, edit, reject workflow.
- Separation of explanation from calculation.

## Control mapping

| Risk | Control |
| --- | --- |
| Model arithmetic error | Deterministic solver |
| Hidden unit mismatch | Unit library validation |
| Unstated assumption | Assumption ledger |
| False explanation | Audit trail and reproducible calculation |

## Draft notes

This chapter should make the core philosophy obvious: hallucination can exist in the proposal lane, but not in the answer lane.
