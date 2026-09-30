---
id: optimization.resolution-dpr
name: Resolution and DPR
domain: optimization
tier: core
prerequisites: [gpu.renderer-tour, gpu.pipeline-stages]
misconceptions:
  display-setting: '"DPR is a display setting, not a cost."'
contexts:
  phones: Phones
  4k-monitors: 4K monitors
  orbit-dpr: Reduced DPR while orbiting
---

## Definition

The pixel ratio is how many device pixels the canvas draws for each CSS pixel, and keeping it low, all the time or while the view moves, is one of the biggest cuts to pixel work.

## Cost lens

Pixel work, and the memory of the canvas and of render targets sized to match it, grow with the pixel ratio squared. The CPU's share of a frame doesn't change.
