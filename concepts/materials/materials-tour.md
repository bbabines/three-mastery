---
id: materials.materials-tour
name: 'Tour: materials'
domain: materials
tier: light
prerequisites: [geometry.object-types-tour]
misconceptions:
  all-react: '"Every material reacts to lights." Basic, Matcap, Normal, and Depth ignore them.'
contexts:
  unlit-ui: Unlit UI and labels
  product-finish: A physically based product finish
  debug-view: A quick debug view
---

## Definition

A material decides how a mesh's surface looks, from a flat color that ignores lights to a surface that reacts to every light and reflection.

## Cost lens

Materials that react to lights do GPU work for every pixel, for every light, and the physically based ones do the most. Each material type is its own shader program, built the first time it's drawn.
