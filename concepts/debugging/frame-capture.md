---
id: debugging.frame-capture
name: Frame capture
domain: debugging
tier: core
prerequisites: [gpu.draw-call-anatomy, gpu.render-targets]
misconceptions:
  scene-graph-truth: '"The scene graph shows what the GPU drew."'
contexts:
  double-rendering: Double rendering
  wrong-texture: Wrong texture bound
  render-target-contents: Render target contents
---

## Definition

A frame capture records every command one frame sends to the GPU, in order, with the state and textures behind each draw call.

## Cost lens

A capture tool wraps every WebGL call while it's on, which slows the page, so never time frames with one running. Capture to see what a frame does, and measure to see how long it takes.
