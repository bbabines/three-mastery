---
id: 2.gpu.pipeline-stages.apply.1
loop: 2
tier: core
concepts: [gpu.pipeline-stages]
mode: apply
context: gpu.pipeline-stages/where-discard
lenses: [cost]
misconceptions: []
---

# Pipeline: account for discarded fragments

> **The job:** Count fragment candidates separately from final writes.

## Task

Given candidate fragments, shader discards, and depth test failures, return the fragment-stage count and framebuffer writes. Rejects must not be counted as final pixels.

| Function | Return |
| --- | --- |
| `fragmentOutcome(candidates: number, discarded: number, depthFailed: number)` | Candidate and surviving fragment counts. |

Discarded and depth-failed candidates should not appear in the framebuffer write count.

<div data-scene="practice"></div>

## Measure

Use `performance.now()` around CPU work, or `renderer.info` and Chrome Performance for rendering. Write down the measured value for the scene; frame time changes by device, so it is not a pass bar.

## Your code

Write it in `drills/2/gpu/pipeline-stages/apply-1/drill.ts`. Save, and the scene runs it. To check it as you go:

```
npm run drill -- drills/2/gpu/pipeline-stages/apply-1
```

## The check

The check verifies that the code does not call every fragment a final pixel. It also rejects an unanswered function.

<details><summary>Hint</summary>

Discard and depth testing can prevent a fragment from reaching the framebuffer.

</details>

## Where else?

Where can a fragment do work yet never become a visible pixel?
