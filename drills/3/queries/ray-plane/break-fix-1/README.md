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

# Ray and plane: a marker behind the pointer

> **The job:** A floor-drag marker appears even when the pointer ray points away from the floor.

## Task

A floor drag puts a marker on the plane even when the pointer ray points away. `planeHit` should return the forward ray-plane hit, or `null` for a parallel ray or a hit behind the origin.

Fix `planeHit` in `drill.ts`. Switch between rays toward and away from the blue plane. Only the first should show a yellow hit.

<div data-scene="demo"></div>

## Your code

Fix `drill.ts`, write one sentence in `cause.md`, and replace the placeholder in `check.ts` with a regression assertion.

    npm run drill -- drills/3/queries/ray-plane/break-fix-1

## The check

The test checks a forward hit and a ray pointing away. Your check should reject a projected point when the ray has no forward intersection.

<details><summary>Hint</summary>

Can the plane projection of the origin lie behind the ray?

</details>

## Where else?

Where else can a plane be present but unreachable by the ray?

<details><summary>A few answers</summary>

Wall placement, a floor grid, or measuring along a pointing ray.

</details>
