---
id: 2.camera.projection-matrix.implement.1
loop: 2
tier: core
concepts: [camera.projection-matrix]
mode: implement
context: camera.projection-matrix/ortho-thumbnails
lenses: [space]
misconceptions: [camera.projection-matrix/fov-horizontal]
---

# Projection matrix: build a perspective projection for a vertical field of view and a viewport’s width and height

> **The job:** Build a perspective projection for a vertical field of view and a viewport’s width and height.

## Task

Build a perspective projection for a vertical field of view and a viewport’s width and height.

Write `lensForViewport(verticalFov, width, height, near, far)` for the behavior above. Save the starter to update the scene.

<div data-scene="demo"></div>

## Spaces

| Value | Space or units |
| --- | --- |
| `verticalFov` | Degrees of vertical field of view |
| `width` | CSS pixels |
| `height` | CSS pixels |
| `near` | World units along the camera view axis |
| `far` | World units along the camera view axis |
| Answer | Scalar or object described in the Task |

## Your code

Write it in `drills/2/camera/projection-matrix/implement-1/drill.ts`. Check it with:

    npm run drill -- drills/2/camera/projection-matrix/implement-1

## The check

It passes when `lensForViewport` does the stated job for the scene and the other cases in the test. The test exercises the values and spaces named above.

<details><summary>Hint</summary>

Use the method from the projection matrix page, and check which space the result belongs to.

</details>

## Where else?

Where else would the same operation help when a part moves or turns?

<details><summary>A few answers</summary>

Zoom vs dolly. Isometric views.

</details>
