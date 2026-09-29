---
id: gpu.renderer-tour
name: 'Tour: renderer settings'
domain: gpu
tier: light
prerequisites: [camera.aspect-resize]
misconceptions:
  antialias-later: '"antialias can be turned on later." It''s fixed when the renderer is created.'
  shadowmap-enough: '"Turning on shadowMap.enabled makes shadows appear." The light and the casting meshes also need `castShadow`, and the surfaces shadows fall on need `receiveShadow`.'
contexts:
  first-setup: A product viewer's first setup
  phone-configurator: A phone-friendly configurator
  studio-shadow: A studio shot with a soft shadow
---

## Definition

The WebGLRenderer settings you choose once, when you set up a scene: `antialias` and `powerPreference` in the constructor, then `setPixelRatio`, `setSize`, `outputColorSpace`, `toneMapping` with `toneMappingExposure`, and `shadowMap.enabled`.

## Cost lens

The pixel ratio sets how many pixels every frame draws: GPU work for every pixel and GPU memory both grow with its square. Antialiasing costs GPU memory for the extra samples. Shadows add a render of the casting meshes from each shadow light, every frame.
