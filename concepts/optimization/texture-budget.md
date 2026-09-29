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

A texture budget sizes each texture to what it covers on screen, and keeps the total of all the textures loaded at once within what the weakest target device can hold, by sizing, sharing, compressing, and mipmapping them.

## Cost lens

GPU memory: width × height × 4 bytes for 8-bit color, plus a third for mipmaps, for every texture loaded at the same time (the runtime memory math page). The upload on first use grows with the same bytes. Pixels beyond what the surface covers on screen cost that memory and add nothing you can see.
