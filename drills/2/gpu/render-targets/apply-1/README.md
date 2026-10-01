---
id: 2.gpu.render-targets.apply.1
loop: 2
tier: core
concepts: [gpu.render-targets]
mode: apply
context: gpu.render-targets/gpu-picking
lenses: [cost]
misconceptions: []
---

# Render target: a GPU picking buffer

> **The job:** Prepare a one-sample target whose ID colors are not blurred.

## Task

For GPU picking, create a WebGLRenderTarget with nearest texture filtering and no MSAA. Return it. The caller can draw object IDs and read one pixel afterward.

| Function | Return |
| --- | --- |
| `pickingTarget(width: number, height: number)` | A nearest-filtered, unsampled GPU picking target. |

Try the scene. The readout changes when your function gives an answer.

<div data-scene="practice"></div>

## Measure

Use `performance.now()` around CPU work, or `renderer.info` and Chrome Performance for rendering. Write down the measured value for the scene; frame time changes by device, so it is not a pass bar.

## Your code

Write it in `drills/2/gpu/render-targets/apply-1/drill.ts`. Save, and the scene runs it. To check it as you go:

```
npm run drill -- drills/2/gpu/render-targets/apply-1
```

## The check

The tests check the behavior on more than one input, including the edge case described in the task. A function left unanswered fails.

<details><summary>Hint</summary>

Linear filtering and MSAA mix neighboring ID colors, corrupting a picking readback.

</details>

## Where else?

Where else would the same code help? The concept card lists Thumbnails, Mirrors.
