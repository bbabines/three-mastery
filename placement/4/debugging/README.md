---
id: 4.debugging.placement
loop: 4
domain: debugging
parts:
  - debugging.triage
  - debugging.nothing-renders
  - debugging.helpers
  - debugging.visualizing-vectors
  - debugging.reading-matrices
  - debugging.nan-degenerate
  - debugging.isolation
  - debugging.frame-capture
  - debugging.shader-errors
  - debugging.debug-views
---

# Placement check: Debugging and visualization

A no-docs check of the decisions in this domain. Write every function in `placement/4/debugging/check.ts` from memory, then run `npm run pick -- done` once. The first attempt is the one that counts. Passing every part suggests skipping this domain's practice; misses point to useful drills. Nothing is timed.

| Function | Decision |
| --- | --- |
| `firstBucket` | Choose the first fault bucket from simple evidence. |
| `cameraSeesPoint` | Check whether a point is inside the camera frustum. |
| `axesAt` | Place visible axes at a suspect world point. |
| `directionArrow` | Draw a direction arrow from a world origin. |
| `translationFromMatrix` | Read translation from a transform matrix. |
| `finitePoint` | Reject a point containing NaN or infinity. |
| `simpleMaterial` | Replace a suspect material with a known unlit one. |
| `frameNeedsCapture` | Decide whether unexpected pass work needs a frame capture. |
| `shaderFailed` | Recognize a shader compile error in a driver log. |
| `normalView` | Use a view-space normal material to isolate geometry. |
