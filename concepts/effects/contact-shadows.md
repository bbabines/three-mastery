---
id: effects.contact-shadows
name: Contact shadows
domain: effects
prerequisites: [gpu.multi-pass, gpu.render-targets, materials.shadows]
misconceptions:
  bigger-map: '"A bigger shadow map fixes parts that look like they float."'
contexts:
  product-on-floor: A product resting on a floor in hard light
  small-parts: Small parts against a larger one
  feet-on-ground: Characters' feet on the ground
---

## Definition

Contact shadows darken the spots right where things touch, by checking a short way toward the light from each pixel through the picture's depth, filling in what the shadow map misses.

## Cost lens

The scene's shapes are drawn a second time for depth, and each pixel marches a few steps toward the light every frame; a longer reach or a higher pixel ratio means more steps.
