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

`traverse` runs a function on an object and on everything under it, `traverseVisible` does the same but skips hidden objects and everything under them, and `traverseAncestors` runs it on each parent above an object, up to the scene.

## Cost lens

Every call visits each object it reaches, one at a time, on the CPU, so its cost grows with the number of objects. That's nothing when a model loads or a user clicks, and wasteful in the frame loop: collect what you need once and keep the list.
