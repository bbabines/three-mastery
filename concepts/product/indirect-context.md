---
id: product.indirect-context
name: Indirect light and scene context
domain: product
prerequisites: [product.shadows-grounding, materials.baked-lighting]
misconceptions:
  ao-is-gi: '"AO supplies global illumination."'
  automatic-bounce: '"A colored wall mesh automatically bounces light onto a product."'
  moving-bake: '"A scene lightmap remains physically correct after the object moves."'
  probe-reflection: '"A diffuse light probe provides sharp metallic reflections."'
contexts:
  studio: Revealing dark leather
  interior: Lighting a product in a room
  ar: Matching surrounding illumination
  practical: Making mixed source colors plausible
---

## Definition

Represent surrounding illumination deliberately with environments, stored irradiance, diffuse probes, or labeled fill approximations; treat occlusion as attenuation and invalidate stored lighting when its scene assumptions change.

## Cost lens

Lightmaps add textures and require a valid UV arrangement. Diffuse probes use compact coefficients but cannot resolve sharp reflections or local visibility. Screen-space AO costs extra rendering and depends on visible depth; it still does not add bounced light.
