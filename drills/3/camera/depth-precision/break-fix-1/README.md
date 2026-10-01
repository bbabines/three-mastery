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

# Depth precision: find the faulty result

> **The job:** A decal test treats perspective depth as if it grows evenly with distance, so it predicts the same precision near and far.

## Task

A decal test treats perspective depth as if it grows evenly with distance, so it predicts the same precision near and far. Return the normalized depth-buffer value at a view-axis distance.

Fix `depthBufferValue` in `drill.ts`. The scene shows the current result alongside a reference; they should agree after the repair.

<div data-scene="demo"></div>

## Spaces

| Value | Space |
| --- | --- |
| Inputs | The named camera, world, or screen space in the task |
| Answer | The space stated in the task |

## Your code

Fix `drill.ts`, write one sentence in `cause.md`, and replace the placeholder in `check.ts` with a regression assertion.

    npm run drill -- drills/3/camera/depth-precision/break-fix-1

## The check

The acceptance test covers more than the scene pose. Your check must fail on the original bug and pass after the fix, using behavior instead of looking for a particular line of code.

<details><summary>Hint</summary>

Compare the named spaces and the operation from the depth precision page.

</details>

## Where else?

Where else would the same wrong assumption cause an error?

<details><summary>A few answers</summary>

A model editor, an interactive viewer, or a check before export.

</details>
