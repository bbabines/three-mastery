---
id: materials.light-types
name: Light types and falloff
domain: materials
tier: light
prerequisites: [materials.lights-tour, materials.lambert]
misconceptions:
  units-dont-matter: '"Scene units don''t affect lighting."'
contexts:
  studio-product: Studio product lighting
  mm-vs-m: Models in millimeters vs meters
  ambient-flattening: Ambient flattening
---

## Definition

Directional, hemisphere, and ambient light reach everything equally, while point and spot light fade with the square of the distance, measured in the scene's own units.

## Cost lens

Every light adds GPU work for every pixel of every lit material, and adding or removing one rebuilds the shader programs. A light turned down to `intensity` 0 still costs its work; removing it or hiding it doesn't.
