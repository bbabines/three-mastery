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

Lights differ in where their light comes from and how it fades: directional, hemisphere, and ambient light reach everything equally at any distance, while point and spot light fade with the square of the distance, so how far away a light is, in the scene's own units, sets how bright it looks.

## Cost lens

Every light adds GPU work for every pixel of every lit material, whatever its type, and adding or removing one rebuilds the shader programs. Turning a light's `intensity` down to 0 still costs its work; removing it or hiding it doesn't.
