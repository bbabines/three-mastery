---
id: geometry.buffer-attribute
name: BufferAttribute and itemSize
domain: geometry
tier: core
prerequisites: [transforms.local-vs-world]
misconceptions:
  array-index: '"Array index equals vertex index."'
contexts:
  read-vertex: Reading vertex 7's position
  color-attribute: Writing a color attribute
  custom-data: Custom per-vertex data
---

## Definition

A BufferAttribute holds one kind of per-vertex data in a single flat typed array, and its item size says how many of those numbers belong to each vertex.

## Space lens

The values in `geometry.attributes.position` are measured from the object itself. `mesh.localToWorld(v)` turns one into the world.

## Cost lens

Every number is stored on the CPU and uploaded to GPU memory. Position, normal, and UV as 32-bit floats cost 32 bytes per vertex.
