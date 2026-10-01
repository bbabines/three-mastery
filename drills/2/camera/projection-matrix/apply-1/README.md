---
id: 2.camera.projection-matrix.apply.1
loop: 2
tier: core
concepts: [camera.projection-matrix]
mode: apply
context: camera.projection-matrix/isometric
lenses: [space]
misconceptions: [camera.projection-matrix/fov-horizontal]
---

# Projection matrix: build an orthographic lens that maps a chosen world-space box into the picture without perspective shrinking

> **The job:** Build an orthographic lens that maps a chosen world-space box into the picture without perspective shrinking.

## Task

Build an orthographic lens that maps a chosen world-space box into the picture without perspective shrinking.

Write `orthoForBox(left, right, top, bottom, near, far)` for the behavior above. Save the starter to update the scene.

<div data-scene="demo"></div>

## Spaces

| Value | Space or units |
| --- | --- |
| `left` | Value in the units named in the Task |
| `right` | Value in the units named in the Task |
| `top` | Value in the units named in the Task |
| `bottom` | Value in the units named in the Task |
| `near` | World units along the camera view axis |
| `far` | World units along the camera view axis |
| Answer | Scalar or object described in the Task |

## Your code

Write it in `drills/2/camera/projection-matrix/apply-1/drill.ts`. Check it with:

    npm run drill -- drills/2/camera/projection-matrix/apply-1

## The check

It passes when `orthoForBox` does the stated job for the scene and the other cases in the test. The test exercises the values and spaces named above.

<details><summary>Hint</summary>

Use the method from the projection matrix page, and check which space the result belongs to.

</details>

## Where else?

Where else would the same operation help when a part moves or turns?

<details><summary>A few answers</summary>

Zoom vs dolly. Orthographic thumbnails.

</details>
