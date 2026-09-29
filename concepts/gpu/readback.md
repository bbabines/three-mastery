---
id: gpu.readback
name: Readback
domain: gpu
tier: light
prerequisites: [gpu.render-targets]
misconceptions:
  one-pixel-free: '"Reading one pixel is free."'
contexts:
  gpu-picking: GPU picking
  screenshots: Screenshots
  color-sampling: Color sampling
---

## Definition

Readback copies pixels from the GPU into a JavaScript array; `renderer.readRenderTargetPixels` makes JavaScript wait until the GPU has finished all the work queued before it, however few pixels it reads, while `readRenderTargetPixelsAsync` waits without blocking and hands over the pixels later.

## Cost lens

A synchronous read is CPU time spent idle: the main thread stops until the GPU catches up, and the two stop overlapping for that frame. The async version costs a frame or so of delay instead.
