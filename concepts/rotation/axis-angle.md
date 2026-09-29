---
id: rotation.axis-angle
name: Axis-angle
domain: rotation
tier: light
prerequisites: [rotation.euler-order, math.normalize]
misconceptions:
  on-axis-world: '"rotateOnAxis uses world axes."'
contexts:
  hinges: Hinges
  tilted-axis: Spinning around a tilted axis
  on-axis-vs-world: rotateOnAxis vs rotateOnWorldAxis
---

## Definition

Any turn can be written as one angle around one line through the object's origin, its axis; three.js takes the axis as a unit-length Vector3 and the angle in radians.

## Space lens

The axis passed to `rotateOnAxis` (and `rotateX`, `rotateY`, `rotateZ`) is measured from the object itself, so it leans when the object leans. The axis passed to `rotateOnWorldAxis` is measured from the parent, which is the world only when no parent is turned. `setRotationFromAxisAngle` sets the whole turn, measured from the parent. `vector.applyAxisAngle` turns a vector around a line through (0, 0, 0) of whatever space the vector is in.
