---
id: 3.gpu.pipeline-stages.break-and-fix.1
loop: 3
tier: core
concepts: [gpu.pipeline-stages]
mode: break-and-fix
context: gpu.pipeline-stages/transparency-order
lenses: [cost]
misconceptions: [gpu.pipeline-stages/fragment-is-pixel]
---

# Pipeline stages: separate fragment candidates from pixels written

> **The job:** Separate fragment candidates from pixels written.

## Task

A frame capture shows more fragment work than the dashboard reports in a layered scene.

Fix the function in `drill.ts`. The blue vertex, fragment, and write bars should meet the yellow outlines.

<div data-scene="demo"></div>

## Measure

Record the scene’s frame interval and draw calls. Say whether this correctness repair should change either number. For GPU execution time, use a GPU trace rather than the CPU render-call duration.

## Your code

Fix `drill.ts`, write one sentence in `cause.md`, and replace the placeholder in `check.ts` with a regression assertion.

    npm run drill -- drills/3/gpu/pipeline-stages/break-fix-1

## The check

Count all fragment candidates even when depth rejects every final write. Write a short assertion in `check.ts` with a different input. It must reject the starter and accept the repair.

<details><summary>Hint</summary>

Does every rasterized fragment become a written pixel?

</details>

## Where else?

Where can a fragment do work yet never become a visible pixel?

<details><summary>A few answers</summary>

Vertex vs pixel cost; Where discard happens.

</details>
