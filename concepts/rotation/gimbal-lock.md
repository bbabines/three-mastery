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

When the middle of the three Euler turns reaches 90° up or down, the first and last turns go around the same line, so two of the angles do the same thing and one way of turning is lost until the middle angle moves away.

## Space lens

At the lock, the last turn's axis (the object's own axis) lines up with the first turn's axis (the parent's axis), so changing either angle turns the object around the same line.
