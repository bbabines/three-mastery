---
id: rotation.euler-order
name: Euler angles and order
domain: rotation
tier: core
prerequisites: [transforms.object3d-tour, transforms.local-vs-world]
misconceptions:
  order-irrelevant: '"Order doesn''t matter."'
  y-is-yaw: '"rotation.y is always yaw."'
contexts:
  ui-sliders: UI rotation sliders
  imported-rotations: Reading imported rotations
  yaw-pitch-camera: Yaw/pitch camera
---

## Definition

Euler angles describe a turn as three angles, one around each axis, done in a set order, and the same angles in another order make a different turn.

## Space lens

The angles are measured from the parent. The first turn goes around the parent's axis, and each later turn around the object's own axis, as the turns before it left it.
