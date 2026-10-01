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

# Drag on plane: keep the grabbed spot under the pointer

> **The job:** Keep the grabbed spot under the pointer.

## Task

A part jumps as soon as a wall drag starts: the grabbed spot no longer stays under the pointer.

Fix the function in `drill.ts`. Follow the red wall hit. The blue part should keep the same offset as the yellow reference.

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

The part origin must equal the wall hit plus the saved grab offset, without changing either input. Write a short assertion in `check.ts` with a different input. It must reject the starter and accept the repair.

<details><summary>Hint</summary>

Where was the object origin relative to the point initially grabbed?

</details>

## Where else?

How would the same grab-offset rule work for a floor drag?

<details><summary>A few answers</summary>

Wall drag; 3D slider.

</details>
