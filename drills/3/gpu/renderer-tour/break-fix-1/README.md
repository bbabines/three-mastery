---
id: 3.gpu.renderer-tour.break-and-fix.1
loop: 3
tier: light
concepts: [gpu.renderer-tour, gpu.state-sorting]
mode: break-and-fix
context: gpu.renderer-tour/first-setup
lenses: [cost]
misconceptions: []
---

# Renderer tour: find the faulty result

> **The job:** A studio shot has no shadows and its label disappears behind parts despite a high render order.

## Task

A studio shot has no shadows and its label disappears behind parts despite a high render order. Configure the renderer and each shadow participant, then place the label above normal geometry.

Fix `prepareStudio` in `drill.ts`. The scene shows the current result alongside a reference; they should agree after the repair.

<div data-scene="demo"></div>

## Measure

Record the scene’s frame interval and draw calls. Say whether this correctness repair should change either number. For GPU execution time, use a GPU trace rather than the CPU render-call duration.

## Your code

Fix `drill.ts`, write one sentence in `cause.md`, and replace the placeholder in `check.ts` with a regression assertion.

    npm run drill -- drills/3/gpu/renderer-tour/break-fix-1

## The check

The acceptance test covers more than the scene pose. Your check must fail on the original bug and pass after the fix, using behavior instead of looking for a particular line of code.

<details><summary>Hint</summary>

Which light and mesh flags must accompany renderer shadow settings?

</details>

## Where else?

Where else would the same wrong assumption cause an error?

<details><summary>A few answers</summary>

A phone-friendly configurator; A studio shot with a soft shadow.

</details>
