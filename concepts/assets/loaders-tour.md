---
id: assets.loaders-tour
name: 'Tour: loaders and textures'
domain: assets
tier: light
prerequisites: [transforms.object3d-tour]
misconceptions:
  loader-alone: '"Each loader works on its own." GLTFLoader throws on compressed files until its decoders are attached.'
  canvas-follows: '"A CanvasTexture follows its canvas." Redrawing needs `needsUpdate = true`.'
contexts:
  compressed-model: A compressed product model
  canvas-price-tag: A price tag drawn on a canvas
  data-lookup: A lookup table as a DataTexture
---

## Definition

Loaders turn files into three.js objects, and texture classes hold the pixels a material draws with, whether they come from an image, a canvas, an array, or a video.

## Cost lens

Every file costs a download and CPU time to build its objects. Every texture is copied to the GPU on its first draw, and again each time it's marked changed.
