---
id: 3.queries.closest-point.break-and-fix.1
loop: 3
tier: light
concepts: [queries.closest-point]
mode: break-and-fix
context: queries.closest-point/edge-snap
lenses: []
misconceptions: []
---

# Closest point: a snap beyond the rail

> **The job:** A snap marker slides beyond the end of a short rail.

## Task

A rail runs from `a` to `b`, and the pointer is past an end. Return the point on the finite rail nearest to the pointer, without moving any input vector.

Fix `segmentSnap` in `drill.ts`. The yellow marker stays at the rail end; your result is red.

<div data-scene="demo"></div>

## Your code

Fix `drill.ts`, write one sentence in `cause.md`, and replace the placeholder in `check.ts` with a regression assertion.

    npm run drill -- drills/3/queries/closest-point/break-fix-1

## The check

The test puts the pointer beyond both ends of an angled segment and checks the returned point. Your check should reject a point outside the segment.

<details><summary>Hint</summary>

Does a rail continue beyond either endpoint?

</details>

## Where else?

Where else does a finite edge need a clamped closest point?

<details><summary>A few answers</summary>

Edge snapping, a short slider track, or measuring from a part to a rail.

</details>
