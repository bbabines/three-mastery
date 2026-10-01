---
id: 2.debugging.frame-capture.apply.1
loop: 2
tier: core
concepts: [debugging.frame-capture]
mode: apply
context: debugging.frame-capture/render-target-contents
lenses: [cost]
misconceptions: []
---

# Frame capture: inspect a target pixel

> **The job:** Read an offscreen render target to check what a pass actually drew.

## Task

The render target already contains a frame. Read one RGBA pixel from it into a Uint8Array and return the red byte. Use a renderer readback call rather than inferring the result from scene objects.

| Function | Return |
| --- | --- |
| `targetRedByte(renderer: Pick<THREE.WebGLRenderer, "readRenderTargetPixels">, target: THREE.WebGLRenderTarget, x: number, y: number)` | The red channel in the rendered target pixel. |

Try the scene. The readout changes when your function gives an answer.

<div data-scene="practice"></div>

## Measure

Use `performance.now()` around CPU work, or `renderer.info` and Chrome Performance for rendering. Write down the measured value for the scene; frame time changes by device, so it is not a pass bar.

## Your code

Write it in `drills/2/debugging/frame-capture/apply-1/drill.ts`. Save, and the scene runs it. To check it as you go:

```
npm run drill -- drills/2/debugging/frame-capture/apply-1
```

## The check

The tests check the behavior on more than one input, including the edge case described in the task. A function left unanswered fails.

<details><summary>Hint</summary>

A frame capture answers what a pass drew, including render targets.

</details>

## Where else?

Where else would the same code help? The concept card lists Double rendering, Wrong texture bound.
