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

# Buffer attribute: the wrong vertex

> **The job:** Read the XYZ position of a named vertex.

## Task

`vertexAt(positions, vertexIndex)` returns a new `Vector3` for one vertex in a position attribute with three numbers per vertex. The starter treats a vertex index as an offset into the flat number array, so a marker aimed at vertex 2 lands near vertex 0. Do not change the attribute.

The scene marks the chosen vertex. Your blue marker should land on its yellow reference.

<div data-scene="demo"></div>

## Your code

Fix `drill.ts`, write one sentence in `cause.md`, and replace the placeholder in `check.ts` with a regression assertion.

    npm run drill -- drills/3/geometry/buffer-attribute/break-fix-1

## The check

The acceptance test reads several vertices with distinct coordinates and checks the input stays unchanged. Your check should reject flat-array indexing by vertex number.

<details><summary>Hint</summary>

The buffer-attribute page shows that an attribute's `getX`, `getY`, and `getZ` accept vertex numbers, while its underlying array stores components.

</details>

## Where else?

Where else would confusing vertex number with array offset move a result?

<details><summary>A few answers</summary>

Mesh inspection, placing a joint on a vertex, or labeling a picked corner.

</details>
