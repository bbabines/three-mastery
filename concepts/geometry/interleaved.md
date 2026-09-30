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

Interleaved attributes share one buffer that keeps each vertex's data together, so each attribute needs a stride and an offset to find its own numbers.

## Cost lens

The same numbers take the same memory either way. Changing any one attribute re-uploads the whole shared buffer, unless you mark an update range.
