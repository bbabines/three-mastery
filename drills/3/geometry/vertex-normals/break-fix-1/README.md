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

# Vertex normals: the hard edge stays smooth

> **The job:** Give each flat face its own lighting normal.

## Task

`flatNormals(geometry)` returns a new geometry that shades each triangle as a flat face. The starter recomputes normals on indexed geometry, where neighboring faces still share vertices and their normals are averaged. Give the faces separate vertices before rebuilding their normals, and leave the input geometry unchanged.

The scene should show a clear hard edge between faces, like the reference part.

<div data-scene="demo"></div>

## Your code

Fix `drill.ts`, write one sentence in `cause.md`, and replace the placeholder in `check.ts` with a regression assertion.

    npm run drill -- drills/3/geometry/vertex-normals/break-fix-1

## The check

The acceptance test checks that adjacent faces have separate corner normals and the original geometry is unchanged. Your check should reject smooth shared normals.

<details><summary>Hint</summary>

The vertex-normals page shows why `computeVertexNormals` averages at a shared index. It also shows how to give faces their own corners.

</details>

## Where else?

Where else should a sharp edge stay sharp after rebuilding normals?

<details><summary>A few answers</summary>

Low-poly props, a beveled panel, or a cut edge on an imported mesh.

</details>
