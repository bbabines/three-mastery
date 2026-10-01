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

# Frustum: find the faulty result

> **The job:** After changing the thumbnail from square to portrait, a part outside the new view still counts as visible.

## Task

After changing the thumbnail from square to portrait, a part outside the new view still counts as visible. Update the lens for the new aspect, then test the world point against the frustum.

Fix `visibleAfterResize` in `drill.ts`. The scene shows the current result alongside a reference; they should agree after the repair.

<div data-scene="demo"></div>

## Spaces

| Value | Space |
| --- | --- |
| Inputs | The named camera, world, or screen space in the task |
| Answer | The space stated in the task |

## Your code

Fix `drill.ts`, write one sentence in `cause.md`, and replace the placeholder in `check.ts` with a regression assertion.

    npm run drill -- drills/3/camera/frustum/break-fix-1

## The check

The acceptance test covers more than the scene pose. Your check must fail on the original bug and pass after the fix, using behavior instead of looking for a particular line of code.

<details><summary>Hint</summary>

Compare the named spaces and the operation from the frustum page.

</details>

## Where else?

Where else would the same wrong assumption cause an error?

<details><summary>A few answers</summary>

A model editor, an interactive viewer, or a check before export.

</details>
