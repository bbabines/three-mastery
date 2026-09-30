---
id: geometry.face-normals
name: Face normals
domain: geometry
tier: core
prerequisites: [geometry.winding-order, transforms.normal-matrix]
misconceptions:
  average-of-vertex: '"The face normal is the average of its vertex normals."'
contexts:
  flat-shading: Flat shading
  back-face-test: Back-face test against a direction
  raycast-normal: Raycast face normal
---

## Definition

A triangle's face normal is the direction of length 1 pointing straight out of its front, worked out from its three corners and their order.

## Space lens

Face normals from a geometry or a raycast are measured from the object itself, and `new Matrix3().getNormalMatrix(mesh.matrixWorld)` turns one into the world. `mesh.normalMatrix` turns it into camera space instead.
