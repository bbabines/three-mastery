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

# Depth precision: near-plane gain

> **The job:** Compare depth separation after changing the near plane.

## Task

Write `nearPlaneGain(viewDepth, oldNear, newNear, far)`. Place two surfaces at `viewDepth` and 0.01 world units farther along the viewing axis. Return the ratio of their depth-buffer separation with `newNear` to that with `oldNear`. A ratio above 1 means more separation.

Save your code and inspect the scene; compare the blue result with the green reference.

<div data-scene="demo"></div>

## Spaces

| Value | Space or units |
| --- | --- |
| `viewDepth, oldNear, newNear, far` | World units along the camera viewing axis |
| Answer | Unitless ratio of depth-buffer gaps |

## Your code

Write it in `drills/2/camera/depth-precision/apply-1/drill.ts`. Save to update the scene. Check it with:

    npm run drill -- drills/2/camera/depth-precision/apply-1

## The check

Moving a very close near plane outward yields a large gain at a distant surface; keeping it fixed yields 1.

<details><summary>Hint</summary>

Use the same two surface depths with each near plane. Compare the gap between their projected depth-buffer values.

</details>

## Where else?

When would this comparison matter?

<details><summary>A few answers</summary>

Diagnose distant surface flicker or choose a tighter camera depth range.

</details>
