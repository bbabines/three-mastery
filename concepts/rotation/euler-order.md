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

`object.rotation` stores a turn as three angles in radians, one around each axis, done one after another in a set order; with the default 'XYZ', the object turns around its own X, then its new Y, then its new Z, so the same three angles in another order give a different turn.

## Space lens

The three angles are measured from the parent. Each turn after the first goes around the object's own axis, as the turns before it left it. Seen from the parent, 'XYZ' is the same as turning around the parent's Z, then Y, then X, so the X angle always turns around the parent's X and the Z angle around the object's own Z.
