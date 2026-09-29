---
id: transforms.update-timing
name: Update timing
domain: transforms
tier: core
prerequisites: [transforms.matrix-vs-matrixworld]
misconceptions:
  stale-read: Reading matrixWorld right after setting position returns the old value.
contexts:
  raycast-after-move: Raycasting right after a move
  bounds-after-transform: Bounds after a transform
  external-sync: Syncing to external data
---

## Definition

three.js refreshes every object's `matrix` and `matrixWorld` when it renders, so code that reads them between a change and the next render has to refresh them first or use a method that does.

## Space lens

Between renders, `position` is already new but `matrixWorld` still describes the world as of the last refresh.

## Cost lens

The refresh visits every object in the scene on every render: CPU time every frame, growing with the number of objects. `matrixAutoUpdate = false` skips rebuilding one object's `matrix`, but not the visit.
