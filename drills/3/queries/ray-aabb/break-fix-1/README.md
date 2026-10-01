---
id: 3.queries.ray-aabb.break-and-fix.1
loop: 3
tier: light
concepts: [queries.ray-aabb, queries.aabb-vs-obb]
mode: break-and-fix
context: queries.ray-aabb/bvh-node
lenses: []
misconceptions: []
---

# Ray aabb: find the faulty result

> **The job:** A click misses a rotated part because its local axis-aligned box is tested against a world ray.

## Task

A click misses a rotated part because its local axis-aligned box is tested against a world ray. Return the first world-space surface point on the rotated box.

Fix `rotatedBoxHit` in `drill.ts`. The scene shows the current result alongside a reference; they should agree after the repair.

<div data-scene="demo"></div>

## Your code

Fix `drill.ts`, write one sentence in `cause.md`, and replace the placeholder in `check.ts` with a regression assertion.

    npm run drill -- drills/3/queries/ray-aabb/break-fix-1

## The check

The acceptance test covers more than the scene pose. Your check must fail on the original bug and pass after the fix, using behavior instead of looking for a particular line of code.

<details><summary>Hint</summary>

Are the ray and the box expressed in the same coordinate frame?

</details>

## Where else?

Where else would the same wrong assumption cause an error?

<details><summary>A few answers</summary>

Early-out; Grid lookup.

</details>
