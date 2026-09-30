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

Readback copies pixels from the GPU into JavaScript, and the plain version makes JavaScript wait until the GPU has finished everything queued before it, however few pixels it reads.

## Cost lens

A plain read is CPU time spent idle, since the main thread stops until the GPU catches up. The async version costs a frame or so of delay instead.
