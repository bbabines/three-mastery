---
id: 2.debugging.frame-capture.implement.1
loop: 2
tier: core
concepts: [debugging.frame-capture]
mode: implement
context: debugging.frame-capture/wrong-texture
lenses: [cost]
misconceptions: []
---

# Frame capture: record draw evidence

> **The job:** Capture the draw and triangle counts after one render.

## Task

A product shows the wrong texture even though its Mesh looks correct in the scene tree. Render once, then copy `renderer.info.render.calls` and `.triangles` into a small result. These numbers establish which draws ran; use a frame capture to inspect the texture bound to the suspicious draw. The scene tree alone cannot answer that.

| Function | Return |
| --- | --- |
| `captureFrameCounts(renderer: Pick<THREE.WebGLRenderer, "render" | "info">, scene: THREE.Scene, camera: THREE.Camera)` | Draw calls and triangles recorded after a render. |

The preview reports draw and triangle counts from one rendered frame.

<div data-scene="practice"></div>

## Measure

Use `performance.now()` around CPU work, or `renderer.info` and Chrome Performance for rendering. Write down the measured value for the scene; frame time changes by device, so it is not a pass bar.

## Your code

Write it in `drills/2/debugging/frame-capture/implement-1/drill.ts`. Save, and the scene runs it. To check it as you go:

```
npm run drill -- drills/2/debugging/frame-capture/implement-1
```

## The check

The test checks that rendering happens before the counts are copied and that both counters come from the current frame.

<details><summary>Hint</summary>

A GPU frame capture can show state and shader source that renderer.info does not.

</details>

## Where else?

How could the same counts reveal duplicate rendering?

<details><summary>A few answers</summary> Record the calls before and after a pass; an unexpected second increase points to another render. </details>
