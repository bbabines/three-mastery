---
id: 2.camera.view-matrix.implement.1
loop: 2
tier: core
concepts: [camera.view-matrix]
mode: implement
context: camera.view-matrix/camera-ui
lenses: [space]
misconceptions: [camera.view-matrix/inverse]
---

# View matrix: world to camera

> **The job:** Express a fixed world point from the camera.

## Task

Write `worldToView(camera, worldPoint)` to return a new camera-space point using the camera’s current pose. A camera moved right makes a fixed world marker appear left in view space. Do not change the camera or input point.

Save your code and inspect the scene; compare the blue result with the green reference.

<div data-scene="demo"></div>

## Spaces

| Value | Space or units |
| --- | --- |
| `camera` | Pose in the world |
| `worldPoint` | World position |
| Answer | Position measured from the camera |

## Your code

Write it in `drills/2/camera/view-matrix/implement-1/drill.ts`. Save to update the scene. Check it with:

    npm run drill -- drills/2/camera/view-matrix/implement-1

## The check

Moved, turned, and parented cameras all give coordinates that transform back to the original world point. The input stays unchanged.

<details><summary>Hint</summary>

The camera’s world transform goes from camera space to world space. Which direction is needed here?

</details>

## Where else?

What else must be measured from the camera?

<details><summary>A few answers</summary>

Compute view depth or position a camera-space effect.

</details>
