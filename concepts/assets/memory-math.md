---
id: assets.memory-math
name: Runtime memory math
domain: assets
tier: core
prerequisites: [assets.ktx2, geometry.buffer-attribute]
misconceptions:
  file-equals-memory: '"File size equals memory size."'
contexts:
  footprint: A model's footprint
  tab-crash: Mobile tab crashes
  compare-variants: Comparing variants
---

## Definition

A loaded model's memory is the bytes in its geometry arrays plus its textures' pixels, whatever the size of the file it came from.

## Cost lens

Textures cost their pixels times the bytes in each, plus a third for mipmaps, and geometry costs the bytes in its arrays. Both sit in GPU memory, and three.js keeps a copy in JavaScript memory too.
