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

A render target is an offscreen picture on the GPU, a color texture and usually a depth buffer, that `renderer.setRenderTarget(target)` draws into instead of the canvas, so its `texture` can then be put on a material or read back.

## Cost lens

GPU memory for as long as it exists: width × height × bytes per pixel for the color, plus the depth buffer. Each time something is rendered into it: CPU time for that render's draw calls and GPU work for every pixel of the target.
