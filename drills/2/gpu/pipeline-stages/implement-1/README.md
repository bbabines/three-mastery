---
id: 2.gpu.pipeline-stages.implement.1
loop: 2
tier: core
concepts: [gpu.pipeline-stages]
mode: implement
context: gpu.pipeline-stages/transparency-order
lenses: [cost]
misconceptions: []
---

# Pipeline: count vertex and fragment work

> **The job:** Separate vertex shader invocations from fragment candidates.

## Task

For a full-screen effect repeated across passes, return vertex and fragment work counts. Vertex work follows submitted vertices; fragment work follows covered samples. A fragment is a candidate, not necessarily a final pixel.

| Function | Return |
| --- | --- |
| `stageWork(vertices: number, coveredSamples: number, passes: number)` | Counts of vertex invocations and fragment candidates. |

Compare vertex submissions with covered fragment candidates across several passes; neither is a final pixel count.

<div data-scene="practice"></div>

## Measure

Use `performance.now()` around CPU work, or `renderer.info` and Chrome Performance for rendering. Write down the measured value for the scene; frame time changes by device, so it is not a pass bar.

## Your code

Write it in `drills/2/gpu/pipeline-stages/implement-1/drill.ts`. Save, and the scene runs it. To check it as you go:

```
npm run drill -- drills/2/gpu/pipeline-stages/implement-1
```

## The check

The check verifies that the code separates vertices from covered fragments over multiple passes. It also rejects an unanswered function.

<details><summary>Hint</summary>

An overdrawn fragment still ran part of the pipeline even if it never becomes the visible pixel.

</details>

## Where else?

Where can a fragment do work yet never become a visible pixel?
