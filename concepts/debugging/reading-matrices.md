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

A Matrix4 keeps its 16 numbers in `elements` column by column: the first three columns are the object's own axes, turned and as long as its scale, indices 12 to 14 hold the move, and the determinant's sign says whether it mirrors.

## Space lens

`matrix.elements` is measured from the object's parent; `matrixWorld.elements` is in the world. Either one is as of the last refresh.
