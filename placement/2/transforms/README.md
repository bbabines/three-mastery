---
id: 2.transforms.placement
loop: 2
domain: transforms
parts: [transforms.object3d-tour, transforms.local-vs-world, transforms.matrix-vs-matrixworld, transforms.update-timing, transforms.trs-order, transforms.compose-decompose, transforms.points-vs-directions, transforms.inverse-matrices, transforms.add-vs-attach, transforms.pivots, transforms.normal-matrix, transforms.negative-scale]
---

# Transforms placement

No docs or solutions. Write every function in `placement/2/transforms/check.ts` from memory. Each function is short. Leave input vectors, quaternions, and matrices unchanged.

| Function | Decision |
| --- | --- |
| `checkObject3dTour(part, newParent)` | Attach the part to a new parent without moving its world position; return that position. |
| `checkLocalVsWorld(part, localOffset)` | Return a part-local mounting point in world space without changing the offset. |
| `checkMatrixVsMatrixworld(part)` | Return a fresh copy of the nested part’s full world matrix. |
| `checkUpdateTiming(part, localPoint)` | Return a local point in world space immediately after an ancestor moves. |
| `checkTrsOrder(vertex, position, rotation, scale)` | Place a local vertex after scale, then turn, then world translation. |
| `checkComposeDecompose(matrix)` | Report whether a saved pose reverses handedness through scale. |
| `checkPointsVsDirections(point, direction, transform)` | Move a ray to world space: point with translation, unit direction without it. |
| `checkInverseMatrices(part, worldPoint)` | Return a world hit in a nested part’s local frame. |
| `checkAddVsAttach(part, parent)` | Reparent without a world jump; return the original world position. |
| `checkPivots(hinge, point, angle)` | Swing a point around the world Y axis through an offset hinge. |
| `checkNormalMatrix(part, localNormal)` | Return a unit world face normal after unequal scale. |
| `checkNegativeScale(matrix)` | Report whether the transform reverses handedness. |

Run `npm run drill -- placement/2/transforms` as you work. When all parts pass, run `npm run pick -- done` once. A miss suggests practicing the drills for that concept; it is not a gate.
