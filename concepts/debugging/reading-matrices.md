---
id: debugging.reading-matrices
name: Reading matrices
domain: debugging
tier: core
prerequisites: [transforms.matrix-vs-matrixworld, rotation.rotation-basis, transforms.negative-scale]
misconceptions:
  set-order: '"Matrix4.set and elements share an order." set takes row-major.'
contexts:
  console-check: Console transform checks
  spotting-scale: Spotting scale
  mirroring: Detecting mirroring
---

## Definition

A Matrix4 stores its 16 numbers column by column: the first three columns are the object's own axes, the fourth is the move, and the determinant's sign says whether it mirrors.

## Space lens

`matrix.elements` is measured from the object's parent; `matrixWorld.elements` is in the world. Either one is as of the last refresh.
