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

Blending mixes a fragment's color with the color already in the framebuffer, so a see-through surface only looks right when what's behind it was drawn first; three.js draws transparent objects after opaque ones, sorted back to front per object by the center of each one's bounding sphere, not per triangle, and leaves `depthWrite` on for them until you set it to false.

## Cost lens

Every see-through layer is shaded and blended where it covers the screen, and nothing behind it can be skipped: GPU work for every pixel, for every layer. Sorting the transparent list is a little CPU time every frame.
