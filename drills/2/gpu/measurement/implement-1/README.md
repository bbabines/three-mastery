---
id: 2.gpu.measurement.implement.1
loop: 2
tier: core
concepts: [gpu.measurement]
mode: implement
context: gpu.measurement/timing-frame
lenses: [cost]
misconceptions: []
---

# Measure: CPU render submission

> **The job:** Time the CPU call that submits a render.

## Task

Call `renderer.render(scene,camera)` between two readings of a supplied clock function, and return elapsed milliseconds. This measures CPU submission only, not GPU execution.

| Function | Return |
| --- | --- |
| `cpuRenderMs(renderer: Pick<THREE.WebGLRenderer, "render">, scene: THREE.Scene, camera: THREE.Camera, now: () => number)` | Milliseconds spent in the CPU render call. |

The CPU submission readout surrounds one render call; it does not report GPU execution time.

<div data-scene="practice"></div>

## Measure

Use `performance.now()` around CPU work, or `renderer.info` and Chrome Performance for rendering. Write down the measured value for the scene; frame time changes by device, so it is not a pass bar.

## Your code

Write it in `drills/2/gpu/measurement/implement-1/drill.ts`. Save, and the scene runs it. To check it as you go:

```
npm run drill -- drills/2/gpu/measurement/implement-1
```

## The check

The check verifies that the code times around the render call in the right order. It also rejects an unanswered function.

<details><summary>Hint</summary>

performance.now around render does not measure the GPU finishing the frame.

</details>

## Where else?

Which experiment would separate fill cost from draw submission cost?
