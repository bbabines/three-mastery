---
id: 3.gpu.frame-budget.break-and-fix.1
loop: 3
tier: core
concepts: [gpu.frame-budget]
mode: break-and-fix
context: gpu.frame-budget/setting-targets
lenses: [cost]
misconceptions: []
---

# Frame budget: judge frame headroom when CPU and GPU work overlap

> **The job:** Judge frame headroom when CPU and GPU work overlap.

## Task

A dashboard marks a frame over budget although its CPU and GPU spans each fit the display budget.

Fix the function in `drill.ts`. The blue headroom bar should meet the yellow expected value.

<div data-scene="demo"></div>

## Measure

Record the scene’s frame interval and draw calls. Say whether this correctness repair should change either number. For GPU execution time, use a GPU trace rather than the CPU render-call duration.

## Your code

Fix `drill.ts`, write one sentence in `cause.md`, and replace the placeholder in `check.ts` with a regression assertion.

    npm run drill -- drills/3/gpu/frame-budget/break-fix-1

## The check

Compare the slower overlapping CPU/GPU span with the refresh budget, including when the limiting side changes. Write a short assertion in `check.ts` with a different input. It must reject the starter and accept the repair.

<details><summary>Hint</summary>

Which of the overlapping CPU and GPU times limits the next frame?

</details>

## Where else?

Why can two individually short CPU and GPU spans still fill the frame?

<details><summary>A few answers</summary>

Comparing devices; Judging a fix.

</details>
