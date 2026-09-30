---
id: queries.aabb-vs-obb
name: AABB vs OBB
domain: queries
tier: light
prerequisites: [queries.bounds-primitives, scene-graph.world-bounds]
misconceptions:
  box3-tight: '"Box3 fits rotated objects tightly."'
contexts:
  tight-overlap: Tight overlap checks
  rotated-parts: Rotated parts
  bounds-display: Bounds display
---

## Definition

An AABB stays lined up with the world's axes and grows loose around a turned object, while an OBB turns with the object and keeps a tight fit.

## Space lens

`new Box3().setFromObject(object)` is in the world. An OBB is usually built from `geometry.boundingBox`, measured from the object itself, then moved into the world with `obb.applyMatrix4(object.matrixWorld)`.

## Cost lens

A `Box3` overlap test is six comparisons. An OBB test checks the boxes from several directions, so it costs more, which is why an AABB usually rules things out first.
