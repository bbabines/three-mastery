---
id: 2.camera.camera-relative.apply.1
loop: 2
tier: light
concepts: [camera.camera-relative]
mode: apply
context: camera.camera-relative/drag-parallel
lenses: [space]
misconceptions: [camera.camera-relative/forward-plus-z]
---

# Camera relative: screen axes

> **The job:** Read the camera’s screen directions in the world.

## Task

A camera may look straight up, where a ground-plane cross product cannot define screen right. Write `screenAxes(camera)` to return new unit vectors for screen right, screen up, and forward in the world. Forward means the direction the camera looks, its own −Z. Leave the camera unchanged.

Save your code and inspect the scene; compare the blue result with the green reference.

<div data-scene="demo"></div>

## Spaces

| Value | Space or units |
| --- | --- |
| `camera` | Pose in the world |
| Answer | Three directions in the world |

## Your code

Write it in `drills/2/camera/camera-relative/apply-1/drill.ts`. Save to update the scene. Check it with:

    npm run drill -- drills/2/camera/camera-relative/apply-1

## The check

The axes remain perpendicular, keep unit length, and match the camera’s turn even while it points upward.

<details><summary>Hint</summary>

Start with the camera’s own +X, +Y, and −Z directions. Which stored part of its pose turns all three?

</details>

## Where else?

Where else do camera-facing axes help?

<details><summary>A few answers</summary>

Place a HUD marker in front of the lens or orient a billboard.

</details>
