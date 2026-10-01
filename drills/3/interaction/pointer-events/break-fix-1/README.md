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

# Pointer events: keep a small touch movement classified as a tap

> **The job:** Keep a small touch movement classified as a tap.

## Task

A touch tap becomes a drag on a high-DPR phone after only a few CSS pixels of movement.

Fix the function in `drill.ts`. The scene shows the finger motion and the CSS-pixel threshold. It should report a click.

<div data-scene="demo"></div>

## Your code

Fix `drill.ts`, write one sentence in `cause.md`, and replace the placeholder in `check.ts` with a regression assertion.

    npm run drill -- drills/3/interaction/pointer-events/break-fix-1

## The check

The tap decision must use CSS-pixel distance even when DPR changes. Write a short assertion in `check.ts` with a different input. It must reject the starter and accept the repair.

<details><summary>Hint</summary>

What unit do PointerEvent client coordinates use on a high-DPR display?

</details>

## Where else?

How would this handle a pen event on a canvas offset within the page?

<details><summary>A few answers</summary>

Touch tap; Pen input.

</details>
