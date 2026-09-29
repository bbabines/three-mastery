---
id: gpu.multisampling
name: Multisampling
domain: gpu
tier: light
prerequisites: [gpu.multi-pass]
misconceptions:
  composer-keeps-aa: '"Adding a composer keeps canvas antialiasing."'
contexts:
  jaggies-post: Jaggies after adding post-processing
  thin-lines: Thin lines
  msaa-memory: MSAA memory cost
---

## Definition

Multisampling (MSAA) tests several points inside each pixel along triangle edges and blends the result, which smooths jagged edges; the canvas gets it from `antialias: true`, but a render target has `samples: 0` unless you set it, so an `EffectComposer`'s picture has none.

## Cost lens

GPU memory: a multisampled buffer stores a color and a depth for every sample, so 4 samples take about 4 times the memory of one. As a rule of thumb, the fragment shader still runs about once per pixel per triangle; the extra work is at the edges.
