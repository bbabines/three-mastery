---
id: 4.camera.placement
loop: 4
domain: camera
parts:
  - camera.view-matrix
  - camera.projection-matrix
  - camera.clip-ndc-screen
  - camera.project-unproject
  - camera.depth-precision
  - camera.frustum
  - camera.aspect-resize
  - camera.fit-to-bounds
  - camera.world-size-per-pixel
  - camera.camera-relative
---

# Placement check: Camera and projection

A no-docs check of the decisions in this domain. Write every function in `placement/4/camera/check.ts` from memory, then run `npm run pick -- done` once. The first attempt is the one that counts. Passing every part suggests skipping this domain's practice; misses point to useful drills. Nothing is timed.

| Function | Decision |
| --- | --- |
| `viewPoint` | Find a world's point in camera space. |
| `projectedPoint` | Apply the camera's projection matrix to a view-space point. |
| `screenPosition` | Map NDC into canvas pixels from top left. |
| `ndcOf` | Project a world point into normalized device coordinates. |
| `depthRatio` | Judge the near-to-far range that consumes depth precision. |
| `inCameraFrustum` | Test whether a world point is inside the camera frustum. |
| `resizeCamera` | Update aspect and projection after a canvas resize. |
| `boundsCenter` | Find the world center of nested geometry for a camera fit. |
| `unitsPerPixel` | Find world height represented by one pixel at a view depth. |
| `cameraRight` | Find screen-right as a world direction. |
