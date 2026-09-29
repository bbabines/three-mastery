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

A few material settings change how the GPU draws a surface rather than how it's lit: which sides of each triangle are drawn (`side`), whether it's blended as see-through (`transparent`), whether pixels below an alpha threshold are thrown away (`alphaTest`), whether it writes to the depth buffer (`depthWrite`), and whether its depth is nudged so it wins against a surface in the same place (`polygonOffset`).

## Cost lens

`DoubleSide` turns off back-face culling, so the GPU shades back faces too, and a transparent `DoubleSide` material is drawn twice, back faces first. Transparent objects are sorted every frame and drawn after the opaque ones, where overlapping layers each cost their own pixel work. `alphaTest` throws pixels away in the shader, which can stop the GPU from skipping hidden pixels early.
