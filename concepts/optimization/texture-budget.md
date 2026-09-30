---
id: optimization.texture-budget
name: Texture budget
domain: optimization
tier: core
prerequisites: [assets.memory-math, optimization.resolution-dpr]
misconceptions:
  always-sharper: '"4K textures are always sharper."'
contexts:
  swatch-libraries: Swatch libraries
  mobile-limits: Mobile limits
  thumbnail-textures: Thumbnail textures
---

## Definition

A texture budget sizes each texture to what it covers on screen, and keeps all the textures loaded at once within what the weakest target device can hold.

## Cost lens

GPU memory for every texture loaded at once, 4 bytes a pixel for 8-bit color plus a third for mipmaps, and an upload of the same bytes on first use. Pixels beyond what the surface covers on screen cost that memory and add nothing you can see.
