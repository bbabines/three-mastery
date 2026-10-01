---
id: 3.camera.view-matrix.break-and-fix.1
loop: 3
tier: core
concepts: [camera.view-matrix]
mode: break-and-fix
context: camera.view-matrix/view-depth
lenses: [space]
misconceptions: [camera.view-matrix/inverse]
---

# View matrix: find the faulty result

> **The job:** A label depth readout follows a moving camera, but the shown camera-space point moves in the same direction as the camera instead of the opposite direction.

## Task

A label depth readout follows a moving camera, but the shown camera-space point moves in the same direction as the camera instead of the opposite direction. Return a fresh view-space point; do not change the world point.

Fix `worldToView` in `drill.ts`. The scene shows the current result alongside a reference; they should agree after the repair.

<div data-scene="demo"></div>

## Spaces

| Value | Space |
| --- | --- |
| Inputs | The named camera, world, or screen space in the task |
| Answer | The space stated in the task |

## Your code

Fix `drill.ts`, write one sentence in `cause.md`, and replace the placeholder in `check.ts` with a regression assertion.

    npm run drill -- drills/3/camera/view-matrix/break-fix-1

## The check

The acceptance test covers more than the scene pose. Your check must fail on the original bug and pass after the fix, using behavior instead of looking for a particular line of code.

<details><summary>Hint</summary>

Compare the named spaces and the operation from the view matrix page.

</details>

## Where else?

Where else would the same wrong assumption cause an error?

<details><summary>A few answers</summary>

A model editor, an interactive viewer, or a check before export.

</details>
