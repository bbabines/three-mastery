---
id: 3.transforms.placement
loop: 3
domain: transforms
parts: [transforms.object3d-tour, transforms.local-vs-world, transforms.matrix-vs-matrixworld, transforms.update-timing, transforms.trs-order, transforms.compose-decompose, transforms.points-vs-directions, transforms.inverse-matrices, transforms.add-vs-attach, transforms.pivots, transforms.normal-matrix, transforms.negative-scale]
---

# Transforms placement

No docs or solutions. Write every function again in `placement/3/transforms/check.ts` from memory. Each function is short.

| Function | Checks |
| --- | --- |
| `checkObject3dTour` | object3d tour |
| `checkLocalVsWorld` | local vs world |
| `checkMatrixVsMatrixworld` | matrix vs matrixworld |
| `checkUpdateTiming` | update timing |
| `checkTrsOrder` | trs order |
| `checkComposeDecompose` | compose decompose |
| `checkPointsVsDirections` | points vs directions |
| `checkInverseMatrices` | inverse matrices |
| `checkAddVsAttach` | add vs attach |
| `checkPivots` | pivots |
| `checkNormalMatrix` | normal matrix |
| `checkNegativeScale` | negative scale |

Run `npm run drill -- placement/3/transforms` as you work. When all parts pass, run `npm run pick -- done` once. A miss suggests practicing the drills for that concept; it is not a gate.
