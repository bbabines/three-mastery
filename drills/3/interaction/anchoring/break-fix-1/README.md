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

# Anchoring: show a price label only while its point is in view

> **The job:** Show a price label only while its point is in view.

## Task

A price label appears on the canvas even when its part is behind the camera.

Fix the function in `drill.ts`. Compare the rear hotspot with the label visibility shown in the scene.

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

A point behind the camera must hide its label; a point in front must remain eligible to show. Write a short assertion in `check.ts` with a different input. It must reject the starter and accept the repair.

<details><summary>Hint</summary>

Can a projected point have screen X and Y inside the canvas while behind the camera?

</details>

## Where else?

How would this change for a hotspot on an occluded moving part?

<details><summary>A few answers</summary>

Price tags; Measurement labels.

</details>
