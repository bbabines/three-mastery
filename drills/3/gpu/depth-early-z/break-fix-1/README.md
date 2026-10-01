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

# Depth early z: account for fragment work behind opaque and cutout surfaces

> **The job:** Account for fragment work behind opaque and cutout surfaces.

## Task

A profiler estimate reports almost no fragment work behind an alpha-cutout panel, while the GPU trace shows shading cost.

Fix the function in `drill.ts`. The blue work bars should meet the yellow expected counts.

<div data-scene="demo"></div>

## Measure

Record the scene’s frame interval and draw calls. Say whether this correctness repair should change either number. For GPU execution time, use a GPU trace rather than the CPU render-call duration.

## Your code

Fix `drill.ts`, write one sentence in `cause.md`, and replace the placeholder in `check.ts` with a regression assertion.

    npm run drill -- drills/3/gpu/depth-early-z/break-fix-1

## The check

Opaque hidden fragments can be rejected early, while alpha-tested fragments still contribute to shaded work. Write a short assertion in `check.ts` with a different input. It must reject the starter and accept the repair.

<details><summary>Hint</summary>

Which fragments can depth reject before expensive shading, and which need discard?

</details>

## Where else?

What changes when the foreground surface is alpha cut out rather than opaque?

<details><summary>A few answers</summary>

Alpha-tested mesh panels; Depth prepass.

</details>
