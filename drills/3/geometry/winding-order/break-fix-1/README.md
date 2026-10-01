---
id: 3.geometry.winding-order.break-and-fix.1
loop: 3
tier: core
concepts: [geometry.winding-order]
mode: break-and-fix
context: geometry.winding-order/inside-out
lenses: []
misconceptions: [geometry.winding-order/normals-flip-culling]
---

# Winding order: find the faulty result

> **The job:** An inside-out import still disappears from the front after its normals are flipped.

## Task

An inside-out import still disappears from the front after its normals are flipped. Return a copy whose triangle winding faces the other way; leave the original alone.

Fix `flipFrontFace` in `drill.ts`. The scene shows the current result alongside a reference; they should agree after the repair.

<div data-scene="demo"></div>

## Your code

Fix `drill.ts`, write one sentence in `cause.md`, and replace the placeholder in `check.ts` with a regression assertion.

    npm run drill -- drills/3/geometry/winding-order/break-fix-1

## The check

The acceptance test covers more than the scene pose. Your check must fail on the original bug and pass after the fix, using behavior instead of looking for a particular line of code.

<details><summary>Hint</summary>

Compare the named spaces and the operation from the winding order page.

</details>

## Where else?

Where else would the same wrong assumption cause an error?

<details><summary>A few answers</summary>

A model editor, an interactive viewer, or a check before export.

</details>
