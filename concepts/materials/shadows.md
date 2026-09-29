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

A shadow in three.js comes from a depth render seen from the light, the shadow map: each pixel then checks whether something nearer the light blocks it, and how much of the scene the light's shadow camera covers sets how sharp the shadow comes out.

## Cost lens

Each shadow-casting light renders its casting meshes again every frame, into its shadow map; a point light renders them six times, once for each side of a cube. The map costs GPU memory that grows with the square of `mapSize`, and every pixel of a receiving surface reads it.
