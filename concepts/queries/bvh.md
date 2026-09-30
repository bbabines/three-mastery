---
id: queries.bvh
name: BVH
domain: queries
tier: core
prerequisites: [queries.ray-triangle, queries.ray-aabb]
misconceptions:
  speeds-everything: '"A BVH speeds up everything." It helps large meshes, costs build time, and needs a refit after edits.'
contexts:
  high-poly-picking: High-poly picking
  shape-casts: Shape casts
  collision: Collision queries
---

## Definition

A BVH (bounding volume hierarchy) is a tree of boxes built over a mesh's triangles, so a query can rule out whole groups of triangles with one box test.

## Space lens

The tree's boxes are measured from the object itself, so moving or turning the mesh doesn't make them stale; only changing the vertices does.

## Cost lens

With a tree, a raycast tests a few boxes per level and a handful of triangles instead of every triangle. Building it takes CPU time and memory up front, and it doesn't change what drawing the mesh costs.
