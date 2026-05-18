# Chapter 16 - Schemas Are Contracts

Part: IV - The Propose / Validate / Commit Loop

## Thesis

Every boundary where model output crosses into a system is a risk surface. Schemas make that boundary explicit, machine-enforceable, and auditable.

## Key Line

A schema is a boundary the model cannot argue with.

## What A Schema Is

A schema is a structural description of valid data.

It specifies what fields exist, what types they must be, which are required, what values are enumerated, and what shape the output takes. It is not documentation. Documentation describes intent. A schema enforces structure at runtime.

When model output reaches a schema validator, one of two things happens: the output matches the schema and continues, or it does not match and fails immediately with a precise error message. There is no middle state. There is no "close enough."

That binary is the point.

The three dominant schema tools in modern development are Zod (TypeScript), Pydantic (Python), and JSON Schema (language-agnostic). They all accomplish the same thing: they give you a machine-readable contract for data, and they give you a runtime check that fails loudly when the contract is violated.

## Schema-First Design

Define the schema before writing the code. The schema is the spec.

This sounds like ceremony. It is not. If you cannot write the schema, you do not know what you are building. The inability to express a data shape in a schema is diagnostic - it reveals that the shape is not yet defined, only imagined. Imagined shapes produce ambiguous prompts, and ambiguous prompts produce inconsistent output.

Schema-first design forces the problem definition to be precise before generation begins. The schema becomes the first artifact the model can work from. It constrains the output space. The model generating code to populate a `UserProfile` schema with typed, required fields has less room to invent than the model generating a user profile from a description.

The schema is also the first test. If the model produces output that fails the schema, the test ran and caught something. No additional test infrastructure needed for the first check.

## Schema Validation At The Boundary

Validation must happen at the boundary - the moment model output crosses into a system that will act on it.

In TypeScript with Zod, the pattern is direct:

```typescript
const UserSchema = z.object({
 id: z.string().uuid(),
 email: z.string().email(),
 role: z.enum(["admin", "editor", "viewer"]),
 createdAt: z.string().datetime(),
});

type User = z.infer<typeof UserSchema>;

// At the boundary:
const user = UserSchema.parse(modelOutput); // throws ZodError with field path on failure
```

The `.parse()` call is the boundary. It runs at the moment model output becomes system data. If the model invented a field, omitted a required field, or produced the wrong type, the error surfaces there - not two function calls later when the database write fails with an unhelpful message.

The key locations for boundary validation: when tool call arguments arrive from the model, when model output is stored to a database, when model output is returned in an API response, and when model output is passed to another service.

Every one of those locations is a place where the model's plausible-but-wrong output can become persistent state. Schema validation at the boundary prevents plausible-but-wrong from becoming permanent.

## Contract Drift And How To Catch It

Schema contracts break when one side changes without coordinating with the other.

A tool returns `{ title, body }`. A consumer expects `{ title, content }`. Both are valid on their own. Together they break - silently, if no schema enforcement exists at the junction. The consumer gets `undefined` for `content`. The consumer probably does not blow up immediately. It just starts producing wrong behavior that is hard to trace back to the schema mismatch.

This is contract drift. It is common in systems where multiple models interact, multiple services communicate, or a tool interface evolves without bumping a version.

Trace MCP in the Mnehmos ecosystem addresses this directly. It tracks the surface contracts between services - the schemas that cross service boundaries - and can diff them across versions. When a schema changes, Trace MCP surfaces which callers depend on the previous shape. The drift is visible before it becomes breakage.

Without a tool like Trace MCP, the minimum protection is schema versioning. Version your schemas. When a breaking change is required, bump the version and give callers a migration path. Never silently change the shape of output that other components depend on.

## Schemas As Injection Defense

Structured schema output is harder to attack through than raw strings.

When a tool returns a raw string, an adversary who controls input to the model can attempt to embed instructions in that string - instructions that a downstream consumer might interpret as commands rather than data. This is prompt injection via tool output.

When a tool returns `{ title: string, body: string }`, the schema narrows the attack surface. The adversary can still embed text in the `body` field. But they cannot inject extra fields that might be interpreted as commands. They cannot change the type of `title` from a string to an object containing a system instruction. The schema validates the structure, and the validator rejects anything that does not match.

Schema validation is not a complete injection defense. It is one layer. But it is a layer that costs almost nothing to add and meaningfully constrains what adversarial content can do at the boundary.

The RPG-MCP architecture demonstrates this. Every tool call is validated against a Zod schema before the engine processes it. The model cannot pass arguments that the schema does not permit. An adversarially crafted prompt that attempts to add an unauthorized field to a tool call - say, `_system_override: true` - fails the schema check and is rejected before the engine sees it.

