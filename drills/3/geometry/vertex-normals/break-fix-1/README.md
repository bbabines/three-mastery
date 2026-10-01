---
id: 3.geometry.vertex-normals.break-and-fix.1
loop: 3
tier: core
concepts: [geometry.vertex-normals]
mode: break-and-fix
context: geometry.vertex-normals/smoothing-artifacts
lenses: []
misconceptions: []
---

# Vertex normals: find the faulty result

> **The job:** A low-poly part still shades smoothly across a hard corner after its vertex normals are rebuilt.

## Task

A low-poly part still shades smoothly across a hard corner after its vertex normals are rebuilt. Return a separate-vertex copy with flat per-face normals.

Fix `flatNormals` in `drill.ts`. The scene shows the current result alongside a reference; they should agree after the repair.

<div data-scene="demo"></div>

## Your code

Fix `drill.ts`, write one sentence in `cause.md`, and replace the placeholder in `check.ts` with a regression assertion.

    npm run drill -- drills/3/geometry/vertex-normals/break-fix-1

## The check

The acceptance test covers more than the scene pose. Your check must fail on the original bug and pass after the fix, using behavior instead of looking for a particular line of code.

<details><summary>Hint</summary>

Compare the named spaces and the operation from the vertex normals page.

</details>

## Where else?

Where else would the same wrong assumption cause an error?

<details><summary>A few answers</summary>

A model editor, an interactive viewer, or a check before export.

</details>
