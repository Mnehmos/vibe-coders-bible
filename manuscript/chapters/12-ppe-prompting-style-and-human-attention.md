# Chapter 12 - PPE: Prompting Style And Human Attention

Part: III - The Hierarchy Of AI Controls

## Thesis

Prompting is the last line of defense, not the first. Better prompting reduces noise and tightens scope. It does not change what must be verified, and it cannot prevent a capable model from producing plausible wrong output.

## Key Line

Prompt discipline improves behavior. It does not enforce behavior.

## PPE In The Hierarchy

Chapter 7 established the position. This chapter makes it actionable.

PPE - Personal Protective Equipment - is the lowest level of the control hierarchy because it is the one that depends entirely on the person. The hard hat works only if the worker puts it on, keeps it on, and is actually under the thing that falls. Prompt instructions work only if they are followed, interpreted correctly, and remain salient across the full length of the session.

Under normal conditions, PPE is effective. Under the conditions that matter - speed, pressure, long sessions, multi-step chains - PPE degrades fastest.

This is not an argument against PPE. Hard hats save lives. Good prompts save time and reduce rework. The argument is against mistaking PPE for structural safety.

The structure of this chapter: what prompting actually reduces, which prompt patterns constrain output in meaningful ways, which patterns are noise, and how to manage the human attention that must carry all of it.

## What Prompting Actually Reduces

Prompting reduces two things: ambiguity and surface area.

Ambiguity: a vague prompt produces a broad response. A model given "improve the API" generates improvements based on its own judgment about what improvement means in this context. Some will be correct. Some will be scope-expanding changes the developer did not want. A prompt that specifies "improve the error handling in the `/payments` endpoint only, and do not change the response schema" narrows the space of possible outputs.

Surface area: a prompt that defines scope limits how much code the model touches. Fewer files changed means fewer things to verify. Fewer things to verify means review is faster and more likely to be thorough.

Neither of these substitutes for verification. A well-scoped prompt producing narrow, specific output still produces output that must be tested. The test may pass or fail independent of how good the prompt was. Prompting changes the quantity and shape of what is generated. It does not change the requirement that what is generated must be verified before it commits.

The practical implication: prompt quality is a force multiplier on verification effort, not a replacement for it. A well-crafted prompt produces less to verify. A poorly-crafted prompt produces more. Both produce output that must be verified.

## Prompt Patterns That Constrain Output

These patterns measurably reduce the failure rate of AI-generated output. They work because they constrain what the model can produce, not because they instruct the model to be more careful.

**Specify the output format precisely.**

A model cannot fake a Zod schema it cannot parse. If the output format is a specific TypeScript type, a specific JSON shape, or a specific file structure, and the verification step checks that shape, then format errors surface immediately rather than in production.

The pattern:

```
Return a JSON object matching this exact shape:
{ "endpoint": string, "method": "GET"|"POST"|"PUT"|"DELETE", "params": string[] }

Do not add fields that are not in this shape.
```

The model now has a structural target. Deviations from the target are detectable.

**State what the output should not do.**

Negative constraints are more effective than positive instructions for eliminating specific failure modes. "Do not add error handling for cases that cannot happen in this context" prevents the model from generating defensive code that handles impossible states - code that looks prudent but obscures the real logic and increases test surface area unnecessarily.

The pattern:

```
Do not add logging statements.
Do not extract helper functions unless a function body exceeds 20 lines.
Do not modify any file other than src/payments/handler.ts.
```

These are not instructions about quality. They are scope limits. The model cannot produce the excluded outputs without violating an explicit boundary.

**Ask for failure modes before the implementation.**

Models that are asked to describe what could go wrong before writing code produce better code. The analysis step surfaces edge cases that the implementation step would have handled silently or missed entirely.

The pattern:

```
Before writing any code: list the three most likely ways this implementation
could fail in production. Then write the implementation.
```

The failure mode analysis is also a verifiable artifact. After the implementation is generated, the reviewer can check whether the implementation actually addresses the failure modes the model identified.

**Declare scope explicitly at the prompt boundary.**

Scope declarations belong in the first sentence of a prompt, not buried in qualifications at the end.

The pattern:

```
Scope: only the updateUserProfile function in src/users/profile.ts.
Task: add input validation for the `email` field using the existing validator utility.
Constraints: do not change the function signature. Do not modify the caller.
```

Scope first. Task second. Constraints third. This order gives the model the boundary before it begins generating, not after it has already started a different approach.

## Prompt Patterns That Do Not Help

Several common prompt patterns feel like safety but produce no meaningful reduction in failure rate.

**Longer system prompts warning the model to "be careful."**

A system prompt that says "Always double-check your work before responding" does not add a verification step. It adds a token that the model attends to in the same way it attends to all tokens - as context that shapes the distribution of outputs. The model does not have a literal double-checking step it executes after generation. The instruction is aspirational noise.

**Asking the model to "review" its own output.**

"Review your answer and correct any errors" is a common instruct-model pattern. It sometimes catches obvious mistakes. It cannot catch the category of errors that matter most: plausible hallucinations, subtly wrong logic, and test coverage gaps. The model reviewing its own output has the same information it had when generating it. The errors that survive generation also survive self-review.

**Flattery and motivational framing.**

"You are an expert senior developer" does not change what the model knows. It changes the register and confidence of the output. A model told it is an expert produces output that sounds more authoritative. It does not produce output that is more correct. Confident wrong answers are harder to catch than uncertain ones.

**Repeating prohibitions that structural controls already enforce.**

