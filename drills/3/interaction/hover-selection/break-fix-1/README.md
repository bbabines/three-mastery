---
id: 3.interaction.hover-selection.break-and-fix.1
loop: 3
tier: light
concepts: [interaction.hover-selection, interaction.interpolation-toolbox]
mode: break-and-fix
context: interaction.hover-selection/part-highlight
lenses: []
misconceptions: [interaction.hover-selection/one-flag]
---

# Hover selection: keep selected emphasis after hover ends

> **The job:** Keep selected emphasis after hover ends.

## Task

A selected part shrinks when the pointer leaves it.

Fix the function in `drill.ts`. The blue part should match the yellow selected-size outline after hover ends.

<div data-scene="demo"></div>

## Your code

Fix `drill.ts`, write one sentence in `cause.md`, and replace the placeholder in `check.ts` with a regression assertion.

    npm run drill -- drills/3/interaction/hover-selection/break-fix-1

## The check

Selection must win after hover ends, and equal elapsed time must produce equal emphasis at different refresh rates. Write a short assertion in `check.ts` with a different input. It must reject the starter and accept the repair.

<details><summary>Hint</summary>

Which state wins if a part stays selected after hover ends?

</details>

## Where else?

How would you keep a selected part highlighted as the pointer moves elsewhere?

<details><summary>A few answers</summary>

Multi-select; Deselect on empty click.

</details>
