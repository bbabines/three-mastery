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

Overdraw reduction cuts how many times each pixel is shaded in a frame, mostly by using fewer and smaller see-through layers, and alphaTest cutouts instead of blending where edges can be hard.

## Cost lens

Pixel work: each layer that covers a pixel runs the fragment shader there, and a see-through layer is shaded and blended even where it's faint, fully clear, or covered. A layer across the whole screen costs a full screen of pixel work, which grows with the square of the pixel ratio.
