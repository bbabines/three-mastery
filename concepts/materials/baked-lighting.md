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

Baked lighting is light and shadow worked out ahead of time, usually in a 3D tool, and stored in a texture, a lightmap or an ambient occlusion (AO) map, so it costs almost nothing to draw but never changes when anything moves.

## Cost lens

Drawing it is one texture read per pixel: no light math, no shadow render. The cost moves elsewhere: GPU memory for the textures, a second set of UVs in the geometry, and the time to bake it again whenever the scene changes.
