---
id: geometry.indexed
name: Indexed vs non-indexed
domain: geometry
tier: core
prerequisites: [geometry.buffer-attribute]
misconceptions:
  shared-normals: '"Shared vertices can have different normals."'
contexts:
  memory-savings: Memory savings
  flat-shading: Flat shading
  per-face-colors: Per-face colors
---

## Definition

An index lists three vertex numbers for each triangle so that triangles can share vertices, while a geometry without one gives every triangle its own three.

## Cost lens

An index number costs 2 or 4 bytes, far less than the 32 bytes of a vertex with position, normal, and UV, so sharing usually makes a smooth mesh several times smaller. A shared vertex has one normal, one UV, and one color, so hard edges, seams, and per-face colors need split vertices, which cost memory.
