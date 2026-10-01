---
id: vfx.depth-effects
name: Depth-based effects
domain: vfx
prerequisites: [gpu.depth-early-z, camera.depth-precision]
misconceptions:
  texture-setting: '"Soft particles are a texture setting." They compare particle and scene depth at the pixel.'
contexts:
  smoke-ground: Smoke meeting the ground
  heat: Heat haze
  water: Water edges
---

## Definition

Depth-based effects compare a translucent fragment's depth with the opaque scene to fade at intersections or distort the image behind it.

## Cost lens

Reading scene depth and drawing translucent layers add per-pixel work; large puffs can become overdraw bound.
