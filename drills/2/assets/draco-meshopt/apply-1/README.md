---
id: 2.assets.draco-meshopt.apply.1
loop: 2
tier: light
concepts: [assets.draco-meshopt, assets.ktx2]
mode: apply
context: assets.draco-meshopt/mobile-decode
lenses: [cost]
misconceptions: []
---

# Asset formats: compare decode and VRAM

> **The job:** Choose a geometry codec for a latency budget and estimate raw texture memory.

## Task

Given measured decode durations, choose `meshopt` when it meets a mobile decode budget and Draco does not; otherwise choose the smaller payload. For a texture, estimate RGBA byte count with or without mipmaps.

| Function | Return |
| --- | --- |
| `chooseGeometryCodec(dracoBytes: number, dracoDecodeMs: number, meshoptBytes: number, meshoptDecodeMs: number, maxDecodeMs: number)` | The chosen codec from measured decode and payload costs. |
| `rgbaTextureBytes(width: number, height: number, mipmaps: boolean)` | Approximate raw RGBA bytes; compressed KTX2 may use less. |

Try the scene. The readout changes when your function gives an answer.

<div data-scene="practice"></div>

## Measure

Use `performance.now()` around CPU work, or `renderer.info` and Chrome Performance for rendering. Write down the measured value for the scene; frame time changes by device, so it is not a pass bar.

## Your code

Write it in `drills/2/assets/draco-meshopt/apply-1/drill.ts`. Save, and the scene runs it. To check it as you go:

```
npm run drill -- drills/2/assets/draco-meshopt/apply-1
```

## The check

The tests check the behavior on more than one input, including the edge case described in the task. A function left unanswered fails.

<details><summary>Hint</summary>

Compressed download size and decoded GPU size are separate budgets.

</details>

## Where else?

Where else would the same code help? The concept card lists Payload budget, Choosing per asset.
