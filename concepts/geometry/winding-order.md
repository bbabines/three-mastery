---
id: geometry.winding-order
name: Winding order
domain: geometry
tier: core
prerequisites: [geometry.indexed]
misconceptions:
  normals-flip-culling: '"Flipping normals flips culling." Culling uses winding, not normals.'
contexts:
  inside-out: Inside-out imports
  mirrored: Mirrored geometry
  double-side: DoubleSide trade-offs
---

## Definition

A triangle's winding order is the order its three corners are listed in, and the side from which they run counter-clockwise is its front, the side three.js draws by default.

## Space lens

Winding is judged on screen, from wherever the camera is: the same triangle runs counter-clockwise from its front and clockwise from behind. three.js also swaps front and back for a mesh whose `matrixWorld` mirrors it.

## Cost lens

Skipping back faces saves drawing work on every closed shape. `DoubleSide` turns that off, and a transparent `DoubleSide` material is drawn twice, backs first and then fronts, as two draw calls.
