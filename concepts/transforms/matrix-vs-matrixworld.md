---
id: transforms.matrix-vs-matrixworld
name: matrix vs matrixWorld
domain: transforms
tier: core
prerequisites: [transforms.local-vs-world]
misconceptions:
  always-current: '"matrixWorld is always current."'
contexts:
  reparenting: Reparenting
  world-bounds: World-space bounds
  exporting: Exporting transforms
---

## Definition

`matrix` is an object's own move, turn, and resize measured from its parent, and `matrixWorld` is where it ends up in the world with every parent combined in; both are saved copies that three.js refreshes when it renders.

## Space lens

`matrix` is measured from the parent. `matrixWorld` is in the world. Anything that asks where an object is in the world, like the renderer, a raycast, or `Box3.setFromObject`, reads `matrixWorld`.
