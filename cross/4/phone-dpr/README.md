---
id: 4.optimization.resolution-dpr.cross.1
loop: 4
tier: core
concepts: [gpu.frame-budget, optimization.resolution-dpr]
mode: cross-domain
context: gpu.frame-budget/comparing-devices
lenses: [cost]
misconceptions: []
---

# Frame drops only on phones

> **The job:** Limit drawing-buffer pixels while keeping the sharpest DPR the budget allows.

## Task

A phone has a small CSS canvas but a high device pixel ratio. Write `budgetedDpr(width, height, deviceDpr, maxPixels)` to use the device DPR unless that would exceed the pixel budget; then lower it just enough to stay under budget. Return 1 for invalid dimensions or budgets. In the scene, change the cap and watch physical pixels and frame time.

<div data-scene="phone"></div>

## Measure

Use the scene's physical pixel count and frame-time readout. Doubling DPR makes about four times as many pixels. Frame time is measured, never used as a pass/fail threshold.

## Your code

Write it in `cross/4/phone-dpr/drill.ts`. Save to update the scene. Check it with:

```
npm run drill -- cross/4/phone-dpr
```

## The check

The check covers a phone above budget, a desktop below budget, and invalid sizes. It checks the squared pixel count, not only the returned ratio.

<details><summary>Hint</summary>

DPR scales both drawing-buffer dimensions. Compare pixel area, not only width.

</details>

## Where else?

Where else does a pixel budget help more than a fixed DPR?

<details><summary>A few answers</summary>

A tablet configurator, split-screen product thumbnails, or a full-screen viewer.

</details>
