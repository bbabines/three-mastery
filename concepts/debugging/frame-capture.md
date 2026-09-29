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

A frame capture records every WebGL command one frame sends to the GPU, in order, with the state, textures, and shaders behind each draw call, so you can see what was really drawn rather than what the scene graph says should be.

## Cost lens

A capture tool wraps every WebGL call while it's on, which slows the page; as a rule of thumb, never time frames with one running. Capture to see what a frame does; measure, with the tools in the GPU pipeline domain, to see how long it takes.
