---
id: 3.queries.ray.break-and-fix.1
loop: 3
tier: light
concepts: [queries.ray, queries.ray-sphere]
mode: break-and-fix
context: queries.ray-sphere/coarse-hit
lenses: []
misconceptions: []
---

# Ray and sphere: return the surface point

> **The job:** A coarse pointer hit returns the ray origin instead of the sphere surface, especially when the ray starts inside the sphere.

## Task

A coarse pick says the ray crosses a sphere, but the marker appears at the pointer ray's origin. Return the first surface point along the forward ray, or `null` when it misses. A ray starting inside exits through the far side.

Fix `sphereEntry` in `drill.ts`. The yellow dot sits on the sphere surface; your result is red.

<div data-scene="demo"></div>

## Your code

Fix `drill.ts`, write one sentence in `cause.md`, and replace the placeholder in `check.ts` with a regression assertion.

    npm run drill -- drills/3/queries/ray/break-fix-1

## The check

The test starts rays outside and inside the sphere, and includes a miss. Your check should require the returned point to lie on the surface.

<details><summary>Hint</summary>

What point does an intersection test return, and how does it differ from a yes-or-no test?

</details>

## Where else?

Where else do you need the hit point rather than a yes-or-no overlap?

<details><summary>A few answers</summary>

Hotspot placement, measuring distance to a round part, or a broad collision test.

</details>
