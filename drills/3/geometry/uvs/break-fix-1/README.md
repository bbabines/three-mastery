---
id: 3.geometry.uvs.break-and-fix.1
loop: 3
tier: light
concepts: [geometry.uvs, geometry.groups]
mode: break-and-fix
context: geometry.groups/material-index
lenses: []
misconceptions: []
---

# UVs and groups: restore the decal face

> **The job:** Move one triangle to a different texture tile and draw it with the decal material.

## Task

An indexed panel shares vertices between triangles. Its first triangle has the right UV offset, but the decal material does not cover the whole face. Fix `tileFirstFace` so it returns a new geometry: only the first triangle's UVs move by `offset`, that triangle uses material slot 1, and every remaining triangle uses slot 0. Keep the input geometry and offset unchanged.

In the scene, the decal triangle should be green and the rest red. A group count is a count of index entries or vertices, not triangles.

<div data-scene="demo"></div>

## Your code

Fix `drill.ts`, write one sentence in `cause.md`, and replace the placeholder in `check.ts` with a regression assertion.

    npm run drill -- drills/3/geometry/uvs/break-fix-1

## The check

The acceptance test checks every triangle's UVs, both material groups, and the unchanged inputs. Write a check that would reject a group covering only part of the first triangle.

<details><summary>Hint</summary>

Check how many index entries or vertices make one triangle. The UVs page shows why shared indexed vertices need separate corners when only one face changes.

</details>

## Where else?

Where else would a too-short material group leave a visible gap?

<details><summary>A few answers</summary>

A highlighted face in a mesh editor, a selected terrain tile, or one material strip on a product model.

</details>
