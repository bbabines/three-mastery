---
id: optimization.overdraw
name: Overdraw reduction
domain: optimization
tier: light
prerequisites: [gpu.depth-early-z, gpu.blending]
misconceptions:
  hidden-free: '"Hidden pixels cost nothing."'
contexts:
  glass-layers: Glass layers
  full-screen-overlays: Full-screen overlays
  cutout-panels: Cutout panels
---

## Definition

Overdraw reduction cuts how many times each pixel is shaded in a frame, by using fewer and smaller see-through layers, and hard-edged cutouts instead of blending.

## Cost lens

Pixel work: a see-through layer is shaded and blended at every pixel it covers, even where it's faint, fully clear, or covered. A layer across the whole screen costs a full screen of pixel work, which grows with the pixel ratio squared.
