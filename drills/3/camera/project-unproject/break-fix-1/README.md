---
id: 3.camera.project-unproject.break-and-fix.1
loop: 3
tier: core
concepts: [camera.project-unproject]
mode: break-and-fix
context: camera.project-unproject/labels-3d
lenses: [space]
misconceptions: [camera.project-unproject/behind-camera]
---

# Project unproject: find the faulty result

> **The job:** A 3D label appears for a part behind the camera because its projected X and Y happen to be inside the picture.

## Task

A 3D label appears for a part behind the camera because its projected X and Y happen to be inside the picture. Return whether the point is inside the visible NDC cube.

Fix `labelVisible` in `drill.ts`. The scene shows the current result alongside a reference; they should agree after the repair.

<div data-scene="demo"></div>

## Spaces

| Value | Space |
| --- | --- |
| Inputs | The named camera, world, or screen space in the task |
| Answer | The space stated in the task |

## Your code

Fix `drill.ts`, write one sentence in `cause.md`, and replace the placeholder in `check.ts` with a regression assertion.

    npm run drill -- drills/3/camera/project-unproject/break-fix-1

## The check

The acceptance test covers more than the scene pose. Your check must fail on the original bug and pass after the fix, using behavior instead of looking for a particular line of code.

<details><summary>Hint</summary>

Compare the named spaces and the operation from the project unproject page.

</details>

## Where else?

Where else would the same wrong assumption cause an error?

<details><summary>A few answers</summary>

A model editor, an interactive viewer, or a check before export.

</details>
