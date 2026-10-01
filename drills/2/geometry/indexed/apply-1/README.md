---
id: 2.geometry.indexed.apply.1
loop: 2
tier: core
concepts: [geometry.indexed]
mode: apply
context: geometry.indexed/per-face-colors
lenses: []
misconceptions: [geometry.indexed/shared-normals]
---

# Indexed geometry: make a copy of indexed geometry whose triangles have separate vertices so each face can carry its own color

> **The job:** Make a copy of indexed geometry whose triangles have separate vertices so each face can carry its own color.

## Task

Make a copy of indexed geometry whose triangles have separate vertices so each face can carry its own color.

Write `separateFaces(geometry)` for the behavior above. Save the starter to update the scene.

<div data-scene="demo"></div>

## Your code

Write it in `drills/2/geometry/indexed/apply-1/drill.ts`. Check it with:

    npm run drill -- drills/2/geometry/indexed/apply-1

## The check

It passes when `separateFaces` does the stated job for the scene and the other cases in the test. The test exercises the values and spaces named above.

<details><summary>Hint</summary>

Use the method from the indexed geometry page, and check which space the result belongs to.

</details>

## Where else?

Where else would the same operation help when a part moves or turns?

<details><summary>A few answers</summary>

Memory savings. Flat shading.

</details>
