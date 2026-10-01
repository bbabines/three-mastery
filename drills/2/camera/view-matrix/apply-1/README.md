---
id: 2.camera.view-matrix.apply.1
loop: 2
tier: core
concepts: [camera.view-matrix]
mode: apply
context: camera.view-matrix/billboards
lenses: [space]
misconceptions: [camera.view-matrix/inverse]
---

# View matrix: find how far a world point lies in front of the camera along its viewing axis, rather than its straight-line distance

> **The job:** Find how far a world point lies in front of the camera along its viewing axis, rather than its straight-line distance.

## Task

Find how far a world point lies in front of the camera along its viewing axis, rather than its straight-line distance.

Write `viewDepth(camera, worldPoint)` for the behavior above. Save the starter to update the scene.

<div data-scene="demo"></div>

## Spaces

| Value | Space or units |
| --- | --- |
| `camera` | Camera pose and lens in world space |
| `worldPoint` | World space |
| Answer | World space |

## Your code

Write it in `drills/2/camera/view-matrix/apply-1/drill.ts`. Check it with:

    npm run drill -- drills/2/camera/view-matrix/apply-1

## The check

It passes when `viewDepth` does the stated job for the scene and the other cases in the test. The test exercises the values and spaces named above.

<details><summary>Hint</summary>

Use the method from the view matrix page, and check which space the result belongs to.

</details>

## Where else?

Where else would the same operation help when a part moves or turns?

<details><summary>A few answers</summary>

View-space depth. Camera-relative UI.

</details>
