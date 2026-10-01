---
id: 3.camera.view-matrix.break-and-fix.1
loop: 3
tier: core
concepts: [camera.view-matrix]
mode: break-and-fix
context: camera.view-matrix/view-depth
lenses: [space]
misconceptions: [camera.view-matrix/inverse]
---

# View matrix: a point follows the camera

> **The job:** Express a fixed world point in a moving camera's space.

## Task

`worldToView(camera, worldPoint)` returns a new point in the camera's view space. A label depth readout moves the wrong way as the camera moves, because the starter uses the camera's world transform in the wrong direction. Leave `worldPoint` and the camera pose unchanged.

Move the camera in the scene. A fixed world marker should move the opposite way in view-space coordinates.

<div data-scene="demo"></div>

## Spaces

| Value | Space |
| --- | --- |
| `worldPoint` | World position |
| `camera.matrixWorld` | Camera local space to world space |
| Answer | Position in camera view space |

## Your code

Fix `drill.ts`, write one sentence in `cause.md`, and replace the placeholder in `check.ts` with a regression assertion.

    npm run drill -- drills/3/camera/view-matrix/break-fix-1

## The check

The acceptance test moves and turns the camera, compares against its inverse world matrix, and checks that the input point stays unchanged. Your check should reject the wrong transform direction.

<details><summary>Hint</summary>

The view-matrix page distinguishes moving a camera point into the world from moving a world point into the camera. Which direction does the label readout need?

</details>

## Where else?

Where else must a world point become camera-relative?

<details><summary>A few answers</summary>

Depth sorting labels, camera-space effects, or testing if a point sits in front of the lens.

</details>
