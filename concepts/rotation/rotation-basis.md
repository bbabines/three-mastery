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

The first three columns of an object's matrix are where its own +X, +Y, and +Z point after its turn, each as long as its scale on that axis, so you can read which way it faces straight out of the matrix, or build a turn from three axes.

## Space lens

The columns of `object.matrix` are the object's own axes measured in its parent's space; the columns of `matrixWorld` are the same axes in the world. They carry scale, so normalize them before using them as directions. An ordinary object's front is +Z, the third column; a camera looks down −Z, so the way it looks is the third column negated.
