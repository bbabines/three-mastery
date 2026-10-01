---
id: 3.interaction.axis-drag.break-and-fix.1
loop: 3
tier: core
concepts: [interaction.axis-drag]
mode: break-and-fix
context: interaction.axis-drag/gizmo-axis
lenses: [space]
misconceptions: []
---

# Axis drag: keep a dragged part on its tilted rail

> **The job:** Keep a dragged part on its tilted rail.

## Task

A part leaves its tilted rail when the pointer moves diagonally.

Fix the function in `drill.ts`. The blue part should meet the yellow rail marker as the red pointer moves.

<div data-scene="demo"></div>

## Spaces

| Value | Space |
| --- | --- |
| Inputs | The named camera, world, or screen space in the task |
| Answer | The space stated in the task |

## Your code

Fix `drill.ts`, write one sentence in `cause.md`, and replace the placeholder in `check.ts` with a regression assertion.

    npm run drill -- drills/3/interaction/axis-drag/break-fix-1

## The check

The returned motion must be parallel to a tilted rail and retain exactly the along-rail component of pointer motion. Write a short assertion in `check.ts` with a different input. It must reject the starter and accept the repair.

<details><summary>Hint</summary>

Which component of pointer motion lies along the rotated rail?

</details>

## Where else?

Where would a rail-constrained drag help besides a translation gizmo?

<details><summary>A few answers</summary>

Height adjustment; Sliding along a rail.

</details>
