---
id: 2.camera.depth-precision.implement.1
loop: 2
tier: core
concepts: [camera.depth-precision]
mode: implement
context: camera.depth-precision/large-scenes
lenses: [space]
misconceptions: [camera.depth-precision/far-plane]
---

# Depth precision: read depth

> **The job:** Find a perspective surface’s depth-buffer value.

## Task

Write `depthAt(camera, viewDepth)`. The depth is positive distance along the camera’s viewing axis, not distance to an off-axis point. Return the projected depth-buffer value from 0 at near to 1 at far. Use the camera’s current lens.

Save your code and inspect the scene; compare the blue result with the green reference.

<div data-scene="demo"></div>

## Spaces

| Value | Space or units |
| --- | --- |
| `camera` | Perspective lens |
| `viewDepth` | World units in front along viewing axis |
| Answer | Depth-buffer value, 0–1 |

## Your code

Write it in `drills/2/camera/depth-precision/implement-1/drill.ts`. Save to update the scene. Check it with:

    npm run drill -- drills/2/camera/depth-precision/implement-1

## The check

Near, middle, and far depths follow the camera’s nonlinear projection; a depth ten times farther is not ten times the depth-buffer value.

<details><summary>Hint</summary>

Project a camera-space point on the −Z axis. NDC Z runs from −1 to +1; the depth buffer runs from 0 to 1.

</details>

## Where else?

What needs the same depth conversion?

<details><summary>A few answers</summary>

Compare a sampled depth texture with a world surface or inspect z-fighting.

</details>
