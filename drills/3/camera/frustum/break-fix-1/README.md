---
id: 3.camera.frustum.break-and-fix.1
loop: 3
tier: light
concepts: [camera.frustum, camera.aspect-resize]
mode: break-and-fix
context: camera.aspect-resize/thumbnail-size
lenses: [space]
misconceptions: []
---

# Frustum: stale after resize

> **The job:** Test whether a point is visible after changing a camera's viewport.

## Task

`visibleAfterResize(camera, width, height, worldPoint)` changes a perspective camera's aspect to `width / height`, then reports whether `worldPoint` is inside the new frustum. The starter changes `aspect` but keeps the old projection matrix, so a side marker still counts as visible after a portrait resize. `width` and `height` are positive CSS pixels; leave the point unchanged.

Switch between wide and tall views in the scene. The marker beside the center should leave the tall camera's view.

<div data-scene="demo"></div>

## Spaces

| Value | Space |
| --- | --- |
| `worldPoint` | World position |
| `width`, `height` | CSS pixels used to set the camera's aspect |
| Answer | Whether the point is inside the camera frustum |

## Your code

Fix `drill.ts`, write one sentence in `cause.md`, and replace the placeholder in `check.ts` with a regression assertion.

    npm run drill -- drills/3/camera/frustum/break-fix-1

## The check

The acceptance test changes the same camera from wide to tall and checks a side point in both views. Your check should catch a stale projection matrix after resize.

<details><summary>Hint</summary>

The frustum page uses the camera's projection and inverse world matrices together. After changing a lens setting, which matrix must be refreshed?

</details>

## Where else?

Where else could a stale lens give the wrong visibility answer?

<details><summary>A few answers</summary>

Label culling after a sidebar opens, a portrait product viewer, or thumbnail generation.

</details>
