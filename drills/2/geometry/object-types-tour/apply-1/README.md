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

# Object types and instances: build one instancedmesh for repeated parts that share geometry and material, setting each instance a different pose

> **The job:** Build one InstancedMesh for repeated parts that share geometry and material, setting each instance a different pose.

## Task

Build one `InstancedMesh` for repeated parts that share geometry and material, setting each instance a different pose. Each copy goes one unit farther along X; mark the instance matrices for upload. This is one object and one material for the repeated parts.

Write `makeRepeatedParts(geometry, material, count)` for the behavior above. Save the starter to update the scene.

<div data-scene="demo"></div>

## Your code

Write it in `drills/2/geometry/object-types-tour/apply-1/drill.ts`. Check it with:

    npm run drill -- drills/2/geometry/object-types-tour/apply-1

## The check

It passes when `makeRepeatedParts` does the stated job for the scene and the other cases in the test. The test exercises the values and spaces named above.

<details><summary>Hint</summary>

Use the method from the object types and instances page, and check which space the result belongs to.

</details>

## Where else?

Where else would the same operation help when a part moves or turns?

<details><summary>A few answers</summary>

A rack of repeated shelves. A point cloud scan.

</details>
