---
id: 2.geometry.winding-order.implement.1
loop: 2
tier: core
concepts: [geometry.winding-order]
mode: implement
context: geometry.winding-order/mirrored
lenses: []
misconceptions: [geometry.winding-order/normals-flip-culling]
---

# Winding order: test the front

> **The job:** Tell which side of a triangle faces a viewer.

## Task

Write `frontFacesViewer(a, b, c, viewDirection)`. The corners are in counter-clockwise front order. `viewDirection` points from the face toward the viewer in the same space. Return true when the geometric front faces that direction. Do not change the vectors.

Save your code and inspect the scene; compare the blue result with the green reference.

<div data-scene="demo"></div>

## Spaces

| Value | Space or units |
| --- | --- |
| `a, b, c` | Triangle positions in one shared space |
| `viewDirection` | Direction toward viewer in that space |
| Answer | Boolean |

## Your code

Write it in `drills/2/geometry/winding-order/implement-1/drill.ts`. Save to update the scene. Check it with:

    npm run drill -- drills/2/geometry/winding-order/implement-1

## The check

Reversing two corners changes the answer, and viewers on opposite sides get opposite results.

<details><summary>Hint</summary>

The triangle’s corner order defines a front direction. Compare it with the direction to the viewer.

</details>

## Where else?

Where else does triangle facing matter?

<details><summary>A few answers</summary>

Choose whether to show a back-face label or inspect culled triangles.

</details>
