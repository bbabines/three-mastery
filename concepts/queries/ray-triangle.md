---
id: queries.ray-triangle
name: Ray–triangle
domain: queries
tier: core
prerequisites: [queries.intersection-anatomy, geometry.winding-order, transforms.inverse-matrices]
misconceptions:
  barycentric-hit-only: '"Barycentrics only matter for the hit test."'
contexts:
  exact-picking: Exact picking
  uv-at-hit: UV interpolation at a hit
  backface: Back-face handling
---

## Definition

`ray.intersectTriangle(a, b, c, backfaceCulling, target)` gives the spot where a ray crosses one triangle, or `null`; raycasting a mesh runs it on every triangle and uses the hit's barycentric coordinates to blend the UV, normal, and any other vertex value at that spot.

## Space lens

The ray and the corners must be in the same space. Corners read from a geometry are measured from the object itself, so three.js moves the ray into each mesh's own space, with the inverse of its `matrixWorld`, before testing its triangles, then turns the hit point back into the world.

## Cost lens

A mesh raycast tests every triangle of every mesh whose bounding sphere the ray touches: CPU time that grows with the triangle count, on every raycast.
