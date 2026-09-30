---
id: rotation.rotation-basis
name: Rotation matrix as a basis
domain: rotation
tier: core
prerequisites: [transforms.matrix-vs-matrixworld, math.cross-product, rotation.euler-order]
misconceptions:
  opaque-box: '"A matrix is an opaque box of numbers."'
contexts:
  forward-from-matrix: Reading forward from a matrix
  make-basis: makeBasis from three axes
  local-axes: Extracting local axes
---

## Definition

The turn inside a matrix is the object's own three axes, written as its first three columns.

## Space lens

The columns of `matrix` are the object's own axes in its parent's space, and those of `matrixWorld` are the same axes in the world. They carry scale, so normalize one before using it as a direction.
