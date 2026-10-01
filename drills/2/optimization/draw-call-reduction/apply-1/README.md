---
id: 2.optimization.draw-call-reduction.apply.1
loop: 2
tier: core
concepts: [optimization.draw-call-reduction]
mode: apply
context: optimization.draw-call-reduction/same-material-parts
lenses: [cost]
misconceptions: []
---

# Draw calls: batch matching part types

> **The job:** Group repeated Mesh placements by shared geometry and material.

## Task

A kit has some parts that can share an instanced draw and others that cannot. Build one InstancedMesh per exact geometry/material pair. Preserve each world matrix and return the batches.

| Function | Return |
| --- | --- |
| `batchMatchingParts(parts: { geometry: THREE.BufferGeometry; material: THREE.Material; world: THREE.Matrix4 }[])` | Instanced batches grouped by exact shared data. |

Try the scene. The readout changes when your function gives an answer.

<div data-scene="practice"></div>

## Measure

Run the Domain 10 draw-call experiment on the same kit. Record actual draw calls and frame time before and after batching. Keep object count and screen coverage fixed. The scene readout gives the live frame-time and draw-count measurements.

## Your code

Write it in `drills/2/optimization/draw-call-reduction/apply-1/drill.ts`. Save, and the scene runs it. To check it as you go:

```
npm run drill -- drills/2/optimization/draw-call-reduction/apply-1
```

## The check

The tests check the behavior on more than one input, including the edge case described in the task. A function left unanswered fails.

<details><summary>Hint</summary>

Instancing needs one geometry and material per batch; unlike parts remain separate.

</details>

## Where else?

Where else would the same code help? The concept card lists Repeated hardware, Static environment.
