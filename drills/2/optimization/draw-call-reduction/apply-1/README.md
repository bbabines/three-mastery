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

The preview groups its fixed kit by exact geometry and material pairs.

<div data-scene="practice"></div>

## Measure

Render the same kit before and after batching. Record `renderer.info.render.calls` and frame time while keeping part count and screen coverage fixed.

## Your code

Write it in `drills/2/optimization/draw-call-reduction/apply-1/drill.ts`. Save, and the scene runs it. To check it as you go:

```
npm run drill -- drills/2/optimization/draw-call-reduction/apply-1
```

## The check

The test checks separate batches for unlike pairs and every preserved instance world matrix.

<details><summary>Hint</summary>

Instancing needs one geometry and material per batch; unlike parts remain separate.

</details>

## Where else?

Which static environment parts can share one instanced draw?

<details><summary>A few answers</summary> Repeated brackets or bolts with the same geometry and material can share a draw while keeping individual transforms. </details>
