---
id: optimization.draw-call-reduction
name: Draw call reduction
domain: optimization
tier: core
prerequisites: [gpu.draw-call-anatomy, geometry.instanced-mesh]
misconceptions:
  instancing-fill-rate: '"Instancing fixes a fill-rate-bound scene."'
contexts:
  repeated-hardware: Repeated hardware
  static-environment: Static environment
  same-material-parts: Many same-material parts
---

## Definition

Draw call reduction merges parts that never move, and draws repeats, or different shapes that share a material, together, so the same picture takes fewer draw calls.

## Cost lens

Every draw call removed saves CPU time every frame, but the GPU still does the same vertex and pixel work. Merging repeats of one shape stores its vertices once per copy, which instancing avoids.
