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

# Interleaved: find the faulty result

> **The job:** Dragging one vertex changes its UVs and the renderer keeps the previous position.

## Task

Dragging one vertex changes its UVs and the renderer keeps the previous position. Update the interleaved position at the vertex index and mark its shared buffer for upload.

Fix `moveInterleaved` in `drill.ts`. The scene shows the current result alongside a reference; they should agree after the repair.

<div data-scene="demo"></div>

## Your code

Fix `drill.ts`, write one sentence in `cause.md`, and replace the placeholder in `check.ts` with a regression assertion.

    npm run drill -- drills/3/geometry/interleaved/break-fix-1

## The check

The acceptance test covers more than the scene pose. Your check must fail on the original bug and pass after the fix, using behavior instead of looking for a particular line of code.

<details><summary>Hint</summary>

Compare the named spaces and the operation from the interleaved page.

</details>

## Where else?

Where else would the same wrong assumption cause an error?

<details><summary>A few answers</summary>

A model editor, an interactive viewer, or a check before export.

</details>
