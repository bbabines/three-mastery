---
id: 3.interaction.local-world-manipulation.break-and-fix.1
loop: 3
tier: core
concepts: [interaction.local-world-manipulation]
mode: break-and-fix
context: interaction.local-world-manipulation/rotated-rail
lenses: [space]
misconceptions: [interaction.local-world-manipulation/world-axes]
---

# Local world manipulation: find the faulty result

> **The job:** Moving a nested part along world X sends it diagonally because its parent is turned.

## Task

Moving a nested part along world X sends it diagonally because its parent is turned. Apply the world delta, then store the result in the parent’s local position.

Fix `moveByWorld` in `drill.ts`. The scene shows the current result alongside a reference; they should agree after the repair.

<div data-scene="demo"></div>

## Spaces

| Value | Space |
| --- | --- |
| Inputs | The named camera, world, or screen space in the task |
| Answer | The space stated in the task |

## Your code

Fix `drill.ts`, write one sentence in `cause.md`, and replace the placeholder in `check.ts` with a regression assertion.

    npm run drill -- drills/3/interaction/local-world-manipulation/break-fix-1

## The check

The acceptance test covers more than the scene pose. Your check must fail on the original bug and pass after the fix, using behavior instead of looking for a particular line of code.

<details><summary>Hint</summary>

What does world X become in the rotated parent’s local axes?

</details>

## Where else?

Where else would the same wrong assumption cause an error?

<details><summary>A few answers</summary>

Rotating relative to a parent; Gizmo space toggle.

</details>
