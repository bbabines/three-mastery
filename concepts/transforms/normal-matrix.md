---
id: transforms.normal-matrix
name: Normal matrix
domain: transforms
tier: core
prerequisites: [transforms.points-vs-directions, transforms.inverse-matrices]
misconceptions:
  normals-like-directions: '"Normals transform like directions." This breaks under non-uniform scale.'
contexts:
  squashed-lighting: Lighting a squashed object
  face-normal-world: Face normal to world
  rim: Rim effects
---

## Definition

The normal matrix is the matrix three.js builds for turning surface normals, so they still point straight out of the surface after an object is stretched unevenly.

## Space lens

A geometry's `normal` attribute and a raycast's `hit.face.normal` are measured from the object itself. `new Matrix3().getNormalMatrix(object.matrixWorld)` turns them into the world. `object.normalMatrix`, and `normalMatrix` in a shader, turn them into camera space, measured from the camera.
