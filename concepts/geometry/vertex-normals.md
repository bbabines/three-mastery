---
id: geometry.vertex-normals
name: Vertex normals
domain: geometry
tier: core
prerequisites: [geometry.face-normals, geometry.indexed]
misconceptions:
  imported-right: '"Imported normals are always right."'
contexts:
  smoothing-artifacts: Smoothing artifacts
  low-poly: Low-poly look
  fix-normals: Fixing bad normals
---

## Definition

Vertex normals are the directions stored at each vertex for lighting, usually the average of the face normals of the triangles that share the vertex, so a hard edge needs separate vertices, each with its own normal.

## Space lens

The `normal` attribute is measured from the object itself. `computeVertexNormals` works them out from the positions and the corner order, so an inside-out mesh gets normals pointing inward.

## Cost lens

A normal costs 12 bytes per vertex as 32-bit floats. Hard edges need split vertices, and `toCreasedNormals` returns a geometry with no index, so crisp edges cost memory.
