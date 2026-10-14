---
id: effects.reflections
name: Screen-space reflections
domain: effects
prerequisites: [gpu.multi-pass, gpu.render-targets, materials.environment-maps, materials.pbr, materials.specular]
misconceptions:
  replaces-environment: '"Screen-space reflections replace the environment map."'
  reflects-anything: '"Screen-space reflections can reflect anything in the scene."'
contexts:
  polished-floor: A polished floor under a product
  neighbor-parts: Metal parts reflecting their neighbors
  wet-street: Wet streets and glossy tiles
---

## Definition

Screen-space reflections let shiny surfaces reflect the other things in the finished picture, by stepping along each reflected direction through the picture's depth and copying the color they meet.

## Cost lens

Every reflective pixel takes a step for each pixel its ray crosses, every frame, so the cost grows with how much of the picture is shiny, with the reach, and with pixel ratio.
