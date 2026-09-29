---
id: gpu.draw-call-anatomy
name: Draw call anatomy
domain: gpu
tier: core
prerequisites: [gpu.pipeline-stages]
misconceptions:
  gpu-expensive: '"Draw calls are expensive on the GPU." The overhead is mostly CPU and driver.'
contexts:
  many-small-parts: Many small parts
  shadow-doubling: Shadow passes doubling calls
  multi-material: Multi-material meshes
---

## Definition

A draw call is one request to the GPU to draw one geometry with one material; before each one, three.js switches to the material's shader program if it changed, uploads the settings that changed, binds the vertex buffers and textures, and only then asks the GPU to draw.

## Cost lens

CPU time for every draw call, every frame: three.js's own JavaScript, then the browser's and the graphics driver's checks on each WebGL call. That share hardly depends on the mesh's size. The GPU's share depends on the vertices and pixels drawn, as on the pipeline stages page.
