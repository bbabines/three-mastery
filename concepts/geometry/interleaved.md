---
id: geometry.interleaved
name: Interleaved attributes
domain: geometry
tier: light
prerequisites: [geometry.buffer-attribute]
misconceptions:
  own-array: '"Every attribute has its own array."'
contexts:
  gltf-data: Reading loaded glTF data
  manual-edits: Manual vertex edits
  cache-friendly: Cache-friendly layouts
---

## Definition

Interleaved attributes share one buffer that holds each vertex's data together, and each attribute finds its own numbers with the buffer's stride, the count of numbers per vertex, and its own offset, where its numbers start within each vertex.

## Cost lens

The same numbers take the same memory either way. Interleaving changes the layout: one buffer to upload instead of several, and changing any one attribute re-uploads the whole shared buffer unless you mark an update range.
