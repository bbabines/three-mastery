---
id: optimization.adaptive-quality
name: Adaptive quality
domain: optimization
tier: light
prerequisites: [optimization.resolution-dpr, gpu.frame-budget]
misconceptions:
  detect-once: '"Detect the device tier once and set quality."'
contexts:
  low-end-devices: Low-end devices
  heavy-scenes: Heavy scenes
  thermal-throttling: Thermal throttling
---

## Definition

Adaptive quality steps settings like the pixel ratio down when frames run late and back up once they've been on time for a while, with a gap between the two so it doesn't flip back and forth.

## Cost lens

A little CPU time every frame to track frame times. In return, it gives up picture quality only when and where the frames need it.
