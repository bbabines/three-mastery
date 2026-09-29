---
id: transforms.compose-decompose
name: compose and decompose
domain: transforms
tier: light
prerequisites: [transforms.trs-order]
misconceptions:
  clean-decompose: '"Every matrix decomposes cleanly." A sheared one doesn''t: decompose drops the shear.'
contexts:
  baking: Baking transforms
  world-rotation: Extracting world rotation
  copy-world: Copying a world transform
---

## Definition

`compose` packs a position, a rotation, and a scale into one matrix, and `decompose` splits a matrix back into those three parts, dropping anything they can't describe, like shear.

## Space lens

`decompose` answers in the space of the matrix you give it: `object.matrix` splits into parts measured from the parent, and `object.matrixWorld` splits into parts in the world.