## The Model's Role In Schema Design

Use the model to draft schemas. Do not accept those drafts without review.

The model is fast at generating Zod or Pydantic schemas from descriptions. Given a description of a data shape, it will produce a reasonable first draft. That draft is a proposal, not a contract. Review it against what the system actually needs. Check that required fields are actually required. Check that enumerated values cover the real cases. Check that the types reflect the real data.

The model cannot know what your production traffic looks like. It cannot know which field is sometimes null in practice, even though the description said it was always present. It cannot know that the `role` field has a fourth value, `"guest"`, that the description did not mention.

Schema review is human work. The model drafts. The person who understands the data verifies.

After the schema is verified, the model can use it as a constraint. Provide the schema in the prompt or context. Ask the model to produce output that validates against it. This is a tighter instruction than "produce a user object" - it gives the model a target shape and gives you a check to run against the output.

## The Mnehmos Example: RPG-MCP

RPG-MCP began with 195 tools. Adding Zod schemas to all tool inputs and outputs did more than validate data.

It made every tool interface inspectable. The schema for a combat action tool specifies exactly what fields the model must provide - `targetId`, `actionType`, `roll` - and exactly what the engine returns - `damage`, `newHitPoints`, `conditions`. A model that invents a `targetName` field gets an immediate validation error, not a confusing engine failure three steps later.

It prevented parameter invention. Before schemas, the model occasionally supplied fields that sounded plausible but did not exist in the engine's interface. The engine silently ignored them. The model received no feedback that it had drifted from the contract. With schemas, that drift surfaces immediately and precisely.

It documented the contract. The Zod schema is the documentation. It is always current because it is the same artifact that enforces the contract. Documentation that lives separately from the code drifts. The schema cannot drift from itself.

The 85% reduction in tool count, from 195 to 32, was also enabled by schemas. Broader, action-based tools replace many narrow point-tools. Schemas specify which action is being requested and what arguments it requires. The model selects from a constrained, validated set of actions rather than an open-ended list of functions.

## Practical Artifact - Schema Contract Checklist

Use this checklist for every boundary where model output enters a system.

| Question | What it protects |
| --- | --- |
| Is there a schema for this output? | Prevents unstructured data from becoming state |
| Is the schema validated at the boundary, not downstream? | Prevents late-detection failures |
| Are all required fields explicitly marked required? | Prevents silent undefined behavior |
| Are enumerated values exhaustive and current? | Prevents invalid state from entering the system |
| Is the schema versioned? | Prevents silent contract drift |
| Do callers know which schema version they depend on? | Prevents cross-service breakage on schema change |
| Is the schema the source of truth for the TypeScript type? | Prevents type and validation from diverging |
| Has a human reviewed the schema against real data? | Prevents model-drafted schemas from encoding wrong assumptions |
| Would a schema violation surface a clear, actionable error? | Prevents silent failures |
| Is the schema checked in as a versioned artifact? | Prevents schema loss when personnel changes |

---

## Export

Copy this block into your CLAUDE.md, agent instructions, or project checklist.

**Key line**
> A schema is a boundary the model cannot argue with.

**Agent YAML**
```yaml
vcb_chapter: 16
title: "Schemas Are Contracts"
key_line: "A schema is a boundary the model cannot argue with."
thesis: "Every boundary where model output crosses into a system is a risk surface. Schemas make that boundary explicit, machine-enforceable, and auditable."
checklist:
 - item: "Define the schema before writing the code"
 protects: "Prevents ambiguous prompts and inconsistent output"
 - item: "Validate at the boundary, not downstream"
 protects: "Prevents plausible-but-wrong output from becoming persistent state"
 - item: "Version your schemas"
 protects: "Prevents silent contract drift between services"
 - item: "Review model-drafted schemas against real data"
 protects: "Prevents wrong assumptions from becoming enforced contracts"
 - item: "Use structured schema output at tool boundaries"
 protects: "Narrows the surface area for prompt injection"
```

**Portable checklist**
- [ ] Is there a schema for every boundary where model output enters the system? - *Prevents unstructured data from becoming state*
- [ ] Is schema validation running at the boundary, not three function calls later? - *Prevents late-detection failures*
- [ ] Are required fields marked required and enumerated values exhaustive? - *Prevents invalid state*
- [ ] Is the schema versioned and do callers know which version they depend on? - *Prevents contract drift*
- [ ] Has a human reviewed the model-drafted schema against real production data? - *Prevents wrong assumptions becoming enforced contracts*
