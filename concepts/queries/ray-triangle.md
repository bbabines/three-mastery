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

A ray–triangle test finds where a ray crosses one triangle, and the hit's barycentric weights then blend the values stored at its corners.

## Space lens

The ray and the corners must be in the same space. Corners from a geometry are measured from the object itself, so three.js moves the ray into each mesh's space before testing, then turns the hit back into the world.

## Cost lens

A mesh raycast tests every triangle of every mesh whose bounding sphere the ray touches: CPU time that grows with the triangle count, on every raycast.
