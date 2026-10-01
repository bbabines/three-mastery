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

# Filtering: find the faulty result

> **The job:** A helper box steals a pick from a selectable part.

## Task

A helper box steals a pick from a selectable part. Each object has a world Box3 in userData.bounds; return the nearest box hit among objects tagged selectable.

Fix `selectableBoxHit` in `drill.ts`. The scene shows the current result alongside a reference; they should agree after the repair.

<div data-scene="demo"></div>

## Your code

Fix `drill.ts`, write one sentence in `cause.md`, and replace the placeholder in `check.ts` with a regression assertion.

    npm run drill -- drills/3/queries/filtering/break-fix-1

## The check

The acceptance test covers more than the scene pose. Your check must fail on the original bug and pass after the fix, using behavior instead of looking for a particular line of code.

<details><summary>Hint</summary>

Which candidates are allowed to compete for the nearest hit?

</details>

## Where else?

Where else would the same wrong assumption cause an error?

<details><summary>A few answers</summary>

Ignoring helpers; Ground-only placement.

</details>
