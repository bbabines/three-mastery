---
id: gpu.measurement
name: Measurement tools
domain: gpu
tier: core
prerequisites: [gpu.frame-budget]
misconceptions:
  render-time-gpu: '"render() time equals GPU time."'
contexts:
  timing-frame: Timing a frame
  spector: Spector.js capture
  info-counts: renderer.info counts
---

## Definition

Each tool sees one part of a frame: `performance.now()` around `renderer.render` times the CPU's work to submit it; the GPU's time needs a GPU timer query (where the browser offers one) or Chrome's Performance panel; `renderer.info` counts draw calls, triangles, and objects on the GPU without timing anything; and Spector.js captures every WebGL command in one frame.

## Cost lens

Measuring has costs of its own: a frame capture slows the page while it records, and stats panels, helpers, and debug views add work of their own, so they come out before the numbers are taken.
