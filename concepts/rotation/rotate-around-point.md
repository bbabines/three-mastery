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

To turn something around a point that isn't its origin, take its offset from the point, turn the offset, add the point back, and turn the object by the same amount: move, turn, and move back.

## Space lens

`applyAxisAngle` and `applyQuaternion` turn a vector around (0, 0, 0) of its own space, so a position turns around its parent's origin. The point, the object's `position`, and the axis must all be measured from the same place, usually the object's parent. `Box3.setFromObject` gives a center in the world, which matches `position` only for an object straight in the scene.
