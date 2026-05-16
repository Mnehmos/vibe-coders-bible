# Appendix E - Evaluation Metrics

State-first systems should be evaluated at the commit boundary.

## Core metrics

| Metric | Definition | Where it applies |
| --- | --- | --- |
| Mixed-output escape rate | Invalid or unsupported model output that reaches a public, persistent, or executable sink | Clio, LLM-Chess, RPG-MCP, ProveCalc, SVS |
| Commit rejection precision | Rejected proposals that are truly invalid or unsafe | Validator-backed systems |
| Commit rejection recall | Invalid proposals that validators successfully catch | Validator-backed systems |
| Source binding rate | Public factual claims with explicit source support and uncertainty labels | Research tools, civic media, public analysis |
| State reproducibility | Same state pack or worksheet produces the same output within deterministic bounds | SVS, ProveCalc, IndexFoundry |
| Partial regeneration accuracy | Editing one state plane invalidates only the correct downstream artifacts | SVS, Clio show packages, software build pipelines |
| Oracle disagreement capture | Cases where model explanation conflicts with a stronger oracle | LLM-Chess, ProveCalc, proof systems |
| Human review compression | Human effort moved from generation to review of typed diffs, traces, and rejected proposals | All systems |
| Control-tier coverage | Strongest hierarchy-of-controls layer guarding each public, persistent, or executable sink | Release gates, renderers, databases, tool APIs |

## Rule

Do not measure reliability only by whether the model generated a bad proposal. Measure whether bad proposals crossed a commit boundary.
