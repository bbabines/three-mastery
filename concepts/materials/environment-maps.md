---
id: materials.environment-maps
name: Environment maps and IBL
domain: materials
tier: core
prerequisites: [materials.pbr]
misconceptions:
  just-background: '"An environment map is just a background." It also lights the scene; metals look black without one.'
contexts:
  chrome: Chrome reflections
  consistent-look: A consistent product look
  env-vs-background: Environment vs background
---

## Definition

An environment map is a picture of everything around the scene that lights physically based materials and gives them something to reflect, whether or not it's shown as the background.

## Cost lens

Blurring it for every roughness is GPU work done once, when the environment is first used; after that, each pixel reads it a few times, which is cheaper than many lights. An HDR environment also costs GPU memory, for the picture and its blurred copy.
