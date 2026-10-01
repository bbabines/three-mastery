---
id: 3.camera.camera-relative.break-and-fix.1
loop: 3
tier: light
concepts: [camera.camera-relative]
mode: break-and-fix
context: camera.camera-relative/screen-pan
lenses: [space]
misconceptions: []
---

# Camera relative: a drag that freezes

> **The job:** Find the world direction that moves an object to the camera's right.

## Task

A horizontal drag stops moving the object when the camera looks almost straight up. Fix `cameraRight(camera)` to return a unit world-space direction for the camera's own right side, even at that tilt. Leave the camera unchanged.

Compare the arrow from your function with the camera's right axis in the scene. They should line up at every tilt.

<div data-scene="demo"></div>

## Spaces

| Value | Space |
| --- | --- |
| `camera` | Its pose places its local right axis in the world |
| Answer | A unit direction in world space |

## Your code

Fix `drill.ts`, write one sentence in `cause.md`, and replace the placeholder in `check.ts` with a regression assertion.

    npm run drill -- drills/3/camera/camera-relative/break-fix-1

## The check

The acceptance test looks straight up and at a tilted heading. Your check should prove that screen right still has unit length and matches the camera's world right axis.

<details><summary>Hint</summary>

The camera-relative page shows how to read an axis from `matrixWorld`. A cross product with `camera.up` loses a direction when the two inputs become parallel.

</details>

## Where else?

What other camera-relative control could fail near a straight-up view?

<details><summary>A few answers</summary>

Moving a selection sideways, placing a screen-space label, or steering a free camera.

</details>
