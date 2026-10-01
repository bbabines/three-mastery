---
id: 3.camera.project-unproject.break-and-fix.1
loop: 3
tier: core
concepts: [camera.project-unproject]
mode: break-and-fix
context: camera.project-unproject/labels-3d
lenses: [space]
misconceptions: [camera.project-unproject/behind-camera]
---

# Projected labels: behind the camera

> **The job:** Show a 3D label only when its point is inside the camera's view.

## Task

`labelVisible(camera, worldPoint)` decides whether a world point belongs in a camera overlay. The starter checks projected X and Y but draws a label for a point behind the camera. Return true only when the point lies inside the visible NDC cube on all three axes. Leave the point unchanged.

The scene has one marker in front of the camera and one behind it. Only the front marker should get a label.

<div data-scene="demo"></div>

## Spaces

| Value | Space |
| --- | --- |
| `worldPoint` | World position |
| Projected point | NDC, −1 to +1 on X, Y, and Z |
| Answer | Whether a label belongs inside the camera view |

## Your code

Fix `drill.ts`, write one sentence in `cause.md`, and replace the placeholder in `check.ts` with a regression assertion.

    npm run drill -- drills/3/camera/project-unproject/break-fix-1

## The check

The acceptance test checks points in front, behind, and to the side. Your check should reject a point whose X and Y pass but whose depth does not.

<details><summary>Hint</summary>

The project/unproject page shows three coordinates after `project`, not just the two used for screen position. Which one separates front from behind?

</details>

## Where else?

Where else could a point behind the camera pass a two-axis test?

<details><summary>A few answers</summary>

Hotspot labels, edge arrows for off-screen targets, or a 3D selection overlay.

</details>
