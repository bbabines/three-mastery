---
id: 3.geometry.tangent-space.break-and-fix.1
loop: 3
tier: core
concepts: [geometry.tangent-space]
mode: break-and-fix
context: geometry.tangent-space/low-poly-detail
lenses: []
misconceptions: [geometry.tangent-space/world-directions]
---

# Tangent space: find the faulty result

> **The job:** A normal-mapped face lights as though the map colors were fixed world directions when the part turns.

## Task

A normal-mapped face lights as though the map colors were fixed world directions when the part turns. Convert the sample from 0–1 to tangent-space −1–1, then use the TBN basis.

Fix `normalFromMap` in `drill.ts`. The scene shows the current result alongside a reference; they should agree after the repair.

<div data-scene="demo"></div>

## Your code

Fix `drill.ts`, write one sentence in `cause.md`, and replace the placeholder in `check.ts` with a regression assertion.

    npm run drill -- drills/3/geometry/tangent-space/break-fix-1

## The check

The acceptance test covers more than the scene pose. Your check must fail on the original bug and pass after the fix, using behavior instead of looking for a particular line of code.

<details><summary>Hint</summary>

Compare the named spaces and the operation from the tangent space page.

</details>

## Where else?

Where else would the same wrong assumption cause an error?

<details><summary>A few answers</summary>

A model editor, an interactive viewer, or a check before export.

</details>
