---
id: product.light-form
name: Light sources and readable form
domain: product
prerequisites: [product.tactile-materials, materials.light-types]
misconceptions:
  more-strength: '"Stronger normals fix leather under any lighting."'
  same-source: '"A larger source and a brighter source change the same thing."'
  area-shadow: '"A three.js area light casts soft shadows automatically."'
  fill-ratio: '"Intensity numbers from different light types give a key/fill ratio."'
contexts:
  leather: Revealing leather grain
  packaging: Separating white packaging
  dark-product: Lighting dark handles
  configurator: Making adjustable products readable
---

## Definition

Control source direction, dimensions, distance, and fill independently to reveal product form and tactile shading without compensating with material values.

## Cost lens

More direct sources add shader work; shadow-casting sources also render depth views. Native rectangular area lights have no shadow support. A point shadow requires six views, unlike the single view used by a directional light.
