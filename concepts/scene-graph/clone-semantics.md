---
id: scene-graph.clone-semantics
name: Clone semantics
domain: scene-graph
tier: core
prerequisites: [assets.reuse-caching, scene-graph.traverse]
misconceptions:
  clone-color-only: '"Changing a clone''s material color affects only the clone."'
contexts:
  per-instance-color: Per-instance color bug
  variant-duplication: Variant duplication
  memory-audit: Memory audit
---

## Definition

`clone()` makes new objects with their own position, rotation, scale, and children, but every cloned mesh shares the original's geometry and material, and through the material its textures.

## Cost lens

A plain clone costs a few new objects on the CPU and one more draw call per mesh, and no new GPU memory. Cloning a copy's materials adds a small material object per mesh; cloning its geometry adds that geometry's vertex data to GPU memory.
