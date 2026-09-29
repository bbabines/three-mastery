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

Scene statistics are counts gathered by walking a scene: meshes, triangles, and the unique geometries, materials, and textures, each counted once by its uuid however many meshes share it.

## Cost lens

Every mesh the camera draws is at least one draw call, CPU work to issue every frame, whether or not it shares a material with others. Unique geometries and textures are what take GPU memory; sharing saves memory, not draw calls.
