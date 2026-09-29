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

The pixel ratio sets how many device pixels the canvas draws for each CSS pixel, and the number of pixels drawn grows with its square, so capping it, and lowering it while the view moves, cuts pixel work more than almost any other setting.

## Cost lens

Pixel work for every pass over the screen, and the memory of the canvas and of every render target sized to match it, grow with the pixel ratio squared: 4 times at a ratio of 2, 9 times at 3. The CPU's share of a frame doesn't change.
