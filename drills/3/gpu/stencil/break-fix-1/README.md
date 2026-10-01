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

# Stencil: find the faulty result

> **The job:** A masked offscreen outline has jagged edges and ignores its stencil reference.

## Task

A masked offscreen outline has jagged edges and ignores its stencil reference. Give the target both stencil storage and MSAA samples, then configure the writer material.

Fix `maskedTarget` in `drill.ts`. The scene shows the current result alongside a reference; they should agree after the repair.

<div data-scene="demo"></div>

## Measure

Record the scene’s frame interval and draw calls. Say whether this correctness repair should change either number. For GPU execution time, use a GPU trace rather than the CPU render-call duration.

## Your code

Fix `drill.ts`, write one sentence in `cause.md`, and replace the placeholder in `check.ts` with a regression assertion.

    npm run drill -- drills/3/gpu/stencil/break-fix-1

## The check

The acceptance test covers more than the scene pose. Your check must fail on the original bug and pass after the fix, using behavior instead of looking for a particular line of code.

<details><summary>Hint</summary>

Does the offscreen target contain stencil storage, and what value will the material write?

</details>

## Where else?

Where else would the same wrong assumption cause an error?

<details><summary>A few answers</summary>

Masks and portals; Clipping caps.

</details>
