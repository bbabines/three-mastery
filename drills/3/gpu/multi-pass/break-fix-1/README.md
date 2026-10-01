---
id: 3.gpu.multi-pass.break-and-fix.1
loop: 3
tier: core
concepts: [gpu.multi-pass]
mode: break-and-fix
context: gpu.multi-pass/selection-outline
lenses: [cost]
misconceptions: [gpu.multi-pass/cheap-filters]
---

# Multi pass: find the faulty result

> **The job:** A bloom estimate treats three full-screen passes as one and omits the final output conversion.

## Task

A bloom estimate treats three full-screen passes as one and omits the final output conversion. Count every full-resolution pass and require an output pass for a classic composer.

Fix `passCost` in `drill.ts`. The scene shows the current result alongside a reference; they should agree after the repair.

<div data-scene="demo"></div>

## Measure

Record the scene’s frame interval and draw calls. Say whether this correctness repair should change either number. For GPU execution time, use a GPU trace rather than the CPU render-call duration.

## Your code

Fix `drill.ts`, write one sentence in `cause.md`, and replace the placeholder in `check.ts` with a regression assertion.

    npm run drill -- drills/3/gpu/multi-pass/break-fix-1

## The check

The acceptance test covers more than the scene pose. Your check must fail on the original bug and pass after the fix, using behavior instead of looking for a particular line of code.

<details><summary>Hint</summary>

How many screens of pixels does each full-screen pass cover?

</details>

## Where else?

Where else would the same wrong assumption cause an error?

<details><summary>A few answers</summary>

Bloom; FXAA.

</details>
