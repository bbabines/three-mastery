---
id: 3.interaction.drag-on-plane.break-and-fix.1
loop: 3
tier: core
concepts: [interaction.drag-on-plane]
mode: break-and-fix
context: interaction.drag-on-plane/floor-drag
lenses: [space]
misconceptions: [interaction.drag-on-plane/hit-is-position]
---

# Drag on plane: find the faulty result

> **The job:** A dragged part snaps its origin under the cursor as soon as the drag starts.

## Task

A dragged part snaps its origin under the cursor as soon as the drag starts. Return the part position from the plane hit while keeping the original grab offset.

Fix `dragPosition` in `drill.ts`. The scene shows the current result alongside a reference; they should agree after the repair.

<div data-scene="demo"></div>

## Spaces

| Value | Space |
| --- | --- |
| Inputs | The named camera, world, or screen space in the task |
| Answer | The space stated in the task |

## Your code

Fix `drill.ts`, write one sentence in `cause.md`, and replace the placeholder in `check.ts` with a regression assertion.

    npm run drill -- drills/3/interaction/drag-on-plane/break-fix-1

## The check

The acceptance test covers more than the scene pose. Your check must fail on the original bug and pass after the fix, using behavior instead of looking for a particular line of code.

<details><summary>Hint</summary>

Where was the object origin relative to the point initially grabbed?

</details>

## Where else?

Where else would the same wrong assumption cause an error?

<details><summary>A few answers</summary>

Wall drag; 3D slider.

</details>
