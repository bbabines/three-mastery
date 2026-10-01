---
id: 3.gpu.renderer-tour.break-and-fix.1
loop: 3
tier: light
concepts: [gpu.renderer-tour, gpu.state-sorting]
mode: break-and-fix
context: gpu.state-sorting/renderorder-fix
lenses: [cost]
misconceptions: []
---

# Renderer tour: show a product shadow and its overlaid label

> **The job:** Show a product shadow and its overlaid label.

## Task

A studio shot has no shadow and its label stays hidden behind the product.

Fix the function in `drill.ts`. The product should cast a floor shadow, and the yellow label should remain visible over it.

<div data-scene="demo"></div>

## Measure

Record the scene’s frame interval and draw calls. Say whether this correctness repair should change either number. For GPU execution time, use a GPU trace rather than the CPU render-call duration.

## Your code

Fix `drill.ts`, write one sentence in `cause.md`, and replace the placeholder in `check.ts` with a regression assertion.

    npm run drill -- drills/3/gpu/renderer-tour/break-fix-1

## The check

The renderer, light, and surfaces must all participate in shadows; an overlaid label must also bypass depth testing. Write a short assertion in `check.ts` with a different input. It must reject the starter and accept the repair.

<details><summary>Hint</summary>

Which light and mesh flags must accompany renderer shadow settings?

</details>

## Where else?

Which renderer settings belong at creation, and which can change later?

<details><summary>A few answers</summary>

A phone-friendly configurator; A studio shot with a soft shadow.

</details>
