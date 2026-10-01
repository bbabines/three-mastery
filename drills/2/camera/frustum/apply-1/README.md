---
id: 2.camera.frustum.apply.1
loop: 2
tier: light
concepts: [camera.frustum, camera.aspect-resize]
mode: apply
context: camera.frustum/shadow-camera
lenses: [space]
misconceptions: [camera.frustum/tests-triangles]
---

# Frustum: resize visibility

> **The job:** Check a world point after a camera resize.

## Task

Write `visibleAfterResize(camera, width, height, worldPoint)`. Treat width and height as a new viewport in CSS pixels. Update the supplied camera’s aspect and projection matrix for that size, then return true only when the world point lies inside its complete view frustum, including near and far planes. Leave `worldPoint` unchanged.

Save your code and inspect the scene; compare the blue result with the green reference.

<div data-scene="demo"></div>

## Spaces

| Value | Space or units |
| --- | --- |
| `camera` | Pose in world; perspective lens |
| `width, height` | Viewport size in CSS pixels |
| `worldPoint` | World position |
| Answer | Boolean |

## Your code

Write it in `drills/2/camera/frustum/apply-1/drill.ts`. Save to update the scene. Check it with:

    npm run drill -- drills/2/camera/frustum/apply-1

## The check

A side point can fit in a wide viewport and leave a tall one. The camera keeps its new aspect; points behind near or beyond far are outside.

<details><summary>Hint</summary>

A resize changes the lens aspect. After projection, all three NDC coordinates must lie between −1 and +1.

</details>

## Where else?

Where else must visibility follow a resize?

<details><summary>A few answers</summary>

Hide off-screen labels or decide whether to draw a selection marker.

</details>
