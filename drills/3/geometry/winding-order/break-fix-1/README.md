---
id: 3.geometry.winding-order.break-and-fix.1
loop: 3
tier: core
concepts: [geometry.winding-order]
mode: break-and-fix
context: geometry.winding-order/inside-out
lenses: []
misconceptions: [geometry.winding-order/normals-flip-culling]
---

# Winding order: an inside-out part

> **The job:** Reverse which side of a triangle counts as its front.

## Task

An imported panel faces the wrong way. Its normals were flipped for lighting, but the renderer still hides the panel from the side that should be visible. Fix `flipFrontFace` so it returns a geometry with reversed winding and matching normals. Keep each corner's UV with its position, and leave the input alone. The input may be indexed or non-indexed.

In the scene, your triangle is on the left and the reference is on the right. Switch between front and back: both should disappear from the front and show from the back. The yellow outlines mark their locations.

<div data-scene="demo"></div>

## Your code

Fix `drill.ts`, write one sentence in `cause.md`, and replace the placeholder in `check.ts` with a regression assertion.

    npm run drill -- drills/3/geometry/winding-order/break-fix-1

## The check

The acceptance test checks both indexed and non-indexed geometry, UVs, normals, and the visible side. Write a short check that raycasts a front-side triangle from both sides; it should reject the original bug.

<details><summary>Hint</summary>

The winding order page shows which corner order counts as the front. Flipping a normal changes lighting, but does it change back-face culling?

</details>

## Where else?

Where else could flipped normals leave a surface invisible?

<details><summary>A few answers</summary>

A mirrored mesh import, an inside-out room, or a reversed face on a collision marker.

</details>
