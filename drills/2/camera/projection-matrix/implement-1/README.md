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

# Perspective projection: resize a lens

> **The job:** Build a perspective lens for a viewport.

## Task

Write `lensForViewport(verticalFov, width, height, near, far)`. The FOV is in degrees, width and height are CSS pixels, and near/far are positive world distances. Return a Matrix4 matching a PerspectiveCamera projection at width/height aspect.

Save your code and inspect the scene; compare the blue result with the green reference.

<div data-scene="demo"></div>

## Spaces

| Value | Space or units |
| --- | --- |
| `verticalFov` | Degrees, top to bottom |
| `width, height` | Viewport size in CSS pixels |
| `near, far` | World units along viewing axis |
| Answer | Projection matrix from view space to clip space |

## Your code

Write it in `drills/2/camera/projection-matrix/implement-1/drill.ts`. Save to update the scene. Check it with:

    npm run drill -- drills/2/camera/projection-matrix/implement-1

## The check

Tall and wide viewports produce the correct horizontal scale while preserving the specified vertical field of view.

<details><summary>Hint</summary>

Set a PerspectiveCamera’s aspect to width divided by height, then inspect its current projection matrix.

</details>

## Where else?

Where else must this lens update?

<details><summary>A few answers</summary>

Handle a canvas resize or build a camera for a thumbnail.

</details>
