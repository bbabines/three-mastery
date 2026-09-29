---
id: transforms.points-vs-directions
name: Points vs directions
domain: transforms
tier: core
prerequisites: [math.point-vs-direction, transforms.matrix-vs-matrixworld]
misconceptions:
  apply-matrix-directions: '"applyMatrix4 works for directions."'
contexts:
  hit-point: Transforming a hit point
  ray-direction: Transforming a ray direction
  velocity: Transforming a velocity
---

## Definition

When an object moves, turns, or resizes, a place on it follows all three but a direction only turns, so `applyMatrix4` converts places while `transformDirection` and `applyQuaternion` convert directions.

## Space lens

A spot or direction you convert with `object.matrixWorld` starts out measured from the object itself, and the answer is in the world. A velocity you add to `position` has to be measured from the same parent as `position`.
