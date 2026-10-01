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

# Axis drag: find the faulty result

> **The job:** A part slides off its rotated rail when the pointer moves diagonally.

## Task

A part slides off its rotated rail when the pointer moves diagonally. Apply only the part of world motion along the rail axis.

Fix `railPosition` in `drill.ts`. The scene shows the current result alongside a reference; they should agree after the repair.

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

The acceptance test covers more than the scene pose. Your check must fail on the original bug and pass after the fix, using behavior instead of looking for a particular line of code.

<details><summary>Hint</summary>

Which component of pointer motion lies along the rotated rail?

</details>

## Where else?

Where else would the same wrong assumption cause an error?

<details><summary>A few answers</summary>

Height adjustment; Sliding along a rail.

</details>
