---
id: optimization.render-on-demand
name: Render on demand
domain: optimization
tier: light
prerequisites: [interaction.controls-tour, gpu.frame-budget]
misconceptions:
  continuous-required: '"Continuous rendering is required."'
contexts:
  static-viewer: Static viewer
  battery-life: Battery life
  background-tabs: Background tabs
---

## Definition

Rendering on demand draws a frame only when something on screen has changed, instead of redrawing the same picture at every screen refresh.

## Cost lens

A still scene rendered every frame spends CPU time, GPU work, and battery on identical pictures, 60 or more times a second. On demand, a still scene costs nothing; the only work is the frames after a change.
