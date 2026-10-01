---
id: 2.camera.projection-matrix.apply.1
loop: 2
tier: core
concepts: [camera.projection-matrix]
mode: apply
context: camera.projection-matrix/isometric
lenses: [space]
misconceptions: [camera.projection-matrix/fov-horizontal]
---

# Orthographic projection: frame a box

> **The job:** Build an orthographic lens with no distance shrink.

## Task

Write `orthoForBox(left, right, top, bottom, near, far)`. Return a Matrix4 for an orthographic camera with those same view-space bounds. A point’s picture size stays constant as its view depth changes; the bounds are measured in world units from the camera.

Save your code and inspect the scene; compare the blue result with the green reference.

<div data-scene="demo"></div>

## Spaces

| Value | Space or units |
| --- | --- |
| `left, right, top, bottom` | View-space world units from the camera |
| `near, far` | World units along viewing axis |
| Answer | Projection matrix from view space to clip space |

## Your code

Write it in `drills/2/camera/projection-matrix/apply-1/drill.ts`. Save to update the scene. Check it with:

    npm run drill -- drills/2/camera/projection-matrix/apply-1

## The check

The returned matrix matches an OrthographicCamera at asymmetric bounds, including the near/far mapping.

<details><summary>Hint</summary>

Three.js has a camera class that builds this lens. Check its projection matrix after updating it.

</details>

## Where else?

Where does an orthographic lens help?

<details><summary>A few answers</summary>

Show a dimensioned drawing or keep a UI overlay the same size with depth.

</details>
