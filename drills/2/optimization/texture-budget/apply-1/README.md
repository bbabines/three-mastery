---
id: 2.optimization.texture-budget.apply.1
loop: 2
tier: core
concepts: [optimization.texture-budget]
mode: apply
context: optimization.texture-budget/mobile-limits
lenses: [cost]
misconceptions: []
---

# Texture budget: size to screen use

> **The job:** Choose a capped source texture width from projected CSS pixels and DPR.

## Task

Return the next power-of-two source width that covers the on-screen pixel need, capped at the device max. A thumbnail does not need a 4K source when it spans a small part of the screen.

| Function | Return |
| --- | --- |
| `sourceWidthForScreen(cssPixels: number, dpr: number, maxSize: number)` | A power-of-two source width within the device cap. |

The preview chooses a source width for one thumbnail size.

<div data-scene="practice"></div>

## Measure

Keep a thumbnail's on-screen size fixed while changing its source width. Record estimated RGBA mip bytes, `renderer.info.memory.textures`, and frame time. Use the source-size rule for the check; treat frame time as a measurement.

## Your code

Write it in `drills/2/optimization/texture-budget/apply-1/drill.ts`. Save, and the scene runs it. To check it as you go:

```
npm run drill -- drills/2/optimization/texture-budget/apply-1
```

## The check

The test checks power-of-two sizing, DPR need, and the device maximum.

<details><summary>Hint</summary>

Size the source to projected screen pixels and DPR, not the original asset label.

</details>

## Where else?

Where can right-sized sources save texture memory?

<details><summary>A few answers</summary> Swatch lists and small thumbnail grids rarely need each full-resolution product image. </details>
