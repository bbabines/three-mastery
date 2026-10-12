---
id: tactile.before-you-light
name: Before you light
domain: tactile
prerequisites: [materials.color-spaces, materials.tone-mapping]
misconceptions:
  exposure-always-works: '"Exposure brightens the picture whatever the settings."'
  everything-srgb: '"Every texture should be marked sRGB."'
  fill-is-harmless: '"A little ambient light can''t hurt."'
contexts:
  product-viewer: A product viewer showing fabric or leather options
  furniture-configurator: A furniture configurator with upholstery swatches
  game-prop: A game prop with scanned materials
---

## Definition

Before any light can show a material, the renderer needs a tone mapping (so light brighter than white has somewhere to go, and exposure works), each map needs the right color space (only the color map is sRGB), and no even fill light should lift every shadow and weaken the relief.

## Cost lens

Tone mapping and color-space conversion cost almost nothing: a few math steps per pixel. A HemisphereLight or AmbientLight is also cheap to draw; its cost is to the look.
