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

Euler angles, a quaternion, a rotation matrix, and an axis with an angle are four ways of writing one turn, and converting between them can change the numbers without changing the turn.

## Space lens

Converting never changes the space: a turn measured from the parent converts to one measured from the parent.
