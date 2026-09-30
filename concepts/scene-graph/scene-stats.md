---
id: scene-graph.scene-stats
name: Scene statistics
domain: scene-graph
tier: light
prerequisites: [scene-graph.traverse]
misconceptions:
  shared-material-one-call: '"100 meshes sharing a material is one draw call."'
contexts:
  asset-audit: Asset audit
  before-after: Before/after optimization
  variant-compare: Variant comparison
---

## Definition

Scene statistics are counts of a scene's meshes and triangles and of its unique geometries, materials, and textures, each counted once however many meshes share it.

## Cost lens

Every mesh the camera draws is at least one draw call, CPU work every frame, whether or not it shares a material. Unique geometries and textures are what take GPU memory, so sharing saves memory, not draw calls.
