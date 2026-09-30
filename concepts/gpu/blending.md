---
id: gpu.blending
name: Blending and transparency
domain: gpu
tier: core
prerequisites: [gpu.state-sorting, gpu.depth-early-z]
misconceptions:
  per-triangle: '"Transparent objects sort per triangle."'
contexts:
  glass: Glass
  fades: Fades
  overlays: Overlays
---

## Definition

Blending mixes a see-through fragment's color with the color already drawn, so what's behind must be drawn first, and three.js sorts see-through objects by their centers, not their triangles.

## Cost lens

Every see-through layer is shaded and blended where it covers the screen, and nothing behind it can be skipped: GPU work for every pixel, for every layer. Sorting the see-through list is a little CPU time every frame.
