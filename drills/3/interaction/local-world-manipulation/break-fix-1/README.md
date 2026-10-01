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

# Local world manipulation: move a nested part along world X

> **The job:** Move a nested part along world X.

## Task

A part under a turned parent moves diagonally when nudged along world X.

Fix the function in `drill.ts`. The blue part should land on the yellow world-X destination.

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

Under a turned parent, the part itself must move by the requested world delta; returning a correct point alone is insufficient. Write a short assertion in `check.ts` with a different input. It must reject the starter and accept the repair.

<details><summary>Hint</summary>

What does world X become in the rotated parent’s local axes?

</details>

## Where else?

When would a part follow its own turned axis rather than a fixed world axis?

<details><summary>A few answers</summary>

Rotating relative to a parent; Gizmo space toggle.

</details>
