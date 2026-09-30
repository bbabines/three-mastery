---
id: materials.shadows
name: Shadows
domain: materials
tier: light
prerequisites: [materials.light-types, camera.frustum]
misconceptions:
  bigger-map: '"A bigger shadow map fixes everything."'
contexts:
  contact-shadow: Contact shadow under a product
  fit-directional: Fitting a directional shadow
  acne-peter-panning: Acne vs peter-panning
---

## Definition

A shadow comes from a depth picture of the scene taken from the light, and how much of the scene that picture covers sets how sharp the shadow is.

## Cost lens

Each shadow-casting light renders its casting meshes again every frame, six times for a point light. The map's GPU memory grows with the square of `mapSize`, and every pixel of a receiving surface reads it.
