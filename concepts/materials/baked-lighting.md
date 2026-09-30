---
id: materials.baked-lighting
name: Baked lighting
domain: materials
tier: light
prerequisites: [geometry.uvs, materials.shadows]
misconceptions:
  reacts-to-moving: '"Baked lighting reacts to moving objects."'
contexts:
  static-rooms: Static rooms
  ao-crevices: AO in crevices
  shadow-catcher: Shadow-catcher planes
---

## Definition

Baked lighting is light and shadow worked out ahead of time and stored in a texture, so it costs almost nothing to draw but never changes when anything moves.

## Cost lens

Drawing it is one texture read per pixel, with no light math and no shadow render. The cost moves to GPU memory for the textures, a second set of UVs, and baking again whenever the scene changes.
