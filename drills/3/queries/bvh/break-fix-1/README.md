---
id: 3.queries.bvh.break-and-fix.1
loop: 3
tier: core
concepts: [queries.bvh]
mode: break-and-fix
context: queries.bvh/high-poly-picking
lenses: []
misconceptions: []
---

# Bvh: find the faulty result

> **The job:** A bounds hierarchy visits every triangle leaf even when the pointer ray misses most branches.

## Task

A bounds hierarchy visits every triangle leaf even when the pointer ray misses most branches. Collect only leaf nodes whose stored local Box3 the ray intersects.

Fix `candidateLeaves` in `drill.ts`. The scene shows the current result alongside a reference; they should agree after the repair.

<div data-scene="demo"></div>

## Your code

Fix `drill.ts`, write one sentence in `cause.md`, and replace the placeholder in `check.ts` with a regression assertion.

    npm run drill -- drills/3/queries/bvh/break-fix-1

## The check

The acceptance test covers more than the scene pose. Your check must fail on the original bug and pass after the fix, using behavior instead of looking for a particular line of code.

<details><summary>Hint</summary>

At which branch can a ray miss be used to skip all descendants?

</details>

## Where else?

Where else would the same wrong assumption cause an error?

<details><summary>A few answers</summary>

Shape casts; Collision queries.

</details>
