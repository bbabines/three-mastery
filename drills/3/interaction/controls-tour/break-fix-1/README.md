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

# Controls tour: keep a gizmo drag from moving the orbit camera

> **The job:** Keep a gizmo drag from moving the orbit camera.

## Task

Dragging a gizmo also swings the camera; after release, camera damping stalls.

Fix the function in `drill.ts`. Use the drag and release buttons. Red camera motion should vanish during a gizmo drag.

<div data-scene="demo"></div>

## Your code

Fix `drill.ts`, write one sentence in `cause.md`, and replace the placeholder in `check.ts` with a regression assertion.

    npm run drill -- drills/3/interaction/controls-tour/break-fix-1

## The check

Orbit must be disabled during a gizmo drag and receive an update after release so damping resumes. Write a short assertion in `check.ts` with a different input. It must reject the starter and accept the repair.

<details><summary>Hint</summary>

Which control receives the pointer while the gizmo is active?

</details>

## Where else?

When would you choose a gizmo or walkthrough control instead of orbit?

<details><summary>A few answers</summary>

Moving a part with a gizmo; A walkthrough of a showroom.

</details>
