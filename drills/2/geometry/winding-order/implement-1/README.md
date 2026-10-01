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

# Winding order: tell whether a triangle’s counter-clockwise front side faces a viewer along the given direction

> **The job:** Tell whether a triangle’s counter-clockwise front side faces a viewer along the given direction.

## Task

Tell whether a triangle’s counter-clockwise front side faces a viewer along the given direction.

Write `frontFacesViewer(a, b, c, viewDirection)` for the behavior above. Save the starter to update the scene.

<div data-scene="demo"></div>

## Your code

Write it in `drills/2/geometry/winding-order/implement-1/drill.ts`. Check it with:

    npm run drill -- drills/2/geometry/winding-order/implement-1

## The check

It passes when `frontFacesViewer` does the stated job for the scene and the other cases in the test. The test exercises the values and spaces named above.

<details><summary>Hint</summary>

Use the method from the winding order page, and check which space the result belongs to.

</details>

## Where else?

Where else would the same operation help when a part moves or turns?

<details><summary>A few answers</summary>

Inside-out imports. DoubleSide trade-offs.

</details>
