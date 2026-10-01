---
id: 3.queries.ray-triangle.break-and-fix.1
loop: 3
tier: core
concepts: [queries.ray-triangle]
mode: break-and-fix
context: queries.ray-triangle/uv-at-hit
lenses: []
misconceptions: [queries.ray-triangle/barycentric-hit-only]
---

# Ray triangle: find the faulty result

> **The job:** Painting a triangle stamps the nearest vertex UV instead of the UV at the exact hit.

## Task

Painting a triangle stamps the nearest vertex UV instead of the UV at the exact hit. Interpolate the three UVs using the ray hit’s barycentric weights.

Fix `uvAtHit` in `drill.ts`. The scene shows the current result alongside a reference; they should agree after the repair.

<div data-scene="demo"></div>

## Your code

Fix `drill.ts`, write one sentence in `cause.md`, and replace the placeholder in `check.ts` with a regression assertion.

    npm run drill -- drills/3/queries/ray-triangle/break-fix-1

## The check

The acceptance test covers more than the scene pose. Your check must fail on the original bug and pass after the fix, using behavior instead of looking for a particular line of code.

<details><summary>Hint</summary>

What do the hit point’s three barycentric weights tell you about UVs?

</details>

## Where else?

Where else would the same wrong assumption cause an error?

<details><summary>A few answers</summary>

Exact picking; Back-face handling.

</details>
