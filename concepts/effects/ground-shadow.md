---
id: effects.ground-shadow
name: Baked soft ground shadow
domain: effects
prerequisites: [materials.shadows, gpu.render-targets]
misconceptions:
  live-always-better: '"A live shadow always looks better than a baked one."'
contexts:
  product-viewer: A product viewer on a plain floor
  configurator: A configurator whose parts change
  phone: A phone that can't afford a shadow map every frame
---

## Definition

A baked soft ground shadow averages the shadows from hundreds of light directions into one texture on the floor, once, so the floor shows a soft contact shadow without drawing a shadow map every frame.

## Cost lens

Baking draws the model once per direction for a few hundred frames, then stops; after that the shadow is one textured square. It has to be baked again whenever the model moves or changes shape.
