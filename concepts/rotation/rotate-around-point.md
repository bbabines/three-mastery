---
id: rotation.rotate-around-point
name: Rotating around a point
domain: rotation
tier: light
prerequisites: [transforms.pivots, transforms.trs-order, rotation.axis-angle]
misconceptions:
  origin-rotation: '"Rotation always happens around the origin."'
contexts:
  orbit: Orbit
  hinge: Hinge
  product-center: Spinning a product around its center
---

## Definition

Turning around a point that isn't the object's origin takes three steps: move the point to the origin, turn, and move back.

## Space lens

A position turns around its parent's origin, so the point, the position, and the axis must all be measured from the same parent.
