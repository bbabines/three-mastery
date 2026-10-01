---
id: 2.gpu.draw-call-anatomy.implement.1
loop: 2
tier: core
concepts: [gpu.draw-call-anatomy]
mode: implement
context: gpu.draw-call-anatomy/shadow-doubling
lenses: [cost]
misconceptions: []
---

# Draw calls: estimate scene submissions

> **The job:** Count the draws caused by meshes, groups, and a shadow pass.

## Task

Return an estimate for visible Mesh draws in a tree. A multi-material geometry with groups draws once per group. Each shadow-casting Mesh adds a draw for each shadow light.

| Function | Return |
| --- | --- |
| `estimatedDraws(root: THREE.Object3D, shadowLights: number)` | Estimated draw submissions across the main and shadow passes. |

Try the scene. The readout changes when your function gives an answer.

<div data-scene="practice"></div>

## Measure

Use `performance.now()` around CPU work, or `renderer.info` and Chrome Performance for rendering. Write down the measured value for the scene; frame time changes by device, so it is not a pass bar.

## Your code

Write it in `drills/2/gpu/draw-call-anatomy/implement-1/drill.ts`. Save, and the scene runs it. To check it as you go:

```
npm run drill -- drills/2/gpu/draw-call-anatomy/implement-1
```

## The check

The tests check the behavior on more than one input, including the edge case described in the task. A function left unanswered fails.

<details><summary>Hint</summary>

A draw call is CPU/driver submission; shared materials do not turn separate meshes into one draw.

</details>

## Where else?

Where else would the same code help? The concept card lists Many small parts, Multi-material meshes.
