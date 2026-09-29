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

A loaded model's memory is the bytes in its geometry arrays plus the bytes of its textures' pixels, set by vertex counts, pixel counts, and formats, not by the size of the file it came from.

## Cost lens

Textures cost width × height × bytes per pixel, plus a third for mipmaps; geometry costs the byte length of every attribute and index array. Both sit in GPU memory, and three.js also keeps the arrays and images in JavaScript memory after uploading them.
