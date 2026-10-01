---
id: 3.rotation.placement
loop: 3
domain: rotation
parts: [rotation.euler-order, rotation.gimbal-lock, rotation.axis-angle, rotation.quaternions, rotation.slerp, rotation.rotation-basis, rotation.lookat-up, rotation.rotate-around-point, rotation.converting]
---

# Rotation placement

No docs or solutions. Write every function again in `placement/3/rotation/check.ts` from memory. Each function is short. Leave input vectors, quaternions, and matrices unchanged.

| Function | Decision |
| --- | --- |
| `checkEulerOrder(angles, order)` | Return the quaternion for these radian angles in the supplied Euler order. |
| `checkGimbalLock(start, end, fraction)` | Blend saved orientations along the shortest turn; keep both quaternions. |
| `checkAxisAngle(point, center, axis, radians)` | Turn a world point around a non-unit tilted axis through an offset center. |
| `checkQuaternions(orientation, localAxis, radians)` | Apply a turn around the part’s own axis after its current orientation. |
| `checkSlerp(a, b, fraction)` | Return the shortest-arc orientation at the given fraction. |
| `checkRotationBasis(rotationMatrix)` | Read the unit +Z direction from a rotated, unequally scaled matrix. |
| `checkLookatUp(from, target, up)` | Aim an ordinary object’s +Z at a target, honoring the given up direction. |
| `checkRotateAroundPoint(point, center, turn)` | Turn a world point around a chosen world center using a quaternion. |
| `checkConverting(angles)` | Convert an Euler with its saved order to an equivalent quaternion. |

Run `npm run drill -- placement/3/rotation` as you work. When all parts pass, run `npm run pick -- done` once. A miss suggests practicing the drills for that concept; it is not a gate.
