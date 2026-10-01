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

# Winding order: return a triangle mesh copy with each triangle’s vertex order reversed so its visible front side flips

> **The job:** Return a triangle mesh copy with each triangle’s vertex order reversed so its visible front side flips.

## Task

Return a triangle mesh copy with each triangle’s vertex order reversed so its visible front side flips.

Write `reverseWinding(geometry)` for the behavior above. Save the starter to update the scene.

<div data-scene="demo"></div>

## Your code

Write it in `drills/2/geometry/winding-order/apply-1/drill.ts`. Check it with:

    npm run drill -- drills/2/geometry/winding-order/apply-1

## The check

It passes when `reverseWinding` does the stated job for the scene and the other cases in the test. The test exercises the values and spaces named above.

<details><summary>Hint</summary>

Use the method from the winding order page, and check which space the result belongs to.

</details>

## Where else?

Where else would the same operation help when a part moves or turns?

<details><summary>A few answers</summary>

Inside-out imports. Mirrored geometry.

</details>
