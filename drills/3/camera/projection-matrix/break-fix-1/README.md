---
id: 3.camera.projection-matrix.break-and-fix.1
loop: 3
tier: core
concepts: [camera.projection-matrix]
mode: break-and-fix
context: camera.projection-matrix/zoom-dolly
lenses: [space]
misconceptions: []
---

# Projection matrix: stretched thumbnails

> **The job:** Build the projection matrix for a viewport's actual shape.

## Task

`viewportLens(verticalFov, width, height, near, far)` returns a fresh perspective projection matrix. `verticalFov` is in degrees; `width` and `height` are positive CSS pixels. The starter swaps the two viewport dimensions, so the product squeezes in wide thumbnails and stretches in tall ones. Fix its aspect without changing the vertical field of view.

Switch between wide and tall pictures in the scene. The product should keep its shape, and your horizontal scale should match the reference value.

<div data-scene="demo"></div>

## Spaces

| Value | Space |
| --- | --- |
| `width`, `height` | CSS pixels |
| `verticalFov` | Vertical angle in degrees |
| `near`, `far` | Positive distances along the view axis |
| Answer | Matrix taking camera-space points to clip space |

## Your code

Fix `drill.ts`, write one sentence in `cause.md`, and replace the placeholder in `check.ts` with a regression assertion.

    npm run drill -- drills/3/camera/projection-matrix/break-fix-1

## The check

The acceptance test compares wide and tall matrices with three.js camera projections. Your check should reject an inverted aspect ratio.

<details><summary>Hint</summary>

The projection-matrix page keeps the vertical field of view fixed. Check which dimension belongs on top when computing `aspect`.

</details>

## Where else?

Where else does the wrong aspect distort a camera view?

<details><summary>A few answers</summary>

A resizable canvas, a video preview, or a portrait screenshot.

</details>
