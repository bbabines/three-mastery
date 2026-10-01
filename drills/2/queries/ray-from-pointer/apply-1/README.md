---
id: 2.queries.ray-from-pointer.apply.1
loop: 2
tier: core
concepts: [queries.ray-from-pointer]
mode: apply
context: queries.ray-from-pointer/drag-start
lenses: [space]
misconceptions: []
---

# Pointer ray: pick a part

> **The job:** Cast a camera ray through a pointer and return the nearest Mesh.

## Task

A pointer is already in canvas NDC. Use `Raycaster.setFromCamera` and a recursive object hit test. Return the nearest hit Mesh name, or an empty string.

| Function | Return |
| --- | --- |
| `pickName(ndc: THREE.Vector2, camera: THREE.Camera, root: THREE.Object3D)` | The nearest hit Mesh name, or an empty string. |

Try the scene. The readout changes when your function gives an answer.

<div data-scene="practice"></div>

## Spaces

| Value | Space |
| --- | --- |
| Inputs and answer | World space unless named otherwise in the task. |

## Your code

Write it in `drills/2/queries/ray-from-pointer/apply-1/drill.ts`. Save, and the scene runs it. To check it as you go:

```
npm run drill -- drills/2/queries/ray-from-pointer/apply-1
```

## The check

The tests check the behavior on more than one input, including the edge case described in the task. A function left unanswered fails.

<details><summary>Hint</summary>

Raycaster.setFromCamera needs NDC and current camera matrices.

</details>

## Where else?

Where else would the same code help? The concept card lists Click, Hover.
