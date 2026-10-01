---
id: 3.camera.projection-matrix.break-and-fix.1
loop: 3
tier: core
concepts: [camera.projection-matrix]
mode: break-and-fix
context: camera.projection-matrix/zoom-dolly
lenses: [space]
misconceptions: []
---

# Projection matrix: find the faulty result

> **The job:** A product looks too narrow in a wide thumbnail and too wide in a tall one.

## Task

A product looks too narrow in a wide thumbnail and too wide in a tall one. Return the projection matrix for the new viewport; FOV is vertical and width and height are CSS pixels.

Fix `viewportLens` in `drill.ts`. The scene shows the current result alongside a reference; they should agree after the repair.

<div data-scene="demo"></div>

## Spaces

| Value | Space |
| --- | --- |
| Inputs | The named camera, world, or screen space in the task |
| Answer | The space stated in the task |

## Your code

Fix `drill.ts`, write one sentence in `cause.md`, and replace the placeholder in `check.ts` with a regression assertion.

    npm run drill -- drills/3/camera/projection-matrix/break-fix-1

## The check

The acceptance test covers more than the scene pose. Your check must fail on the original bug and pass after the fix, using behavior instead of looking for a particular line of code.

<details><summary>Hint</summary>

Compare the named spaces and the operation from the projection matrix page.

</details>

## Where else?

Where else would the same wrong assumption cause an error?

<details><summary>A few answers</summary>

A model editor, an interactive viewer, or a check before export.

</details>
