---
id: 3.queries.filtering.break-and-fix.1
loop: 3
tier: light
concepts: [queries.filtering, queries.bounds-primitives]
mode: break-and-fix
context: queries.filtering/selectable-only
lenses: []
misconceptions: [queries.filtering/helpers-ignored]
---

# Pick filtering: a helper steals the hit

> **The job:** A helper box steals a pick from a selectable part.

## Task

The ray crosses a helper before it reaches a selectable part. Each candidate has a world-space `Box3` in `userData.bounds`. Return the nearest hit whose `userData.selectable` is true, or `null` if there is none.

Fix `selectableBoxHit` in `drill.ts`. The yellow wire box is a helper; the solid part should turn green when picked.

<div data-scene="demo"></div>

## Your code

Fix `drill.ts`, write one sentence in `cause.md`, and replace the placeholder in `check.ts` with a regression assertion.

    npm run drill -- drills/3/queries/filtering/break-fix-1

## The check

The test places a closer helper ahead of a selectable box and checks which object wins. Your check should include an unselectable object with a nearer hit.

<details><summary>Hint</summary>

Which candidates are allowed to compete for the nearest hit?

</details>

## Where else?

Where else should a visible object be excluded from picking?

<details><summary>A few answers</summary>

Editor handles, floor-only placement, or a ghost preview in front of a product.

</details>
