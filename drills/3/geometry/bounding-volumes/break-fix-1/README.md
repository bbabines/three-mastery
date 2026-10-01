---
id: 3.geometry.bounding-volumes.break-and-fix.1
loop: 3
tier: light
concepts: [geometry.bounding-volumes]
mode: break-and-fix
context: geometry.bounding-volumes/culling
lenses: []
misconceptions: []
---

# Bounding volumes: find the faulty result

> **The job:** After a direct vertex edit, the part can disappear because its old bounding sphere no longer covers the new position.

## Task

After a direct vertex edit, the part can disappear because its old bounding sphere no longer covers the new position. Return a current local-space sphere after the edit.

Fix `deformAndBound` in `drill.ts`. The scene shows the current result alongside a reference; they should agree after the repair.

<div data-scene="demo"></div>

## Your code

Fix `drill.ts`, write one sentence in `cause.md`, and replace the placeholder in `check.ts` with a regression assertion.

    npm run drill -- drills/3/geometry/bounding-volumes/break-fix-1

## The check

The acceptance test covers more than the scene pose. Your check must fail on the original bug and pass after the fix, using behavior instead of looking for a particular line of code.

<details><summary>Hint</summary>

Compare the named spaces and the operation from the bounding volumes page.

</details>

## Where else?

Where else would the same wrong assumption cause an error?

<details><summary>A few answers</summary>

A model editor, an interactive viewer, or a check before export.

</details>
