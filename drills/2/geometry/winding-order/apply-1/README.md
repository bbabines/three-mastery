---
id: 2.geometry.winding-order.apply.1
loop: 2
tier: core
concepts: [geometry.winding-order]
mode: apply
context: geometry.winding-order/double-side
lenses: []
misconceptions: [geometry.winding-order/normals-flip-culling]
---

# Winding order: turn fronts around

> **The job:** Reverse every triangle’s front side on a copy.

## Task

Write `reverseWinding(geometry)`. Return a new geometry with each triangle’s second and third corners exchanged so its visible front flips. Handle indexed and nonindexed triangles. Keep each nonindexed corner’s UV and other attributes with its position, and keep shading normals aligned with the new front. Preserve the source.

Save your code and inspect the scene; compare the blue result with the green reference.

<div data-scene="demo"></div>

## Spaces

| Value | Space or units |
| --- | --- |
| `geometry` | Vertex positions and attributes from object itself |
| Answer | New BufferGeometry with reversed fronts |

## Your code

Write it in `drills/2/geometry/winding-order/apply-1/drill.ts`. Save to update the scene. Check it with:

    npm run drill -- drills/2/geometry/winding-order/apply-1

## The check

Every face points the opposite way in either geometry form, and UVs stay attached to their corners.

<details><summary>Hint</summary>

Indexed geometry stores corner order in its index list. Nonindexed geometry stores it directly in every attribute.

</details>

## Where else?

Where else must corner order reverse?

<details><summary>A few answers</summary>

Bake a mirror transform or diagnose a missing FrontSide face.

</details>
