# Chapter 32 - Context Poisoning And Prompt Injection

Part: VII - Failure Modes

## Thesis

Context is part of the attack surface. Anything the model reads can try to steer what it does.

## Key line

Untrusted context must not become trusted instruction.

## Chapter job

Explain prompt injection and context poisoning in a way that applies to coding agents, docs, dependencies, comments, and tool output.

## Main beats

- Malicious docs.
- Tool output injection.
- Dependency README attacks.
- Source comments as prompt payload.
- Memory poisoning.
- Quarantine and provenance.
- Separating data from instruction.
- Capability boundaries.

## Practical artifact

Add a "context provenance checklist":

- Where did this context come from?
- Is it trusted instruction or untrusted data?
- Can it request tool use?
- Can it affect memory?
- Can it reach secrets or production?

## Draft notes

Tie this back to mixed model output and tool boundaries. The model should read hostile text without obeying it.
