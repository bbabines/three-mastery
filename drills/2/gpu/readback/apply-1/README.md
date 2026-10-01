---
id: 2.gpu.readback.apply.1
loop: 2
tier: light
concepts: [gpu.readback]
mode: apply
context: gpu.readback/screenshots
lenses: [cost]
misconceptions: []
---

# Readback: await an offscreen pixel

> **The job:** Use asynchronous GPU readback for a small picking pixel.

## Task

Call `readRenderTargetPixelsAsync` for one pixel at x and y, and return the resulting Promise. The target was rendered already. Avoid a synchronous read that stalls the main thread.

| Function | Return |
| --- | --- |
| `readIdPixel(renderer: Pick<THREE.WebGLRenderer, "readRenderTargetPixelsAsync">, target: THREE.WebGLRenderTarget, x: number, y: number)` | The Promise for one RGBA picking pixel. |

The ID target contains one pick color. Read one RGBA pixel asynchronously and compare it with the color shown.

<div data-scene="practice"></div>

## Measure

Use `performance.now()` around CPU work, or `renderer.info` and Chrome Performance for rendering. Write down the measured value for the scene; frame time changes by device, so it is not a pass bar.

## Your code

Write it in `drills/2/gpu/readback/apply-1/drill.ts`. Save, and the scene runs it. To check it as you go:

```
npm run drill -- drills/2/gpu/readback/apply-1
```

## The check

The check verifies that the code requests exactly one pixel and returns the async result. It also rejects an unanswered function.

<details><summary>Hint</summary>

Even one synchronous read can wait for earlier GPU work to finish.

</details>

## Where else?

When would an asynchronous ID read matter during pointer movement?
