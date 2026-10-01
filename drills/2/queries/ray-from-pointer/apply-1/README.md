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
| Pointer | Canvas NDC, from −1 to +1 |
| Camera and objects | World transforms |
| Ray and hit point | World space |

## Your code

Write it in `drills/2/queries/ray-from-pointer/apply-1/drill.ts`. Save, and the scene runs it. To check it as you go:

```
npm run drill -- drills/2/queries/ray-from-pointer/apply-1
```

## The check

The test picks the nearer nested mesh at canvas center and returns no name for a miss.

<details><summary>Hint</summary>

Raycaster.setFromCamera needs NDC and current camera matrices.

</details>

## Where else?

Where else should a pointer ray search nested objects?

<details><summary>A few answers</summary> Hover selection, drag start, or a click on an assembly. </details>
