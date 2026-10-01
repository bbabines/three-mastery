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

> **The job:** combine ideas from several domains in one small piece of code.

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

Use the relevant three.js methods shown on the concept pages. Make the result observable before trying to optimize it.

</details>

## Where else?

Where else would this choice appear in an interactive 3D tool?
