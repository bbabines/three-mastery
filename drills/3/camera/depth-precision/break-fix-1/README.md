---
id: 3.camera.depth-precision.break-and-fix.1
loop: 3
tier: core
concepts: [camera.depth-precision]
mode: break-and-fix
context: camera.depth-precision/coplanar-decals
lenses: [space]
misconceptions: []
---

# Depth precision: a linear estimate

> **The job:** Read the depth value a perspective camera would store at a distance.

## Task

`depthBufferValue(near, far, viewDepth)` returns a value from 0 to 1 for a point `viewDepth` units straight ahead of a perspective camera. `near` and `far` are the camera clip distances. The starter spreads depth evenly through that range, which gives the wrong answer for a decal far from the camera.

Move the depth control in the scene. Your value should match the camera's projection, with much more of the depth range used near the camera.

<div data-scene="demo"></div>

## Spaces

| Value | Space |
| --- | --- |
| `near`, `far`, `viewDepth` | Positive distances along the camera's view axis |
| Answer | Depth-buffer value from 0 at near to 1 at far |

## Your code

Fix `drill.ts`, write one sentence in `cause.md`, and replace the placeholder in `check.ts` with a regression assertion.

    npm run drill -- drills/3/camera/depth-precision/break-fix-1

## The check

The acceptance test compares your value with a point projected through a three.js perspective camera at near, middle, and far depths. Your check should reject a linear estimate.

<details><summary>Hint</summary>

The depth precision page shows that perspective depth is uneven. Project a point on the camera's −Z axis, then map its NDC Z from −1…+1 to 0…1.

</details>

## Where else?

Where else would linear depth give the wrong distance?

<details><summary>A few answers</summary>

A decal overlap, a depth-based fade, or a screen-space effect.

</details>
