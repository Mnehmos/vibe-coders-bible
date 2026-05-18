# Chapter 24 - ProveCalc: The LLM Never Computes

Part: VI - Case Studies From The Mnehmos Ecosystem

## Thesis

Engineering calculation software is a domain where model arithmetic errors can cause real harm. ProveCalc solves this by enforcing a hard boundary: the model explains and interprets, the deterministic engine computes. The answer always comes from the engine.

## Key Line

The model may explain the math. The math engine owns the answer.

## The Problem With LLM Arithmetic

Models can perform arithmetic. They can also get it wrong.

A model can describe Bernoulli's equation, set up a pipe flow problem, explain the assumptions, and produce a numerical answer. That answer may be correct. It may also be wrong by a factor of ten, with units silently mismatched, and with the error invisible until someone uses the result.

Engineering calculations are not a domain where close enough works. A pipe pressure calculation that is twelve percent wrong is not a useful answer. It is a liability.

The obvious solution is to route numerical computation away from the model entirely.

## The ProveCalc Architecture

ProveCalc is a desktop engineering calculation app that makes the boundary explicit by design.

The model handles:

- Interpreting the user's calculation intent in natural language.
- Explaining which formula applies and why.
- Describing assumptions and naming where they come from.
- Walking the user through what the inputs mean.
- Generating a human-readable explanation of the result.

The engine handles:

- Every numerical operation.
- Unit consistency checks.
- Constraint validation.
- The actual computed result.

The model never runs the math. It describes the math. The engine runs it.

## Two Lanes With A Hard Boundary

The key design decision is that the proposal lane and the computation lane do not share a result.

The model can propose a calculation structure: "this is a pipe flow problem, we need to apply the Darcy-Weisbach equation, and we need values for pipe diameter, flow velocity, and friction factor." That proposal is useful. It frames the problem, identifies the formula, and names the inputs.

But the model's answer to "what is the result?" is not the answer.

The result comes from evaluating the formula deterministically, with validated units, against the confirmed input values.

If the model's explanation and the engine's answer diverge, the engine is right. There is no workflow in which the model's arithmetic overrides the computed result.

Hallucination can exist in the proposal lane.

It cannot exist in the answer lane.

## The Assumption Ledger

Engineering calculations depend on assumptions. Some assumptions are explicit. Many are not.

ProveCalc tracks assumptions explicitly: what values were assumed, what sources they came from, and what range of values would change the output meaningfully.

The model can propose an assumption. The assumption ledger records it. The user sees it. The user confirms or changes it.

This removes a category of silent error: the model assuming a value, the user not noticing, and the calculation proceeding on an unexamined premise.

Every assumption that enters the calculation is a record, not a hidden variable.

## The Audit Trail

Every calculation produces a traceable record: inputs, formula, assumed values, unit conversions applied, and computed result.

This serves two purposes.

First, reproducibility. Another engineer can follow the same path and arrive at the same result without relying on the model conversation.

Second, accountability. If a result is used in a downstream decision and later questioned, the calculation can be reconstructed. The answer does not live in a chat log. It lives in a structured record that names every step.

## Control Mapping

| Risk | Control |
| --- | --- |
| Model arithmetic error | Deterministic solver owns all computation |
| Hidden unit mismatch | Unit library validates consistency before evaluation |
| Unstated assumption | Assumption ledger captures and exposes all premises |
| False explanation | Audit trail separates explanation from computation |
| Incorrect formula selection | User confirms formula before engine evaluates |

## What This Teaches

ProveCalc is the cleanest version of the core doctrine in this book.

Trust AI to propose. Let the model explain, frame, interpret, and describe.

Verify before commit. Let the engine compute, validate, and produce the answer.

The model is useful in the proposal lane. In a domain where the answer matters, the model cannot own the answer.

The architecture makes that principle structural.

The model cannot produce a wrong engineering answer because the model does not produce the engineering answer.

That is not a limitation of the model. It is a design decision about which lane owns what.

## Practical Artifact - Computation Boundary Checklist

Use this checklist when an AI-assisted workflow includes numerical outputs or consequential decisions.

| Question | What it protects |
| --- | --- |
| Does the model produce the final numerical result, or does a deterministic system? | Prevents arithmetic hallucination from entering outputs |
| Are units validated before the computation runs? | Prevents silent unit mismatch errors |
| Are assumptions made explicit and user-confirmed? | Prevents hidden premise errors |
| Is there an audit trail linking inputs to result? | Enables reproducibility and review |
| Can the computation be re-run without the model conversation? | Prevents chat-log dependency |
| If the model's explanation and the engine's result disagree, which one is used? | Forces clarity about which lane owns the answer |

The computation boundary is not just for engineering software. Any workflow where the model produces a number that a person or system will act on deserves a version of this design.
