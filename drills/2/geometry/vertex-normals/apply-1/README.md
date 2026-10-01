---
id: 2.geometry.vertex-normals.apply.1
loop: 2
tier: core
concepts: [geometry.vertex-normals]
mode: apply
context: geometry.vertex-normals/fix-normals
lenses: []
misconceptions: [geometry.vertex-normals/imported-right]
---

# Vertex normals: make hard edges

> **The job:** Give each face its own flat shading.

## Task

Write `hardEdges(geometry)`. Return a copy with independent triangle corners and rebuilt face-aligned normals. The source geometry must stay unchanged. When adjacent faces no longer share a vertex, their normals need not be averaged.

Save your code and inspect the scene; compare the blue result with the green reference.

<div data-scene="demo"></div>

## Spaces

| Value | Space or units |
| --- | --- |
| `geometry positions` | Measured from object itself |
| Answer | New geometry with per-face normal attributes |

## Your code

Write it in `drills/2/geometry/vertex-normals/apply-1/drill.ts`. Save to update the scene. Check it with:

    npm run drill -- drills/2/geometry/vertex-normals/apply-1

## The check

The copy has independent corners and distinct normals at a cube edge; the source stays intact.

<details><summary>Hint</summary>

Smooth shading averages shared vertex normals. How can the faces stop sharing them?

</details>

## Where else?

Where else are hard edges useful?

<details><summary>A few answers</summary>

Low-poly props, a chamfer boundary, or a flat-shaded terrain tile.

</details>
