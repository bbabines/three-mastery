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

Try the scene. The readout changes when your function gives an answer.

<div data-scene="practice"></div>

## Measure

Run the Domain 10 resolution experiment at fixed visible thumbnail size. Record source texture width, estimated RGBA mip bytes, renderer.info.memory.textures, and frame time before and after right-sizing. Do not use frame time as a test threshold.

## Your code

Write it in `drills/2/optimization/texture-budget/apply-1/drill.ts`. Save, and the scene runs it. To check it as you go:

```
npm run drill -- drills/2/optimization/texture-budget/apply-1
```

## The check

The tests check the behavior on more than one input, including the edge case described in the task. A function left unanswered fails.

<details><summary>Hint</summary>

Size the source to projected screen pixels and DPR, not the original asset label.

</details>

## Where else?

Where else would the same code help? The concept card lists Swatch libraries, Thumbnail textures.
