---
id: queries.intersection-anatomy
name: Intersection anatomy
domain: queries
tier: core
prerequisites: [queries.ray-from-pointer, geometry.face-normals, geometry.uvs]
misconceptions:
  face-normal-world: '"face.normal is in world space."'
  first-visible: '"The first hit is the visible one."'
contexts:
  orient-marker: Orienting a marker
  paint-uv: Painting at a UV
  pick-instance: Picking an instance
---

## Definition

A raycast returns a list of hits sorted nearest first, and each hit describes where the ray met an object and which part of it.

## Space lens

`hit.point` and `hit.distance` are in the world, while `hit.face.normal` and `hit.normal` are measured from the hit object itself. `hit.uv` is a spot on the texture, 0 to 1 across and up.

## Cost lens

Each mesh in the list costs a quick check against its bounding sphere, and only the meshes that pass pay for a test of every triangle, all on the CPU.
