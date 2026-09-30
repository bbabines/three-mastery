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

A clone is a new object with its own placement and its own copies of the children, but every cloned mesh shares the original's geometry, material, and textures.

## Cost lens

A plain clone costs a few new objects on the CPU and a draw call per mesh, but no new GPU memory. Cloning a copy's materials adds small material objects, and cloning its geometry adds that vertex data to GPU memory.
