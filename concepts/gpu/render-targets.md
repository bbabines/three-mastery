---
id: gpu.render-targets
name: Render targets
domain: gpu
tier: core
prerequisites: [gpu.pipeline-stages]
misconceptions:
  always-screen: '"Rendering always goes to the screen."'
contexts:
  thumbnails: Thumbnails
  gpu-picking: GPU picking
  mirrors: Mirrors
---

## Definition

A render target is an offscreen picture on the GPU that three.js can draw into instead of the canvas, so the result can be used as a texture or read back.

## Cost lens

GPU memory for its color and its depth buffer, for as long as it exists. Each render into it costs CPU time for the draw calls and GPU work for every pixel of the target.
