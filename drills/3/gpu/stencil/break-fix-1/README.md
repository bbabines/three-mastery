---
id: 3.gpu.stencil.break-and-fix.1
loop: 3
tier: light
concepts: [gpu.stencil, gpu.multisampling]
mode: break-and-fix
context: gpu.multisampling/thin-lines
lenses: [cost]
misconceptions: []
---

# Stencil: draw a smooth mask into an offscreen target

> **The job:** Draw a smooth mask into an offscreen target.

## Task

An offscreen mask ignores its selected area and has jagged edges.

Fix the function in `drill.ts`. The blue mask should fill the yellow circle without covering the rest of the preview.

<div data-scene="demo"></div>

## Measure

Record the scene’s frame interval and draw calls. Say whether this correctness repair should change either number. For GPU execution time, use a GPU trace rather than the CPU render-call duration.

## Your code

Fix `drill.ts`, write one sentence in `cause.md`, and replace the placeholder in `check.ts` with a regression assertion.

    npm run drill -- drills/3/gpu/stencil/break-fix-1

## The check

The target needs stencil storage and the requested samples; the writer must store the selected reference on a depth pass. Write a short assertion in `check.ts` with a different input. It must reject the starter and accept the repair.

<details><summary>Hint</summary>

Does the offscreen target contain stencil storage, and what value will the material write?

</details>

## Where else?

How would you use a stencil mask for a portal or outline?

<details><summary>A few answers</summary>

Masks and portals; Clipping caps.

</details>
