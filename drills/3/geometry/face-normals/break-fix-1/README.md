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

# Face normals: a tilted surface marker

> **The job:** Keep a face marker perpendicular to a stretched surface.

## Task

`worldFaceNormal(a, b, c, matrixWorld)` returns a unit world-space normal for a triangle with local-space corners `a`, `b`, and `c`. The part can be rotated and stretched unevenly. The starter transforms the normal like an ordinary direction, so a marker tilts away from the face. Leave the corners and matrix unchanged.

The blue normal arrow should line up with the green reference on the stretched triangle.

<div data-scene="demo"></div>

## Your code

Fix `drill.ts`, write one sentence in `cause.md`, and replace the placeholder in `check.ts` with a regression assertion.

    npm run drill -- drills/3/geometry/face-normals/break-fix-1

## The check

The acceptance test uses a sloped triangle under non-uniform scale and compares against its transformed edges. Your check should reject a normal that is no longer perpendicular.

<details><summary>Hint</summary>

The face-normals page uses `Triangle.getNormal` for the local face. Under uneven scale, its world direction needs the normal-specific matrix.

</details>

## Where else?

Where else must a normal stay perpendicular after a stretch?

<details><summary>A few answers</summary>

A surface decal, a contact shadow, or a selection ring on a sloped part.

</details>
