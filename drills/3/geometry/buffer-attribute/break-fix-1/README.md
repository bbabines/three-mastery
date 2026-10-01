---
id: 3.geometry.buffer-attribute.break-and-fix.1
loop: 3
tier: core
concepts: [geometry.buffer-attribute]
mode: break-and-fix
context: geometry.buffer-attribute/read-vertex
lenses: []
misconceptions: [geometry.buffer-attribute/array-index]
---

# Buffer attribute: find the faulty result

> **The job:** A marker placed on vertex 2 lands near vertex 0.

## Task

A marker placed on vertex 2 lands near vertex 0. Read XYZ by vertex number from an attribute whose flat array stores three numbers per vertex.

Fix `vertexAt` in `drill.ts`. The scene shows the current result alongside a reference; they should agree after the repair.

<div data-scene="demo"></div>

## Your code

Fix `drill.ts`, write one sentence in `cause.md`, and replace the placeholder in `check.ts` with a regression assertion.

    npm run drill -- drills/3/geometry/buffer-attribute/break-fix-1

## The check

The acceptance test covers more than the scene pose. Your check must fail on the original bug and pass after the fix, using behavior instead of looking for a particular line of code.

<details><summary>Hint</summary>

Compare the named spaces and the operation from the buffer attribute page.

</details>

## Where else?

Where else would the same wrong assumption cause an error?

<details><summary>A few answers</summary>

A model editor, an interactive viewer, or a check before export.

</details>
