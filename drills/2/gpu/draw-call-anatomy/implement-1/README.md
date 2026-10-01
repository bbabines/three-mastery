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

Compare the estimate with the grouped meshes and shadow lights shown in the scene. Each visible group submits once per pass.

<div data-scene="practice"></div>

## Measure

Use `performance.now()` around CPU work, or `renderer.info` and Chrome Performance for rendering. Write down the measured value for the scene; frame time changes by device, so it is not a pass bar.

## Your code

Write it in `drills/2/gpu/draw-call-anatomy/implement-1/drill.ts`. Save, and the scene runs it. To check it as you go:

```
npm run drill -- drills/2/gpu/draw-call-anatomy/implement-1
```

## The check

The check verifies that the code counts material groups, hidden branches, and shadow submissions. It also rejects an unanswered function.

<details><summary>Hint</summary>

A draw call is CPU/driver submission; shared materials do not turn separate meshes into one draw.

</details>

## Where else?

How would a shadow pass change a scene with many small parts?
