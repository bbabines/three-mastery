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

The preview estimates decoded bytes for one full mip chain.

<div data-scene="practice"></div>

## Measure

Compare a large swatch with a right-sized one at the same on-screen size. Record each decoded mip-chain estimate, `renderer.info.memory.textures`, and frame time. The byte estimate is checked; frame time varies by device.

## Your code

Write it in `drills/2/optimization/texture-budget/implement-1/drill.ts`. Save, and the scene runs it. To check it as you go:

```
npm run drill -- drills/2/optimization/texture-budget/implement-1
```

## The check

The test checks the full RGBA8 mip chain for more than one texture size.

<details><summary>Hint</summary>

Count decoded pixels, not the download bytes.

</details>

## Where else?

How would this estimate help set a mobile swatch limit?

<details><summary>A few answers</summary> Multiply one swatch's decoded bytes by the number kept resident, then compare with the device budget. </details>
