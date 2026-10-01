---
id: 3.optimization.culling-lod.break-and-fix.1
loop: 3
tier: light
concepts: [optimization.culling-lod, optimization.shader-cost]
mode: break-and-fix
context: optimization.culling-lod/large-scenes
lenses: [cost]
misconceptions: []
---

# Culling and material cost: distant parts stay expensive

> **The job:** hide out-of-view parts and use a cheaper material for small distant parts.

## Task

`configurePart` already tests an object's world bounds against the camera frustum, so whole off-screen parts disappear. A visible part far down a long aisle still uses a transmission-enabled `MeshPhysicalMaterial`, even though it covers few pixels. The caller provides a cheaper material and the distance where it should take over. Repair that choice, name the mistaken assumption in `cause.md`, and write the check.

<div data-scene="partCost"></div>

## Measure

Record visible-object and draw-call counts plus frame time for near, distant, and off-screen parts. Use `renderer.info` for draw calls and Chrome's Performance panel for time. The acceptance check targets material selection, not a noisy frame-time threshold.

## Your code

Edit `drills/3/optimization/culling-lod/break-fix-1/drill.ts`, `cause.md`, and `check.ts`.

    npm run drill -- drills/3/optimization/culling-lod/break-fix-1

## The check

Near parts keep the detailed material, distant visible parts switch to the cheap one, and out-of-view parts are culled as whole objects.

<details><summary>Hint</summary> A frustum test answers visibility, while distance answers which visible version is worth shading. </details>

## Where else?

What if one large instanced mesh has a few nearby parts and many distant parts?

<details><summary>A few answers</summary> Its shared bounds may keep all instances visible; split distant groups or use instanced LOD, then measure the material and draw costs. </details>
