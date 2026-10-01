---
id: 3.geometry.object-types-tour.break-and-fix.1
loop: 3
tier: light
concepts: [geometry.object-types-tour, geometry.instanced-mesh]
mode: break-and-fix
context: geometry.object-types-tour/rack-shelves
lenses: []
misconceptions: []
---

# Object types tour: find the faulty result

> **The job:** Moving one repeated shelf moves every shelf together.

## Task

Moving one repeated shelf moves every shelf together. Update only the chosen instance pose, not the InstancedMesh object transform.

Fix `placeInstance` in `drill.ts`. The scene shows the current result alongside a reference; they should agree after the repair.

<div data-scene="demo"></div>

## Your code

Fix `drill.ts`, write one sentence in `cause.md`, and replace the placeholder in `check.ts` with a regression assertion.

    npm run drill -- drills/3/geometry/object-types-tour/break-fix-1

## The check

The acceptance test covers more than the scene pose. Your check must fail on the original bug and pass after the fix, using behavior instead of looking for a particular line of code.

<details><summary>Hint</summary>

Compare the named spaces and the operation from the object types tour page.

</details>

## Where else?

Where else would the same wrong assumption cause an error?

<details><summary>A few answers</summary>

A model editor, an interactive viewer, or a check before export.

</details>
