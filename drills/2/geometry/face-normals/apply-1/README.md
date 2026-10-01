---
id: 2.geometry.face-normals.apply.1
loop: 2
tier: core
concepts: [geometry.face-normals]
mode: apply
context: geometry.face-normals/back-face-test
lenses: []
misconceptions: [geometry.face-normals/average-of-vertex]
---

# Face normals: front toward a view

> **The job:** Test a triangle’s geometric front.

## Task

Write `flatFaceToward(a, b, c, worldView)`. The corners are world positions in counter-clockwise front order. `worldView` points from the triangle toward the viewer in the world. Return true only when the triangle’s flat face normal points toward that direction. Do not change the vectors.

Save your code and inspect the scene; compare the blue result with the green reference.

<div data-scene="demo"></div>

## Spaces

| Value | Space or units |
| --- | --- |
| `a, b, c` | World positions |
| `worldView` | World direction toward viewer |
| Answer | Boolean |

## Your code

Write it in `drills/2/geometry/face-normals/apply-1/drill.ts`. Save to update the scene. Check it with:

    npm run drill -- drills/2/geometry/face-normals/apply-1

## The check

It distinguishes viewers on opposite sides of a sloped triangle, regardless of smooth vertex normals.

<details><summary>Hint</summary>

A triangle’s corner order sets its geometric normal. Compare that direction with the direction toward the viewer.

</details>

## Where else?

Where else does geometric facing matter?

<details><summary>A few answers</summary>

Hide labels on the back of a model or reject a back-face hit.

</details>
