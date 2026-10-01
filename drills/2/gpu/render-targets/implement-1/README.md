---
id: 2.gpu.render-targets.implement.1
loop: 2
tier: core
concepts: [gpu.render-targets]
mode: implement
context: gpu.render-targets/thumbnails
lenses: [cost]
misconceptions: []
---

# Render target: an offscreen thumbnail

> **The job:** Create a color-and-depth target sized for a thumbnail.

## Task

Return a WebGLRenderTarget with the supplied width and height, a depth buffer, and no stencil buffer. The renderer can draw to it without changing the canvas.

| Function | Return |
| --- | --- |
| `thumbnailTarget(width: number, height: number)` | A thumbnail-sized offscreen render target. |

Try the scene. The readout changes when your function gives an answer.

<div data-scene="practice"></div>

## Measure

Use `performance.now()` around CPU work, or `renderer.info` and Chrome Performance for rendering. Write down the measured value for the scene; frame time changes by device, so it is not a pass bar.

## Your code

Write it in `drills/2/gpu/render-targets/implement-1/drill.ts`. Save, and the scene runs it. To check it as you go:

```
npm run drill -- drills/2/gpu/render-targets/implement-1
```

## The check

The tests check the behavior on more than one input, including the edge case described in the task. A function left unanswered fails.

<details><summary>Hint</summary>

WebGLRenderTarget owns offscreen attachments until disposed.

</details>

## Where else?

Where else would the same code help? The concept card lists GPU picking, Mirrors.
