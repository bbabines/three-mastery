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

# Rotated box: the world ray misses

> **The job:** A click misses a rotated part because its local axis-aligned box is tested against a world ray.

## Task

A part's box is in its own space, while the pointer ray is in world space. Use `boxToWorld` to bring them into one space for the test. Return the first forward hit in world space, or `null` on a miss.

Fix `rotatedBoxHit` in `drill.ts`. The yellow dot marks the world-space entry on the wire box; your hit is red.

<div data-scene="demo"></div>

## Your code

Fix `drill.ts`, write one sentence in `cause.md`, and replace the placeholder in `check.ts` with a regression assertion.

    npm run drill -- drills/3/queries/ray-aabb/break-fix-1

## The check

The test turns and moves the box before sending a ray through it. Your check should reject a point that is still in the box's local space.

<details><summary>Hint</summary>

Are the ray and the box expressed in the same coordinate frame?

</details>

## Where else?

Where else must a query and its target use the same space?

<details><summary>A few answers</summary>

Rotated part picking, a local collision proxy, or a box test inside a BVH.

</details>
