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
| `checkViewMatrix` | Express a world point in camera space, including parent transforms. |
| `checkProjectionMatrix` | Build a perspective lens from vertical FOV and viewport aspect. |
| `checkClipNdcScreen` | Map NDC X/Y to top-left CSS pixels; preserve NDC depth. |
| `checkProjectUnproject` | Project a world point to a CSS label position and NDC depth. |
| `checkDepthPrecision` | Find depth-buffer value at a positive view depth. |
| `checkFrustum` | Update camera aspect after resize and test a world point inside its frustum. |
| `checkAspectResize` | Update camera aspect and projection matrix for a resized viewport. |
| `checkFitToBounds` | Fit a sphere within both portrait and landscape angles. |
| `checkWorldSizePerPixel` | Find world units covered by one CSS pixel at a view depth. |
| `checkCameraRelative` | Read camera screen axes as world directions. |

Run `npm run drill -- placement/2/camera` as you work. When all parts pass, run `npm run pick -- done` once. A miss suggests practicing the drills for that concept; it is not a gate.
