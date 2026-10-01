---
id: 3.scene-graph.scene-stats.break-and-fix.1
loop: 3
tier: light
concepts: [scene-graph.scene-stats, scene-graph.visibility-layers]
mode: break-and-fix
context: scene-graph.visibility-layers/per-view
lenses: []
misconceptions: []
---

# Scene audit: count the requested layer

> **The job:** A scene audit counts meshes that the current camera layer cannot draw.

## Task

The audit asks how many meshes on one layer can be shown. `visibleLayerMeshes` receives a root and a layer number. Count a mesh only when it and its ancestors are visible and that mesh's layer mask includes the requested layer.

Fix `visibleLayerMeshes` in `drill.ts`. The blue box uses layer 3; the yellow one uses layer 1. The layer-3 count is one.

<div data-scene="demo"></div>

## Your code

Fix `drill.ts`, write one sentence in `cause.md`, and replace the placeholder in `check.ts` with a regression assertion.

    npm run drill -- drills/3/scene-graph/scene-stats/break-fix-1

## The check

The test mixes layers and a hidden parent. Your check should reject a count that includes either the other layer or the hidden subtree.

<details><summary>Hint</summary>

Which layer mask and ancestor visibility conditions decide whether a mesh is actually seen?

</details>

## Where else?

Where else would counting every mesh give a misleading budget?

<details><summary>A few answers</summary>

Per-view asset audits, a minimap camera, or a before-and-after draw-call estimate.

</details>
