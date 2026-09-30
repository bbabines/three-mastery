---
id: rotation.quaternions
name: Quaternions
domain: rotation
tier: core
prerequisites: [rotation.axis-angle, rotation.gimbal-lock]
misconceptions:
  components-angles: '"The components are angles."'
  order-free: '"Multiplication order doesn''t matter."'
contexts:
  accumulating: Accumulating rotations
  local-world-deltas: Local vs world deltas
  from-two-vectors: Orientation from two vectors
---

## Definition

A quaternion is three.js's way of storing a turn: four numbers that hold an axis and an angle together, none of which is an angle.

## Space lens

An object's quaternion is measured from its parent. `multiply` adds a turn around the object's own axes, and `premultiply` adds one around the parent's axes.
