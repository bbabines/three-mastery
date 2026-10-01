---
id: 2.geometry.indexed.implement.1
loop: 2
tier: core
concepts: [geometry.indexed]
mode: implement
context: geometry.indexed/flat-shading
lenses: []
misconceptions: [geometry.indexed/shared-normals]
---

# Indexed geometry: read the three local-space corners of one triangle from either indexed or non-indexed geometry

> **The job:** Read the three local-space corners of one triangle from either indexed or non-indexed geometry.

## Task

Read the three local-space corners of one triangle from either indexed or non-indexed geometry.

Write `triangleVertices(geometry, triangleIndex)` for the behavior above. Save the starter to update the scene.

<div data-scene="demo"></div>

## Your code

Write it in `drills/2/geometry/indexed/implement-1/drill.ts`. Check it with:

    npm run drill -- drills/2/geometry/indexed/implement-1

## The check

It passes when `triangleVertices` does the stated job for the scene and the other cases in the test. The test exercises the values and spaces named above.

<details><summary>Hint</summary>

Use the method from the indexed geometry page, and check which space the result belongs to.

</details>

## Where else?

Where else would the same operation help when a part moves or turns?

<details><summary>A few answers</summary>

Memory savings. Per-face colors.

</details>