If the file tool is scoped to `src/`, the instruction "do not modify configuration files" is redundant. It adds tokens to the context and adds nothing to safety. The structural control is already enforcing it. When a prohibition exists only as a prompt instruction and not as a structural control, the instruction is a signal that a stronger control is missing.

## The Attention Budget

Human attention is the resource that administrative controls, engineering controls, and PPE all compete for.

A developer reviewing AI-generated output has a finite capacity for careful observation in a session. That capacity is not fixed - it depletes. The first pull request gets thorough review. The seventh, after four hours, gets less. This is not a personal failure. It is how attention works under load.

AI development has a specific attention problem: it multiplies output faster than it multiplies attention. An agent session produces more changed lines per hour than a developer writing manually. The review burden grows. The attention budget does not.

Three practical disciplines manage the attention budget.

**Timebox sessions.** A session longer than ninety minutes produces diminishing review quality in the last third. The output grows; the attention available to check it shrinks. Shorter sessions with a handoff file are more verifiable than longer sessions with larger diffs.

**Review before context grows.** The cheapest moment to review a change is immediately after it is generated, when the decision that produced it is still in working memory. Deferring review to the end of the session means reviewing a large diff without the context of why each piece was generated.

**Limit the review surface per session.** A session that touches one module produces a focused diff. A session that touches eight modules produces a diff that is impossible to review thoroughly. Scope limits - enforced by branch conventions and issue-linked sessions - are attention management tools as much as they are architectural tools.

The attention budget argument produces a counterintuitive conclusion: slower, more focused sessions with frequent review points are more productive than fast, broad sessions with end-of-session review. Speed during generation is not the constraint. Speed during review is.

## PPE Failure Modes

PPE fails in predictable ways. Knowing them makes it easier to know when to stop relying on it.

**Context erosion.** An instruction in the system prompt loses salience as the session grows. By message forty in a long session, the original instruction is competing with forty messages of context that may have reframed the task. The instruction is still present. It is no longer the primary shaping signal.

**Scope drift.** A prompt that defines narrow scope does not prevent the model from expanding scope when the task logic seems to require it. "Only modify the login function" does not prevent the model from modifying the authentication helper when it identifies a dependency that appears to need updating. The model's judgment about what scope means can diverge from the developer's.

**Verification fatigue.** PPE depends on human review. Human review degrades. A prompt pattern that reduces surface area by 30% is valuable. It does not solve the fundamental problem that review is a human-attention process with limits.

**Over-reliance on instructions to prevent structural problems.** A team that relies on "do not call the production database" as a prompt instruction instead of removing the production credential is relying on PPE to handle an elimination problem. When that prompt instruction fails once - and it will - the structural problem manifests without warning.

## Practical Artifact - PPE Calibration Card

Use this before starting a session. It takes two minutes. It surfaces gaps before generation starts, not after.

| Question | What it catches |
| --- | --- |
| Is there an issue linked to this session that defines scope? | Undefined scope that prompt instructions cannot substitute for |
| Does the first prompt declare scope, task, and constraints in that order? | Ambiguity that produces excess output to review |
| Does the output format have a structural specification that validation can check? | Format drift that looks correct but fails downstream |
| Are the prohibitions in this prompt enforced by structural controls, or only by the prompt? | Prompt-only guards that will erode under session pressure |
| Is the session bounded in time and output scope? | Attention budget overrun that degrades review quality |
| Is there a verification step defined before the session starts, not after? | Output that passes review because the review was too vague |
| What is the rollback path if the session output is wrong? | Irreversible outputs that make bad output costly to fix |

After the session:

| Question | What it catches |
| --- | --- |
| Was the diff reviewed before the PR was opened, not after? | Output that crosses the commit boundary unread |
| Did any prohibitions in the prompt get violated? If so, is there a structural control to install? | Prompt-only guards that proved insufficient |
| Was the handoff file written? | Context loss that forces the next session to re-solve settled questions |

---

## Export

Copy this block into your CLAUDE.md, agent instructions, or project checklist.

**Key line**
> Prompt discipline improves behavior. It does not enforce behavior.

**Agent YAML**
```yaml
vcb_chapter: 12
title: "PPE: Prompting Style And Human Attention"
key_line: "Prompt discipline improves behavior. It does not enforce behavior."
thesis: "Prompting is the last line of defense, not the first. Better prompting reduces noise and tightens scope. It does not change what must be verified."
checklist:
 - item: "Output format is specified structurally, not descriptively."
 protects: "Format drift that passes review but fails at the sink"
 - item: "Negative constraints name what the output must not do."
 protects: "Scope expansion and defensive code that obscures logic"
 - item: "Failure modes are requested before implementation."
 protects: "Edge cases that generation handles silently or misses"
 - item: "Scope is declared first in every prompt."
 protects: "Ambiguity that expands the review surface"
 - item: "Sessions are timeboxed and reviewed frequently, not at the end."
 protects: "Attention budget overrun and low-quality end-of-session review"
 - item: "Every prompt prohibition is checked against structural controls."
 protects: "Prompt-only guards that erode under session pressure"
```

**Portable checklist**
- [ ] Is scope declared in the first sentence of the prompt? - *Protects against ambiguous output that expands the review surface*
- [ ] Is the output format structurally specified and verifiable? - *Protects against format drift that looks correct and fails downstream*
- [ ] Were failure modes requested before implementation? - *Protects against edge cases the implementation handles silently*
- [ ] Are session-critical prohibitions enforced by structural controls, not only by prompt? - *Protects against instruction erosion in long sessions*
- [ ] Is the session timeboxed with a review point before context grows large? - *Protects against attention budget overrun*
- [ ] Is there a defined verification step before the session starts? - *Protects against vague review that misses plausible-but-wrong output*
