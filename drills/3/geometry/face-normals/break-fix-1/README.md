---
id: 3.geometry.face-normals.break-and-fix.1
loop: 3
tier: core
concepts: [geometry.face-normals]
mode: break-and-fix
context: geometry.face-normals/flat-shading
lenses: []
misconceptions: []
---

# Face normals: find the faulty result

> **The job:** A marker aligned to a hit face tilts after the part is stretched unevenly.

## Task

A marker aligned to a hit face tilts after the part is stretched unevenly. Return its geometric face normal in world space.

Fix `worldFaceNormal` in `drill.ts`. The scene shows the current result alongside a reference; they should agree after the repair.

<div data-scene="demo"></div>

## Your code

Fix `drill.ts`, write one sentence in `cause.md`, and replace the placeholder in `check.ts` with a regression assertion.

    npm run drill -- drills/3/geometry/face-normals/break-fix-1

## The check

The acceptance test covers more than the scene pose. Your check must fail on the original bug and pass after the fix, using behavior instead of looking for a particular line of code.

<details><summary>Hint</summary>

Compare the named spaces and the operation from the face normals page.

</details>

## Where else?

Where else would the same wrong assumption cause an error?

<details><summary>A few answers</summary>

A model editor, an interactive viewer, or a check before export.

</details>
