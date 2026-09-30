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

Axis-angle describes a turn as one angle around one line through the object's origin, with the line given as a direction of length 1.

## Space lens

An axis passed to `rotateOnAxis` is measured from the object itself, so it leans when the object leans. An axis passed to `rotateOnWorldAxis` is measured from the parent, which is the world only when no parent is turned.
