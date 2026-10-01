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

# Render targets: find the faulty result

> **The job:** After drawing a product thumbnail offscreen, the main canvas stays blank.

## Task

After drawing a product thumbnail offscreen, the main canvas stays blank. Restore the default framebuffer after rendering to the target.

Fix `captureThumbnail` in `drill.ts`. The scene shows the current result alongside a reference; they should agree after the repair.

<div data-scene="demo"></div>

## Measure

Record the scene’s frame interval and draw calls. Say whether this correctness repair should change either number. For GPU execution time, use a GPU trace rather than the CPU render-call duration.

## Your code

Fix `drill.ts`, write one sentence in `cause.md`, and replace the placeholder in `check.ts` with a regression assertion.

    npm run drill -- drills/3/gpu/render-targets/break-fix-1

## The check

The acceptance test covers more than the scene pose. Your check must fail on the original bug and pass after the fix, using behavior instead of looking for a particular line of code.

<details><summary>Hint</summary>

Which framebuffer remains bound after the thumbnail draw?

</details>

## Where else?

Where else would the same wrong assumption cause an error?

<details><summary>A few answers</summary>

GPU picking; Mirrors.

</details>
