---
id: 3.debugging.nothing-renders.break-and-fix.1
loop: 3
tier: light
concepts: [debugging.nothing-renders, debugging.nan-degenerate]
mode: break-and-fix
context: debugging.nothing-renders/invisible-model
lenses: []
misconceptions:
  - debugging.nothing-renders/loaded-visible
---

# Nothing renders: a loaded part with no size

> **The job:** reject a part whose world transform collapses it to zero size.

## Task

`canAppear(mesh)` checks whether a loaded part can be drawn at all. The starter sees that it is in the scene and marked visible, then says yes. The live part still vanishes when a parent has a zero scale.

Fix the check for a degenerate world transform, name the mistaken assumption in `cause.md`, and write a regression assertion in `check.ts`. Toggle the parent's scale in the scene.

<div data-scene="vanishing"></div>

## Your code

Edit `drills/3/debugging/nothing-renders/break-fix-1/drill.ts`, `cause.md`, and `check.ts`.

    npm run drill -- drills/3/debugging/nothing-renders/break-fix-1

## The check

The acceptance test includes an ordinary parent and a zero-scale parent. The regression assertion rejects a check that equates scene membership with a drawable transform.

<details><summary>Hint</summary> A zero scale makes the world matrix singular; its inverse cannot recover positions for operations such as raycasting. </details>

## Where else?

What other silent degenerate values can make an object disappear?

<details><summary>A few answers</summary> NaN positions, a camera's near and far planes, or an empty geometry attribute. </details>
