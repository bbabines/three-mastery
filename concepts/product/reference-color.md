---
id: product.reference-color
name: Reference, color, and exposure
domain: product
prerequisites: [materials.color-spaces, materials.tone-mapping, materials.pbr]
misconceptions:
  exposure-repair: Exposure can repair a wrongly interpreted material color.
  data-color: Every texture should use sRGB.
  study-scale: Fitting a model establishes its physical dimensions.
contexts:
  catalog: Consistent product catalog images
  paint: Paint color configurators
  leather: Leather color approval
---

## Definition

A controlled reference separates surface properties from illumination and the display transform before comparing product appearance.

## Cost lens

Color interpretation and exposure have little runtime cost. Changing tone mapping can compile shader variants; accurate comparison also requires consistent capture settings.
