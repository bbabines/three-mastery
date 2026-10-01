---
id: 3.gpu.blending.break-and-fix.1
loop: 3
tier: core
concepts: [gpu.blending]
mode: break-and-fix
context: gpu.blending/glass
lenses: [cost]
misconceptions: []
---

# Blending: keep a later transparent part visible through tinted glass

> **The job:** Keep a later transparent part visible through tinted glass.

## Task

A tinted pane hides the transparent part behind it when that part draws afterward.

Fix the function in `drill.ts`. The blue part should remain visible through the yellow glass.

<div data-scene="demo"></div>

## Measure

Record the scene’s frame interval and draw calls. Say whether this correctness repair should change either number. For GPU execution time, use a GPU trace rather than the CPU render-call duration.

## Your code

Fix `drill.ts`, write one sentence in `cause.md`, and replace the placeholder in `check.ts` with a regression assertion.

    npm run drill -- drills/3/gpu/blending/break-fix-1

## The check

The glass must blend and keep depth testing while leaving depth writes off for later transparent geometry. Write a short assertion in `check.ts` with a different input. It must reject the starter and accept the repair.

<details><summary>Hint</summary>

Does a transparent pane still write the depth buffer?

</details>

## Where else?

Where would a fading overlay need depth testing without writing depth?

<details><summary>A few answers</summary>

Fades; Overlays.

</details>
