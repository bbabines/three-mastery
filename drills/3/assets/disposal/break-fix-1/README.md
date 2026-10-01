---
id: 3.assets.disposal.break-and-fix.1
loop: 3
tier: core
concepts: [assets.disposal]
mode: break-and-fix
context: assets.disposal/spa-route
lenses: [cost]
misconceptions:
  - assets.disposal/remove-frees
---

# Disposal: a route that leaves GPU resources behind

> **The job:** release the resources owned by a product scene when its route closes.

## Task

`retireProduct(root)` receives a self-contained product subtree. Its geometries, materials, and color or normal textures are owned only by that subtree. The starter removes the subtree, but repeated route visits keep its GPU resources alive.

Fix the cleanup without disposing the same shared-within-the-subtree resource twice. Write the cause in `cause.md` and a regression assertion in `check.ts`.

<div data-scene="routeCleanup"></div>

## Measure

Watch geometry and texture counts in `renderer.info.memory` across repeated load and unload visits. Counts should return to their baseline after resources have been used and released. Material disposal needs an event check because `renderer.info.memory` does not count materials.

## Your code

Edit `drills/3/assets/disposal/break-fix-1/drill.ts`, `cause.md`, and `check.ts`.

    npm run drill -- drills/3/assets/disposal/break-fix-1

## The check

The acceptance test checks removal plus one disposal event per owned geometry, material, and texture, even when two meshes use the same resources. The regression check must catch a removal-only implementation.

<details><summary>Hint</summary> Removing an Object3D changes the scene graph; it does not free the WebGL allocations behind its resources. </details>

## Where else?

Where else should resource ownership be explicit?

<details><summary>A few answers</summary> Variant switches, abandoned previews, and a long-lived single-page app. </details>
