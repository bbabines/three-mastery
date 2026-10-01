---
id: vfx.cellular-noise
name: Cellular noise
domain: vfx
prerequisites: [vfx.value-noise]
misconceptions:
  needs-texture: '"Cellular patterns need a texture." A nearest-feature distance can be computed in the shader.'
contexts:
  cracks: Cracks
  caustics: Caustics
  scales: Scales
---

## Definition

Cellular or Worley noise measures distance to nearby scattered feature points, making cells and borders from coordinates alone.

## Cost lens

Each sample searches neighboring feature points, so it costs more shader work than one simple gradient-noise sample.
