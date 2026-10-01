---
id: 3.queries.ray-from-pointer.break-and-fix.1
loop: 3
tier: core
concepts: [queries.ray-from-pointer]
mode: break-and-fix
context: queries.ray-from-pointer/click
lenses: [space]
misconceptions: []
---

# Ray from pointer: find the faulty result

> **The job:** A click selects the wrong part when the canvas is offset on the page.

## Task

A click selects the wrong part when the canvas is offset on the page. Build a world ray from pointer CSS coordinates using the canvas rectangle.

Fix `pointerRay` in `drill.ts`. The scene shows the current result alongside a reference; they should agree after the repair.

<div data-scene="demo"></div>

## Spaces

| Value | Space |
| --- | --- |
| Inputs | The named camera, world, or screen space in the task |
| Answer | The space stated in the task |

## Your code

Fix `drill.ts`, write one sentence in `cause.md`, and replace the placeholder in `check.ts` with a regression assertion.

    npm run drill -- drills/3/queries/ray-from-pointer/break-fix-1

## The check

The acceptance test covers more than the scene pose. Your check must fail on the original bug and pass after the fix, using behavior instead of looking for a particular line of code.

<details><summary>Hint</summary>

What offset separates client coordinates from canvas coordinates?

</details>

## Where else?

Where else would the same wrong assumption cause an error?

<details><summary>A few answers</summary>

Hover; Drag start.

</details>
