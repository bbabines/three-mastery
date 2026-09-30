---
id: assets.reuse-caching
name: Reuse and caching
domain: assets
tier: light
prerequisites: [assets.memory-math]
misconceptions:
  same-url-free: '"Loading the same URL twice is free."'
contexts:
  repeated-parts: Repeated parts
  variant-swaps: Variant swaps
  duplicate-load-leaks: Duplicate-load leaks
---

## Definition

Every load of a file builds a complete new copy, while a clone of a loaded model shares its geometry, materials, and textures.

## Cost lens

A second load of the same URL costs another decode and another full copy in memory. A clone costs a few objects and a draw call per mesh, and no new GPU memory.
