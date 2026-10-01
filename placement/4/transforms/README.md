---
id: 4.transforms.placement
loop: 4
domain: transforms
parts:
  - transforms.object3d-tour
  - transforms.local-vs-world
  - transforms.matrix-vs-matrixworld
  - transforms.update-timing
  - transforms.trs-order
  - transforms.compose-decompose
  - transforms.points-vs-directions
  - transforms.inverse-matrices
  - transforms.add-vs-attach
  - transforms.pivots
  - transforms.normal-matrix
  - transforms.negative-scale
---

# Placement check: Coordinate spaces and transforms

A no-docs check of the decisions in this domain. Write every function in `placement/4/transforms/check.ts` from memory, then run `npm run pick -- done` once. The first attempt is the one that counts. Passing every part suggests skipping this domain's practice; misses point to useful drills. Nothing is timed.

| Function | Decision |
| --- | --- |
| `makeHierarchy` | Put a child under a parent for shared transforms. |
| `worldPoint` | Convert a local point into the world. |
| `worldTranslation` | Read a nested object's current world position. |
| `movedWorldPoint` | Move then read the updated world position in the same step. |
| `pointAfterTrs` | Apply position, rotation, and scale in three.js order. |
| `translationOf` | Read the position component of a composed transform. |
| `worldDirection` | Turn a local direction into a world direction without translation. |
| `localPoint` | Turn a world point into the object's local space. |
| `keepWorldOnReparent` | Reparent a child while preserving its world transform. |
| `pivotedOrigin` | Find the world position of an object's local origin after its pivot acts. |
| `normalInWorld` | Keep a surface normal perpendicular after uneven scale. |
| `reversesHandedness` | Detect a mirrored transform from its determinant. |
