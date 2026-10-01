---
id: 3.camera.fit-to-bounds.break-and-fix.1
loop: 3
tier: light
concepts: [camera.fit-to-bounds, camera.world-size-per-pixel]
mode: break-and-fix
context: camera.fit-to-bounds/focus-part
lenses: [space]
misconceptions: [camera.fit-to-bounds/vertical-enough]
---

# Fit to bounds: find the faulty result

> **The job:** A sphere fits in landscape but clips in a portrait thumbnail, and hotspot sizing uses the resulting distance.

## Task

A sphere fits in landscape but clips in a portrait thumbnail, and hotspot sizing uses the resulting distance. Return a distance that fits both axes and the world size of one CSS pixel there.

Fix `fitAndPixelSize` in `drill.ts`. The scene shows the current result alongside a reference; they should agree after the repair.

<div data-scene="demo"></div>

## Spaces

| Value | Space |
| --- | --- |
| Inputs | The named camera, world, or screen space in the task |
| Answer | The space stated in the task |

## Your code

Fix `drill.ts`, write one sentence in `cause.md`, and replace the placeholder in `check.ts` with a regression assertion.

    npm run drill -- drills/3/camera/fit-to-bounds/break-fix-1

## The check

The acceptance test covers more than the scene pose. Your check must fail on the original bug and pass after the fix, using behavior instead of looking for a particular line of code.

<details><summary>Hint</summary>

Compare the named spaces and the operation from the fit to bounds page.

</details>

## Where else?

Where else would the same wrong assumption cause an error?

<details><summary>A few answers</summary>

A model editor, an interactive viewer, or a check before export.

</details>
