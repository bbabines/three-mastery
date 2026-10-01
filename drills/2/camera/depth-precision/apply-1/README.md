---
id: 2.camera.depth-precision.apply.1
loop: 2
tier: core
concepts: [camera.depth-precision]
mode: apply
context: camera.depth-precision/log-depth
lenses: [space]
misconceptions: [camera.depth-precision/far-plane]
---

# Depth precision: compare depth separation at a distant surface before and after moving the near plane outward

> **The job:** Compare depth separation at a distant surface before and after moving the near plane outward.

## Task

Compare depth separation at a distant surface before and after moving the near plane outward.

Write `nearPlaneGain(viewDepth, oldNear, newNear, far)` for the behavior above. Save the starter to update the scene.

<div data-scene="demo"></div>

## Spaces

| Value | Space or units |
| --- | --- |
| `viewDepth` | World units along the camera view axis |
| `oldNear` | Value in the units named in the Task |
| `newNear` | Value in the units named in the Task |
| `far` | World units along the camera view axis |
| Answer | Scalar or object described in the Task |

## Your code

Write it in `drills/2/camera/depth-precision/apply-1/drill.ts`. Check it with:

    npm run drill -- drills/2/camera/depth-precision/apply-1

## The check

It passes when `nearPlaneGain` does the stated job for the scene and the other cases in the test. The test exercises the values and spaces named above.

<details><summary>Hint</summary>

Use the method from the depth precision page, and check which space the result belongs to.

</details>

## Where else?

Where else would the same operation help when a part moves or turns?

<details><summary>A few answers</summary>

Coplanar decals. Large scenes.

</details>
