---
id: 3.camera.clip-ndc-screen.break-and-fix.1
loop: 3
tier: core
concepts: [camera.clip-ndc-screen]
mode: break-and-fix
context: camera.clip-ndc-screen/pointer-ndc
lenses: [space]
misconceptions: [camera.clip-ndc-screen/ndc-y-down]
---

# Clip ndc screen: find the faulty result

> **The job:** A label projected near the top of the camera appears near the bottom of the page.

## Task

A label projected near the top of the camera appears near the bottom of the page. Return its CSS pixel Y position from NDC Y and viewport height.

Fix `screenY` in `drill.ts`. The scene shows the current result alongside a reference; they should agree after the repair.

<div data-scene="demo"></div>

## Spaces

| Value | Space |
| --- | --- |
| Inputs | The named camera, world, or screen space in the task |
| Answer | The space stated in the task |

## Your code

Fix `drill.ts`, write one sentence in `cause.md`, and replace the placeholder in `check.ts` with a regression assertion.

    npm run drill -- drills/3/camera/clip-ndc-screen/break-fix-1

## The check

The acceptance test covers more than the scene pose. Your check must fail on the original bug and pass after the fix, using behavior instead of looking for a particular line of code.

<details><summary>Hint</summary>

Compare the named spaces and the operation from the clip ndc screen page.

</details>

## Where else?

Where else would the same wrong assumption cause an error?

<details><summary>A few answers</summary>

A model editor, an interactive viewer, or a check before export.

</details>
