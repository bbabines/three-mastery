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

# Indexed geometry: read triangle corners

> **The job:** Find one triangle’s three positions.

## Task

Write `triangleVertices(geometry, triangleIndex)`. Return three new Vector3 positions measured from the object itself. If the geometry has an index list, use it to find vertex numbers; otherwise each three consecutive vertices form a triangle. Do not modify the geometry.

Save your code and inspect the scene; compare the blue result with the green reference.

<div data-scene="demo"></div>

## Spaces

| Value | Space or units |
| --- | --- |
| `triangleIndex` | Triangle number, starting at zero |
| `geometry positions` | Measured from object itself |
| Answer | Three positions in the same space |

## Your code

Write it in `drills/2/geometry/indexed/implement-1/drill.ts`. Save to update the scene. Check it with:

    npm run drill -- drills/2/geometry/indexed/implement-1

## The check

Both indexed and nonindexed cases return the requested triangle, not always the first three attribute entries.

<details><summary>Hint</summary>

The triangle number selects three entries in draw order. For indexed geometry, those entries are vertex numbers.

</details>

## Where else?

Where else do triangle corners matter?

<details><summary>A few answers</summary>

Compute a face normal or mark a raycast hit triangle.

</details>
