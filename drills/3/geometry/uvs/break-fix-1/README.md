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

# Uvs: find the faulty result

> **The job:** A decal uses the shifted texture tile but the first triangle still draws with material slot zero.

## Task

A decal uses the shifted texture tile but the first triangle still draws with material slot zero. Copy the mesh, shift the first face UVs, and assign that face to slot one.

Fix `tileFirstFace` in `drill.ts`. The scene shows the current result alongside a reference; they should agree after the repair.

<div data-scene="demo"></div>

## Your code

Fix `drill.ts`, write one sentence in `cause.md`, and replace the placeholder in `check.ts` with a regression assertion.

    npm run drill -- drills/3/geometry/uvs/break-fix-1

## The check

The acceptance test covers more than the scene pose. Your check must fail on the original bug and pass after the fix, using behavior instead of looking for a particular line of code.

<details><summary>Hint</summary>

Compare the named spaces and the operation from the uvs page.

</details>

## Where else?

Where else would the same wrong assumption cause an error?

<details><summary>A few answers</summary>

A model editor, an interactive viewer, or a check before export.

</details>
