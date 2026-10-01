---
id: 3.queries.ray-plane.break-and-fix.1
loop: 3
tier: core
concepts: [queries.ray-plane]
mode: break-and-fix
context: queries.ray-plane/floor-drag
lenses: []
misconceptions: [queries.ray-plane/every-ray-hits]
---

# Ray plane: find the faulty result

> **The job:** A floor-drag marker appears even when the pointer ray points away from the floor.

## Task

A floor-drag marker appears even when the pointer ray points away from the floor. Return the forward ray–plane hit, or null when there is no hit.

Fix `planeHit` in `drill.ts`. The scene shows the current result alongside a reference; they should agree after the repair.

<div data-scene="demo"></div>

## Your code

Fix `drill.ts`, write one sentence in `cause.md`, and replace the placeholder in `check.ts` with a regression assertion.

    npm run drill -- drills/3/queries/ray-plane/break-fix-1

## The check

The acceptance test covers more than the scene pose. Your check must fail on the original bug and pass after the fix, using behavior instead of looking for a particular line of code.

<details><summary>Hint</summary>

Can the plane projection of the origin lie behind the ray?

</details>

## Where else?

Where else would the same wrong assumption cause an error?

<details><summary>A few answers</summary>

Placement grid; Measuring.

</details>
