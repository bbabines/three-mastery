---
id: 4.optimization.placement
loop: 4
domain: optimization
parts:
  - optimization.draw-call-reduction
  - optimization.resolution-dpr
  - optimization.render-on-demand
  - optimization.allocation-hygiene
  - optimization.culling-lod
  - optimization.overdraw
  - optimization.shader-cost
  - optimization.texture-budget
  - optimization.hitch-avoidance
  - optimization.leak-detection
  - optimization.adaptive-quality
---

# Placement check: Optimization and memory

A no-docs check of the decisions in this domain. Write every function in `placement/4/optimization/check.ts` from memory, then run `npm run pick -- done` once. The first attempt is the one that counts. Passing every part suggests skipping this domain's practice; misses point to useful drills. Nothing is timed.

| Function | Decision |
| --- | --- |
| `canInstanceTogether` | Check whether meshes can share an instanced draw. |
| `pixelCount` | Count physical pixels after DPR is applied. |
| `needsRender` | Render only while content changes or animation runs. |
| `reusePoint` | Reuse a vector rather than allocate one every frame. |
| `useLowDetail` | Choose a lower-detail model past a distance threshold. |
| `shadedFragments` | Estimate fragment work from overlapping layers. |
| `shaderWork` | Estimate how fragment cost scales with passes. |
| `textureBytes` | Estimate base-level texture bytes before mipmaps. |
| `prewarmNeeded` | Decide whether a new variant risks a first-use hitch. |
| `grewAfterCycle` | Detect resource count growth after a full cycle. |
| `nextDpr` | Lower DPR one step when repeated frame cost exceeds a budget. |
