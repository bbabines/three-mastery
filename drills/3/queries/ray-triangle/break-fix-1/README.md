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

# Triangle hit: the paint lands at a vertex

> **The job:** Painting a triangle stamps the nearest vertex UV instead of the UV at the exact hit.

## Task

A ray hits inside a triangle, but the paint stamp uses one vertex's UV. Find the ray's point on the triangle, then blend its three vertex UVs using the hit's barycentric weights. Return `null` on a miss.

Fix `uvAtHit` in `drill.ts`. The left shape shows the hit. On the right, the yellow dot is the blended UV; yours is red.

<div data-scene="demo"></div>

## Your code

Fix `drill.ts`, write one sentence in `cause.md`, and replace the placeholder in `check.ts` with a regression assertion.

    npm run drill -- drills/3/queries/ray-triangle/break-fix-1

## The check

The test hits between three distinct UVs and checks the blended result. Your check should reject simply returning any one vertex's UV.

<details><summary>Hint</summary>

What do the hit point’s three barycentric weights tell you about UVs?

</details>

## Where else?

Where else do values at a hit need all three triangle corners?

<details><summary>A few answers</summary>

Painting a texture, interpolating vertex colors, or reading a surface coordinate.

</details>
