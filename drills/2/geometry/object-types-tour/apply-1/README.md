---
id: 2.geometry.object-types-tour.apply.1
loop: 2
tier: light
concepts: [geometry.object-types-tour, geometry.instanced-mesh]
mode: apply
context: geometry.object-types-tour/wireframe-dimensions
lenses: []
misconceptions: [geometry.object-types-tour/instanced-batched-same]
---

# InstancedMesh: repeat a part

> **The job:** Place repeated copies in one InstancedMesh.

## Task

Write `makeRepeatedParts(geometry, material, count)`. Return an InstancedMesh using the supplied geometry and material. Set each instance’s transform so instance 0 is at X=0, instance 1 at X=1, and so on, then mark the instance matrix for upload. Preserve the supplied resources.

Save your code and inspect the scene; compare the blue result with the green reference.

<div data-scene="demo"></div>

## Spaces

| Value | Space or units |
| --- | --- |
| `geometry` | Vertex data measured from object itself |
| `material` | Shared material |
| `count` | Number of instances |
| Answer | InstancedMesh with poses in world units |

## Your code

Write it in `drills/2/geometry/object-types-tour/apply-1/drill.ts`. Save to update the scene. Check it with:

    npm run drill -- drills/2/geometry/object-types-tour/apply-1

## The check

One mesh contains the requested number of instances and each instance has its own X position.

<details><summary>Hint</summary>

An InstancedMesh shares geometry and material but stores one matrix per instance. The matrices must reach the GPU.

</details>

## Where else?

Where else is instancing useful?

<details><summary>A few answers</summary>

A rack of identical bolts, repeated tiles, or a field of markers.

</details>
