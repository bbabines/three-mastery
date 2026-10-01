---
id: 3.gpu.render-targets.break-and-fix.1
loop: 3
tier: core
concepts: [gpu.render-targets]
mode: break-and-fix
context: gpu.render-targets/thumbnails
lenses: [cost]
misconceptions: []
---

# Render targets: draw a thumbnail and keep the main canvas active

> **The job:** Draw a thumbnail and keep the main canvas active.

## Task

After an offscreen product thumbnail is drawn, the main canvas stays blank.

Fix the function in `drill.ts`. The blue product should appear on the main canvas after the thumbnail draw.

<div data-scene="demo"></div>

## Measure

Record the scene’s frame interval and draw calls. Say whether this correctness repair should change either number. For GPU execution time, use a GPU trace rather than the CPU render-call duration.

## Your code

Fix `drill.ts`, write one sentence in `cause.md`, and replace the placeholder in `check.ts` with a regression assertion.

    npm run drill -- drills/3/gpu/render-targets/break-fix-1

## The check

After the offscreen render, the default framebuffer must be active for the next canvas draw. Write a short assertion in `check.ts` with a different input. It must reject the starter and accept the repair.

<details><summary>Hint</summary>

Which framebuffer remains bound after the thumbnail draw?

</details>

## Where else?

Where else would drawing offscreen avoid changing the main canvas?

<details><summary>A few answers</summary>

GPU picking; Mirrors.

</details>
