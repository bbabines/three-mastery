---
id: math.projection-rejection
name: Projection and rejection
domain: math
tier: core
prerequisites: [math.dot-product, math.normalize]
misconceptions:
  zero-an-axis: '"Zero one axis to project onto a plane" only works for axis-aligned planes.'
contexts:
  wall-slide: Sliding along a wall
  axis-constraint: Constraining motion to an axis
  closest-point-line: Closest point on a line
---

## Definition

Projection keeps the part of a vector that runs along a direction, and rejection keeps the leftover part at right angles to it.

## Space lens

The vector and the direction must be in the same space. A wall's normal turns with the wall, so use it as it faces in the world.
