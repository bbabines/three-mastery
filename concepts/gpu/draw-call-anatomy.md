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

A draw call is one request to the GPU to draw one geometry with one material, and before each one three.js sets up whatever changed since the last.

## Cost lens

CPU time for every draw call, every frame, spent by three.js, the browser, and the graphics driver, and hardly affected by the mesh's size. The GPU's share depends on the vertices and pixels drawn.
