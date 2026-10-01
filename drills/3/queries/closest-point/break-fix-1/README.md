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

# Closest point: find the faulty result

> **The job:** A snap marker slides beyond the end of a short rail.

## Task

A snap marker slides beyond the end of a short rail. Return the closest point on the finite segment, not its endless supporting line.

Fix `segmentSnap` in `drill.ts`. The scene shows the current result alongside a reference; they should agree after the repair.

<div data-scene="demo"></div>

## Your code

Fix `drill.ts`, write one sentence in `cause.md`, and replace the placeholder in `check.ts` with a regression assertion.

    npm run drill -- drills/3/queries/closest-point/break-fix-1

## The check

The acceptance test covers more than the scene pose. Your check must fail on the original bug and pass after the fix, using behavior instead of looking for a particular line of code.

<details><summary>Hint</summary>

Does a rail continue beyond either endpoint?

</details>

## Where else?

Where else would the same wrong assumption cause an error?

<details><summary>A few answers</summary>

Distance measurement; Proximity hover.

</details>
