---
id: materials.material-flags
name: Pipeline-facing material flags
domain: materials
tier: light
prerequisites: [geometry.winding-order, gpu.blending]
misconceptions:
  doubleside-free: '"DoubleSide is free."'
contexts:
  decals: Decals
  perforated: Perforated panels
  thin-surfaces: Thin surfaces
---

## Definition

A few material settings change how the GPU draws a surface rather than how it's lit: which faces it draws, whether it blends or cuts holes, and how its depth hides other surfaces.

## Cost lens

`DoubleSide` shades back faces too, and a transparent `DoubleSide` material is drawn twice. Transparent objects are sorted every frame and each overlapping layer costs its own pixel work, and `alphaTest` can stop the GPU from skipping hidden pixels early.
