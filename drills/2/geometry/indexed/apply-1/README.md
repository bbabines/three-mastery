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

# Indexed geometry: separate faces

> **The job:** Give each triangle its own corners.

## Task

Write `separateFaces(geometry)`. Return a nonindexed copy of an indexed triangle geometry, so each triangle has its own vertex data and can receive a separate face color. Preserve the source geometry, its attributes, and triangle order.

Save your code and inspect the scene; compare the blue result with the green reference.

<div data-scene="demo"></div>

## Spaces

| Value | Space or units |
| --- | --- |
| `geometry` | Vertex data measured from object itself |
| Answer | New nonindexed BufferGeometry |

## Your code

Write it in `drills/2/geometry/indexed/apply-1/drill.ts`. Save to update the scene. Check it with:

    npm run drill -- drills/2/geometry/indexed/apply-1

## The check

The copy has one position entry for each index entry and no index list; the source remains indexed.

<details><summary>Hint</summary>

Three.js can expand an indexed geometry into one independent vertex per triangle corner.

</details>

## Where else?

When else do faces need independent corners?

<details><summary>A few answers</summary>

Assign flat normals or split UVs at a texture seam.

</details>
