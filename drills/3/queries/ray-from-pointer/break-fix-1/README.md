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

# Pointer ray: an offset canvas misses the part

> **The job:** A click selects the wrong part when the canvas is offset on the page.

## Task

The canvas starts away from the window's top-left corner. `clientX` and `clientY` are viewport CSS pixels; subtract the canvas rectangle's left and top before converting to NDC. Return a world-space ray through that canvas point.

Fix `pointerRay` in `drill.ts`. The supplied pointer is at canvas center. The yellow center ray reaches the blue target; yours is red.

<div data-scene="demo"></div>

## Spaces

| Value | Space |
| --- | --- |
| Pointer and canvas rectangle | Viewport CSS pixels |
| Intermediate pointer | Canvas NDC, from −1 to +1 |
| Returned ray | World space |

## Your code

Fix `drill.ts`, write one sentence in `cause.md`, and replace the placeholder in `check.ts` with a regression assertion.

    npm run drill -- drills/3/queries/ray-from-pointer/break-fix-1

## The check

The test uses an offset canvas and checks the ray's origin and direction against `Raycaster.setFromCamera`. Your check should also work away from canvas center.

<details><summary>Hint</summary>

What offset separates client coordinates from canvas coordinates?

</details>

## Where else?

Where else does forgetting the canvas offset shift a 3D query?

<details><summary>A few answers</summary>

Hover picking, the start of a drag, or a touch tap on a scrolled page.

</details>
