---
id: 3.geometry.interleaved.break-and-fix.1
loop: 3
tier: light
concepts: [geometry.interleaved, geometry.updating-buffers]
mode: break-and-fix
context: geometry.interleaved/gltf-data
lenses: []
misconceptions: [geometry.interleaved/own-array]
---

# Interleaved: a vertex drag changes UVs

> **The job:** Move one vertex in a shared position/UV buffer.

## Task

`moveInterleaved(position, index, point)` updates one position in an interleaved buffer, then marks that shared buffer for GPU upload. Each vertex stores position and UV values together. The starter writes to the flat array as though it contained positions only, changing a UV and leaving the renderer with the previous position. Keep `point` and all UVs unchanged.

In the scene, the selected vertex should move to the yellow marker without changing the texture coordinates.

<div data-scene="demo"></div>

## Your code

Fix `drill.ts`, write one sentence in `cause.md`, and replace the placeholder in `check.ts` with a regression assertion.

    npm run drill -- drills/3/geometry/interleaved/break-fix-1

## The check

The acceptance test checks the moved XYZ, unchanged UVs, and an upload version increase. Your check should reject a write into the wrong part of the shared array.

<details><summary>Hint</summary>

The interleaved page shows an attribute's offset and its shared stride. Its setter handles both; the shared data tracks upload changes.

</details>

## Where else?

Where else can packed vertex data make a flat-array write hit the wrong field?

<details><summary>A few answers</summary>

Imported glTF meshes, vertex colors packed beside positions, or a deforming mesh with UVs.

</details>
