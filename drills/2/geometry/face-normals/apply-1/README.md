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

# Face normals: use a triangle’s geometric face normal to tell whether its front faces a world-space view direction

> **The job:** Use a triangle’s geometric face normal to tell whether its front faces a world-space view direction.

## Task

Use a triangle’s geometric face normal to tell whether its front faces a world-space view direction.

Write `flatFaceToward(a, b, c, worldView)` for the behavior above. Save the starter to update the scene.

<div data-scene="demo"></div>

## Your code

Write it in `drills/2/geometry/face-normals/apply-1/drill.ts`. Check it with:

    npm run drill -- drills/2/geometry/face-normals/apply-1

## The check

It passes when `flatFaceToward` does the stated job for the scene and the other cases in the test. The test exercises the values and spaces named above.

<details><summary>Hint</summary>

Use the method from the face normals page, and check which space the result belongs to.

</details>

## Where else?

Where else would the same operation help when a part moves or turns?

<details><summary>A few answers</summary>

Flat shading. Raycast face normal.

</details>
