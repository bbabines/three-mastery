---
id: 3.gpu.depth-early-z.break-and-fix.1
loop: 3
tier: core
concepts: [gpu.depth-early-z]
mode: break-and-fix
context: gpu.depth-early-z/overdraw
lenses: [cost]
misconceptions: [gpu.depth-early-z/hidden-free]
---

# Depth early z: find the faulty result

> **The job:** A profiler estimate counts covered fragments behind an opaque wall as free, even though alpha-tested panels still shade before discard.

## Task

A profiler estimate counts covered fragments behind an opaque wall as free, even though alpha-tested panels still shade before discard. Separate opaque early rejection from alpha-tested shading.

Fix `depthWork` in `drill.ts`. The scene shows the current result alongside a reference; they should agree after the repair.

<div data-scene="demo"></div>

## Measure

Record the scene’s frame interval and draw calls. Say whether this correctness repair should change either number. For GPU execution time, use a GPU trace rather than the CPU render-call duration.

## Your code

Fix `drill.ts`, write one sentence in `cause.md`, and replace the placeholder in `check.ts` with a regression assertion.

    npm run drill -- drills/3/gpu/depth-early-z/break-fix-1

## The check

The acceptance test covers more than the scene pose. Your check must fail on the original bug and pass after the fix, using behavior instead of looking for a particular line of code.

<details><summary>Hint</summary>

Which fragments can depth reject before expensive shading, and which need discard?

</details>

## Where else?

Where else would the same wrong assumption cause an error?

<details><summary>A few answers</summary>

Alpha-tested mesh panels; Depth prepass.

</details>
