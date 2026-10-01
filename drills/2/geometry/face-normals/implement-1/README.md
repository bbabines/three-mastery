---
id: 2.geometry.face-normals.implement.1
loop: 2
tier: core
concepts: [geometry.face-normals]
mode: implement
context: geometry.face-normals/flat-shading
lenses: []
misconceptions: [geometry.face-normals/average-of-vertex]
---

# Face normals: find a triangle face normal in world space after its model has been turned and unevenly stretched

> **The job:** Find a triangle face normal in world space after its model has been turned and unevenly stretched.

## Task

Find a triangle face normal in world space after its model has been turned and unevenly stretched.

Write `faceNormalWorld(a, b, c, modelToWorld)` for the behavior above. Save the starter to update the scene.

<div data-scene="demo"></div>

## Your code

Write it in `drills/2/geometry/face-normals/implement-1/drill.ts`. Check it with:

    npm run drill -- drills/2/geometry/face-normals/implement-1

## The check

It passes when `faceNormalWorld` does the stated job for the scene and the other cases in the test. The test exercises the values and spaces named above.

<details><summary>Hint</summary>

Use the method from the face normals page, and check which space the result belongs to.

</details>

## Where else?

Where else would the same operation help when a part moves or turns?

<details><summary>A few answers</summary>

Back-face test against a direction. Raycast face normal.

</details>
