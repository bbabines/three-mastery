---
id: 4.rotation.placement
loop: 4
domain: rotation
parts:
  - rotation.euler-order
  - rotation.gimbal-lock
  - rotation.axis-angle
  - rotation.quaternions
  - rotation.slerp
  - rotation.rotation-basis
  - rotation.lookat-up
  - rotation.rotate-around-point
  - rotation.converting
---

# Placement check: Rotation

A no-docs check of the decisions in this domain. Write every function in `placement/4/rotation/check.ts` from memory, then run `npm run pick -- done` once. The first attempt is the one that counts. Passing every part suggests skipping this domain's practice; misses point to useful drills. Nothing is timed.

| Function | Decision |
| --- | --- |
| `orderedTurn` | Build the intended ordered turn. |
| `stableTurn` | Store an orientation without editing its Euler components. |
| `axisTurn` | Turn around an arbitrary axis. |
| `worldDelta` | Apply a delta turn in world space. |
| `halfTurn` | Interpolate halfway along the shortest turn. |
| `forwardAxis` | Read the rotated local forward axis. |
| `aimWithUp` | Aim an object while specifying which way is up. |
| `orbitPoint` | Rotate a point around a chosen pivot. |
| `quaternionFromEuler` | Convert an Euler orientation to a quaternion. |
