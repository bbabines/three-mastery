---
id: vfx.domain-warping
name: Domain warping and curl noise
domain: vfx
prerequisites: [vfx.value-noise, vfx.fbm]
misconceptions:
  curl-is-more-noise: '"Curl noise is just more noise." It is a direction field made from derivatives of a noise field.'
contexts:
  swirling-smoke: Swirling smoke
  energy: Flowing energy
  advection: Particle advection
---

## Definition

Domain warping bends a pattern by moving its sample coordinates; curl noise supplies a swirling direction field that can move those coordinates without a source or sink.

## Cost lens

Warping samples noise before the main pattern, so every extra warp sample adds work for each covered pixel.
