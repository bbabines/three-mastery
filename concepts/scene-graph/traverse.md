---
id: scene-graph.traverse
name: Traverse variants
domain: scene-graph
tier: core
prerequisites: [transforms.object3d-tour, assets.gltf-structure]
misconceptions:
  visible-children: '"traverseVisible still visits children of hidden objects."'
contexts:
  collect-meshes: Collecting meshes
  product-root: Finding the product root from a clicked mesh
  apply-override: Applying an override
---

## Definition

Traversing runs a function on an object and everything under it, optionally skipping hidden branches, or on each parent above it up to the scene.

## Cost lens

Each walk costs CPU time for every object it reaches. That's nothing after a load or a click, but in the frame loop it's wasted: collect what you need once and keep the list.
