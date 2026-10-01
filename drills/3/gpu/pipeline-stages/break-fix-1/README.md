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

# Pipeline stages: find the faulty result

> **The job:** A capture reports fewer fragment runs than the overdraw visible in a layered scene.

## Task

A capture reports fewer fragment runs than the overdraw visible in a layered scene. Count fragment candidates separately from pixels surviving depth.

Fix `frameWork` in `drill.ts`. The scene shows the current result alongside a reference; they should agree after the repair.

<div data-scene="demo"></div>

## Measure

Record the scene’s frame interval and draw calls. Say whether this correctness repair should change either number. For GPU execution time, use a GPU trace rather than the CPU render-call duration.

## Your code

Fix `drill.ts`, write one sentence in `cause.md`, and replace the placeholder in `check.ts` with a regression assertion.

    npm run drill -- drills/3/gpu/pipeline-stages/break-fix-1

## The check

The acceptance test covers more than the scene pose. Your check must fail on the original bug and pass after the fix, using behavior instead of looking for a particular line of code.

<details><summary>Hint</summary>

Does every rasterized fragment become a written pixel?

</details>

## Where else?

Where else would the same wrong assumption cause an error?

<details><summary>A few answers</summary>

Vertex vs pixel cost; Where discard happens.

</details>
