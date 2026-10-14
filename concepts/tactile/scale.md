---
id: tactile.scale
name: Scale and distance
domain: tactile
prerequisites: [tactile.maps, materials.texture-sampling, geometry.uvs]
misconceptions:
  resolution-always-better: '"Higher resolution always looks more real."'
  sharp-is-enough: '"Real-world size doesn''t matter if it looks sharp."'
  any-scan: '"Any scan of the material will do."'
contexts:
  rack-configurator: Gym racks and benches seen whole across a room in a product configurator
  swatch-closeup: A fabric swatch zoomed in on a product page
  floor-plan: A floor and walls in an architectural walkthrough
---

## Definition

A material looks believable when each tile covers its real size, its scan holds enough pixels per centimeter for how close it's seen, and far away its repeats are broken up and its filtering (mipmaps, anisotropy, faded normals) keeps it from crawling or glittering.

## Cost lens

Texture memory grows with the square of the resolution: a 4K map takes 85 MB with its mipmaps, a 1K map about 5 MB. Anisotropic filtering costs a few extra texture reads where surfaces are seen at a slant, and mipmaps a third more memory.
