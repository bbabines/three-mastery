---
id: rotation.gimbal-lock
name: Gimbal lock
domain: rotation
tier: light
prerequisites: [rotation.euler-order]
misconceptions:
  library-bug: '"It''s a bug in the math library."'
contexts:
  camera-down: Camera pitched straight down
  turntable-extremes: Turntable at extremes
  interpolating-euler: Interpolating Euler angles
---

## Definition

Gimbal lock is the spot where two of the three Euler angles do the same thing, because the middle turn has lined up the first and last axes.

## Space lens

At the lock, the last turn's axis, the object's own, lines up with the first turn's axis, the parent's, so either angle turns the object around the same line.
