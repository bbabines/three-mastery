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

# Scene stats: find the faulty result

> **The job:** A scene audit counts meshes that the current camera layer cannot draw.

## Task

A scene audit counts meshes that the current camera layer cannot draw. Count only visible meshes on the requested layer.

Fix `visibleLayerMeshes` in `drill.ts`. The scene shows the current result alongside a reference; they should agree after the repair.

<div data-scene="demo"></div>

## Your code

Fix `drill.ts`, write one sentence in `cause.md`, and replace the placeholder in `check.ts` with a regression assertion.

    npm run drill -- drills/3/scene-graph/scene-stats/break-fix-1

## The check

The acceptance test covers more than the scene pose. Your check must fail on the original bug and pass after the fix, using behavior instead of looking for a particular line of code.

<details><summary>Hint</summary>

Which layer mask and ancestor visibility conditions decide whether a mesh is actually seen?

</details>

## Where else?

Where else would the same wrong assumption cause an error?

<details><summary>A few answers</summary>

Before/after optimization; Variant comparison.

</details>
