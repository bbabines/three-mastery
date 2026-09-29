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

Loaders turn files such as models and images into three.js objects, and texture classes wrap any grid of pixels, from a file, a canvas, an array, or a video, so a material can draw with it.

## Cost lens

Every file costs a download, then CPU time to turn it into objects. Compressed files also need a decoder, whose own files download once. Every texture is copied to the GPU when it's first drawn, and again each time it's marked as changed.
