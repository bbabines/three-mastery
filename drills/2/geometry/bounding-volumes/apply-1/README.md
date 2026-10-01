---
id: 2.geometry.bounding-volumes.apply.1
loop: 2
tier: light
concepts: [geometry.bounding-volumes]
mode: apply
context: geometry.bounding-volumes/camera-fit
lenses: []
misconceptions: [geometry.bounding-volumes/world-space]
---

# Bounding volumes: recompute a geometry’s local-space bounding sphere after direct edits to its position array

> **The job:** Recompute a geometry’s local-space bounding sphere after direct edits to its position array.

## Task

Recompute a geometry’s local-space bounding sphere after direct edits to its position array.

Write `freshBoundingSphere(geometry)` for the behavior above. Save the starter to update the scene.

<div data-scene="demo"></div>

## Your code

Write it in `drills/2/geometry/bounding-volumes/apply-1/drill.ts`. Check it with:

    npm run drill -- drills/2/geometry/bounding-volumes/apply-1

## The check

It passes when `freshBoundingSphere` does the stated job for the scene and the other cases in the test. The test exercises the values and spaces named above.

<details><summary>Hint</summary>

Use the method from the bounding volumes page, and check which space the result belongs to.

</details>

## Where else?

Where else would the same operation help when a part moves or turns?

<details><summary>A few answers</summary>

Culling. Raycast early-out.

</details>
