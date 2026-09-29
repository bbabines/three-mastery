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

A color space says what a color's numbers mean: three.js does its lighting in linear numbers, where twice the number is twice the light, while pictures, color pickers, and screens use sRGB, so color textures are marked sRGB, data maps are left unmarked, and the renderer converts the result to sRGB for the screen.

## Space lens

Here "space" means color space, not a coordinate space. `material.color` is stored in linear numbers, but `set('#e4572e')` and `getHexString()` speak sRGB. `setRGB(r, g, b)` takes linear numbers unless you pass `SRGBColorSpace` as a fourth argument. A texture marked `SRGBColorSpace` is converted to linear as it's read; one left at `NoColorSpace` is read as is. `renderer.outputColorSpace` (sRGB by default) converts the finished picture for the screen.
