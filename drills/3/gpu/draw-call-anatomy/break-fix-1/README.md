---
id: 3.gpu.draw-call-anatomy.break-and-fix.1
loop: 3
tier: core
concepts: [gpu.draw-call-anatomy]
mode: break-and-fix
context: gpu.draw-call-anatomy/many-small-parts
lenses: [cost]
misconceptions: []
---

# Draw call anatomy: estimate main and shadow draw submissions

> **The job:** Estimate main and shadow draw submissions.

## Task

The estimated draw count is much lower than a capture of grouped, shadow-casting parts.

Fix the function in `drill.ts`. The blue submission bar should reach the yellow outline.

<div data-scene="demo"></div>

## Measure

Record the scene’s frame interval and draw calls. Say whether this correctness repair should change either number. For GPU execution time, use a GPU trace rather than the CPU render-call duration.

## Your code

Fix `drill.ts`, write one sentence in `cause.md`, and replace the placeholder in `check.ts` with a regression assertion.

    npm run drill -- drills/3/gpu/draw-call-anatomy/break-fix-1

## The check

Count visible material groups in the main pass and each shadow pass; hidden groups add nothing. Write a short assertion in `check.ts` with a different input. It must reject the starter and accept the repair.

<details><summary>Hint</summary>

How many material groups and eligible passes submit draws for one visible mesh?

</details>

## Where else?

How would a shadow pass change a scene with many small parts?

<details><summary>A few answers</summary>

Shadow passes doubling calls; Multi-material meshes.

</details>
