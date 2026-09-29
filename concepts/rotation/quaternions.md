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

A quaternion is three.js's way of storing a turn: four numbers with a length of 1 that hold an axis and an angle together, where none of the numbers is an angle, q and −q are the same turn, and the order you multiply two of them decides whose axes the second turn uses.

## Space lens

`object.quaternion` is measured from the parent, and `getWorldQuaternion` gives the turn in the world. `q.multiply(d)` applies `d` around the object's own axes; `q.premultiply(d)` applies it around the parent's axes, which are the world's only when no parent is turned. The two directions given to `setFromUnitVectors` must be in the same space as each other.
