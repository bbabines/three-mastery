---
id: effects.ambient-occlusion
name: Ambient occlusion
domain: effects
prerequisites: [gpu.multi-pass, gpu.render-targets, materials.environment-maps, materials.pbr, materials.shadows]
misconceptions:
  light-shadow: '"Ambient occlusion is a shadow from the lights."'
  stronger-real: '"Stronger ambient occlusion looks more real."'
contexts:
  nested-parts: Parts that touch or nest into each other
  floor-contact: An object resting on a floor
  room-corners: Corners and crevices in a room
---

## Definition

Ambient occlusion darkens creases, gaps, and corners by how much of the space around each point is blocked by nearby surfaces, so parts look tucked into each other instead of pasted on.

## Cost lens

It samples the depth around every pixel each frame, so its cost grows with the sample count and the number of pixels. Applying it to environment light only needs the scene's shapes drawn twice.
