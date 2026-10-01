---
id: 2.optimization.draw-call-reduction.implement.1
loop: 2
tier: core
concepts: [optimization.draw-call-reduction]
mode: implement
context: optimization.draw-call-reduction/static-environment
lenses: [cost]
misconceptions: []
---

# Draw calls: instance a static structure

> **The job:** Submit many repeated parts through one InstancedMesh.

## Task

A static room uses the same bracket at several positions. Build an InstancedMesh, set one Matrix4 per bracket, and return it. The instance count should equal the placements count. Keep the bracket size and screen coverage fixed when comparing draw counts.

| Function | Return |
| --- | --- |
| `instanceHardware(geometry: THREE.BufferGeometry, material: THREE.Material, placements: THREE.Matrix4[])` | One InstancedMesh carrying each copy transform. |

The preview draws three placements through one instance batch.

<div data-scene="practice"></div>

## Measure

Draw the same three brackets separately and as instances. Record `renderer.info.render.calls` and frame time with equal screen coverage. Draw calls should fall; frame time has no fixed threshold.

## Your code

Write it in `drills/2/optimization/draw-call-reduction/implement-1/drill.ts`. Save, and the scene runs it. To check it as you go:

```
npm run drill -- drills/2/optimization/draw-call-reduction/implement-1
```

## The check

The test checks the shared geometry and material, instance count, and each placement matrix.

<details><summary>Hint</summary>

Instancing reduces CPU draw submissions, not fragment work.

</details>

## Where else?

When does instancing help repeated hardware?

<details><summary>A few answers</summary> It helps when many identical parts use the same geometry and material but sit at different transforms. </details>
