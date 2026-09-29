---
id: rotation.converting
name: Converting representations
domain: rotation
tier: light
prerequisites: [rotation.quaternions, rotation.rotation-basis]
misconceptions:
  same-numbers: '"A round-trip returns the same numbers."'
contexts:
  serializing: Serializing state
  ui-display: Displaying rotation in UI
  comparing: Comparing orientations
---

## Definition

Euler angles, a quaternion, a rotation matrix, and an axis with an angle are four ways of writing the same turn; three.js converts between any of them, but the numbers that come back can differ from the ones that went in while still meaning the same turn.

## Space lens

Converting never changes the space: a turn measured from the parent, like `object.quaternion`, converts to angles or a matrix measured from the parent too. `getWorldQuaternion` and the turn inside `matrixWorld` are in the world.
