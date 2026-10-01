---
id: 3.interaction.anchoring.break-and-fix.1
loop: 3
tier: core
concepts: [interaction.anchoring]
mode: break-and-fix
context: interaction.anchoring/hotspots
lenses: [space]
misconceptions: [interaction.anchoring/labels-hide]
---

# Anchoring: find the faulty result

> **The job:** A price label appears on top of the canvas for a part behind the camera.

## Task

A price label appears on top of the canvas for a part behind the camera. Return CSS pixel coordinates and a visibility flag based on all three projected NDC axes.

Fix `labelState` in `drill.ts`. The scene shows the current result alongside a reference; they should agree after the repair.

<div data-scene="demo"></div>

## Spaces

| Value | Space |
| --- | --- |
| Inputs | The named camera, world, or screen space in the task |
| Answer | The space stated in the task |

## Your code

Fix `drill.ts`, write one sentence in `cause.md`, and replace the placeholder in `check.ts` with a regression assertion.

    npm run drill -- drills/3/interaction/anchoring/break-fix-1

## The check

The acceptance test covers more than the scene pose. Your check must fail on the original bug and pass after the fix, using behavior instead of looking for a particular line of code.

<details><summary>Hint</summary>

Can a projected point have screen X and Y inside the canvas while behind the camera?

</details>

## Where else?

Where else would the same wrong assumption cause an error?

<details><summary>A few answers</summary>

Price tags; Measurement labels.

</details>
