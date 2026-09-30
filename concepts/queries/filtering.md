---
id: queries.filtering
name: Filtering
domain: queries
tier: light
prerequisites: [queries.intersection-anatomy, scene-graph.traverse, scene-graph.visibility-layers]
misconceptions:
  helpers-ignored: '"Helpers are ignored automatically."'
contexts:
  ignore-helpers: Ignoring helpers
  selectable-only: Selectable parts only
  ground-only: Ground-only placement
---

## Definition

Filtering chooses which objects a raycast tests, and walking up from the mesh it hits finds the part you actually want.

## Cost lens

Every object left in is tested: a bounding-sphere check each, and triangle tests for any the ray comes near. A short target list is both more correct and cheaper than the whole scene.
