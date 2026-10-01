---
id: vfx.fbm
name: fBm
domain: vfx
prerequisites: [vfx.value-noise]
misconceptions:
  more-always-better: '"More octaves always look better." Detail finer than a pixel aliases and adds cost.'
contexts:
  smoke: Smoke
  terrain: Terrain masks
  erosion: Eroded edges
---

## Definition

Fractal Brownian motion, or fBm, layers noise at rising frequencies and falling strengths to add detail at several scales.

## Cost lens

Each octave adds another noise evaluation per pixel; stop when the detail is smaller than the pixels that display it.
