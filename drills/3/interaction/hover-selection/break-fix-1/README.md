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

# Hover selection: find the faulty result

> **The job:** A selected part shrinks when the pointer leaves it.

## Task

A selected part shrinks when the pointer leaves it. Return its next emphasis scale: selection wins over hover, and the transition uses elapsed time.

Fix `nextEmphasis` in `drill.ts`. The scene shows the current result alongside a reference; they should agree after the repair.

<div data-scene="demo"></div>

## Your code

Fix `drill.ts`, write one sentence in `cause.md`, and replace the placeholder in `check.ts` with a regression assertion.

    npm run drill -- drills/3/interaction/hover-selection/break-fix-1

## The check

The acceptance test covers more than the scene pose. Your check must fail on the original bug and pass after the fix, using behavior instead of looking for a particular line of code.

<details><summary>Hint</summary>

Which state wins if a part stays selected after hover ends?

</details>

## Where else?

Where else would the same wrong assumption cause an error?

<details><summary>A few answers</summary>

Multi-select; Deselect on empty click.

</details>
