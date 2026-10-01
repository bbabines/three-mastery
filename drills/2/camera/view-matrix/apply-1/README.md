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

# View matrix: depth along the lens

> **The job:** Measure how far ahead a world point lies.

## Task

Write `viewDepth(camera, worldPoint)`. Return positive distance along the camera’s forward axis for a point in front; points behind give negative values. This is not the straight-line distance to a point off to the side. Leave the point and camera unchanged.

Save your code and inspect the scene; compare the blue result with the green reference.

<div data-scene="demo"></div>

## Spaces

| Value | Space or units |
| --- | --- |
| `camera` | Pose in the world |
| `worldPoint` | World position |
| Answer | Signed world units along camera forward |

## Your code

Write it in `drills/2/camera/view-matrix/apply-1/drill.ts`. Save to update the scene. Check it with:

    npm run drill -- drills/2/camera/view-matrix/apply-1

## The check

A point five units ahead returns 5, even when the camera moves and turns; side offset does not change that depth.

<details><summary>Hint</summary>

First express the point measured from the camera. A camera faces its own −Z direction.

</details>

## Where else?

What else needs view depth rather than straight-line distance?

<details><summary>A few answers</summary>

Size a constant-pixel gizmo or sort camera-facing labels.

</details>
