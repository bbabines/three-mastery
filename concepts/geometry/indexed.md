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

An index is a list of vertex numbers, three per triangle, that lets triangles share vertices; without one, every triangle carries its own three vertices.

## Cost lens

Position, normal, and UV as 32-bit floats cost 32 bytes per vertex, and each index number costs 2 bytes (Uint16) or 4 (Uint32); a loaded glTF can also use 1-byte indices. Sharing vertices usually makes a smooth mesh several times smaller, and means fewer vertices for the GPU's vertex stage to process. A shared vertex has only one normal, one UV, and one color, so hard edges, seams, and per-face colors need their vertices split.
