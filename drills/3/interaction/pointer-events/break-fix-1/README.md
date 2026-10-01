---
id: 3.interaction.pointer-events.break-and-fix.1
loop: 3
tier: light
concepts: [interaction.pointer-events, interaction.click-vs-drag]
mode: break-and-fix
context: interaction.click-vs-drag/tap-vs-pan
lenses: []
misconceptions: []
---

# Pointer events: find the faulty result

> **The job:** A touch tap becomes a drag on a high-DPR phone even though the finger moved only a few CSS pixels.

## Task

A touch tap becomes a drag on a high-DPR phone even though the finger moved only a few CSS pixels. Compare pointer movement with the click threshold in CSS pixels.

Fix `isClick` in `drill.ts`. The scene shows the current result alongside a reference; they should agree after the repair.

<div data-scene="demo"></div>

## Your code

Fix `drill.ts`, write one sentence in `cause.md`, and replace the placeholder in `check.ts` with a regression assertion.

    npm run drill -- drills/3/interaction/pointer-events/break-fix-1

## The check

The acceptance test covers more than the scene pose. Your check must fail on the original bug and pass after the fix, using behavior instead of looking for a particular line of code.

<details><summary>Hint</summary>

What unit do PointerEvent client coordinates use on a high-DPR display?

</details>

## Where else?

Where else would the same wrong assumption cause an error?

<details><summary>A few answers</summary>

Touch tap; Pen input.

</details>
