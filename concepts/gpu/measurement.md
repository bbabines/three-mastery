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

Each performance tool sees one part of a frame: a stopwatch times the CPU's work to send it, GPU timers and the browser's profiler see the GPU's work, and three.js's counters count work without timing it.

## Cost lens

Measuring has costs of its own: a frame capture slows the page while it records, and stats panels, helpers, and debug views add work, so they come out before the numbers are taken.
