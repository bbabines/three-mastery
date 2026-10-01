---
id: 3.geometry.indexed.break-and-fix.1
loop: 3
tier: core
concepts: [geometry.indexed]
mode: break-and-fix
context: geometry.indexed/memory-savings
lenses: []
misconceptions: []
---

# Indexed geometry: the wrong triangle

> **The job:** Find the three corners of a chosen mesh triangle.

## Task

`triangleAt(geometry, triangleIndex)` returns three new local-space points in winding order. An indexed mesh can reuse a position across triangles; its index buffer says which position each corner uses. The starter reads three consecutive positions instead, so the inspector outlines the wrong face. It should also work when there is no index buffer. Leave the geometry unchanged.

The blue outline should trace the same triangle as the yellow reference.

<div data-scene="demo"></div>

## Your code

Fix `drill.ts`, write one sentence in `cause.md`, and replace the placeholder in `check.ts` with a regression assertion.

    npm run drill -- drills/3/geometry/indexed/break-fix-1

## The check

The acceptance test chooses a later triangle in an indexed mesh and a triangle without indices. Your check should reject reading consecutive positions when indices differ.

<details><summary>Hint</summary>

The indexed page shows that three index entries choose the position vertices for one triangle. Check whether this geometry has an index first.

</details>

## Where else?

Where else must triangle corners follow the index buffer?

<details><summary>A few answers</summary>

Face selection, a barycentric marker, or a wireframe over an imported mesh.

</details>
