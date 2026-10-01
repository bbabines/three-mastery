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

# BVH: skip boxes the ray misses

> **The job:** A bounds hierarchy visits every triangle leaf even when the pointer ray misses most branches.

## Task

A bounds tree has a world-space `Box3` in each node's `userData.box`. Visit a child only when the ray crosses its box. Return the leaf nodes reached; a missed branch can be skipped with all its descendants.

Fix `candidateLeaves` in `drill.ts`. The yellow ray crosses only the left box. A selected candidate gets a red outline.

<div data-scene="demo"></div>

## Your code

Fix `drill.ts`, write one sentence in `cause.md`, and replace the placeholder in `check.ts` with a regression assertion.

    npm run drill -- drills/3/queries/bvh/break-fix-1

## The check

The test gives the tree a branch the ray misses. Your check should reject a candidate list that includes leaves under that branch.

<details><summary>Hint</summary>

At which branch can a ray miss be used to skip all descendants?

</details>

## Where else?

Where else can a missed parent box save work below it?

<details><summary>A few answers</summary>

Picking a dense model, a broad collision search, or querying nearby terrain tiles.

</details>
