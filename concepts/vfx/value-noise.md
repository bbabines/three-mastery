---
id: vfx.value-noise
name: Value and gradient noise
domain: vfx
prerequisites: [shaders.built-in-functions, shaders.fragment-coordinates]
misconceptions:
  changes-each-frame: '"Noise changes every frame." The same coordinates always give the same value.'
contexts:
  clouds: Cloud masks
  heat: Heat shimmer
  breakup: Organic breakup
---

## Definition

Gradient noise is a repeatable smooth field that gives nearby coordinates similar values, so a procedural shader can make clouds, heat, or irregular edges without a texture.

## Cost lens

Noise does several arithmetic steps for each shaded pixel. Raising its spatial frequency can alias before it adds useful detail.
