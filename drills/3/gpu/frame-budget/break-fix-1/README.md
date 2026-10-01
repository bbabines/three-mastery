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

# Frame budget: find the faulty result

> **The job:** A frame is marked over budget when CPU submission and GPU execution each fit separately.

## Task

A frame is marked over budget when CPU submission and GPU execution each fit separately. They overlap, so compare the slower side with the display budget.

Fix `headroomMs` in `drill.ts`. The scene shows the current result alongside a reference; they should agree after the repair.

<div data-scene="demo"></div>

## Measure

Record the scene’s frame interval and draw calls. Say whether this correctness repair should change either number. For GPU execution time, use a GPU trace rather than the CPU render-call duration.

## Your code

Fix `drill.ts`, write one sentence in `cause.md`, and replace the placeholder in `check.ts` with a regression assertion.

    npm run drill -- drills/3/gpu/frame-budget/break-fix-1

## The check

The acceptance test covers more than the scene pose. Your check must fail on the original bug and pass after the fix, using behavior instead of looking for a particular line of code.

<details><summary>Hint</summary>

Which of the overlapping CPU and GPU times limits the next frame?

</details>

## Where else?

Where else would the same wrong assumption cause an error?

<details><summary>A few answers</summary>

Comparing devices; Judging a fix.

</details>
