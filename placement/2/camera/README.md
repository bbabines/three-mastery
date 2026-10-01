---
id: 2.camera.placement
loop: 2
domain: camera
parts: [camera.view-matrix, camera.projection-matrix, camera.clip-ndc-screen, camera.project-unproject, camera.depth-precision, camera.frustum, camera.aspect-resize, camera.fit-to-bounds, camera.world-size-per-pixel, camera.camera-relative]
---

# Camera placement

No docs or solutions. Write every function in `placement/2/camera/check.ts` from memory. Each function is short.

| Function | Checks |
| --- | --- |
| `checkViewMatrix` | view matrix |
| `checkProjectionMatrix` | projection matrix |
| `checkClipNdcScreen` | clip ndc screen |
| `checkProjectUnproject` | project unproject |
| `checkDepthPrecision` | depth precision |
| `checkFrustum` | frustum |
| `checkAspectResize` | aspect resize |
| `checkFitToBounds` | fit to bounds |
| `checkWorldSizePerPixel` | world size per pixel |
| `checkCameraRelative` | camera relative |

Run `npm run drill -- placement/2/camera` as you work. When all parts pass, run `npm run pick -- done` once. A miss suggests practicing the drills for that concept; it is not a gate.
