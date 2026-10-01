---
id: 2.assets.memory-math.apply.1
loop: 2
tier: core
concepts: [assets.memory-math]
mode: apply
context: assets.memory-math/compare-variants
lenses: [cost]
misconceptions: []
---

# Memory: budget several textures

> **The job:** Estimate memory for a variant's decoded texture set.

## Task

Given the widths and heights of RGBA8 textures, return their total bytes with full mipmaps. Do not use the compressed file sizes.

| Function | Return |
| --- | --- |
| `textureSetBytes(textures: { width: number; height: number }[])` | Total decoded RGBA8 bytes with mipmaps. |

Try the scene. The readout changes when your function gives an answer.

<div data-scene="practice"></div>

## Measure

Use `performance.now()` around CPU work, or `renderer.info` and Chrome Performance for rendering. Write down the measured value for the scene; frame time changes by device, so it is not a pass bar.

## Your code

Write it in `drills/2/assets/memory-math/apply-1/drill.ts`. Save, and the scene runs it. To check it as you go:

```
npm run drill -- drills/2/assets/memory-math/apply-1
```

## The check

The test adds every mip level across two differently sized textures and checks the input list stays unchanged.

<details><summary>Hint</summary>

A mip chain continues until width and height are both one.

</details>

## Where else?

Where else would a set of textures exceed a memory budget?

<details><summary>A few answers</summary> Variant libraries, mobile tabs, or several visible decals. </details>
