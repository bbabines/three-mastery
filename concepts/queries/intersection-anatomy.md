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

A raycast returns an array of hits, nearest first, and each hit says how far along the ray it is, where it is in the world, and which object, triangle, texture spot, and instance it landed on.

## Space lens

`hit.point` and `hit.distance` are in the world. `hit.face.normal` and `hit.normal` are measured from the hit object itself, because three.js moves the ray into each object's own space to test its triangles. `hit.uv` is a spot on the texture, 0 to 1 across and up.

## Cost lens

Each mesh in the list costs a bounding-sphere test. Only meshes whose sphere the ray hits pay for a matrix inverse and a test against every triangle. It's all CPU work, done before the call returns.
