---
id: 3.camera.camera-relative.break-and-fix.1
loop: 3
tier: light
concepts: [camera.camera-relative]
mode: break-and-fix
context: camera.camera-relative/screen-pan
lenses: [space]
misconceptions: []
---

# Camera relative: find the faulty result

> **The job:** A horizontal drag freezes when the camera looks nearly straight up.

## Task

A horizontal drag freezes when the camera looks nearly straight up. Return the world direction of screen right at any camera tilt.

Fix `cameraRight` in `drill.ts`. The scene shows the current result alongside a reference; they should agree after the repair.

<div data-scene="demo"></div>

## Spaces

| Value | Space |
| --- | --- |
| Inputs | The named camera, world, or screen space in the task |
| Answer | The space stated in the task |

## Your code

Fix `drill.ts`, write one sentence in `cause.md`, and replace the placeholder in `check.ts` with a regression assertion.

    npm run drill -- drills/3/camera/camera-relative/break-fix-1

## The check

The acceptance test covers more than the scene pose. Your check must fail on the original bug and pass after the fix, using behavior instead of looking for a particular line of code.

<details><summary>Hint</summary>

Compare the named spaces and the operation from the camera relative page.

</details>

## Where else?

Where else would the same wrong assumption cause an error?

<details><summary>A few answers</summary>

A model editor, an interactive viewer, or a check before export.

</details>
