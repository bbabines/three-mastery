---
id: 4.queries.ray-from-pointer.cross.1
loop: 4
tier: core
concepts: [queries.ray-from-pointer, gpu.readback, optimization.draw-call-reduction]
mode: cross-domain
context: queries.ray-from-pointer/hover
lenses: [cost]
misconceptions: []
---

# GPU picking vs raycasting on a million-triangle model

> **The job:** Read a GPU pick ID without blocking pointer interaction.

## Task

A dense model can make a CPU triangle raycast costly. Write `readPickId(renderer, target, x, y)` to read one pixel from an ID render target with the asynchronous three.js API and decode its RGB channels into an integer ID. A zero ID means no selectable part. In the scene, click **Compare picks** to compare a CPU raycast against this readback on a plane with about a million triangles.

<div data-scene="compare"></div>

## Measure

Record the CPU raycast time, ID-pass submission time, and asynchronous readback wait shown in the scene. Submission time is CPU wall time, not GPU execution time; inspect the pass in Chrome's performance tools and repeat before choosing a strategy.

## Your code

Write it in `cross/4/gpu-picking/drill.ts`. Save to update the scene. Check it with:

```
npm run drill -- cross/4/gpu-picking
```

## The check

The check verifies the read is asynchronous, asks for exactly one pixel, and decodes several IDs including zero. A synchronous read cannot pass.

<details><summary>Hint</summary>

An ID render pass and its pixel readback have different costs. Measure both when comparing against a raycast.

</details>

## Where else?

When should GPU picking be measured against a raycast?

<details><summary>A few answers</summary>

Dense CAD selection, instanced bolt picking, or hover over a complex assembly.

</details>
