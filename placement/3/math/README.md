---
id: 3.math.placement
loop: 3
domain: math
parts:
  - math.point-vs-direction
  - math.length
  - math.normalize
  - math.dot-product
  - math.cross-product
  - math.projection-rejection
  - math.reflection
  - math.lerp
  - math.angle-between
  - math.spherical-coords
  - math.triple-product
  - math.float-tolerance
---

# Placement check: 3D math

> **What it's for:** check whether the math is still ready to use when a bug appears. Pass every part and you can skip its drills this time round; miss any and they're worth doing.

## How it works

No docs and no three.js source for this one. Write the twelve functions again from memory in `placement/3/math/check.ts`, one for each concept in the domain. Each is a line or three of three.js.

When you've written all twelve, run the check once:

```
npm run pick -- done
```

It logs which parts missed. The first attempt is the one that counts, so don't run the check before you're done.

## The twelve

| Function | Returns |
| --- | --- |
| `moveFor(position, velocity, seconds)` | Where something is after moving at `velocity` for `seconds` |
| `inRange(a, b, radius)` | Whether `b` is within `radius` of `a` |
| `aimAt(from, to)` | The length-1 direction from `from` to `to`, or (0, 0, 0) when they're the same place |
| `isBehind(position, forward, target)` | Whether `target` is behind something at `position` facing `forward` |
| `faceNormal(a, b, c)` | The length-1 direction a triangle faces; its corners are counter-clockwise from the front |
| `slideAlongWall(velocity, wallNormal)` | The velocity sliding along a wall when it's moving into it, and unchanged when it's moving away |
| `bounce(velocity, normal)` | The velocity bounced off a surface |
| `positionAt(start, end, elapsed, duration)` | Where something moving from `start` to `end` over `duration` seconds is at `elapsed`, stopping at `end` |
| `turnToward(forward, toTarget)` | The signed angle in radians from `forward` to `toTarget` around +Y: positive to the left |
| `orbitPosition(target, radius, phi, theta)` | Where an orbit camera sits around `target` |
| `isMirrored(xAxis, yAxis, zAxis)` | Whether a set of axes is mirrored |
| `samePlace(p, q)` | Whether two positions match, allowing for rounding (within 0.000001) |

Directions and normals can be any length unless the table says otherwise. None of the functions may change the vectors they're handed.
