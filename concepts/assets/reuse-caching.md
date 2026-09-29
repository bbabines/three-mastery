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

Each load of a file builds a complete new copy of everything in it, so load each file once and reuse the result, cloning it where it's needed, since clones share the original's geometry, materials, and textures.

## Cost lens

A second load of the same URL costs another decode and another full copy in memory, even when the browser skips the download. A clone costs a few objects on the CPU and a draw call per mesh, and no new GPU memory.
