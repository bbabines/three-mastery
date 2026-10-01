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

# Multi pass: count the work of every post effect

> **The job:** Count the work of every post effect.

## Task

A bloom cost estimate stays the same as more full-screen effects are added.

Fix the function in `drill.ts`. The blue fragment and output bars should meet the yellow outlines.

<div data-scene="demo"></div>

## Measure

Record the scene’s frame interval and draw calls. Say whether this correctness repair should change either number. For GPU execution time, use a GPU trace rather than the CPU render-call duration.

## Your code

Fix `drill.ts`, write one sentence in `cause.md`, and replace the placeholder in `check.ts` with a regression assertion.

    npm run drill -- drills/3/gpu/multi-pass/break-fix-1

## The check

Full-screen work must scale with resolution and pass count, and a classic composer still needs output conversion. Write a short assertion in `check.ts` with a different input. It must reject the starter and accept the repair.

<details><summary>Hint</summary>

How many screens of pixels does each full-screen pass cover?

</details>

## Where else?

What does a second full-screen effect add at twice the canvas width and height?

<details><summary>A few answers</summary>

Bloom; FXAA.

</details>
