---
id: materials.color-spaces
name: Color spaces
domain: materials
tier: core
prerequisites: [assets.loaders-tour, materials.materials-tour]
misconceptions:
  all-srgb: '"Every texture is sRGB."'
contexts:
  washed-out: Washed-out textures
  normal-maps: Wrong-looking normal maps
  picker-mismatch: Colors that don't match a picker
---

## Definition

A color space says what a color's numbers mean: in linear, twice the number is twice the light, and in sRGB, the numbers follow the curve that images and screens use.

## Space lens

Here "space" means color space. `material.color` and the lighting math are linear, while hex codes, color pickers, color maps, and the screen speak sRGB.
