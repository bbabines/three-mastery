---
id: 2.rotation.placement
loop: 2
domain: rotation
parts: [rotation.euler-order, rotation.gimbal-lock, rotation.axis-angle, rotation.quaternions, rotation.slerp, rotation.rotation-basis, rotation.lookat-up, rotation.rotate-around-point, rotation.converting]
---

# Rotation placement

No docs or solutions. Write every function in `placement/2/rotation/check.ts` from memory. Each function is short.

| Function | Checks |
| --- | --- |
| `checkEulerOrder` | euler order |
| `checkGimbalLock` | gimbal lock |
| `checkAxisAngle` | axis angle |
| `checkQuaternions` | quaternions |
| `checkSlerp` | slerp |
| `checkRotationBasis` | rotation basis |
| `checkLookatUp` | lookat up |
| `checkRotateAroundPoint` | rotate around point |
| `checkConverting` | converting |

Run `npm run drill -- placement/2/rotation` as you work. When all parts pass, run `npm run pick -- done` once. A miss suggests practicing the drills for that concept; it is not a gate.
