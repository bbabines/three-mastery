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

# Depth precision: measure the depth-buffer value of a surface at a given distance along a perspective camera’s view axis

> **The job:** Measure the depth-buffer value of a surface at a given distance along a perspective camera’s view axis.

## Task

Measure the depth-buffer value of a surface at a given distance along a perspective camera’s view axis.

Write `depthAt(camera, viewDepth)` for the behavior above. Save the starter to update the scene.

<div data-scene="demo"></div>

## Spaces

| Value | Space or units |
| --- | --- |
| `camera` | Camera pose and lens in world space |
| `viewDepth` | World units along the camera view axis |
| Answer | Scalar or object described in the Task |

## Your code

Write it in `drills/2/camera/depth-precision/implement-1/drill.ts`. Check it with:

    npm run drill -- drills/2/camera/depth-precision/implement-1

## The check

It passes when `depthAt` does the stated job for the scene and the other cases in the test. The test exercises the values and spaces named above.

<details><summary>Hint</summary>

Use the method from the depth precision page, and check which space the result belongs to.

</details>

## Where else?

Where else would the same operation help when a part moves or turns?

<details><summary>A few answers</summary>

Coplanar decals. Logarithmic depth trade-off.

</details>
