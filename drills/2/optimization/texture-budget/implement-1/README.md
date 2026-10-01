---
id: 2.optimization.texture-budget.implement.1
loop: 2
tier: core
concepts: [optimization.texture-budget]
mode: implement
context: optimization.texture-budget/swatch-libraries
lenses: [cost]
misconceptions: []
---

# Texture budget: count the full mip chain

> **The job:** Estimate the GPU bytes of a decoded RGBA texture with mipmaps.

## Task

A swatch library holds many textures. For one swatch, return the total raw RGBA8 bytes for every mip level down to 1 × 1; multiply by the swatch count when making the budget. A small JPEG file still expands after decode; a supported GPU-compressed texture can use less.

| Function | Return |
| --- | --- |
| `rgbaMipBytes(width: number, height: number)` | Decoded RGBA8 bytes including the full mip chain. |

Try the scene. The readout changes when your function gives an answer.

<div data-scene="practice"></div>

## Measure

Run the Domain 10 resolution experiment with the same on-screen swatch size. Compare a large and right-sized texture: record renderer.info.memory.textures, decoded byte estimates, and frame time. The byte estimate is the acceptance check; timing varies by device.

## Your code

Write it in `drills/2/optimization/texture-budget/implement-1/drill.ts`. Save, and the scene runs it. To check it as you go:

```
npm run drill -- drills/2/optimization/texture-budget/implement-1
```

## The check

The tests check the behavior on more than one input, including the edge case described in the task. A function left unanswered fails.

<details><summary>Hint</summary>

Count decoded pixels, not the download bytes.

</details>

## Where else?

Where else would the same code help? The concept card lists Mobile limits, Thumbnail textures.
