---
id: 3.interaction.controls-tour.break-and-fix.1
loop: 3
tier: light
concepts: [interaction.controls-tour, interaction.controls-coexistence]
mode: break-and-fix
context: interaction.controls-coexistence/custom-drags
lenses: []
misconceptions: []
---

# Controls tour: find the faulty result

> **The job:** A gizmo drag also orbits the camera.

## Task

A gizmo drag also orbits the camera. Set the orbit control state for the drag; when the drag ends, update it so damping resumes.

Fix `gizmoMode` in `drill.ts`. The scene shows the current result alongside a reference; they should agree after the repair.

<div data-scene="demo"></div>

## Your code

Fix `drill.ts`, write one sentence in `cause.md`, and replace the placeholder in `check.ts` with a regression assertion.

    npm run drill -- drills/3/interaction/controls-tour/break-fix-1

## The check

The acceptance test covers more than the scene pose. Your check must fail on the original bug and pass after the fix, using behavior instead of looking for a particular line of code.

<details><summary>Hint</summary>

Which control receives the pointer while the gizmo is active?

</details>

## Where else?

Where else would the same wrong assumption cause an error?

<details><summary>A few answers</summary>

Moving a part with a gizmo; A walkthrough of a showroom.

</details>
