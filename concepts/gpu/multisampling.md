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

Multisampling smooths jagged edges by testing several points inside each pixel along a triangle's edge, and a render target has none unless you ask for it.

## Cost lens

GPU memory: a multisampled buffer keeps a color and a depth for every sample, so 4 samples take about 4 times the memory. The fragment shader usually still runs about once per pixel for each triangle.
