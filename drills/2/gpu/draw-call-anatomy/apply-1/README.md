---
id: 2.gpu.draw-call-anatomy.apply.1
loop: 2
tier: core
concepts: [gpu.draw-call-anatomy]
mode: apply
context: gpu.draw-call-anatomy/multi-material
lenses: [cost]
misconceptions: []
---

# Draw calls: read the renderer's count

> **The job:** Render once and return the actual draw count from renderer.info.

## Task

Render a configured scene with the supplied camera. Return `renderer.info.render.calls` after that render. The caller can compare it with a merged or instanced version.

| Function | Return |
| --- | --- |
| `renderCallCount(renderer: Pick<THREE.WebGLRenderer, "render" | "info">, scene: THREE.Scene, camera: THREE.Camera)` | The renderer.info draw call count after a render. |

Compare the actual draw count after rendering with the separate and instanced versions of the same parts.

<div data-scene="practice"></div>

## Measure

Use `performance.now()` around CPU work, or `renderer.info` and Chrome Performance for rendering. Write down the measured value for the scene; frame time changes by device, so it is not a pass bar.

## Your code

Write it in `drills/2/gpu/draw-call-anatomy/apply-1/drill.ts`. Save, and the scene runs it. To check it as you go:

```
npm run drill -- drills/2/gpu/draw-call-anatomy/apply-1
```

## The check

The check verifies that the code reads renderer.info after the render it measures. It also rejects an unanswered function.

<details><summary>Hint</summary>

Read renderer.info after rendering. A shadow pass can add draws.

</details>

## Where else?

How would a shadow pass change a scene with many small parts?
