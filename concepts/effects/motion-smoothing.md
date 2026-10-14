---
id: effects.motion-smoothing
name: Smoothing while moving
domain: effects
prerequisites: [gpu.multisampling, gpu.multi-pass, gpu.render-targets, effects.progressive]
misconceptions:
  free-aa: '"TAA is free anti-aliasing."'
  adds-to-msaa: '"TAA and MSAA add up."'
contexts:
  turntable: A product turning on a turntable
  orbit-viewer: An orbiting product viewer
  noisy-effects: Calming effects that change their pattern every frame
---

## Definition

Smoothing while moving (temporal reprojection anti-aliasing, TRAA) shifts each frame by part of a pixel and blends it into earlier frames, moved along with each pixel's motion, so edges stay smooth while things move.

## Cost lens

The scene writes a motion buffer as it draws, and a full-size pass blends every frame into the history. It also softens fine detail and can leave faint trails.
