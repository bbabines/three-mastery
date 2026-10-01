---
id: vfx.blending-modes
name: Additive vs alpha blending
domain: vfx
prerequisites: [gpu.blending, materials.transparency]
misconceptions:
  additive-free: '"Additive glow is free." It still shades and blends every covered pixel.'
contexts:
  fire: Fire and sparks
  smoke: Smoke
  glows: Stacked glows
---

## Definition

Alpha blending replaces a fraction of background color, while additive blending adds light and cannot darken it.

## Cost lens

Both modes pay for transparent overdraw; set `depthWrite: false` for layered particles and keep their screen area modest.
