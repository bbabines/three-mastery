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

An environment map is a picture of everything around the scene, in every direction; set as `scene.environment`, it lights physically based materials and gives them something to reflect, blurred to match each surface's roughness, which is called image-based lighting (IBL), while showing it behind the scene is a separate setting, `scene.background`.

## Cost lens

Prefiltering, the blurring for every roughness, is GPU work done once, when the environment is first used. After that, each pixel reads the environment a few times, which is cheaper than many lights. An HDR environment costs GPU memory: 8 bytes a pixel as half floats, plus the prefiltered copy.
