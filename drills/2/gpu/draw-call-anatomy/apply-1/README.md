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

Try the scene. The readout changes when your function gives an answer.

<div data-scene="practice"></div>

## Measure

Use `performance.now()` around CPU work, or `renderer.info` and Chrome Performance for rendering. Write down the measured value for the scene; frame time changes by device, so it is not a pass bar.

## Your code

Write it in `drills/2/gpu/draw-call-anatomy/apply-1/drill.ts`. Save, and the scene runs it. To check it as you go:

```
npm run drill -- drills/2/gpu/draw-call-anatomy/apply-1
```

## The check

The tests check the behavior on more than one input, including the edge case described in the task. A function left unanswered fails.

<details><summary>Hint</summary>

Read renderer.info after rendering. A shadow pass can add draws.

</details>

## Where else?

Where else would the same code help? The concept card lists Many small parts, Shadow passes doubling calls.
