---
id: 4.math.placement
loop: 4
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

A no-docs check of the decisions in this domain. Write every function in `placement/4/math/check.ts` from memory, then run `npm run pick -- done` once. The first attempt is the one that counts. Passing every part suggests skipping this domain's practice; misses point to useful drills. Nothing is timed.

| Function | Decision |
| --- | --- |
| `translatePoint` | Move a point by a direction. |
| `withinRadius` | Judge whether two points are within a radius. |
| `safeHeading` | Give the length-one direction toward a point. |
| `movingToward` | Judge whether motion has a component toward a target. |
| `triangleDirection` | Find a triangle's front direction. |
| `allowedMotion` | Keep only movement along an angled rail. |
| `reflectedMotion` | Reflect motion from a surface. |
| `clampedBlend` | Blend between points without overshooting. |
| `signedYaw` | Give the signed turn about +Y. |
| `orbitOffset` | Turn spherical coordinates into an offset. |
| `isLeftHanded` | Judge whether a basis reverses handedness. |
| `sameSpot` | Compare positions with tolerance. |
