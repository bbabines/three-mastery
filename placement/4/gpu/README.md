---
id: 4.gpu.placement
loop: 4
domain: gpu
parts:
  - gpu.renderer-tour
  - gpu.pipeline-stages
  - gpu.draw-call-anatomy
  - gpu.state-sorting
  - gpu.depth-early-z
  - gpu.stencil
  - gpu.blending
  - gpu.render-targets
  - gpu.multi-pass
  - gpu.multisampling
  - gpu.readback
  - gpu.frame-budget
  - gpu.measurement
---

# Placement check: GPU pipeline and diagnosis

A no-docs check of the decisions in this domain. Write every function in `placement/4/gpu/check.ts` from memory, then run `npm run pick -- done` once. The first attempt is the one that counts. Passing every part suggests skipping this domain's practice; misses point to useful drills. Nothing is timed.

| Function | Decision |
| --- | --- |
| `cappedDpr` | Cap renderer pixel ratio before setup. |
| `fragmentWork` | Estimate fragment work from coverage and overdraw. |
| `drawCallsForGroups` | Estimate draws when every mesh has material groups. |
| `sortMaterials` | Group meshes by material ID to reduce state switches. |
| `canRejectEarly` | Judge whether a surface can benefit from early depth rejection. |
| `enableStencilMask` | Configure a material to write a stencil reference. |
| `enableTransparency` | Mark a changed material transparent before its next draw. |
| `offscreenTarget` | Allocate an offscreen color target at physical size. |
| `totalPassDraws` | Count draws across a base scene and extra passes. |
| `samplesUsed` | Read an offscreen target's MSAA sample request. |
| `rgbaReadBytes` | Count bytes moved by an RGBA8 pixel readback. |
| `exceedsBudget` | Judge whether a measured frame exceeds its chosen budget. |
| `drawCalls` | Read renderer draw-call count from its measurement tools. |
