---
id: queries.ray
name: Ray
domain: queries
tier: light
prerequisites: [math.point-vs-direction, math.normalize]
misconceptions:
  both-ways: '"A ray extends both ways."'
contexts:
  pointer-picking: Pointer picking
  line-of-sight: Line of sight
  ground-placement: Placing on the ground
---

## Definition

A ray is a starting point and a direction, and it runs from the start in that direction only, forever.

## Space lens

A ray's start and direction are in whatever space you built them in. `raycaster.ray` is in the world, like the `hit.point` it finds.
