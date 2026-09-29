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

A BVH (bounding volume hierarchy) is a tree of boxes built over a mesh's triangles, so a query tests a few boxes and skips every triangle inside the boxes it misses, instead of testing them all.

## Space lens

The tree is built from the geometry, so its boxes are measured from the object itself. Moving or turning the mesh doesn't make them stale; the ray is moved into the mesh's own space, as for any raycast. Only changing the vertices does.

## Cost lens

Without a tree, a raycast tests every triangle of a mesh whose bounding sphere it touches. With one, it tests a few boxes per level and a handful of triangles. Building the tree takes CPU time and memory up front, and editing vertices needs a refit. None of it changes what drawing the mesh costs.
